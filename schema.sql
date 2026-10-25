-- Empty local D1 schema. No production rows or credentials.
CREATE TABLE `deposit_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`clabe` text NOT NULL,
	`label` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`roomie_id` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`roomie_id`) REFERENCES `roomies`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `roomies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`rent_amount` integer NOT NULL,
	`rent_day` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
, start_date TEXT, grace_days INTEGER NOT NULL DEFAULT 5);

CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);

CREATE UNIQUE INDEX `deposit_accounts_clabe_unique` ON `deposit_accounts` (`clabe`);

CREATE UNIQUE INDEX `roomies_slug_unique` ON `roomies` (`slug`);

CREATE TABLE admin_sessions (token_hash TEXT PRIMARY KEY NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions(expires_at);
