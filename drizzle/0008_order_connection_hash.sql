ALTER TABLE "orders" ADD COLUMN "connection_hash" text;--> statement-breakpoint
CREATE INDEX "orders_connection_idx" ON "orders" USING btree ("connection_hash","created_at");