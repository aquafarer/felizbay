-- Inquiry routing (⑤): persist the contact form's routing selects. The inquiry
-- type (retail/wholesale/oem/support) and order volume reuse the existing
-- business_type / quantity columns; these two are new.
ALTER TABLE `inquiry` ADD COLUMN `product_interest` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiry` ADD COLUMN `customization` text DEFAULT '' NOT NULL;
