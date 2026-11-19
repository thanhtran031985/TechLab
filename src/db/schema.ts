import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const courses = sqliteTable('courses', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  source_url: text('source_url').notNull(),
  channel_name: text('channel_name').notNull(),
  module_count: integer('module_count').notNull().default(0),
  updated_at: text('updated_at').notNull(),
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(), // <course>/<module>
  course_slug: text('course_slug')
    .notNull()
    .references(() => courses.slug, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  order_index: integer('order_index').notNull(),
  title: text('title').notNull(),
  video_timestamp: text('video_timestamp').notNull(), // [HH:MM:SS]
  challenge_count: integer('challenge_count').notNull().default(0),
  updated_at: text('updated_at').notNull(),
});

export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey(), // <course>/<module>/<order_index>
  module_id: text('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  order_index: integer('order_index').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  mode_required: text('mode_required', {
    enum: ['junior', 'senior', 'both'],
  }).notNull(),
});

export const challenge_progress = sqliteTable('challenge_progress', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().default('local'),
  challenge_id: text('challenge_id')
    .notNull()
    .references(() => challenges.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['NOT_STARTED', 'PASSED'] })
    .notNull()
    .default('NOT_STARTED'),
  attempts: integer('attempts').notNull().default(0),
  passed_at: text('passed_at'),
  updated_at: text('updated_at').notNull(),
});

export const user_notes = sqliteTable('user_notes', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().default('local'),
  module_id: text('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  video_timestamp: text('video_timestamp').notNull(),
  content: text('content').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const sandbox_runs = sqliteTable('sandbox_runs', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().default('local'),
  module_id: text('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  mode: text('mode', { enum: ['junior', 'senior'] }).notNull(),
  action_name: text('action_name').notNull(),
  http_method: text('http_method').notNull(),
  http_path: text('http_path').notNull(),
  http_status: integer('http_status').notNull(),
  summary: text('summary').notNull(),
  created_at: text('created_at').notNull(),
});

export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type ChallengeProgress = typeof challenge_progress.$inferSelect;
export type UserNote = typeof user_notes.$inferSelect;
export type SandboxRun = typeof sandbox_runs.$inferSelect;
