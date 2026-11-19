import { NextResponse } from 'next/server';
import { getDb } from '@/db/client';

export async function GET() {
  try {
    const { sqlite } = getDb();
    sqlite.prepare('SELECT 1').get();
    const journalMode = sqlite.pragma('journal_mode', { simple: true });

    return NextResponse.json({
      ok: true,
      data: {
        status: 'up',
        db: 'sqlite',
        journalMode: String(journalMode).toLowerCase(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        code: 'HEALTH_CHECK_FAILED',
        message: 'Lỗi kiểm tra trạng thái hệ thống',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
