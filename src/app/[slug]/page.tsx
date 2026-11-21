import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from "./actions";
import { OrderForm } from "./order-form";
import {
  getEventBySlug,
  isOrderingOpen,
  retentionDate,
  partsForForm,
} from "@/lib/events";
import { formatDate, formatDateTime, formatTimeRange } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? event.title : "Niet gevonden" };
}

export default function EventPage({
  params,
  searchParams,
}: PageProps<"/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 sm:py-10">
      <Suspense fallback={<p className="text-muted-foreground">Laden…</p>}>
        <EventDetails params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function EventDetails({
  params,
  searchParams,
}: Pick<PageProps<"/[slug]">, "params" | "searchParams">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const cancelled = query.geannuleerd === "1";
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const open = isOrderingOpen(event);

  return (
    <article className="flex flex-col gap-6">
      {cancelled && (
        <p role="status" className="rounded-lg bg-muted px-4 py-3 text-sm">
          Je inschrijving is geannuleerd. Toch komen? Vul het formulier
          hieronder opnieuw in.
        </p>
      )}

      {event.imagePath && (
        <Image
          src={event.imagePath}
          alt={`Uitnodiging: ${event.title}`}
          width={1024}
          height={900}
          sizes="(max-width: 640px) 100vw, 576px"
          className="h-auto w-full rounded-xl"
          priority
        />
      )}

      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden />
          <span className="first-letter:uppercase">
            {formatDate(event.startsAt)}
          </span>
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Wanneer en waar</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {event.parts.map((part, index) => (
              <li key={part.id} className="flex flex-col gap-1">
                <p className="font-medium">
                  Deel {index + 1}: {part.name}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" aria-hidden />
                  {formatTimeRange(part.startsAt, part.endsAt)}
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {part.location ? (
                    <span>
                      {part.location} ·{" "}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(part.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4"
                      >
                        Route
                      </a>
                    </span>
                  ) : (
                    <span>Adres: zie je uitnodiging</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programma</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm leading-6">
            {event.description.replace(/^Programma:\s*/, "")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inschrijven en spaghetti bestellen</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 text-sm">
          {event.orderDeadline && open ? (
            <>
              <p>
                Inschrijven en bestellen kan tot{" "}
                <strong>{formatDateTime(event.orderDeadline)}</strong>. Na het
                inschrijven krijg je een persoonlijke link waarmee je tot dan
                kan wijzigen of annuleren.
              </p>
              <OrderForm
                action={createOrder.bind(null, event.slug)}
                parts={partsForForm(event)}
                menu={event.menu.map((m) => ({ id: m.id, name: m.name }))}
                submitLabel="Inschrijven"
              />
              <p className="text-xs text-muted-foreground">
                We bewaren je naam, inschrijving en bestelling enkel voor dit
                feest en verwijderen ze op {formatDate(retentionDate(event))}.
              </p>
            </>
          ) : (
            <p>Inschrijven en bestellen is afgesloten.</p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
