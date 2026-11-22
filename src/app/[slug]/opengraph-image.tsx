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
        background: "#FBF3E4",
        fontFamily: "DM Serif",
      }}
    >
      {/*
        One background drawing: a wavy day/night border like on the site,
        sun, balloons and confetti by day; disco ball, fireworks, moon and
        stars by night; bunting on top and party lights along the bottom.
      */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F6C445" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F6C445" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pinkglow" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#C9476F" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C9476F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Night side with a wavy edge */}
        <path
          d="M820 0 C780 90 860 170 800 260 C740 350 820 430 760 520 C730 565 740 600 720 630 L1200 630 L1200 0 Z"
          fill="#F4A6B7"
          opacity="0.45"
        />
        <path
          d="M836 0 C796 90 876 170 816 260 C756 350 836 430 776 520 C746 565 756 600 736 630 L1200 630 L1200 0 Z"
          fill="#1B2340"
        />
        <ellipse cx="980" cy="640" rx="320" ry="220" fill="url(#pinkglow)" />

        {/* Spotlights */}
        {[
          ["#E86A92", "860,630 900,630 1080,0 1010,0"],
          ["#F2C14E", "1180,630 1140,630 980,0 1050,0"],
          ["#B98CF0", "1010,630 1040,630 1200,120 1200,40"],
        ].map(([color, points], i) => (
          <polygon key={i} points={points} fill={color} opacity="0.12" />
        ))}

        {/* Stars */}
        {[
          [880, 110],
          [960, 70],
          [1150, 230],
          [1010, 250],
          [900, 330],
          [1170, 380],
          [1060, 420],
          [880, 470],
          [1140, 520],
          [960, 560],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 3.5 : 2.2}
            fill="#FBE3A0"
          />
        ))}

        {/* Moon */}
        <circle cx="1150" cy="190" r="34" fill="#F2C14E" />
        <circle cx="1167" cy="177" r="32" fill="#1B2340" />

        {/* Disco ball with rays */}
        <line
          x1="1050"
          y1="40"
          x2="1050"
          y2="70"
          stroke="#C9C3D6"
          strokeWidth="2"
        />
        {[-150, -110, -70, -30, 10, 50, 90, 130, 170, 210].map((angle, i) => (
          <line
            key={angle}
            x1="1050"
            y1="100"
            x2={1050 + Math.cos((angle * Math.PI) / 180) * 64}
            y2={100 + Math.sin((angle * Math.PI) / 180) * 64}
            stroke={["#E86A92", "#F2C14E", "#4FB3A9", "#B98CF0"][i % 4]}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}
        <circle cx="1050" cy="100" r="30" fill="#9EA3BF" />
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4].map((col) => {
            const x = 1026 + col * 10;
            const y = 76 + row * 10;
            const inside = (x + 4 - 1050) ** 2 + (y + 4 - 100) ** 2 < 26 * 26;
            return inside ? (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width="9"
                height="9"
                fill={
                  (row + col) % 3 === 0
                    ? "#F4F1FA"
                    : (row + col) % 3 === 1
                      ? "#C9C3D6"
                      : "#7E83A3"
                }
              />
            ) : null;
          }),
        )}

        {/* Fireworks */}
        {[
          [1110, 320, "#E86A92", "#F2C14E", 50],
          [1100, 470, "#4FB3A9", "#B98CF0", 40],
        ].map(([cx, cy, c1, c2, r], f) => (
          <g key={f}>
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i * 2 * Math.PI) / 14;
              const outer = (r as number) * (i % 2 ? 0.8 : 1);
              return (
                <g key={i}>
                  <line
                    x1={(cx as number) + Math.cos(a) * 10}
                    y1={(cy as number) + Math.sin(a) * 10}
                    x2={(cx as number) + Math.cos(a) * outer}
                    y2={(cy as number) + Math.sin(a) * outer}
                    stroke={(i % 2 ? c2 : c1) as string}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={(cx as number) + Math.cos(a) * (outer + 7)}
                    cy={(cy as number) + Math.sin(a) * (outer + 7)}
                    r="2.5"
                    fill={(i % 2 ? c2 : c1) as string}
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* Day side: sun with glow */}
        <circle cx="110" cy="170" r="90" fill="url(#glow)" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={110 + Math.cos(a) * 46}
              y1={170 + Math.sin(a) * 46}
              x2={110 + Math.cos(a) * 64}
              y2={170 + Math.sin(a) * 64}
              stroke="#F2994A"
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="110" cy="170" r="38" fill="#F6C445" />

        {/* Balloons */}
        {[
          [70, 420, "#F4A6B7"],
          [125, 395, "#F2994A"],
          [100, 470, "#7CCBB8"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <path
              d={`M${x} ${(y as number) + 38} q -10 40 4 80 t -2 60`}
              fill="none"
              stroke="#3B2F2F"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            <ellipse
              cx={x as number}
              cy={y as number}
              rx="30"
              ry="37"
              fill={c as string}
            />
            <ellipse
              cx={(x as number) - 10}
              cy={(y as number) - 13}
              rx="7"
              ry="11"
              fill="#FFFFFF"
              opacity="0.45"
            />
          </g>
        ))}

        {/* Confetti, day and night */}
        {[
          [40, 95, "#E4572E", 20],
          [190, 110, "#4FB3A9", -30],
          [160, 300, "#F6C445", 45],
          [30, 300, "#F4A6B7", 10],
          [190, 560, "#E86A92", -20],
          [60, 590, "#F2994A", 35],
          [200, 230, "#B98CF0", -40],
          [870, 600, "#F2C14E", 25],
          [1180, 290, "#4FB3A9", -15],
          [1040, 600, "#E86A92", 40],
          [960, 400, "#F2994A", -25],
          [1180, 470, "#B98CF0", 15],
        ].map(([x, y, c, r], i) =>
          i % 3 === 0 ? (
            <circle
              key={i}
              cx={x as number}
              cy={y as number}
              r="5"
              fill={c as string}
            />
          ) : (
            <rect
              key={i}
              x={(x as number) - 9}
              y={(y as number) - 4}
              width="18"
              height="8"
              rx="2"
              fill={c as string}
              transform={`rotate(${r} ${x} ${y})`}
            />
          ),
        )}

        {/* Bunting along the top */}
        {Array.from({ length: 27 }, (_, i) => {
          const x = i * 44;
          return (
            <g key={`flag-${i}`}>
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

        {/* Party lights along the bottom */}
        <path
          d="M0 586 Q300 616 600 590 T1200 588"
          fill="none"
          stroke="#3B2F2F"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        {Array.from({ length: 19 }, (_, i) => {
          const x = 30 + i * 64;
          const y = 600 + Math.sin(i * 0.9) * 6;
          const c = ["#E86A92", "#F2C14E", "#4FB3A9", "#F2994A", "#B98CF0"][
            i % 5
          ];
          return (
            <g key={`bulb-${i}`}>
              <circle cx={x} cy={y} r="18" fill={c} opacity="0.25" />
              <ellipse cx={x} cy={y} rx="7" ry="9" fill={c} />
            </g>
          );
        })}
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
