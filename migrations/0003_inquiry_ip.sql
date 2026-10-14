-- Audit fields for contact-form submissions: capture IP + User-Agent at insertion
-- time (the legacy encrypted-file pipeline stored these; the D1 migration lost them).
ALTER TABLE `inquiry` ADD COLUMN `ip` text;--> statement-breakpoint
ALTER TABLE `inquiry` ADD COLUMN `user_agent` text;