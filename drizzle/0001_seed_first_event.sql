-- First event: "43 is a Party" (Saturday 5 December 2026).
-- Times are written with the Brussels offset in December (+01, CET) and stored in UTC.
INSERT INTO "events" ("slug", "title", "description", "location", "starts_at", "ends_at", "order_deadline")
VALUES (
	'43-is-a-party',
	'43 is a Party',
	$desc$Programma:
15u00 Start @ Treck Hostel
15u30 De Sint komt langs
16u30 Zwaardjes & Treck ambiance
18u00 Spaghetti bolognaise voor iedereen$desc$,
	'Treck Hostel Gent, Groendreef 51, 9000 Gent',
	'2026-12-05 15:00:00+01',
	'2026-12-05 20:00:00+01',
	'2026-11-28 23:59:00+01'
);
--> statement-breakpoint
INSERT INTO "menu_items" ("event_id", "name", "sort_order")
SELECT "id", v."name", v."sort_order"
FROM "events"
CROSS JOIN (VALUES
	('Spaghetti bolognaise', 1),
	('Spaghetti vegetarisch', 2),
	('Kinderportie', 3)
) AS v("name", "sort_order")
WHERE "slug" = '43-is-a-party';
