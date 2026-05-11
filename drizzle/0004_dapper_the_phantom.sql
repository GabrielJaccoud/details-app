ALTER TABLE `extracted_data` ADD `sourceText` text;--> statement-breakpoint
ALTER TABLE `extracted_data` ADD `sourcePageNumber` int;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD `fieldOrigins` json;