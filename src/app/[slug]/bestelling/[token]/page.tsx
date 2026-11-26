import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEventBySlug,
  isOrderingOpen,
  partsForForm,
  retentionDate,
} from "@/lib/events";
import { formatDate } from "@/lib/format";
import { getOrderByToken } from "@/lib/orders";
import { cancelOrder, updateOrder } from "../../actions";
import { CancelButton } from "../../cancel-button";
import { OrderForm } from "../../order-form";

export const metadata: Metadata = {
  title: "Je inschrijving",
  // The token in this URL is the guest's key: never send it to other sites.
  referrer: "no-referrer",
};

export default function OrderPage({
  params,
  searchParams,
}: PageProps<"/[slug]/bestelling/[token]">) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 sm:py-10">
      <Suspense fallback={<p className="text-muted-foreground">Laden…</p>}>
        <OrderDetails params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function OrderDetails({
  params,
  searchParams,
}: Pick<PageProps<"/[slug]/bestelling/[token]">, "params" | "searchParams">) {
  const [{ slug, token }, query] = await Promise.all([params, searchParams]);
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const order = await getOrderByToken(event.id, token);
  if (!order) notFound();

  const open = isOrderingOpen(event);
  const isNew = query.nieuw === "1";
  const isChanged = query.gewijzigd === "1";

  const quantityOf = (menuItemId: number) =>
    order.lines.find((l) => l.menuItemId === menuItemId)?.quantity ?? 0;
  const parts = partsForForm(event);
  const chosenParts = parts.filter((p) => order.partIds.includes(p.id));
  const portions = event.menu
    .map((m) => ({ name: m.name, quantity: quantityOf(m.id) }))
    .filter((p) => p.quantity > 0);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <Link
          href={`/${event.slug}`}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          ← {event.title}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          Je inschrijving
        </h1>
      </header>

      {(isNew || isChanged) && (
        <p role="status" className="rounded-lg bg-muted px-4 py-3 text-sm">
          {isNew
            ? "Bedankt! Je inschrijving is opgeslagen."
            : "Je wijzigingen zijn opgeslagen."}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{order.guestName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div>
            <p className="font-medium">Je komt naar</p>
            <ul className="list-disc pl-5">
              {chosenParts.map((p) => (
                <li key={p.id}>
                  {p.name}:{" "}
                  <strong>{personen(order.people[String(p.id)] ?? 1)}</strong>{" "}
                  <span className="text-muted-foreground">({p.when})</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Spaghetti</p>
            {portions.length > 0 ? (
              <ul className="list-disc pl-5">
                {portions.map((p) => (
                  <li key={p.name}>
                    {p.quantity} × {p.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Geen spaghetti besteld.</p>
            )}
          </div>
          {order.note && (
            <div>
              <p className="font-medium">Opmerking</p>
              <p className="whitespace-pre-line">{order.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {open ? (
        <>
          <p className="rounded-lg border px-4 py-3 text-sm">
            <strong>Bewaar deze link</strong> (bv. als bladwijzer). Hiermee kan
            je je inschrijving later nog wijzigen of annuleren.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Wijzigen</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderForm
                action={updateOrder.bind(null, event.slug, token)}
                parts={parts}
                menu={event.menu.map((m) => ({ id: m.id, name: m.name }))}
                initialValues={{
                  guestName: order.guestName,
                  partIds: order.partIds,
                  people: Object.fromEntries(
                    Object.entries(order.people).map(([id, n]) => [
                      id,
                      String(n),
                    ]),
                  ),
                  quantities: Object.fromEntries(
                    event.menu.map((m) => [
                      String(m.id),
                      String(quantityOf(m.id)),
                    ]),
                  ),
                  note: order.note ?? "",
                }}
                submitLabel="Wijzigingen opslaan"
              />
            </CardContent>
          </Card>

          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-muted-foreground">Toch niet komen?</p>
            <CancelButton action={cancelOrder.bind(null, event.slug, token)} />
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Inschrijven en bestellen is afgesloten. Wijzigen kan niet meer; neem
          contact op met de organisator als er iets niet klopt.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        We bewaren je naam, inschrijving en bestelling enkel voor dit feest en
        verwijderen ze op {formatDate(retentionDate(event))}.
      </p>
    </article>
  );
}

function personen(n: number): string {
  return n === 1 ? "1 persoon" : `${n} personen`;
}
