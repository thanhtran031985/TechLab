import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import Database from 'better-sqlite3';
import { runMigrations } from '../../scripts/migrate';
import { syncCourses } from '../../scripts/sync-courses';
import { createDbClient } from '../../src/db/client';

describe('Content-as-Code Sync Pipeline (scripts/sync-courses.ts)', () => {
  let tempDir: string;
  let tempDbPath: string;
  let tempContentDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'techlab-sync-test-'));
    tempDbPath = path.join(tempDir, 'test.db');
    tempContentDir = path.join(tempDir, 'content', 'courses');

    // Run migrations on temp DB
    runMigrations(tempDbPath);

    // Create a mock course in tempContentDir
    const courseDir = path.join(tempContentDir, 'mock-course');
    const challengesDir = path.join(courseDir, 'challenges');
    fs.mkdirSync(challengesDir, { recursive: true });

    const courseJson = {
      slug: 'mock-course',
      title: 'Mock Course for Testing',
      description: 'Test description',
      source_url: 'https://www.youtube.com/watch?v=123456',
      channel_name: 'Test Channel',
      modules: [
        {
          slug: '01-intro',
          order_index: 1,
          title: 'Introduction',
          video_timestamp: '[00:00:00]',
        },
      ],
    };
    fs.writeFileSync(
      path.join(courseDir, 'course.json'),
      JSON.stringify(courseJson, null, 2),
      'utf-8'
    );

    const challengesJson = {
      module_slug: '01-intro',
      challenges: [
        {
          order_index: 1,
          title: 'Challenge 1',
          description: 'Inspect HTTP packet',
          mode_required: 'junior',
        },
      ],
    };
    fs.writeFileSync(
      path.join(challengesDir, '01-intro.json'),
      JSON.stringify(challengesJson, null, 2),
      'utf-8'
    );
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  it('syncs course, module and challenge data idempotently', () => {
    // Run sync twice
    const result1 = syncCourses({
      dbPath: tempDbPath,
      contentDir: tempContentDir,
    });
    expect(result1.syncedCourses).toBe(1);
    expect(result1.syncedModules).toBe(1);
    expect(result1.syncedChallenges).toBe(1);

    const result2 = syncCourses({
      dbPath: tempDbPath,
      contentDir: tempContentDir,
    });
    expect(result2.syncedCourses).toBe(1);
    expect(result2.syncedModules).toBe(1);
    expect(result2.syncedChallenges).toBe(1);

    // Verify DB contents
    const sqlite = new Database(tempDbPath);
    const course = sqlite
      .prepare("SELECT * FROM courses WHERE slug = 'mock-course'")
      .get() as any;
    expect(course).toBeDefined();
    expect(course.title).toBe('Mock Course for Testing');
    expect(course.module_count).toBe(1);

    const mod = sqlite
      .prepare("SELECT * FROM modules WHERE id = 'mock-course/01-intro'")
      .get() as any;
    expect(mod).toBeDefined();
    expect(mod.challenge_count).toBe(1);

    const ch = sqlite
      .prepare("SELECT * FROM challenges WHERE id = 'mock-course/01-intro/1'")
      .get() as any;
    expect(ch).toBeDefined();
    expect(ch.mode_required).toBe('junior');

    sqlite.close();
  });

  it('preserves user progress and user notes during sync (PRD D2)', () => {
    syncCourses({ dbPath: tempDbPath, contentDir: tempContentDir });

    const sqlite = new Database(tempDbPath);
    // Insert user progress and notes
    sqlite
      .prepare(
        `INSERT INTO challenge_progress (id, user_id, challenge_id, status, attempts, passed_at, updated_at)
         VALUES ('prog-1', 'local', 'mock-course/01-intro/1', 'PASSED', 2, '2026-11-19T00:00:00.000Z', '2026-11-19T00:00:00.000Z')`
      )
      .run();

    sqlite
      .prepare(
        `INSERT INTO user_notes (id, user_id, module_id, video_timestamp, content, created_at, updated_at)
         VALUES ('note-1', 'local', 'mock-course/01-intro', '[00:00:05]', 'Ghi chu quan trong', '2026-11-19T00:00:00.000Z', '2026-11-19T00:00:00.000Z')`
      )
      .run();

    sqlite.close();

    // Re-run sync with updated course title
    const courseJson = {
      slug: 'mock-course',
      title: 'Updated Mock Course Title',
      description: 'Updated description',
      source_url: 'https://www.youtube.com/watch?v=123456',
      channel_name: 'Test Channel',
      modules: [
        {
          slug: '01-intro',
          order_index: 1,
          title: 'Introduction Updated',
          video_timestamp: '[00:00:00]',
        },
      ],
    };
    fs.writeFileSync(
      path.join(tempContentDir, 'mock-course', 'course.json'),
      JSON.stringify(courseJson, null, 2),
      'utf-8'
    );

    syncCourses({ dbPath: tempDbPath, contentDir: tempContentDir });

    // Check that progress and notes are still intact!
    const sqliteAfter = new Database(tempDbPath);
    const progress = sqliteAfter
      .prepare("SELECT * FROM challenge_progress WHERE id = 'prog-1'")
      .get() as any;
    expect(progress).toBeDefined();
    expect(progress.status).toBe('PASSED');
    expect(progress.attempts).toBe(2);

    const note = sqliteAfter
      .prepare("SELECT * FROM user_notes WHERE id = 'note-1'")
      .get() as any;
    expect(note).toBeDefined();
    expect(note.content).toBe('Ghi chu quan trong');

    sqliteAfter.close();
  });

  it('checkCourses reports in-sync or out-of-sync properly', () => {
    // Before sync: should report out of sync (course missing)
    const checkBefore = syncCourses({
      dbPath: tempDbPath,
      contentDir: tempContentDir,
      checkOnly: true,
    });
    expect(checkBefore.inSync).toBe(false);

    // Perform sync
    syncCourses({ dbPath: tempDbPath, contentDir: tempContentDir });

    // After sync: should report in sync
    const checkAfter = syncCourses({
      dbPath: tempDbPath,
      contentDir: tempContentDir,
      checkOnly: true,
    });
    expect(checkAfter.inSync).toBe(true);
  });
});
