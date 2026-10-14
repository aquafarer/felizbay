CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`body` text DEFAULT '' NOT NULL,
	`image` text,
	`category` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`author` text,
	`publish_date` integer NOT NULL,
	`update_date` integer,
	`draft` integer DEFAULT false NOT NULL,
	`metadata_title` text,
	`metadata_description` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_slug_unique` ON `news` (`slug`);--> statement-breakpoint
CREATE INDEX `news_category_idx` ON `news` (`category`);