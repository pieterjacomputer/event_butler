-- "43 is a Party": 28/11 becomes a soft deadline; sign-ups and changes stay
-- possible until Saturday 5 December 2026, 23:59 Brussels (the form
-- disappears on 6 December).
UPDATE "events"
SET "registration_closes_at" = '2026-12-05 23:59:00+01'
WHERE "slug" = '43-is-a-party';
