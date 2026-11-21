CREATE TABLE "event_parts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_parts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"name" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"location" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_parts" (
	"order_id" uuid NOT NULL,
	"event_part_id" integer NOT NULL,
	CONSTRAINT "order_parts_order_id_event_part_id_pk" PRIMARY KEY("order_id","event_part_id")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_path" text;--> statement-breakpoint
ALTER TABLE "event_parts" ADD CONSTRAINT "event_parts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_parts" ADD CONSTRAINT "order_parts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_parts" ADD CONSTRAINT "order_parts_event_part_id_event_parts_id_fk" FOREIGN KEY ("event_part_id") REFERENCES "public"."event_parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_parts_event_id_idx" ON "event_parts" USING btree ("event_id");