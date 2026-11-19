import { getDb } from '@/db/client';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  try {
    const { sqlite } = getDb();

    // Query courses with total challenges and passed challenges
    const query = `
      SELECT
        c.slug,
        c.title,
        c.description,
        c.source_url,
        c.channel_name,
        c.module_count,
        COALESCE(SUM(m.challenge_count), 0) AS total_challenges,
        (
          SELECT COUNT(DISTINCT cp.challenge_id)
          FROM challenge_progress cp
          JOIN challenges ch ON cp.challenge_id = ch.id
          JOIN modules mod ON ch.module_id = mod.id
          WHERE mod.course_slug = c.slug
            AND cp.user_id = 'local'
            AND cp.status = 'PASSED'
        ) AS passed_challenges
      FROM courses c
      LEFT JOIN modules m ON c.slug = m.course_slug
      GROUP BY c.slug
      ORDER BY c.slug ASC
    `;

    const courses = sqlite.prepare(query).all().map((row: any) => ({
      slug: row.slug,
      title: row.title,
      description: row.description,
      source_url: row.source_url,
      channel_name: row.channel_name,
      module_count: Number(row.module_count),
      total_challenges: Number(row.total_challenges),
      passed_challenges: Number(row.passed_challenges),
    }));

    return apiSuccess(courses);
  } catch (error) {
    return apiError(
      'INTERNAL_ERROR',
      'Lỗi truy vấn danh sách khóa học',
      error instanceof Error ? error.message : String(error),
      500
    );
  }
}
