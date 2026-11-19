import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getCourses } from '../../src/app/api/courses/route';
import { GET as getCourseDetail } from '../../src/app/api/courses/[course]/route';
import { GET as getProgress, POST as postProgress } from '../../src/app/api/progress/route';
import { getDb } from '../../src/db/client';

describe('Courses & Progress API Endpoints', () => {
  const { sqlite } = getDb();

  beforeEach(() => {
    // Clean progress table before each test
    sqlite.prepare("DELETE FROM challenge_progress WHERE user_id = 'local'").run();
  });

  describe('GET /api/courses', () => {
    it('returns list of courses with module count and passed challenges count', async () => {
      const res = await getCourses();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);

      const restApi = json.data.find((c: any) => c.slug === 'rest-api');
      expect(restApi).toBeDefined();
      expect(restApi.title).toBe('REST API Design Like a Senior Engineer');
      expect(restApi.module_count).toBe(10);
      expect(restApi.passed_challenges).toBe(0);
    });
  });

  describe('GET /api/courses/[course]', () => {
    it('returns course details and its 10 modules', async () => {
      const res = await getCourseDetail(
        new NextRequest('http://localhost:3000/api/courses/rest-api'),
        { params: Promise.resolve({ course: 'rest-api' }) }
      );
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.slug).toBe('rest-api');
      expect(json.data.modules.length).toBe(10);
      expect(json.data.modules[0].slug).toBe('01-network-http-rest');
    });

    it('returns 404 for non-existent course', async () => {
      const res = await getCourseDetail(
        new NextRequest('http://localhost:3000/api/courses/fake-course'),
        { params: Promise.resolve({ course: 'fake-course' }) }
      );
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.code).toBe('COURSE_NOT_FOUND');
    });
  });

  describe('GET & POST /api/progress', () => {
    it('returns initial progress with 0 passed challenges', async () => {
      const res = await getProgress();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.passedCount).toBe(0);
      expect(json.data.passedIds).toEqual([]);
    });

    it('records PASSED challenge and updates progress idempotently', async () => {
      const challengeId = 'rest-api/01-network-http-rest/1';

      // 1. Post valid progress
      const req1 = new NextRequest('http://localhost:3000/api/progress', {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      });
      const res1 = await postProgress(req1);
      expect(res1.status).toBe(200);

      const json1 = await res1.json();
      expect(json1.ok).toBe(true);
      expect(json1.data.challengeId).toBe(challengeId);
      expect(json1.data.status).toBe('PASSED');
      expect(json1.data.passedCount).toBe(1);

      // 2. Post again with same challengeId (idempotent)
      const req2 = new NextRequest('http://localhost:3000/api/progress', {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      });
      const res2 = await postProgress(req2);
      expect(res2.status).toBe(200);

      const json2 = await res2.json();
      expect(json2.ok).toBe(true);
      expect(json2.data.passedCount).toBe(1);

      // 3. GET /api/progress should now contain the challengeId
      const getRes = await getProgress();
      const getJson = await getRes.json();
      expect(getJson.data.passedIds).toContain(challengeId);
      expect(getJson.data.passedCount).toBe(1);
    });

    it('rejects invalid payload with 400 and Vietnamese message', async () => {
      const req = new NextRequest('http://localhost:3000/api/progress', {
        method: 'POST',
        body: JSON.stringify({ invalidField: 123 }),
      });
      const res = await postProgress(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.code).toBe('VALIDATION_ERROR');
      expect(json.message).toBeDefined();
    });

    it('returns 404 when challengeId does not exist', async () => {
      const req = new NextRequest('http://localhost:3000/api/progress', {
        method: 'POST',
        body: JSON.stringify({ challengeId: 'non-existent-challenge' }),
      });
      const res = await postProgress(req);
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.code).toBe('CHALLENGE_NOT_FOUND');
    });
  });
});
