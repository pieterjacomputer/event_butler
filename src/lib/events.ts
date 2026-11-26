import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { formatTimeRange } from "@/lib/format";
import { eventParts, events, menuItems } from "@/db/schema";

/**
 * An event with its parts and menu, or null if the slug does not exist.
 * Wrapped in React `cache` so the page and its metadata share one query.
 */
export const getEventBySlug = cache(async (slug: string) => {
  const db = getDb();
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  if (!event) return null;

  const [parts, menu] = await Promise.all([
    db
      .select()
      .from(eventParts)
      .where(eq(eventParts.eventId, event.id))
      .orderBy(asc(eventParts.sortOrder)),
    db
      .select()
      .from(menuItems)
      .where(eq(menuItems.eventId, event.id))
      .orderBy(asc(menuItems.sortOrder)),
  ]);

  return { ...event, parts, menu };
});

export type EventWithDetails = NonNullable<
  Awaited<ReturnType<typeof getEventBySlug>>
>;

/**
 * The moment sign-ups and changes close for good: the hard close if set,
 * otherwise the order deadline. (With a hard close, the order deadline is
 * only a "preferably before" date.)
 */
export function closingTime(
  event: Pick<EventWithDetails, "orderDeadline" | "registrationClosesAt">,
): Date | null {
  return event.registrationClosesAt ?? event.orderDeadline;
}

/**
 * Orders and RSVPs are accepted until the closing time (checked on the
 * server). Times are stored to the minute (e.g. 23:59) and include that
 * whole minute.
 */
export function isOrderingOpen(
  event: Pick<EventWithDetails, "orderDeadline" | "registrationClosesAt">,
  now: Date = new Date(),
): boolean {
  const closes = closingTime(event);
  if (closes === null) return false;
  return now.getTime() < closes.getTime() + 60_000;
}

/** Guest data is deleted 30 days after the event (see CLAUDE.md, privacy). */
export function retentionDate(event: Pick<EventWithDetails, "startsAt">): Date {
  return new Date(event.startsAt.getTime() + 30 * 24 * 60 * 60 * 1000);
}

/** The parts as shown next to the RSVP checkboxes. */
export function partsForForm(event: EventWithDetails) {
  return event.parts.map((part, index) => ({
    id: part.id,
    name: `Deel ${index + 1}: ${part.name}`,
    when: [
      formatTimeRange(part.startsAt, part.endsAt),
      part.location?.split(",")[0],
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}
