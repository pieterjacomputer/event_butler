ALTER TABLE "event_parts" ADD COLUMN "route_address" text;--> statement-breakpoint
ALTER TABLE "event_parts" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "event_parts" ADD COLUMN "theme" text DEFAULT 'day' NOT NULL;