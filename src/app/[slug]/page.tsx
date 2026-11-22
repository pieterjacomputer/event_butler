import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronsDown, Clock, MapPin, PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createOrder } from "./actions";
import {
  Balloons,
  Bunting,
  Cloud,
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
  Sun,
  TerraceScene,
  WaveEdge,
} from "./event-visuals";
import { OrderForm } from "./order-form";
import { RouteMenu } from "./route-menu";
import { createFormToken } from "@/lib/anti-spam";
import { VisitBeacon } from "./visit-beacon";
import { StickyCallToAction } from "./sticky-cta";
import {
  getEventBySlug,
  isOrderingOpen,
  partsForForm,
  retentionDate,
  type EventWithDetails,
} from "@/lib/events";
import {
  formatDate,
  formatDayMonth,
  formatShortDate,
  formatTime,
  formatTimeRange,
} from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Niet gevonden" };

  // Shown in share previews (WhatsApp, Messenger, …). Never an address.
  const date = formatDate(event.startsAt);
  const parts = event.parts
    .map(
      (p) =>
        `${p.name.split(" – ")[0]} ${formatTimeRange(p.startsAt, p.endsAt)}`,
    )
    .join(" · ");
  const deadline = event.orderDeadline
    ? ` RSVP en spaghetti bestellen graag voor ${formatDayMonth(event.orderDeadline)}.`
    : "";
  const description = `${date.charAt(0).toUpperCase()}${date.slice(1)} · ${parts}.${deadline}`;

  return {
    title: event.title,
    description,
    openGraph: {
      title: `🎉 ${event.title}`,
      description,
      type: "website",
      locale: "nl_BE",
      siteName: "Event Butler",
    },
    twitter: { card: "summary_large_image", title: event.title, description },
  };
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
      <div className="relative md:grid md:h-svh md:min-h-[640px] md:grid-cols-2 md:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex min-h-svh flex-col md:contents">
          <EventHeader event={event} className="md:col-span-2" />
          {dayPart && (
            <PartPanel
              part={dayPart}
              number={1}
              slug={event.slug}
              className="flex-1 md:col-start-1 md:row-start-2 md:bg-[#F7E7CF] md:pr-32"
            >
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
          <div className="pointer-events-none z-10 hidden md:col-span-2 md:col-start-1 md:row-start-2 md:flex md:items-end md:justify-center md:pb-[calc(2.5vh-6px)]">
            <CallToAction className="pointer-events-auto" />
          </div>
        )}
      </div>

      <FormSection event={event} open={open} />
      <VisitBeacon slug={event.slug} />
      {open && <StickyCallToAction targetId="inschrijven" />}
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
      data-track="cta"
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
        "relative overflow-hidden bg-[#FBF3E4] px-4 pt-11 pb-1 text-center text-[#2B2140] md:pt-[6vh] md:pb-[3vh]",
        className,
      )}
    >
      <Bunting className="absolute inset-x-0 top-0 h-14 w-full" />
      {/* A sunny sky with balloons and confetti around the title */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Confetti
          colors={["#F4A6B7", "#F6C445", "#7CCBB8", "#F2994A", "#E4572E"]}
          className="absolute inset-0 h-full w-full opacity-70 md:opacity-35 md:[mask-image:radial-gradient(ellipse_55%_50%_at_50%_42%,transparent_45%,black_100%)]"
        />
        <Sun className="absolute top-12 right-2 w-12 md:top-14 md:right-auto md:left-[6%] md:w-28 lg:w-32" />
        <Cloud className="absolute top-24 left-1 w-14 opacity-90 md:top-20 md:left-[18%] md:w-32" />
        <Cloud className="absolute top-12 right-[22%] hidden w-24 opacity-80 md:block" />
        <Balloons className="absolute top-12 right-[5%] hidden w-24 md:block lg:w-28" />
        <Balloons className="absolute top-24 left-[30%] hidden w-14 -scale-x-100 opacity-80 md:block" />
      </div>
      <h1 className="font-script leading-none">
        {match ? (
          <>
            <span className="text-6xl text-[#E4572E] drop-shadow-[3px_3px_0_#F6C445] sm:text-8xl md:text-[clamp(3.5rem,9vh,8rem)]">
              {match[1]}
            </span>{" "}
            <span className="text-4xl text-[#C8432B] sm:text-6xl md:text-[clamp(2.25rem,5.8vh,4.5rem)]">
              {match[2]}
            </span>
          </>
        ) : (
          <span className="text-4xl text-[#C8432B] sm:text-6xl md:text-[clamp(2.25rem,5.8vh,4.5rem)]">
            {event.title}
          </span>
        )}
      </h1>
      <p className="mt-3 inline-block -rotate-1 bg-[#F6C445] px-5 py-1 font-serif text-xl tracking-wide text-[#2B2140] shadow-sm md:mt-4 md:px-7 md:py-1.5 md:text-[clamp(1.25rem,3vh,1.875rem)]">
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
      "border-2 border-[#F2C14E] bg-[#1B2340] text-white shadow-[0_0_16px_rgba(242,193,78,0.45)] hover:bg-[#232C52] hover:shadow-[0_0_22px_rgba(242,193,78,0.65)]",
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
  // Night side: if the programme already starts with the start time, show
  // that time only once (in the glowing programme line, with a clock).
  const startInProgramme =
    night && items[0]?.startsWith(formatTime(part.startsAt)) === true;

  return (
    <section
      id={id}
      aria-label={`Deel ${number}: ${part.name}`}
      className={cn(
        "relative flex flex-col overflow-hidden px-6 pt-6 pb-24 md:min-h-0 md:px-12 md:pt-[5vh] md:pb-[2.5vh]",
        theme.panel,
        className,
      )}
    >
      {night ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,71,111,0.45),transparent_60%)]" />
          <StarField className="pointer-events-none absolute inset-0 h-full w-full" />
          <Spotlights className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />
          <Confetti className="pointer-events-none absolute inset-0 h-full w-full opacity-55 md:opacity-30 md:[mask-image:radial-gradient(ellipse_55%_50%_at_50%_42%,transparent_45%,black_100%)]" />
          <PartyLights className="pointer-events-none absolute inset-x-0 top-6 h-12 w-full md:top-8" />
          <DiscoBall className="pointer-events-none absolute top-8 left-3 w-20 md:top-10 md:left-16 md:w-28" />
          <MoonAndStars className="pointer-events-none absolute top-14 right-2 w-28 md:top-14 md:w-36" />
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
            direction="vertical"
            fill="#F7E7CF"
            className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-14 md:block"
          />
          <WaveEdge
            direction="horizontal"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-10 w-full md:block"
          />
          {/* Mobile: the night flows into the form screen with the same curve */}
          <WaveEdge
            direction="horizontal"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full rotate-180 md:hidden"
          />
        </>
      ) : (
        <>
          <Balloons className="pointer-events-none absolute top-3 left-1 w-14 opacity-90 md:hidden" />
          <SpaghettiBowl className="pointer-events-none absolute right-3 bottom-24 w-20 opacity-90 md:hidden" />
          {/* Mobile: screen 1 flows into the night screen with a wavy edge */}
          <WaveEdge
            direction="horizontal"
            fill="#1B2340"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-8 w-full rotate-180 md:hidden"
          />
          {/* Pastel confetti and a sun glow (plus a cloud on desktop), continuing the header */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,rgba(246,196,69,0.28),transparent_60%)]" />
            <Confetti
              colors={["#F4A6B7", "#F6C445", "#7CCBB8", "#F2994A", "#E4572E"]}
              className="absolute inset-0 h-full w-full opacity-70 md:opacity-35 md:[mask-image:radial-gradient(ellipse_55%_50%_at_50%_42%,transparent_45%,black_100%)]"
            />
            <Cloud className="absolute top-16 right-10 hidden w-24 opacity-80 md:block" />
            {/* Desktop: the header flows into this side with the same wavy edge as the night side */}
            <WaveEdge
              direction="horizontal"
              className="absolute inset-x-0 top-0 hidden h-10 w-full md:block"
            />
          </div>
        </>
      )}

      <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col items-center text-center md:max-w-2xl">
        {night ? (
          <>
            {/* The info sits in the middle of the night sky. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 py-6 md:flex-none md:gap-[1.2vh] md:py-[1vh]">
              <p
                className={cn(
                  "text-xs font-semibold tracking-widest uppercase md:text-sm",
                  theme.muted,
                )}
              >
                Deel {number}
              </p>
              <h2
                className={cn(
                  "-rotate-1 rounded-md px-5 py-1.5 font-serif text-3xl md:px-7 md:py-2 md:text-[clamp(1.75rem,4.3vh,3rem)]",
                  theme.pill,
                )}
              >
                {label}
              </h2>
              {venue && (
                <p
                  className={cn(
                    "font-script text-2xl md:text-[clamp(1.375rem,3.3vh,2.25rem)]",
                    theme.accent,
                  )}
                >
                  {venue}
                </p>
              )}

              {!startInProgramme && (
                <p className="flex items-center gap-2 font-serif text-2xl md:gap-3 md:text-[clamp(1.375rem,3.3vh,2.25rem)]">
                  <Clock
                    className="size-5 md:size-[clamp(1.25rem,3vh,2rem)]"
                    aria-hidden
                  />
                  {formatTimeRange(part.startsAt, part.endsAt)}
                </p>
              )}

              {part.location && (
                <p
                  className={cn(
                    "flex items-start gap-2 text-sm md:text-base",
                    theme.muted,
                  )}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {part.location}
                </p>
              )}

              {items.length > 0 && (
                <ul className="flex flex-col gap-1 text-left text-sm md:gap-[0.8vh] md:text-[clamp(0.875rem,1.9vh,1.125rem)]">
                  {items.map((item) => {
                    const [, time, text] =
                      /^(\d{1,2}u\d{2})\s+(.*)$/.exec(item) ?? [];
                    return (
                      <li
                        key={item}
                        className={cn(
                          "flex gap-3",
                          night &&
                            "text-lg [text-shadow:0_0_12px_rgba(232,106,146,0.9)] md:text-[clamp(1.125rem,2.6vh,1.5rem)]",
                        )}
                      >
                        {time ? (
                          <span className="flex items-center gap-2.5 font-serif text-2xl md:gap-3 md:text-[clamp(1.375rem,3.3vh,2.25rem)]">
                            <Clock
                              className={cn(
                                "size-6 md:size-[clamp(1.375rem,3.3vh,2.25rem)]",
                                theme.accent,
                              )}
                              aria-hidden
                            />
                            <span className={theme.accent}>{time}</span>
                            <span>{text}</span>
                          </span>
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
              <CocktailsCheers className="mt-2 w-28 md:w-[clamp(3.5rem,9vh,8rem)]" />
            </div>
            <div className="relative -mx-6 w-[calc(100%+3rem)] md:-mx-12 md:min-h-0 md:w-[calc(100%+6rem)] md:flex-1">
              <HousewarmingScene
                idPrefix={`part-${part.id}`}
                className="pointer-events-none w-full max-w-none md:absolute md:inset-0 md:h-full"
              />
            </div>
          </>
        ) : (
          <div className="flex w-full flex-1 flex-col items-center gap-2.5 md:gap-[1.4vh]">
            <p
              className={cn(
                "text-xs font-semibold tracking-widest uppercase md:text-sm",
                theme.muted,
              )}
            >
              Deel {number}
            </p>
            <h2
              className={cn(
                "-rotate-1 rounded-md px-5 py-1.5 font-serif text-3xl md:px-7 md:py-2 md:text-[clamp(1.75rem,4.3vh,3rem)]",
                theme.pill,
              )}
            >
              {label}
            </h2>
            {venue && (
              <p
                className={cn(
                  "font-script text-2xl md:text-[clamp(1.375rem,3.3vh,2.25rem)]",
                  theme.accent,
                )}
              >
                {venue}
              </p>
            )}

            <p className="flex items-center gap-2 font-serif text-2xl md:gap-3 md:text-[clamp(1.375rem,3.3vh,2.25rem)]">
              <Clock
                className="size-5 md:size-[clamp(1.25rem,3vh,2rem)]"
                aria-hidden
              />
              {formatTimeRange(part.startsAt, part.endsAt)}
            </p>

            {part.location && (
              <p
                className={cn(
                  "flex items-start gap-2 text-sm md:text-base",
                  theme.muted,
                )}
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {part.location}
              </p>
            )}

            {items.length > 0 && (
              <ul className="flex flex-col gap-1 text-left text-sm md:gap-[0.8vh] md:text-[clamp(0.875rem,1.9vh,1.125rem)]">
                {items.map((item) => {
                  const [, time, text] =
                    /^(\d{1,2}u\d{2})\s+(.*)$/.exec(item) ?? [];
                  return (
                    <li
                      key={item}
                      className={cn(
                        "flex gap-3",
                        night &&
                          "text-lg [text-shadow:0_0_12px_rgba(232,106,146,0.9)] md:text-[clamp(1.125rem,2.6vh,1.5rem)]",
                      )}
                    >
                      {time ? (
                        <>
                          <span
                            className={cn(
                              "w-12 shrink-0 font-semibold md:w-16",
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
            {/*
              The afternoon terrace fills the space above Route. On phones it
              only takes the room left on the first screen (it may shrink to
              nothing on small phones), so screen 1 keeps fitting.
            */}
            <div className="relative -mx-6 min-h-0 w-[calc(100%+3rem)] flex-1 md:-mx-12 md:w-[calc(100%+6rem)]">
              <TerraceScene className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
            </div>
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
          <p className="font-serif text-lg">RSVP en bestel je spaghetti</p>
        </header>

        <Card className="text-foreground">
          <CardContent className="flex flex-col gap-6 text-sm">
            {open && event.orderDeadline ? (
              <>
                <p>
                  RSVP&apos;en en spaghetti bestellen graag voor{" "}
                  <strong>{formatDayMonth(event.orderDeadline)}</strong>. Na het
                  inschrijven krijg je een persoonlijke link waarmee je tot dan
                  kan wijzigen of annuleren.
                </p>
                <OrderForm
                  action={createOrder.bind(null, event.slug)}
                  parts={partsForForm(event)}
                  menu={event.menu.map((m) => ({ id: m.id, name: m.name }))}
                  submitLabel="Ik kom Feesten"
                  celebrate
                  formToken={createFormToken()}
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
