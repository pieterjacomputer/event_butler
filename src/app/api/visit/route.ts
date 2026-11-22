import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAdmin } from "@/auth";
import { getDb } from "@/db";
import { events, pageVisits } from "@/db/schema";

const REFERRERS = [
  "direct",
  "whatsapp",
  "facebook",
  "messenger",
  "instagram",
  "email",
  "google",
  "andere",
] as const;

const bodySchema = z.object({
  slug: z.string().min(1).max(100),
  kind: z.enum(["view", "cta", "route"]),
  referrer: z.enum(REFERRERS),
});

// Link previews, crawlers and scripts: not real visitors.
const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|headless|lighthouse/i;

function deviceOf(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

/** Today's date in Brussels, so the anonymous id changes at local midnight. */
function brusselsDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
  }).format(new Date());
}

/**
 * Records one anonymous visit or click. No cookies; the IP address is only
 * used, together with a secret and today's date, to make a one-way hash and
 * is never stored.
 */
export async function POST(request: Request) {
  const noContent = new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });

  const secret = process.env.VISIT_HASH_SECRET;
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!secret || !userAgent || BOT.test(userAgent)) return noContent;

  let body: z.infer<typeof bodySchema>;
  try {
    const parsed = bodySchema.safeParse(JSON.parse(await request.text()));
    if (!parsed.success) return noContent;
    body = parsed.data;
  } catch {
    return noContent;
  }

  // The organiser's own visits do not count.
  if (await isAdmin()) return noContent;

  const db = getDb();
  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.slug, body.slug))
    .limit(1);
  if (!event) return noContent;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const visitorHash = createHash("sha256")
    .update(`${secret}|${brusselsDay()}|${ip}|${userAgent}|${body.slug}`)
    .digest("hex")
    .slice(0, 32);
  const country = request.headers.get("x-vercel-ip-country");

  await db.insert(pageVisits).values({
    eventId: event.id,
    kind: body.kind,
    visitorHash,
    referrer: body.referrer,
    device: deviceOf(userAgent),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
  });

  return noContent;
}
