import path from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDbClient } from '../src/db/client';
import { env } from '../src/lib/env';

export function runMigrations(dbPath?: string): void {
  const targetPath = dbPath ?? env.TECHLAB_DB_PATH;
  const { db, sqlite } = createDbClient(targetPath);

  try {
    const migrationsFolder = path.resolve(process.cwd(), 'drizzle');
    migrate(db, { migrationsFolder });
  } finally {
    sqlite.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('migrate.ts')) {
  console.log('Running SQLite migrations...');
  runMigrations();
  console.log('Migrations completed successfully.');
}
