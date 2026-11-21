"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isAdmin } from "@/auth";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getEventBySlug } from "@/lib/events";

/** Deletes one sign-up (its headcounts and portions go with it). */
export async function deleteSignup(slug: string, orderId: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  const event = await getEventBySlug(slug);
  if (!event) redirect("/admin");

  const deleted = await getDb()
    .delete(orders)
    .where(and(eq(orders.id, orderId), eq(orders.eventId, event.id)))
    .returning({ id: orders.id });

  redirect(`/admin/${slug}?verwijderd=${deleted.length}`);
}

export type DeleteAllState = { error?: string };

/**
 * Deletes all guest data of an event. Only runs when the organiser typed
 * the exact event title, so it cannot happen by accident.
 */
export async function deleteAllSignups(
  slug: string,
  _prev: DeleteAllState,
  formData: FormData,
): Promise<DeleteAllState> {
  if (!(await isAdmin())) redirect("/admin/login");
  const event = await getEventBySlug(slug);
  if (!event) redirect("/admin");

  const typed = String(formData.get("confirmTitle") ?? "").trim();
  if (typed !== event.title) {
    return { error: `Typ exact "${event.title}" om te bevestigen.` };
  }

  const deleted = await getDb()
    .delete(orders)
    .where(eq(orders.eventId, event.id))
    .returning({ id: orders.id });

  redirect(`/admin/${slug}?verwijderd=${deleted.length}`);
}
