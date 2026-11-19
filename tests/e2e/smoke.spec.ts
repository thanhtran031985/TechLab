import { test, expect } from '@playwright/test';

test.describe('TechLab Basic Smoke & Health Test', () => {
  test('calls /api/health directly and verifies status', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBe(true);
    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      data: {
        status: 'up',
        db: 'sqlite',
        journalMode: 'wal',
      },
    });
  });

  test('calls /api/courses and returns 200 with courses data', async ({ request }) => {
    const res = await request.get('/api/courses');
    expect(res.ok()).toBe(true);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });
});
