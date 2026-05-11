CREATE TABLE `edital_document_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editalId` int NOT NULL,
	`documentId` int NOT NULL,
	`userId` int NOT NULL,
	`linkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `edital_document_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int NOT NULL,
	`documentType` enum('curriculum','identity','education','experience','recommendation','other') NOT NULL DEFAULT 'other',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_documents_id` PRIMARY KEY(`id`)
);
