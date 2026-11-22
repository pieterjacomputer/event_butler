import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisitStats } from "@/lib/stats";

const REFERRER_LABELS: Record<string, string> = {
  direct: "Direct / link",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  messenger: "Messenger",
  instagram: "Instagram",
  email: "E-mail",
  google: "Google",
  andere: "Andere website",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Smartphone",
  tablet: "Tablet",
  desktop: "Computer",
};

const COUNTRY_LABELS: Record<string, string> = {
  BE: "België",
  NL: "Nederland",
  FR: "Frankrijk",
  DE: "Duitsland",
  LU: "Luxemburg",
  GB: "Verenigd Koninkrijk",
  "?": "Onbekend",
};

function shortDay(isoDay: string): string {
  const [, month, day] = isoDay.split("-");
  return `${Number(day)}/${Number(month)}`;
}

/** Anonymous visitor statistics: totals, a daily chart and breakdowns. */
export function VisitStatsCard({
  stats,
  signups,
}: {
  stats: VisitStats;
  signups: number;
}) {
  const conversion =
    stats.visitors > 0 ? Math.round((signups / stats.visitors) * 100) : null;
  const maxPerDay = Math.max(1, ...stats.perDay.map((d) => d.visitors));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bezoekers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 text-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            label="Vandaag"
            value={stats.visitorsToday}
            detail="bezoekers"
          />
          <Tile
            label="Laatste 7 dagen"
            value={stats.visitors7d}
            detail="bezoekers"
          />
          <Tile
            label="Totaal"
            value={stats.visitors}
            detail={`bezoekers · ${stats.views} paginaweergaven`}
          />
          <Tile
            label="Conversie"
            value={conversion === null ? "–" : `${conversion}%`}
            detail={`${signups} inschrijvingen`}
          />
        </div>

        <div>
          <p className="mb-2 font-medium">
            Bezoekers per dag (laatste 30 dagen)
          </p>
          {stats.perDay.length === 0 ? (
            <p className="text-muted-foreground">Nog geen bezoeken.</p>
          ) : (
            <div className="flex h-40 items-end gap-1 overflow-x-auto pb-6">
              {stats.perDay.map((d) => (
                <div
                  key={d.day}
                  className="relative flex h-full min-w-6 flex-1 flex-col justify-end"
                  title={`${shortDay(d.day)}: ${d.visitors} bezoekers, ${d.views} weergaven`}
                >
                  <span className="mb-1 text-center text-xs tabular-nums text-muted-foreground">
                    {d.visitors}
                  </span>
                  <div
                    className="rounded-t bg-[#E86A92]"
                    style={{ height: `${(d.visitors / maxPerDay) * 100}%` }}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-muted-foreground">
                    {shortDay(d.day)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Breakdown
            title="Waar komen ze vandaan?"
            rows={stats.referrers}
            labels={REFERRER_LABELS}
          />
          <Breakdown
            title="Toestel"
            rows={stats.devices}
            labels={DEVICE_LABELS}
          />
          <Breakdown
            title="Land"
            rows={stats.countries}
            labels={COUNTRY_LABELS}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Tile label="Klikken op “Ik kom feesten”" value={stats.ctaClicks} />
          <Tile label="Klikken op een route-app" value={stats.routeClicks} />
        </div>

        <p className="text-xs text-muted-foreground">
          Anoniem gemeten, zonder cookies en zonder IP-adressen op te slaan. Een
          bezoeker wordt per dag één keer geteld. Je eigen bezoeken als admin
          tellen niet mee. Link-voorbeelden (bv. in WhatsApp) worden zoveel
          mogelijk genegeerd; vanuit de WhatsApp-app geopende links tonen vaak
          als “Direct / link”.
        </p>
      </CardContent>
    </Card>
  );
}

function Tile({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail?: string;
}) {
  return (
    <div className="rounded-lg bg-muted px-4 py-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

function Breakdown({
  title,
  rows,
  labels,
}: {
  title: string;
  rows: { label: string; visitors: number }[];
  labels: Record<string, string>;
}) {
  const total = rows.reduce((sum, r) => sum + r.visitors, 0);
  return (
    <div>
      <p className="mb-2 font-medium">{title}</p>
      {rows.length === 0 ? (
        <p className="text-muted-foreground">–</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => {
            const pct = total > 0 ? Math.round((r.visitors / total) * 100) : 0;
            return (
              <li key={r.label}>
                <div className="flex justify-between gap-2">
                  <span>{labels[r.label] ?? r.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {r.visitors} · {pct}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-muted">
                  <div
                    className="h-1.5 rounded bg-[#4FB3A9]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
