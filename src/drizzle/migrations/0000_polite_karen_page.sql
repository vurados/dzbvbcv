CREATE TABLE `collection` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`title` text NOT NULL,
	`color` text,
	`isEncrypted` integer DEFAULT false,
	`cryptHash` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collectionId` integer,
	`title` text NOT NULL,
	`oreder` integer NOT NULL,
	`width` integer DEFAULT 1,
	`height` integer DEFAULT 1,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collection_id_unique` ON `collection` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);