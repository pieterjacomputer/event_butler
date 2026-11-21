import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderLines, orderParts, orders } from "@/db/schema";

/** A guest's RSVP and order, found by the secret token in their personal link. */
export async function getOrderByToken(eventId: number, token: string) {
  // Tokens are 43 base64url characters; reject anything else without a query.
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.editToken, token), eq(orders.eventId, eventId)))
    .limit(1);
  if (!order) return null;

  const [parts, lines] = await Promise.all([
    db
      .select({
        eventPartId: orderParts.eventPartId,
        people: orderParts.people,
      })
      .from(orderParts)
      .where(eq(orderParts.orderId, order.id)),
    db
      .select({
        menuItemId: orderLines.menuItemId,
        quantity: orderLines.quantity,
      })
      .from(orderLines)
      .where(eq(orderLines.orderId, order.id)),
  ]);

  return {
    ...order,
    partIds: parts.map((p) => p.eventPartId),
    /** People per part, keyed by part id. */
    people: Object.fromEntries(
      parts.map((p) => [String(p.eventPartId), p.people]),
    ),
    lines,
  };
}

export type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof getOrderByToken>>
>;
