CREATE TABLE `challenge_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'local' NOT NULL,
	`challenge_id` text NOT NULL,
	`status` text DEFAULT 'NOT_STARTED' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`passed_at` text,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`mode_required` text NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`source_url` text NOT NULL,
	`channel_name` text NOT NULL,
	`module_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`course_slug` text NOT NULL,
	`slug` text NOT NULL,
	`order_index` integer NOT NULL,
	`title` text NOT NULL,
	`video_timestamp` text NOT NULL,
	`challenge_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`course_slug`) REFERENCES `courses`(`slug`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sandbox_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'local' NOT NULL,
	`module_id` text NOT NULL,
	`mode` text NOT NULL,
	`action_name` text NOT NULL,
	`http_method` text NOT NULL,
	`http_path` text NOT NULL,
	`http_status` integer NOT NULL,
	`summary` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'local' NOT NULL,
	`module_id` text NOT NULL,
	`video_timestamp` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
