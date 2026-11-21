import { isAdmin } from "@/auth";
import { getEventOverview } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";

/** Escapes a CSV cell and neutralises spreadsheet formulas (=, +, -, @). */
function cell(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[";\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** All sign-ups as a CSV file (semicolon-separated, for Excel in Belgium). */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/admin/[slug]/export">,
) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if (!(await isAdmin())) {
    return new Response("Geen toegang", { status: 401, headers });
  }

  const { slug } = await params;
  const overview = await getEventOverview(slug);
  if (!overview) return new Response("Niet gevonden", { status: 404, headers });
  const { event, signups } = overview;

  const header = [
    "Naam",
    ...event.parts.map((p, i) => `Deel ${i + 1}: ${p.name} (personen)`),
    ...event.menu.map((m) => `${m.name} (porties)`),
    "Opmerking",
    "Ingeschreven",
    "Laatst gewijzigd",
  ];
  const rows = signups.map((s) => [
    s.guestName,
    ...event.parts.map((p) => s.people[p.id] ?? 0),
    ...event.menu.map((m) => s.portions[m.id] ?? 0),
    s.note ?? "",
    formatDateTime(s.createdAt),
    formatDateTime(s.updatedAt),
  ]);

  // BOM so Excel opens the file as UTF-8 (é, ë, …).
  const csv =
    "﻿" +
    [header, ...rows].map((row) => row.map(cell).join(";")).join("\r\n") +
    "\r\n";

  return new Response(csv, {
    headers: {
      ...headers,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}-inschrijvingen.csv"`,
    },
  });
}
