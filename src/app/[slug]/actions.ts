"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { orderLines, orderParts, orders } from "@/db/schema";
import { getEventBySlug, isOrderingOpen } from "@/lib/events";
import {
  formValuesFrom,
  parseOrderForm,
  toFieldErrors,
  type OrderFormState,
  type OrderInput,
} from "@/lib/order-schema";
import { getOrderByToken } from "@/lib/orders";

const CLOSED = "Inschrijven en bestellen is afgesloten.";

type Event = NonNullable<Awaited<ReturnType<typeof getEventBySlug>>>;

/**
 * Validates the form on the server and checks that the chosen parts and menu
 * items belong to this event. Returns the clean input or an error state.
 */
function validate(
  event: Event,
  formData: FormData,
  attempt: number,
): { ok: true; input: OrderInput } | { ok: false; state: OrderFormState } {
  const values = formValuesFrom(formData);
  const fail = (state: OrderFormState) => ({
    ok: false as const,
    state: { ...state, values, attempt },
  });

  // Honeypot: real guests never see or fill this field.
  if (String(formData.get("website") ?? "") !== "") {
    return fail({ error: "Er ging iets mis. Probeer het opnieuw." });
  }

  const parsed = parseOrderForm(formData);
  if (!parsed.success) {
    return fail({
      error: "Controleer de velden hieronder.",
      fieldErrors: toFieldErrors(parsed.error),
    });
  }

  const partIds = new Set(event.parts.map((p) => p.id));
  const menuIds = new Set(event.menu.map((m) => String(m.id)));
  const input = parsed.data;
  if (
    !input.partIds.every((id) => partIds.has(id)) ||
    !Object.keys(input.quantities).every((id) => menuIds.has(id))
  ) {
    return fail({
      error: "Er ging iets mis. Vernieuw de pagina en probeer opnieuw.",
    });
  }

  return { ok: true, input };
}

/** The inserts for an order's parts and portions (only quantities above 0). */
function childRows(orderId: string, input: OrderInput) {
  const db = getDb();
  const queries: BatchItem<"pg">[] = [];
  const uniquePartIds = [...new Set(input.partIds)];
  queries.push(
    db
      .insert(orderParts)
      .values(uniquePartIds.map((eventPartId) => ({ orderId, eventPartId }))),
  );
  const lines = Object.entries(input.quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([menuItemId, quantity]) => ({
      orderId,
      menuItemId: Number(menuItemId),
      quantity,
    }));
  if (lines.length > 0) {
    queries.push(db.insert(orderLines).values(lines));
  }
  return queries;
}

export async function createOrder(
  slug: string,
  prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const attempt = (prev.attempt ?? 0) + 1;
  const event = await getEventBySlug(slug);
  if (!event) return { error: "Dit feest bestaat niet.", attempt };
  if (!isOrderingOpen(event)) return { error: CLOSED, attempt };

  const result = validate(event, formData, attempt);
  if (!result.ok) return result.state;
  const { input } = result;

  const db = getDb();
  const orderId = randomUUID();
  const token = randomBytes(32).toString("base64url");

  // neon-http runs a batch as one transaction: all rows are saved, or none.
  await db.batch([
    db.insert(orders).values({
      id: orderId,
      eventId: event.id,
      guestName: input.guestName,
      note: input.note === "" ? null : input.note,
      editToken: token,
    }),
    ...childRows(orderId, input),
  ]);

  redirect(`/${slug}/bestelling/${token}?nieuw=1`);
}

export async function updateOrder(
  slug: string,
  token: string,
  prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const attempt = (prev.attempt ?? 0) + 1;
  const event = await getEventBySlug(slug);
  if (!event) return { error: "Dit feest bestaat niet.", attempt };
  if (!isOrderingOpen(event)) return { error: CLOSED, attempt };

  const order = await getOrderByToken(event.id, token);
  if (!order) return { error: "Deze inschrijving bestaat niet meer.", attempt };

  const result = validate(event, formData, attempt);
  if (!result.ok) return result.state;
  const { input } = result;

  const db = getDb();
  await db.batch([
    db
      .update(orders)
      .set({
        guestName: input.guestName,
        note: input.note === "" ? null : input.note,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id)),
    db.delete(orderParts).where(eq(orderParts.orderId, order.id)),
    db.delete(orderLines).where(eq(orderLines.orderId, order.id)),
    ...childRows(order.id, input),
  ]);

  redirect(`/${slug}/bestelling/${token}?gewijzigd=1`);
}

export async function cancelOrder(slug: string, token: string): Promise<void> {
  const event = await getEventBySlug(slug);
  if (!event || !isOrderingOpen(event)) {
    redirect(`/${slug}/bestelling/${token}`);
  }

  const order = await getOrderByToken(event.id, token);
  if (order) {
    // Parts and portions are removed with it (ON DELETE CASCADE).
    await getDb().delete(orders).where(eq(orders.id, order.id));
  }

  redirect(`/${slug}?geannuleerd=1`);
}
