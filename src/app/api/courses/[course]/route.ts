import { NextRequest } from 'next/server';
import { getDb } from '@/db/client';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ course: string }> }
) {
  try {
    const { course: courseSlug } = await params;
    const { sqlite } = getDb();

    const course = sqlite
      .prepare('SELECT * FROM courses WHERE slug = ?')
      .get(courseSlug) as any;

    if (!course) {
      return apiError(
        'COURSE_NOT_FOUND',
        `Không tìm thấy khóa học với mã [${courseSlug}]`,
        undefined,
        404
      );
    }

    const modulesQuery = `
      SELECT
        m.id,
        m.course_slug,
        m.slug,
        m.order_index,
        m.title,
        m.video_timestamp,
        m.challenge_count,
        (
          SELECT COUNT(DISTINCT cp.challenge_id)
          FROM challenge_progress cp
          JOIN challenges ch ON cp.challenge_id = ch.id
          WHERE ch.module_id = m.id
            AND cp.user_id = 'local'
            AND cp.status = 'PASSED'
        ) AS passed_challenges
      FROM modules m
      WHERE m.course_slug = ?
      ORDER BY m.order_index ASC
    `;

    const modules = sqlite.prepare(modulesQuery).all(courseSlug).map((row: any) => ({
      id: row.id,
      course_slug: row.course_slug,
      slug: row.slug,
      order_index: Number(row.order_index),
      title: row.title,
      video_timestamp: row.video_timestamp,
      challenge_count: Number(row.challenge_count),
      passed_challenges: Number(row.passed_challenges),
    }));

    return apiSuccess({
      ...course,
      module_count: Number(course.module_count),
      modules,
    });
  } catch (error) {
    return apiError(
      'INTERNAL_ERROR',
      'Lỗi truy vấn chi tiết khóa học',
      error instanceof Error ? error.message : String(error),
      500
    );
  }
}
