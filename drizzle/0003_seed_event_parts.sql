-- RSVP parts and image for "43 is a Party".
-- Part 2 is at a private home: its address is deliberately not stored.
INSERT INTO "event_parts" ("event_id", "name", "starts_at", "ends_at", "location", "sort_order")
SELECT "id", v."name", v."starts_at"::timestamptz, v."ends_at"::timestamptz, v."location", v."sort_order"
FROM "events"
CROSS JOIN (VALUES
	('Met kindjes', '2026-12-05 15:00:00+01', '2026-12-05 20:00:00+01', 'Treck Hostel Gent, Groendreef 51, 9000 Gent', 1),
	('Zonder kindjes – Hoge Housewarming', '2026-12-05 21:00:00+01', NULL, NULL, 2)
) AS v("name", "starts_at", "ends_at", "location", "sort_order")
WHERE "slug" = '43-is-a-party';
--> statement-breakpoint
UPDATE "events" SET "image_path" = '/events/43-is-a-party.jpg' WHERE "slug" = '43-is-a-party';
