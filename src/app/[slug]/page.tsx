import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Clock, MapPin, Navigation, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createOrder } from "./actions";
import {
  Balloons,
  Bunting,
  MoonAndStars,
  SpaghettiBowl,
  StringLights,
} from "./event-visuals";
import { OrderForm } from "./order-form";
import {
  getEventBySlug,
  isOrderingOpen,
  partsForForm,
  retentionDate,
  type EventWithDetails,
} from "@/lib/events";
import {
  formatDate,
  formatDateTime,
  formatShortDate,
  formatTimeRange,
} from "@/lib/format";

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
    <main className="flex-1">
      <Suspense fallback={<p className="p-6 text-muted-foreground">Laden…</p>}>
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

  const open = isOrderingOpen(event) && event.orderDeadline !== null;

  return (
    <article>
      {cancelled && (
        <p role="status" className="mx-auto max-w-xl px-4 pt-4 text-sm">
          <span className="block rounded-lg bg-muted px-4 py-3">
            Je inschrijving is geannuleerd. Toch komen? Vul het formulier
            hieronder opnieuw in.
          </span>
        </p>
      )}

      <EventHeader event={event} />

      <section
        aria-label="Programma"
        className="relative flex flex-col md:grid md:grid-cols-2"
      >
        {event.parts.map((part, index) => (
          <PartPanel
            key={part.id}
            part={part}
            number={index + 1}
            slug={event.slug}
            className={index === 0 ? "order-1" : "order-3"}
          />
        ))}
        {open && (
          <div className="relative z-10 order-2 -my-7 flex justify-center md:absolute md:top-1/2 md:left-1/2 md:my-0 md:-translate-x-1/2 md:-translate-y-1/2">
            <a
              href="#inschrijven"
              className="inline-flex items-center gap-2 rounded-full border-4 border-white bg-gradient-to-r from-[#E4572E] to-[#E86A92] px-7 py-3.5 font-serif text-xl text-white shadow-xl transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#F6C445] focus-visible:outline-none motion-reduce:transition-none"
            >
              <PartyPopper className="size-6" aria-hidden />
              Ik kom feesten
            </a>
          </div>
        )}
      </section>

      <section
        id="inschrijven"
        className="mx-auto max-w-xl scroll-mt-4 px-4 py-10"
      >
        <Card>
          <CardHeader>
            <CardTitle>Inschrijven en spaghetti bestellen</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 text-sm">
            {open && event.orderDeadline ? (
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
      </section>
    </article>
  );
}

function EventHeader({ event }: { event: EventWithDetails }) {
  // "43 is a Party" → a big "43" plus the rest in script.
  const match = /^(\d+)\s+(.*)$/.exec(event.title);
  return (
    <header className="relative overflow-hidden bg-[#FBF3E4] px-4 pt-16 pb-10 text-center text-[#2B2140]">
      <Bunting className="absolute inset-x-0 top-0 h-14 w-full" />
      <h1 className="font-script leading-none">
        {match ? (
          <>
            <span className="text-7xl text-[#E4572E] drop-shadow-[3px_3px_0_#F6C445] sm:text-8xl">
              {match[1]}
            </span>{" "}
            <span className="text-5xl text-[#C8432B] sm:text-6xl">
              {match[2]}
            </span>
          </>
        ) : (
          <span className="text-5xl text-[#C8432B] sm:text-6xl">
            {event.title}
          </span>
        )}
      </h1>
      <p className="mt-5 inline-block -rotate-1 bg-[#F6C445] px-6 py-1.5 font-serif text-2xl tracking-wide text-[#2B2140] shadow-sm">
        <span className="sr-only">{formatDate(event.startsAt)}</span>
        <span aria-hidden>{formatShortDate(event.startsAt)}</span>
      </p>
    </header>
  );
}

const THEMES = {
  day: {
    panel: "bg-[#FBF3E4] text-[#2B2140]",
    pill: "bg-[#F4A6B7]/70 text-[#2B2140]",
    accent: "text-[#C8432B]",
    muted: "text-[#2B2140]/70",
    button: "border-[#2B2140]/20 bg-white/70 text-[#2B2140] hover:bg-white",
  },
  night: {
    panel: "bg-[#1B2340] text-[#F7EFE3]",
    pill: "bg-[#C9476F] text-white",
    accent: "text-[#F2C14E]",
    muted: "text-[#F7EFE3]/75",
    button: "border-white/25 bg-white/10 text-white hover:bg-white/20",
  },
} as const;

function PartPanel({
  part,
  number,
  slug,
  className,
}: {
  part: EventWithDetails["parts"][number];
  number: number;
  slug: string;
  className?: string;
}) {
  const theme = THEMES[part.theme];
  // "Zonder kindjes – Hoge Housewarming" → label + subtitle.
  const [label, subtitle] = part.name.split(" – ");
  const venue = subtitle ?? part.location?.split(",")[0];
  const items = (part.description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "relative overflow-hidden px-6 pt-14 pb-16 md:px-10 md:py-16",
        theme.panel,
        className,
      )}
    >
      {part.theme === "day" ? (
        <>
          <Balloons className="pointer-events-none absolute top-3 left-1 w-14 opacity-90 md:w-20" />
          <SpaghettiBowl className="pointer-events-none absolute right-3 bottom-4 w-20 opacity-90 md:w-24" />
        </>
      ) : (
        <>
          <StringLights className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full" />
          <MoonAndStars className="pointer-events-none absolute top-8 right-2 w-28 opacity-95 md:w-36" />
        </>
      )}

      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
        <p
          className={cn(
            "text-xs font-semibold tracking-widest uppercase",
            theme.muted,
          )}
        >
          Deel {number}
        </p>
        <h2
          className={cn(
            "-rotate-1 rounded-md px-5 py-1.5 font-serif text-3xl",
            theme.pill,
          )}
        >
          {label}
        </h2>
        {venue && (
          <p className={cn("font-script text-2xl", theme.accent)}>{venue}</p>
        )}

        <p className="flex items-center gap-2 font-serif text-2xl">
          <Clock className="size-5" aria-hidden />
          {formatTimeRange(part.startsAt, part.endsAt)}
        </p>

        {part.location && (
          <p className={cn("flex items-start gap-2 text-sm", theme.muted)}>
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {part.location}
          </p>
        )}

        {items.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-left text-[15px]">
            {items.map((item) => {
              const [, time, text] =
                /^(\d{1,2}u\d{2})\s+(.*)$/.exec(item) ?? [];
              return (
                <li key={item} className="flex gap-3">
                  {time ? (
                    <>
                      <span
                        className={cn(
                          "w-12 shrink-0 font-semibold",
                          theme.accent,
                        )}
                      >
                        {time}
                      </span>
                      <span>{text}</span>
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {part.routeAddress && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className={cn("text-sm", theme.muted)}>Route:</span>
            {(
              [
                ["google", "Google Maps"],
                ["waze", "Waze"],
              ] as const
            ).map(([app, appLabel]) => (
              <a
                key={app}
                // Our own redirect: the address is never in this page.
                href={`/${slug}/route/${part.id}?app=${app}`}
                target="_blank"
                rel="nofollow noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  theme.button,
                )}
              >
                <Navigation className="size-3.5" aria-hidden />
                {appLabel}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
