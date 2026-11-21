import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronsDown,
  Clock,
  MapPin,
  Navigation,
  PartyPopper,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createOrder } from "./actions";
import {
  Balloons,
  Bunting,
  HousewarmingScene,
  MoonAndStars,
  SpaghettiBowl,
  StarField,
  StringLights,
  WaveEdge,
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

type Part = EventWithDetails["parts"][number];

async function EventDetails({
  params,
  searchParams,
}: Pick<PageProps<"/[slug]">, "params" | "searchParams">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const cancelled = query.geannuleerd === "1";
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const open = isOrderingOpen(event) && event.orderDeadline !== null;
  const [dayPart, ...otherParts] = event.parts;

  return (
    <article>
      {cancelled && (
        <p role="status" className="bg-[#FBF3E4] px-4 pt-4 text-sm">
          <span className="mx-auto block max-w-xl rounded-lg bg-white px-4 py-3 text-[#2B2140] shadow-sm">
            Je inschrijving is geannuleerd. Toch komen? Vul het formulier
            onderaan opnieuw in.
          </span>
        </p>
      )}

      {/*
        Mobile: three full screens — (1) header + day, (2) night, (3) form.
        Desktop: header on top, day and night side by side, form below.
      */}
      <div className="relative md:grid md:grid-cols-2">
        <div className="flex min-h-svh flex-col md:contents">
          <EventHeader event={event} className="md:col-span-2" />
          {dayPart && (
            <PartPanel
              part={dayPart}
              number={1}
              slug={event.slug}
              className="flex-1 md:col-start-1 md:row-start-2"
            >
              {otherParts[0] && (
                <a
                  href={`#deel-2`}
                  className="mt-auto flex flex-col items-center gap-1 pt-8 text-sm text-[#2B2140]/80 md:hidden"
                >
                  <span>
                    Swipe omhoog voor{" "}
                    <strong>{otherParts[0].name.split(" – ")[0]}</strong>
                  </span>
                  <ChevronsDown
                    className="size-6 motion-safe:animate-bounce"
                    aria-hidden
                  />
                </a>
              )}
            </PartPanel>
          )}
        </div>

        {otherParts.map((part, index) => (
          <PartPanel
            key={part.id}
            id={`deel-${index + 2}`}
            part={part}
            number={index + 2}
            slug={event.slug}
            className="min-h-svh md:col-start-2 md:row-start-2 md:min-h-0"
          >
            {open && (
              <a
                href="#inschrijven"
                className="mt-auto flex flex-col items-center gap-1 pt-8 text-sm text-white/80 md:hidden"
              >
                <span>Swipe omhoog om in te schrijven</span>
                <ChevronsDown
                  className="size-6 motion-safe:animate-bounce"
                  aria-hidden
                />
              </a>
            )}
          </PartPanel>
        ))}

        {/* Desktop: the call to action sits on the seam between both sides. */}
        {open && (
          <div className="pointer-events-none z-10 hidden md:col-span-2 md:col-start-1 md:row-start-2 md:flex md:items-center md:justify-center">
            <CallToAction className="pointer-events-auto" />
          </div>
        )}
      </div>

      <FormSection event={event} open={open} />
    </article>
  );
}

function CallToAction({ className }: { className?: string }) {
  return (
    <a
      href="#inschrijven"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-4 border-white bg-gradient-to-r from-[#E4572E] to-[#E86A92] px-7 py-3.5 font-serif text-xl text-white shadow-xl transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#F6C445] focus-visible:outline-none motion-reduce:transition-none",
        className,
      )}
    >
      <PartyPopper className="size-6" aria-hidden />
      Ik kom feesten
    </a>
  );
}

function EventHeader({
  event,
  className,
}: {
  event: EventWithDetails;
  className?: string;
}) {
  // "43 is a Party" → a big "43" plus the rest in script.
  const match = /^(\d+)\s+(.*)$/.exec(event.title);
  return (
    <header
      className={cn(
        "relative overflow-hidden bg-[#FBF3E4] px-4 pt-16 pb-6 text-center text-[#2B2140] md:pb-10",
        className,
      )}
    >
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
    button: "border-[#2B2140]/20 bg-white/80 text-[#2B2140] hover:bg-white",
  },
  night: {
    panel: "bg-[#1B2340] text-[#F7EFE3]",
    pill: "bg-[#C9476F] text-white",
    accent: "text-[#F2C14E]",
    muted: "text-[#F7EFE3]/75",
    button:
      "border-white/30 bg-[#1B2340]/70 text-white backdrop-blur-sm hover:bg-[#1B2340]/90",
  },
} as const;

function PartPanel({
  id,
  part,
  number,
  slug,
  className,
  children,
}: {
  id?: string;
  part: Part;
  number: number;
  slug: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const theme = THEMES[part.theme];
  const night = part.theme === "night";
  // "Zonder kindjes – Hoge Housewarming" → label + subtitle.
  const [label, subtitle] = part.name.split(" – ");
  const venue = subtitle ?? part.location?.split(",")[0];
  const items = (part.description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      id={id}
      aria-label={`Deel ${number}: ${part.name}`}
      className={cn(
        "relative flex flex-col overflow-hidden px-6 pt-14 pb-8 md:px-12 md:pt-16 md:pb-10",
        theme.panel,
        className,
      )}
    >
      {night ? (
        <>
          <StarField className="pointer-events-none absolute inset-0 h-full w-full" />
          <StringLights className="pointer-events-none absolute inset-x-0 top-6 h-12 w-full md:top-0" />
          <MoonAndStars className="pointer-events-none absolute top-14 right-2 w-28 md:top-8 md:w-36" />
          <HousewarmingScene className="pointer-events-none absolute inset-x-0 bottom-0 hidden w-full opacity-90 md:block" />
          {/* Organic transition from the day side */}
          <WaveEdge
            direction="horizontal"
            className="pointer-events-none absolute inset-x-0 top-0 h-8 w-full md:hidden"
          />
          <WaveEdge
            direction="vertical"
            className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-14 md:block"
          />
        </>
      ) : (
        <>
          <Balloons className="pointer-events-none absolute top-3 left-1 w-14 opacity-90 md:w-20" />
          <SpaghettiBowl className="pointer-events-none absolute right-3 bottom-24 w-20 opacity-90 md:bottom-28 md:w-24" />
        </>
      )}

      <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col items-center gap-4 text-center">
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
                    <span className="w-full text-center font-script text-2xl">
                      {item}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Spacer: pushes the route buttons to the bottom of the panel. */}
        {night ? (
          <>
            {/* Mobile: the party scene fills the screen between text and buttons. */}
            <div className="flex w-full flex-1 items-end md:hidden">
              <HousewarmingScene className="pointer-events-none -mx-6 w-[calc(100%+3rem)] max-w-none" />
            </div>
            <div className="hidden min-h-6 flex-1 md:block" />
          </>
        ) : (
          <div className="min-h-6 flex-1" />
        )}

        {part.routeAddress && (
          <RouteButtons
            slug={slug}
            partId={part.id}
            className={theme.button}
            muted={theme.muted}
          />
        )}

        {children}
      </div>
    </section>
  );
}

function RouteButtons({
  slug,
  partId,
  className,
  muted,
}: {
  slug: string;
  partId: number;
  className: string;
  muted: string;
}) {
  const apps = [
    ["google", "Google Maps"],
    ["waze", "Waze"],
  ] as const;
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cn("text-xs tracking-widest uppercase", muted)}>
        Route
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {apps.map(([app, appLabel]) => (
          <a
            key={app}
            // Our own redirect: the address is never in this page.
            href={`/${slug}/route/${partId}?app=${app}`}
            target="_blank"
            rel="nofollow noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              className,
            )}
          >
            <Navigation className="size-3.5" aria-hidden />
            {appLabel}
          </a>
        ))}
      </div>
    </div>
  );
}

function FormSection({
  event,
  open,
}: {
  event: EventWithDetails;
  open: boolean;
}) {
  return (
    <section
      id="inschrijven"
      className="relative min-h-svh scroll-mt-0 overflow-hidden bg-[#FBF3E4] px-4 pt-12 pb-16 text-[#2B2140] md:min-h-0"
    >
      <Bunting className="absolute inset-x-0 top-0 h-12 w-full opacity-80" />
      <div className="relative mx-auto flex max-w-xl flex-col gap-6">
        <header className="flex flex-col items-center gap-2 pt-4 text-center">
          <h2 className="font-script text-5xl text-[#E4572E] drop-shadow-[2px_2px_0_#F6C445]">
            Ik kom feesten
          </h2>
          <p className="font-serif text-lg">
            Schrijf je in en bestel je spaghetti
          </p>
        </header>

        <Card className="text-foreground">
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
      </div>
    </section>
  );
}
