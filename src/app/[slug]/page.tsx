import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronDown,
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
  CocktailsCheers,
  HousewarmingScene,
  Confetti,
  DiscoBall,
  Firework,
  MoonAndStars,
  PartyLights,
  Spotlights,
  SpaghettiBowl,
  StarField,
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
              className="flex-1 md:col-start-1 md:row-start-2 md:pr-32"
            >
              {open && <CallToAction className="mt-4 md:hidden" />}
              {otherParts[0] && (
                <ScrollHint
                  href="#deel-2"
                  label={`Naar ${otherParts[0].name.split(" – ")[0]}`}
                  className="text-[#2B2140]/70"
                />
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
            className="min-h-svh md:col-start-2 md:row-start-2 md:min-h-0 md:pl-32"
          >
            {open && (
              <ScrollHint
                href="#inschrijven"
                label="Naar het inschrijfformulier"
                className="text-white/80"
              />
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

/** Mobile only: a bouncing arrow to the next screen. */
function ScrollHint({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn("mt-2 flex justify-center p-1 md:hidden", className)}
    >
      <ChevronsDown className="size-8 motion-safe:animate-bounce" aria-hidden />
    </a>
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
        "relative overflow-hidden bg-[#FBF3E4] px-4 pt-14 pb-2 text-center text-[#2B2140] md:pt-16 md:pb-10",
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
      "border-[#F2C14E] bg-[#F2C14E] text-[#1B2340] shadow-[0_0_18px_rgba(242,193,78,0.55)] hover:bg-[#F6D27A]",
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
        "relative flex flex-col overflow-hidden px-6 pt-10 pb-6 md:px-12 md:pt-16 md:pb-10",
        theme.panel,
        className,
      )}
    >
      {night ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,71,111,0.45),transparent_60%)]" />
          <StarField className="pointer-events-none absolute inset-0 h-full w-full" />
          <Spotlights className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />
          <Confetti className="pointer-events-none absolute inset-0 h-full w-full" />
          <PartyLights className="pointer-events-none absolute inset-x-0 top-6 h-12 w-full md:top-0" />
          <DiscoBall className="pointer-events-none absolute top-8 left-3 w-20 md:top-4 md:left-16 md:w-28" />
          <MoonAndStars className="pointer-events-none absolute top-14 right-2 w-28 md:top-8 md:w-36" />
          <Firework className="pointer-events-none absolute top-[30%] -left-4 w-24 opacity-90 md:left-10 md:w-32" />
          <Firework
            colors={["#4FB3A9", "#B98CF0"]}
            className="pointer-events-none absolute top-[40%] -right-3 w-20 opacity-90 md:right-6 md:w-28"
          />
          <Firework
            colors={["#F2994A", "#F2C14E"]}
            className="pointer-events-none absolute top-[18%] right-[30%] hidden w-16 opacity-70 md:block"
          />
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

      <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col items-center text-center">
        {night ? (
          <>
            {/* The info sits in the middle of the night sky. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 py-6 md:gap-4">
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
                <p className={cn("font-script text-2xl", theme.accent)}>
                  {venue}
                </p>
              )}

              <p className="flex items-center gap-2 font-serif text-2xl">
                <Clock className="size-5" aria-hidden />
                {formatTimeRange(part.startsAt, part.endsAt)}
              </p>

              {part.location && (
                <p
                  className={cn("flex items-start gap-2 text-sm", theme.muted)}
                >
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
                      <li
                        key={item}
                        className={cn(
                          "flex gap-3",
                          night &&
                            "text-lg [text-shadow:0_0_12px_rgba(232,106,146,0.9)]",
                        )}
                      >
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
              <CocktailsCheers className="mt-2 w-28 md:w-32" />
            </div>
            <HousewarmingScene
              idPrefix={`part-${part.id}`}
              className="pointer-events-none -mx-6 w-[calc(100%+3rem)] max-w-none md:-mx-12 md:w-[calc(100%+6rem)]"
            />
          </>
        ) : (
          <div className="flex w-full flex-1 flex-col items-center gap-3 md:gap-4">
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
              <p className={cn("font-script text-2xl", theme.accent)}>
                {venue}
              </p>
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
                    <li
                      key={item}
                      className={cn(
                        "flex gap-3",
                        night &&
                          "text-lg [text-shadow:0_0_12px_rgba(232,106,146,0.9)]",
                      )}
                    >
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
            <div className="min-h-6 flex-1" />
          </div>
        )}

        {part.routeAddress && (
          <RouteMenu slug={slug} partId={part.id} className={theme.button} />
        )}

        {children}
      </div>
    </section>
  );
}

/**
 * One Route button; the guest picks their maps app from a small menu.
 * Every option goes through our own redirect, so the address is never in
 * this page.
 */
function RouteMenu({
  slug,
  partId,
  className,
}: {
  slug: string;
  partId: number;
  className: string;
}) {
  const apps = [
    ["google", "Google Maps"],
    ["waze", "Waze"],
    ["apple", "Apple Kaarten"],
  ] as const;
  return (
    <details className="group relative">
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden",
          className,
        )}
      >
        <Navigation className="size-4" aria-hidden />
        Route
        <ChevronDown
          className="size-4 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul className="absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 overflow-hidden rounded-xl border bg-white text-left text-sm text-[#2B2140] shadow-xl">
        {apps.map(([app, appLabel]) => (
          <li key={app}>
            <a
              href={`/${slug}/route/${partId}?app=${app}`}
              target="_blank"
              rel="nofollow noreferrer"
              className="block px-4 py-3 hover:bg-[#FBF3E4]"
            >
              Openen in {appLabel}
            </a>
          </li>
        ))}
      </ul>
    </details>
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
