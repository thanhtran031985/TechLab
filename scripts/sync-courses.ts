import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { createDbClient } from '../src/db/client';
import { courseSchema, moduleChallengesSchema } from '../src/schemas/course';
import { env } from '../src/lib/env';

export interface SyncOptions {
  dbPath?: string;
  contentDir?: string;
  checkOnly?: boolean;
}

export interface SyncResult {
  syncedCourses: number;
  syncedModules: number;
  syncedChallenges: number;
  inSync: boolean;
  errors: string[];
}

export function syncCourses(options: SyncOptions = {}): SyncResult {
  const contentDir =
    options.contentDir ?? path.resolve(process.cwd(), 'content', 'courses');
  const dbPath = options.dbPath ?? env.TECHLAB_DB_PATH;
  const checkOnly = options.checkOnly ?? false;

  const result: SyncResult = {
    syncedCourses: 0,
    syncedModules: 0,
    syncedChallenges: 0,
    inSync: true,
    errors: [],
  };

  if (!fs.existsSync(contentDir)) {
    result.inSync = false;
    result.errors.push(`Thư mục content không tồn tại: ${contentDir}`);
    return result;
  }

  const courseDirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const parsedCourses: Array<{
    course: any;
    challengesByModule: Map<string, any[]>;
  }> = [];

  for (const dirName of courseDirs) {
    const courseFilePath = path.join(contentDir, dirName, 'course.json');
    if (!fs.existsSync(courseFilePath)) {
      continue;
    }

    try {
      const courseRaw = JSON.parse(fs.readFileSync(courseFilePath, 'utf-8'));
      const course = courseSchema.parse(courseRaw);

      const challengesByModule = new Map<string, any[]>();
      const challengesDir = path.join(contentDir, dirName, 'challenges');

      if (fs.existsSync(challengesDir)) {
        const challengeFiles = fs
          .readdirSync(challengesDir)
          .filter((f) => f.endsWith('.json'));

        for (const cFile of challengeFiles) {
          const cRaw = JSON.parse(
            fs.readFileSync(path.join(challengesDir, cFile), 'utf-8')
          );
          const parsed = moduleChallengesSchema.parse(cRaw);
          challengesByModule.set(parsed.module_slug, parsed.challenges);
        }
      }

      parsedCourses.push({ course, challengesByModule });
    } catch (err) {
      result.inSync = false;
      result.errors.push(
        `Lỗi validate course [${dirName}]: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (result.errors.length > 0) {
    return result;
  }

  // Connect to DB
  const { sqlite } = createDbClient(dbPath);

  try {
    if (checkOnly) {
      for (const { course, challengesByModule } of parsedCourses) {
        const dbCourse = sqlite
          .prepare('SELECT * FROM courses WHERE slug = ?')
          .get(course.slug) as any;

        if (!dbCourse) {
          result.inSync = false;
          result.errors.push(`Khóa học [${course.slug}] chưa có trong CSDL.`);
          continue;
        }

        if (dbCourse.module_count !== course.modules.length) {
          result.inSync = false;
          result.errors.push(
            `Khóa học [${course.slug}] lệch số lượng module: file=${course.modules.length}, db=${dbCourse.module_count}`
          );
        }

        for (const mod of course.modules) {
          const moduleId = `${course.slug}/${mod.slug}`;
          const dbMod = sqlite
            .prepare('SELECT * FROM modules WHERE id = ?')
            .get(moduleId) as any;

          if (!dbMod) {
            result.inSync = false;
            result.errors.push(`Module [${moduleId}] chưa có trong CSDL.`);
            continue;
          }

          const fileChallenges = challengesByModule.get(mod.slug) || [];
          if (dbMod.challenge_count !== fileChallenges.length) {
            result.inSync = false;
            result.errors.push(
              `Module [${moduleId}] lệch số lượng challenge: file=${fileChallenges.length}, db=${dbMod.challenge_count}`
            );
          }

          for (const ch of fileChallenges) {
            const chId = `${moduleId}/${ch.order_index}`;
            const dbCh = sqlite
              .prepare('SELECT * FROM challenges WHERE id = ?')
              .get(chId) as any;

            if (!dbCh) {
              result.inSync = false;
              result.errors.push(`Challenge [${chId}] chưa có trong CSDL.`);
            }
          }
        }
      }

      return result;
    }

    // Sync mode (upsert in a transaction)
    const now = new Date().toISOString();

    const syncTx = sqlite.transaction(() => {
      for (const { course, challengesByModule } of parsedCourses) {
        sqlite
          .prepare(
            `INSERT INTO courses (slug, title, description, source_url, channel_name, module_count, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(slug) DO UPDATE SET
               title = excluded.title,
               description = excluded.description,
               source_url = excluded.source_url,
               channel_name = excluded.channel_name,
               module_count = excluded.module_count,
               updated_at = excluded.updated_at`
          )
          .run(
            course.slug,
            course.title,
            course.description,
            course.source_url,
            course.channel_name,
            course.modules.length,
            now
          );

        result.syncedCourses++;

        for (const mod of course.modules) {
          const moduleId = `${course.slug}/${mod.slug}`;
          const fileChallenges = challengesByModule.get(mod.slug) || [];

          sqlite
            .prepare(
              `INSERT INTO modules (id, course_slug, slug, order_index, title, video_timestamp, challenge_count, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                 course_slug = excluded.course_slug,
                 slug = excluded.slug,
                 order_index = excluded.order_index,
                 title = excluded.title,
                 video_timestamp = excluded.video_timestamp,
                 challenge_count = excluded.challenge_count,
                 updated_at = excluded.updated_at`
            )
            .run(
              moduleId,
              course.slug,
              mod.slug,
              mod.order_index,
              mod.title,
              mod.video_timestamp,
              fileChallenges.length,
              now
            );

          result.syncedModules++;

          for (const ch of fileChallenges) {
            const chId = `${moduleId}/${ch.order_index}`;

            sqlite
              .prepare(
                `INSERT INTO challenges (id, module_id, order_index, title, description, mode_required)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET
                   module_id = excluded.module_id,
                   order_index = excluded.order_index,
                   title = excluded.title,
                   description = excluded.description,
                   mode_required = excluded.mode_required`
              )
              .run(
                chId,
                moduleId,
                ch.order_index,
                ch.title,
                ch.description,
                ch.mode_required
              );

            result.syncedChallenges++;
          }
        }
      }
    });

    syncTx();
    result.inSync = true;
    return result;
  } finally {
    sqlite.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('sync-courses.ts')) {
  const isCheck = process.argv.includes('--check');
  console.log(isCheck ? 'Kiểm tra đồng bộ Content-as-Code...' : 'Đang đồng bộ Content-as-Code vào SQLite...');

  const res = syncCourses({ checkOnly: isCheck });

  if (isCheck) {
    if (res.inSync) {
      console.log('✓ Dữ liệu Content-as-Code khớp 100% với CSDL.');
      process.exit(0);
    } else {
      console.error('✗ Dữ liệu Content-as-Code bị lệch:');
      for (const err of res.errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }
  } else {
    if (res.errors.length > 0) {
      console.error('Lỗi đồng bộ:');
      for (const err of res.errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    } else {
      console.log(
        `✓ Đồng bộ thành công: ${res.syncedCourses} khóa học, ${res.syncedModules} module, ${res.syncedChallenges} challenge.`
      );
    }
  }
}
