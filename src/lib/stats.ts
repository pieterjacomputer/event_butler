import { sql } from "drizzle-orm";
import { getDb } from "@/db";

/** Brussels calendar day of a visit, used for "per day" numbers. */
const DAY = sql`(created_at at time zone 'Europe/Brussels')::date`;

/**
 * Anonymous visit statistics for one event. A "visitor" is unique per day
 * (the anonymous id changes daily), so totals over several days add up the
 * daily unique visitors.
 */
export async function getVisitStats(eventId: number) {
  const db = getDb();
  const today = sql`(now() at time zone 'Europe/Brussels')::date`;

  const [
    totalsResult,
    perDayResult,
    referrerResult,
    deviceResult,
    countryResult,
  ] = await Promise.all([
    db.execute(sql`
        select
          count(*) filter (where kind = 'view')::int as views,
          count(distinct (visitor_hash, ${DAY})) filter (where kind = 'view')::int as visitors,
          count(distinct visitor_hash) filter (where kind = 'view' and ${DAY} = ${today})::int as visitors_today,
          count(distinct (visitor_hash, ${DAY})) filter (where kind = 'view' and ${DAY} > ${today} - 7)::int as visitors_7d,
          count(*) filter (where kind = 'cta')::int as cta_clicks,
          count(*) filter (where kind = 'route')::int as route_clicks
        from page_visits where event_id = ${eventId}`),
    db.execute(sql`
        select ${DAY}::text as day,
          count(distinct visitor_hash)::int as visitors,
          count(*)::int as views
        from page_visits
        where event_id = ${eventId} and kind = 'view' and ${DAY} > ${today} - 30
        group by 1 order by 1`),
    db.execute(sql`
        select referrer as label, count(distinct (visitor_hash, ${DAY}))::int as visitors
        from page_visits where event_id = ${eventId} and kind = 'view'
        group by 1 order by 2 desc`),
    db.execute(sql`
        select device as label, count(distinct (visitor_hash, ${DAY}))::int as visitors
        from page_visits where event_id = ${eventId} and kind = 'view'
        group by 1 order by 2 desc`),
    db.execute(sql`
        select coalesce(country, '?') as label, count(distinct (visitor_hash, ${DAY}))::int as visitors
        from page_visits where event_id = ${eventId} and kind = 'view'
        group by 1 order by 2 desc limit 6`),
  ]);

  const totals = totalsResult.rows[0] as {
    views: number;
    visitors: number;
    visitors_today: number;
    visitors_7d: number;
    cta_clicks: number;
    route_clicks: number;
  };
  type Row = { label: string; visitors: number };

  return {
    views: totals.views,
    visitors: totals.visitors,
    visitorsToday: totals.visitors_today,
    visitors7d: totals.visitors_7d,
    ctaClicks: totals.cta_clicks,
    routeClicks: totals.route_clicks,
    perDay: perDayResult.rows as {
      day: string;
      visitors: number;
      views: number;
    }[],
    referrers: referrerResult.rows as Row[],
    devices: deviceResult.rows as Row[],
    countries: countryResult.rows as Row[],
  };
}

export type VisitStats = Awaited<ReturnType<typeof getVisitStats>>;
