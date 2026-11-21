-- Split event page for "43 is a Party": theme and programme per part.
-- Part 2's route address is private and is NOT set here (the repository is
-- public); it is set directly in the production database.
UPDATE "event_parts" SET
	"theme" = 'day',
	"route_address" = 'Treck Hostel Gent, Groendreef 51, 9000 Gent',
	"description" = $d$15u00 Start @ Treck Hostel
15u30 De Sint komt langs
16u30 Zwaardjes & Treck ambiance
18u00 Spaghetti bolognaise voor iedereen$d$
WHERE "sort_order" = 1
	AND "event_id" = (SELECT "id" FROM "events" WHERE "slug" = '43-is-a-party');
--> statement-breakpoint
UPDATE "event_parts" SET
	"theme" = 'night',
	"description" = '21u00 Feest!'
WHERE "sort_order" = 2
	AND "event_id" = (SELECT "id" FROM "events" WHERE "slug" = '43-is-a-party');
--> statement-breakpoint
UPDATE "events" SET "image_path" = NULL WHERE "slug" = '43-is-a-party';
