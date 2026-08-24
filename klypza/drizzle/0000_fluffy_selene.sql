CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`topic` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`consent_at` integer NOT NULL,
	`status` text DEFAULT 'subscribed' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `reward_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`claim_after` integer NOT NULL,
	`claimed` integer DEFAULT false NOT NULL,
	`advertiser_id` text DEFAULT 'klypza-house' NOT NULL,
	FOREIGN KEY (`visitor_id`) REFERENCES `visitors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sponsor_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text NOT NULL,
	`budget` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`credits` integer DEFAULT 10 NOT NULL,
	`total_uses` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
