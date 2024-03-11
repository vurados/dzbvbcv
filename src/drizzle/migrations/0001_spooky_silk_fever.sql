/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE collection ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE collection ADD `color` text;--> statement-breakpoint
ALTER TABLE collection ADD `isEncrypted` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE collection ADD `cryptHash` text;--> statement-breakpoint
ALTER TABLE collection ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE note ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE note ADD `oreder` integer NOT NULL;--> statement-breakpoint
ALTER TABLE note ADD `width` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE note ADD `height` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE note ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE user ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/