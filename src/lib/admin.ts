import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { events, orderLines, orderParts, orders } from "@/db/schema";
import { getEventBySlug } from "@/lib/events";

/** All events, for the admin start page. */
export async function listEvents() {
  return getDb()
    .select({
      slug: events.slug,
      title: events.title,
      startsAt: events.startsAt,
    })
    .from(events)
    .orderBy(asc(events.startsAt));
}

/**
 * Everything the organiser needs for one event: every sign-up with its
 * headcount per part and portions per menu item, plus the totals.
 */
export async function getEventOverview(slug: string) {
  const event = await getEventBySlug(slug);
  if (!event) return null;

  const db = getDb();
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.eventId, event.id))
    .orderBy(asc(orders.createdAt));
  const orderIds = rows.map((o) => o.id);

  const [parts, lines] =
    orderIds.length === 0
      ? [[], []]
      : await Promise.all([
          db
            .select()
            .from(orderParts)
            .where(inArray(orderParts.orderId, orderIds)),
          db
            .select()
            .from(orderLines)
            .where(inArray(orderLines.orderId, orderIds)),
        ]);

  const signups = rows.map((order) => ({
    id: order.id,
    guestName: order.guestName,
    note: order.note,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    /** People per part id; a missing part means "not coming". */
    people: Object.fromEntries(
      parts
        .filter((p) => p.orderId === order.id)
        .map((p) => [p.eventPartId, p.people]),
    ) as Record<number, number>,
    /** Portions per menu item id. */
    portions: Object.fromEntries(
      lines
        .filter((l) => l.orderId === order.id)
        .map((l) => [l.menuItemId, l.quantity]),
    ) as Record<number, number>,
  }));

  const totals = {
    signups: signups.length,
    parts: event.parts.map((part) => ({
      id: part.id,
      name: part.name,
      signups: signups.filter((s) => s.people[part.id] !== undefined).length,
      people: signups.reduce((sum, s) => sum + (s.people[part.id] ?? 0), 0),
    })),
    menu: event.menu.map((item) => ({
      id: item.id,
      name: item.name,
      portions: signups.reduce((sum, s) => sum + (s.portions[item.id] ?? 0), 0),
    })),
    notes: signups.filter((s) => s.note).length,
  };

  return { event, signups, totals };
}

export type EventOverview = NonNullable<
  Awaited<ReturnType<typeof getEventOverview>>
>;
