import { describe, it, expect } from 'vitest';
import { GET } from '../../src/app/api/health/route';

describe('/api/health Route Handler', () => {
  it('returns HTTP 200 with ok: true and journalMode: wal', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual({
      ok: true,
      data: {
        status: 'up',
        db: 'sqlite',
        journalMode: 'wal',
      },
    });
  });
});
