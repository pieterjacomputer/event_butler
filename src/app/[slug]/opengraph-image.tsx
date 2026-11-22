import { ImageResponse } from "next/og";
import { getEventBySlug } from "@/lib/events";
import { formatDate, formatDayMonth, formatTimeRange } from "@/lib/format";

/**
 * Share preview (WhatsApp, Messenger, …): a themed card with the title,
 * date and both parts. Never contains an address.
 */
export const alt = "Uitnodiging voor het feest";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Loads only the glyphs we need from Google Fonts (server-side). */
async function loadGoogleFont(family: string, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const FLAGS = ["#E4572E", "#F6C445", "#4FB3A9", "#F4A6B7", "#F2994A"];

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  const title = event?.title ?? "Event Butler";
  const match = /^(\d+)\s+(.*)$/.exec(title);
  const date = event ? formatDate(event.startsAt) : "";
  const parts = (event?.parts ?? []).map(
    (p) => `${p.name.split(" – ")[0]} ${formatTimeRange(p.startsAt, p.endsAt)}`,
  );
  const deadline = event?.orderDeadline
    ? `RSVP & spaghetti graag voor ${formatDayMonth(event.orderDeadline)}`
    : "";

  const scriptText = title;
  const serifText = `${date}${parts.join("")}${deadline}·`;
  const [script, serif] = await Promise.all([
    loadGoogleFont("Pacifico", scriptText),
    loadGoogleFont("DM+Serif+Display", serifText),
  ]);
  const fonts = [
    ...(script
      ? [{ name: "Pacifico", data: script, style: "normal" as const }]
      : []),
    ...(serif
      ? [{ name: "DM Serif", data: serif, style: "normal" as const }]
      : []),
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background:
          "linear-gradient(105deg, #FBF3E4 0%, #FBF3E4 55%, #1B2340 55%, #1B2340 100%)",
        fontFamily: "DM Serif",
      }}
    >
      {/* Bunting along the top */}
      <svg
        width="1200"
        height="70"
        viewBox="0 0 1200 70"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {Array.from({ length: 27 }, (_, i) => {
          const x = i * 44;
          return (
            <g key={i}>
              <path
                d={`M${x} 6 Q${x + 22} 20 ${x + 44} 6`}
                fill="none"
                stroke="#3B2F2F"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <path
                d={`M${x + 10} 13 L${x + 34} 13 L${x + 22} 42 Z`}
                fill={FLAGS[i % FLAGS.length]}
              />
            </g>
          );
        })}
      </svg>

      {/* Night side: moon, stars and coloured lights */}
      <svg
        width="540"
        height="630"
        viewBox="0 0 540 630"
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <circle cx="430" cy="150" r="46" fill="#F2C14E" />
        <circle cx="452" cy="134" r="44" fill="#1B2340" />
        {[
          [120, 120],
          [260, 90],
          [340, 210],
          [470, 300],
          [180, 480],
          [400, 520],
          [300, 380],
          [500, 450],
          [90, 300],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 4 : 2.5}
            fill="#FBE3A0"
          />
        ))}
        {["#E86A92", "#F2C14E", "#4FB3A9", "#F2994A", "#B98CF0", "#E86A92"].map(
          (c, i) => (
            <g key={i}>
              <circle
                cx={150 + i * 64}
                cy={590}
                r={22}
                fill={c}
                opacity={0.25}
              />
              <circle cx={150 + i * 64} cy={590} r={9} fill={c} />
            </g>
          ),
        )}
      </svg>

      {/* Card with the essentials */}
      <div
        style={{
          position: "absolute",
          left: 220,
          top: 100,
          width: 760,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 40px 40px",
          borderRadius: 32,
          background: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(27,35,64,0.25)",
          color: "#2B2140",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "Pacifico",
          }}
        >
          {match ? (
            <>
              <span style={{ fontSize: 140, color: "#E4572E", lineHeight: 1 }}>
                {match[1]}
              </span>
              <span
                style={{
                  fontSize: 84,
                  color: "#C8432B",
                  marginLeft: 20,
                  lineHeight: 1,
                }}
              >
                {match[2]}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 84, color: "#C8432B" }}>{title}</span>
          )}
        </div>
        {date && (
          <div
            style={{
              marginTop: 22,
              padding: "6px 26px",
              background: "#F6C445",
              fontSize: 38,
              transform: "rotate(-1deg)",
            }}
          >
            {date}
          </div>
        )}
        {parts.length > 0 && (
          <div
            style={{
              marginTop: 24,
              fontSize: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {parts.map((part) => (
              <div key={part} style={{ display: "flex" }}>
                {part}
              </div>
            ))}
          </div>
        )}
        {deadline && (
          <div
            style={{
              marginTop: 14,
              fontSize: 28,
              color: "#C8432B",
              display: "flex",
            }}
          >
            {deadline}
          </div>
        )}
      </div>
    </div>,
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
