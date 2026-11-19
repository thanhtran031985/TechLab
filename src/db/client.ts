import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { env } from '../lib/env';
import * as schema from './schema';

export interface DbClient {
  sqlite: Database.Database;
  db: BetterSQLite3Database<typeof schema>;
}

export function createDbClient(dbPath?: string): DbClient {
  const targetPath = dbPath ?? env.TECHLAB_DB_PATH;
  const dir = path.dirname(targetPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(targetPath);

  // Required SQLite PRAGMAs according to docs/PRD.md & .agents/rules/database.md
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('busy_timeout = 30000');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('auto_vacuum = INCREMENTAL');

  const db = drizzle(sqlite, { schema });

  return { sqlite, db };
}

// Global singleton for server runtime
let globalClient: DbClient | undefined;

export function getDb(): DbClient {
  if (!globalClient) {
    globalClient = createDbClient();
  }
  return globalClient;
}

export const { db, sqlite } = getDb();
