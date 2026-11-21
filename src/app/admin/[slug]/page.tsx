import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Download } from "lucide-react";
import { isAdmin } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventOverview } from "@/lib/admin";
import { isOrderingOpen } from "@/lib/events";
import { formatDateTime } from "@/lib/format";
import { SignOutButton } from "../sign-out-button";
import { deleteAllSignups, deleteSignup } from "./actions";
import { DeleteAllForm, DeleteSignupButton } from "./delete-buttons";

export const metadata: Metadata = { title: "Admin – overzicht" };

export default function AdminEventPage({
  params,
  searchParams,
}: PageProps<"/admin/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-muted-foreground">Laden…</p>}>
        <Overview params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Overview({
  params,
  searchParams,
}: Pick<PageProps<"/admin/[slug]">, "params" | "searchParams">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const deletedCount =
    typeof query.verwijderd === "string" ? Number(query.verwijderd) : null;
  const overview = await getEventOverview(slug);
  if (!overview) notFound();
  const { event, signups, totals } = overview;
  const open = isOrderingOpen(event);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            ← Alle feesten
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {event.orderDeadline
              ? `${open ? "Inschrijven kan tot" : "Inschrijven gesloten sinds"} ${formatDateTime(event.orderDeadline)}`
              : "Geen deadline"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/admin/${event.slug}/export`}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <Download className="size-4" aria-hidden />
            Download CSV
          </a>
          <SignOutButton />
        </div>
      </header>

      {deletedCount !== null && Number.isFinite(deletedCount) && (
        <p role="status" className="rounded-lg bg-muted px-4 py-3 text-sm">
          {deletedCount === 1
            ? "1 inschrijving verwijderd."
            : `${deletedCount} inschrijvingen verwijderd.`}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Inschrijvingen" value={totals.signups} />
        {totals.parts.map((part, i) => (
          <Stat
            key={part.id}
            label={`Deel ${i + 1}: ${part.name.split(" – ")[0]}`}
            value={`${part.people} ${part.people === 1 ? "persoon" : "personen"}`}
            detail={`${part.signups} inschrijvingen`}
          />
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Spaghetti</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-3">
            {totals.menu.map((item) => (
              <li key={item.id} className="rounded-lg bg-muted px-4 py-3">
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {item.portions}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {item.portions === 1 ? "portie" : "porties"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Alle inschrijvingen
            {totals.notes > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {totals.notes} met opmerking
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {signups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nog geen inschrijvingen.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4 font-medium">Naam</th>
                  {event.parts.map((part, i) => (
                    <th key={part.id} className="py-2 pr-4 font-medium">
                      Deel {i + 1}
                    </th>
                  ))}
                  {event.menu.map((item) => (
                    <th key={item.id} className="py-2 pr-4 font-medium">
                      {item.name}
                    </th>
                  ))}
                  <th className="py-2 pr-4 font-medium">Opmerking</th>
                  <th className="py-2 pr-4 font-medium">Laatst gewijzigd</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">Verwijderen</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <tr key={s.id} className="border-b align-top last:border-0">
                    <td className="py-2 pr-4 font-medium">{s.guestName}</td>
                    {event.parts.map((part) => (
                      <td key={part.id} className="py-2 pr-4 tabular-nums">
                        {s.people[part.id] ?? "–"}
                      </td>
                    ))}
                    {event.menu.map((item) => (
                      <td key={item.id} className="py-2 pr-4 tabular-nums">
                        {s.portions[item.id] ?? 0}
                      </td>
                    ))}
                    <td className="max-w-xs py-2 pr-4">
                      {s.note && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                          {s.note}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(s.updatedAt)}
                    </td>
                    <td className="py-1">
                      <DeleteSignupButton
                        guestName={s.guestName}
                        action={deleteSignup.bind(null, event.slug, s.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            Alle gastgegevens verwijderen
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">
            Verwijdert alle {totals.signups} inschrijvingen van dit feest:
            namen, aantallen, porties en opmerkingen. Het feest zelf en de
            pagina blijven bestaan. Dit kan niet ongedaan worden; download
            eventueel eerst de CSV.
          </p>
          <DeleteAllForm
            title={event.title}
            count={totals.signups}
            action={deleteAllSignups.bind(null, event.slug)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}
