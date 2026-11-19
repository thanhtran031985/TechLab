import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { apiSuccess, apiError } from '@/lib/api-response';

const progressPostSchema = z.object({
  challengeId: z.string().min(1, 'Mã thử thách (challengeId) không được để trống'),
  status: z.literal('PASSED').optional().default('PASSED'),
});

const TOTAL_CHALLENGES = 30;

export async function GET() {
  try {
    const { sqlite } = getDb();

    const rows = sqlite
      .prepare(
        "SELECT challenge_id FROM challenge_progress WHERE user_id = 'local' AND status = 'PASSED'"
      )
      .all() as Array<{ challenge_id: string }>;

    const passedIds = rows.map((r) => r.challenge_id);

    return apiSuccess({
      passedIds,
      passedCount: passedIds.length,
      totalCount: TOTAL_CHALLENGES,
    });
  } catch (error) {
    return apiError(
      'INTERNAL_ERROR',
      'Lỗi truy vấn tiến độ học tập',
      error instanceof Error ? error.message : String(error),
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('VALIDATION_ERROR', 'Payload JSON không hợp lệ', undefined, 400);
    }

    const parseResult = progressPostSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(
        'VALIDATION_ERROR',
        'Dữ liệu gửi lên không đúng định dạng',
        parseResult.error.flatten(),
        400
      );
    }

    const { challengeId, status } = parseResult.data;
    const { sqlite } = getDb();

    // Verify challenge exists
    const challenge = sqlite
      .prepare('SELECT id FROM challenges WHERE id = ?')
      .get(challengeId);

    if (!challenge) {
      return apiError(
        'CHALLENGE_NOT_FOUND',
        `Không tìm thấy thử thách với mã [${challengeId}]`,
        undefined,
        404
      );
    }

    const now = new Date().toISOString();
    const progressId = `local:${challengeId}`;

    // Upsert into challenge_progress
    sqlite
      .prepare(
        `INSERT INTO challenge_progress (id, user_id, challenge_id, status, attempts, passed_at, updated_at)
         VALUES (?, 'local', ?, ?, 1, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           status = 'PASSED',
           attempts = challenge_progress.attempts + 1,
           passed_at = COALESCE(challenge_progress.passed_at, excluded.passed_at),
           updated_at = excluded.updated_at`
      )
      .run(progressId, challengeId, status, now, now);

    const countRow = sqlite
      .prepare(
        "SELECT COUNT(DISTINCT challenge_id) AS cnt FROM challenge_progress WHERE user_id = 'local' AND status = 'PASSED'"
      )
      .get() as { cnt: number };

    return apiSuccess({
      challengeId,
      status: 'PASSED',
      passedCount: countRow.cnt,
      totalCount: TOTAL_CHALLENGES,
    });
  } catch (error) {
    return apiError(
      'INTERNAL_ERROR',
      'Lỗi ghi nhận tiến độ thử thách',
      error instanceof Error ? error.message : String(error),
      500
    );
  }
}
