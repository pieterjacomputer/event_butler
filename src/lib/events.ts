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
 * Orders and RSVPs are accepted until the deadline (checked on the server).
 * The deadline is stored to the minute (e.g. 23:59) and includes that whole
 * minute.
 */
export function isOrderingOpen(
  event: Pick<EventWithDetails, "orderDeadline">,
  now: Date = new Date(),
): boolean {
  if (event.orderDeadline === null) return false;
  return now.getTime() < event.orderDeadline.getTime() + 60_000;
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
