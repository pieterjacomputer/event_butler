"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { orderLines, orderParts, orders } from "@/db/schema";
import { checkFormToken, connectionHash } from "@/lib/anti-spam";
import { getEventBySlug, isOrderingOpen } from "@/lib/events";
import { todayInBrussels } from "@/lib/format";
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
    db.insert(orderParts).values(
      uniquePartIds.map((eventPartId) => ({
        orderId,
        eventPartId,
        people: input.people[String(eventPartId)],
      })),
    ),
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

  // Spam protection 1: humans need a few seconds to fill in the form.
  const values = formValuesFrom(formData);
  const tokenCheck = checkFormToken(String(formData.get("formToken") ?? ""));
  if (tokenCheck === "too-fast") {
    return { error: "Even geduld… probeer het zo opnieuw.", values, attempt };
  }
  if (tokenCheck !== "ok") {
    return {
      error: "Deze pagina is verlopen. Vernieuw de pagina en probeer opnieuw.",
      values,
      attempt,
    };
  }

  // Spam protection 2: at most 5 sign-ups per hour from one connection.
  const db = getDb();
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const connection = connectionHash(ip, todayInBrussels());
  const [recent] = await db
    .select({ n: count() })
    .from(orders)
    .where(
      and(
        eq(orders.connectionHash, connection),
        gt(orders.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
      ),
    );
  if ((recent?.n ?? 0) >= 5) {
    return {
      error:
        "Er zijn net veel inschrijvingen gebeurd vanaf deze verbinding. Probeer het over een uurtje opnieuw.",
      values,
      attempt,
    };
  }

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
      connectionHash: connection,
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
