import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import Database from 'better-sqlite3';
import { runMigrations } from '../../scripts/migrate';
import { createDbClient } from '../../src/db/client';
import * as schema from '../../src/db/schema';

describe('Database Schema & Migrations', () => {
  let tempDir: string;
  let tempDbPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'techlab-db-test-'));
    tempDbPath = path.join(tempDir, 'test.db');
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error on Windows file locks
    }
  });

  it('applies migrations idempotently twice without error', () => {
    // First run
    expect(() => runMigrations(tempDbPath)).not.toThrow();
    // Second run (idempotent)
    expect(() => runMigrations(tempDbPath)).not.toThrow();
  });

  it('sets required PRAGMAs: journal_mode=wal, foreign_keys=1, synchronous=NORMAL', () => {
    runMigrations(tempDbPath);
    const { sqlite } = createDbClient(tempDbPath);

    const journalMode = sqlite.pragma('journal_mode', { simple: true });
    const foreignKeys = sqlite.pragma('foreign_keys', { simple: true });
    const synchronous = sqlite.pragma('synchronous', { simple: true });

    expect(journalMode).toBe('wal');
    expect(foreignKeys).toBe(1);
    expect(synchronous).toBe(1); // 1 = NORMAL in SQLite

    sqlite.close();
  });

  it('creates all 6 tables from PRD', () => {
    runMigrations(tempDbPath);
    const sqlite = new Database(tempDbPath);

    const tables = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'"
      )
      .all()
      .map((r: any) => r.name);

    sqlite.close();

    const expectedTables = [
      'courses',
      'modules',
      'challenges',
      'challenge_progress',
      'user_notes',
      'sandbox_runs',
    ];

    for (const table of expectedTables) {
      expect(tables).toContain(table);
    }
  });

  it('enforces foreign key constraints', () => {
    runMigrations(tempDbPath);
    const { sqlite } = createDbClient(tempDbPath);

    // Inserting a module referencing a non-existent course should fail
    expect(() => {
      sqlite
        .prepare(
          `INSERT INTO modules (id, course_slug, slug, order_index, title, video_timestamp, challenge_count, updated_at)
           VALUES ('fake/m1', 'non-existent-course', 'm1', 1, 'Module 1', '[00:00:00]', 0, '2026-11-19T00:00:00.000Z')`
        )
        .run();
    }).toThrow(/FOREIGN KEY/i);

    sqlite.close();
  });
});
