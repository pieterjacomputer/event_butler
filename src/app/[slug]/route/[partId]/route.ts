import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { eventParts, events } from "@/db/schema";

/**
 * Route button: redirects to Google Maps or Waze with the part's address.
 * The address is only looked up here, so it never appears in the event page
 * or its source code.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/[slug]/route/[partId]">,
) {
  const { slug, partId } = await params;
  const app = new URL(request.url).searchParams.get("app");
  const id = Number(partId);

  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
  };

  if (!Number.isInteger(id) || id <= 0) {
    return new Response("Niet gevonden", { status: 404, headers });
  }

  const [part] = await getDb()
    .select({ routeAddress: eventParts.routeAddress })
    .from(eventParts)
    .innerJoin(events, eq(eventParts.eventId, events.id))
    .where(and(eq(eventParts.id, id), eq(events.slug, slug)))
    .limit(1);

  if (!part?.routeAddress) {
    return new Response("Niet gevonden", { status: 404, headers });
  }

  const destination = encodeURIComponent(part.routeAddress);
  const target =
    app === "waze"
      ? `https://waze.com/ul?q=${destination}&navigate=yes`
      : app === "apple"
        ? `https://maps.apple.com/?daddr=${destination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return new Response(null, {
    status: 302,
    headers: { ...headers, Location: target },
  });
}
