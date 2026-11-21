/**
 * Decorative illustrations for the event page, inspired by the invitation's
 * colours and mood. Purely visual: hidden from screen readers.
 */

const FLAG_COLORS = ["#E4572E", "#F6C445", "#4FB3A9", "#F4A6B7", "#F2994A"];

/** A garland of triangular flags. */
export function Bunting({ className }: { className?: string }) {
  const flags = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 440 70"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 8 Q220 46 440 8"
        fill="none"
        stroke="#3B2F2F"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {flags.map((i) => {
        const x = 20 + i * 40;
        // Follow the curve of the string.
        const t = x / 440;
        const y = 8 + 2 * (1 - t) * t * 38;
        return (
          <path
            key={i}
            d={`M${x - 13} ${y} L${x + 13} ${y} L${x} ${y + 26} Z`}
            fill={FLAG_COLORS[i % FLAG_COLORS.length]}
          />
        );
      })}
    </svg>
  );
}

/** Three party balloons. */
export function Balloons({ className }: { className?: string }) {
  const balloons = [
    { cx: 34, cy: 42, fill: "#F4A6B7" },
    { cx: 70, cy: 30, fill: "#F2994A" },
    { cx: 56, cy: 74, fill: "#7CCBB8" },
  ];
  return (
    <svg viewBox="0 0 110 170" className={className} aria-hidden>
      {balloons.map((b, i) => (
        <g key={i}>
          <path
            d={`M${b.cx} ${b.cy + 30} q -8 30 4 60 t -2 40`}
            fill="none"
            stroke="#3B2F2F"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <ellipse cx={b.cx} cy={b.cy} rx="24" ry="29" fill={b.fill} />
          <ellipse
            cx={b.cx - 8}
            cy={b.cy - 10}
            rx="6"
            ry="9"
            fill="#fff"
            opacity="0.45"
          />
          <path d={`M${b.cx - 4} ${b.cy + 29} l4 6 l4 -6 Z`} fill={b.fill} />
        </g>
      ))}
    </svg>
  );
}

/** A string of warm, glowing light bulbs. */
export function StringLights({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 440 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 6 Q110 34 220 10 T440 8"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {bulbs.map((i) => {
        const x = 24 + i * 49;
        const y = 22 + Math.sin(i * 1.3) * 6;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 6} r="11" fill="#F6D27A" opacity="0.18" />
            <circle cx={x} cy={y + 6} r="4.5" fill="#FBE3A0" />
            <rect x={x - 2} y={y - 1} width="4" height="4" fill="#0E1226" />
          </g>
        );
      })}
    </svg>
  );
}

/** A crescent moon with a few twinkling stars. */
export function MoonAndStars({ className }: { className?: string }) {
  const stars = [
    { x: 18, y: 30, r: 3 },
    { x: 60, y: 14, r: 2 },
    { x: 150, y: 62, r: 2.5 },
    { x: 96, y: 88, r: 1.8 },
    { x: 30, y: 96, r: 2.2 },
  ];
  return (
    <svg viewBox="0 0 180 120" className={className} aria-hidden>
      <defs>
        <mask id="crescent">
          <rect width="180" height="120" fill="#fff" />
          <circle cx="136" cy="32" r="26" fill="#000" />
        </mask>
      </defs>
      <circle cx="124" cy="42" r="28" fill="#F2C14E" mask="url(#crescent)" />
      {stars.map((s, i) => (
        <path
          key={i}
          d={`M${s.x} ${s.y - s.r * 2} L${s.x + s.r * 0.6} ${s.y - s.r * 0.6} L${s.x + s.r * 2} ${s.y} L${s.x + s.r * 0.6} ${s.y + s.r * 0.6} L${s.x} ${s.y + s.r * 2} L${s.x - s.r * 0.6} ${s.y + s.r * 0.6} L${s.x - s.r * 2} ${s.y} L${s.x - s.r * 0.6} ${s.y - s.r * 0.6} Z`}
          fill="#FBE3A0"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

/** A steaming bowl of spaghetti. */
export function SpaghettiBowl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <path
        d="M18 34 Q60 4 102 34"
        fill="#F3D27A"
        stroke="#E8B94E"
        strokeWidth="2"
      />
      <path
        d="M26 30 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0"
        fill="none"
        stroke="#E8B94E"
        strokeWidth="2"
      />
      <circle cx="48" cy="22" r="7" fill="#C8432B" />
      <circle cx="66" cy="18" r="6" fill="#C8432B" />
      <circle cx="78" cy="26" r="5" fill="#C8432B" />
      <path d="M58 12 q6 -8 12 -2 q-6 2 -12 2 Z" fill="#5E9E4B" />
      <path d="M10 34 H110 Q104 72 60 72 Q16 72 10 34 Z" fill="#FFFFFF" />
      <path d="M10 34 H110" stroke="#E7DCCB" strokeWidth="2" />
    </svg>
  );
}

/** Soft, wavy edge where the day side melts into the night side. */
export function WaveEdge({
  direction,
  className,
}: {
  direction: "vertical" | "horizontal";
  className?: string;
}) {
  // Filled with the day colour, drawn on top of the night panel.
  return direction === "vertical" ? (
    <svg
      viewBox="0 0 80 800"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 0 H34 C70 90 6 170 38 260 C70 350 10 430 40 520 C70 610 8 690 36 800 H0 Z"
        fill="#F4A6B7"
        opacity="0.35"
      />
      <path
        d="M0 0 H22 C58 90 -6 170 26 260 C58 350 -2 430 28 520 C58 610 -4 690 24 800 H0 Z"
        fill="#FBF3E4"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 800 70"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 0 V34 C90 70 170 6 260 38 C350 70 430 10 520 40 C610 70 690 8 800 36 V0 Z"
        fill="#F4A6B7"
        opacity="0.35"
      />
      <path
        d="M0 0 V22 C90 58 170 -6 260 26 C350 58 430 -2 520 28 C610 58 690 -4 800 24 V0 Z"
        fill="#FBF3E4"
      />
    </svg>
  );
}

/** Small stars scattered over the night sky. */
export function StarField({ className }: { className?: string }) {
  // Fixed positions so server and client render the same.
  const stars = [
    [6, 12, 1.2],
    [18, 30, 0.8],
    [27, 8, 1],
    [41, 22, 0.7],
    [52, 5, 1.1],
    [63, 18, 0.8],
    [74, 9, 1],
    [88, 26, 0.9],
    [94, 14, 0.7],
    [12, 44, 0.7],
    [35, 38, 0.9],
    [58, 34, 0.7],
    [81, 40, 1],
    [47, 50, 0.6],
    [22, 56, 0.8],
    [70, 52, 0.7],
    [92, 48, 0.8],
    [4, 62, 0.6],
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {stars.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r * 0.35}
          fill="#FBE3A0"
          opacity={0.5 + (i % 3) * 0.2}
        />
      ))}
    </svg>
  );
}

/**
 * A housewarming party at night: a house with glowing windows and guests,
 * string lights to a tree, and a garden table with cocktails and candles.
 */
export function HousewarmingScene({
  className,
  idPrefix,
}: {
  className?: string;
  /** Unique per instance on a page, so gradient ids don't clash. */
  idPrefix: string;
}) {
  const windowId = `${idPrefix}-hw-window`;
  const glowId = `${idPrefix}-hw-glow`;
  const bulbs = [148, 176, 204, 232, 260, 288, 316, 344];
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden>
      <defs>
        <radialGradient id={windowId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFE7A8" />
          <stop offset="100%" stopColor="#F2B25C" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6D27A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F6D27A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm glow around the house */}
      <ellipse cx="110" cy="170" rx="130" ry="80" fill={`url(#${glowId})`} />

      {/* Tree on the right */}
      <rect x="352" y="120" width="8" height="90" fill="#121733" />
      <circle cx="356" cy="104" r="34" fill="#16203F" />
      <circle cx="336" cy="122" r="22" fill="#16203F" />
      <circle cx="378" cy="124" r="20" fill="#16203F" />

      {/* House: warm cream walls, terracotta roof, dark outlines */}
      {/* Chimney with a little smoke */}
      <circle cx="156" cy="52" r="6" fill="#C9C3D6" opacity="0.25" />
      <circle cx="164" cy="40" r="8" fill="#C9C3D6" opacity="0.18" />
      <rect
        x="146"
        y="68"
        width="18"
        height="40"
        fill="#8A3A30"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      <rect
        x="143"
        y="64"
        width="24"
        height="6"
        fill="#6E2C25"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {/* Walls with siding */}
      <rect
        x="52"
        y="116"
        width="116"
        height="94"
        fill="#F6E7CF"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {[128, 140, 152, 164, 176, 188, 200].map((y) => (
        <line
          key={y}
          x1="53"
          y1={y}
          x2="167"
          y2={y}
          stroke="#E2CFAF"
          strokeWidth="1"
        />
      ))}
      {/* Roof with shingles and a warm rim light */}
      <path
        d="M34 122 L110 56 L186 122 Z"
        fill="#C0503F"
        stroke="#0E1226"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {[78, 92, 106].map((y) => {
        const half = ((y - 56) / 66) * 76;
        return (
          <line
            key={y}
            x1={110 - half}
            y1={y}
            x2={110 + half}
            y2={y}
            stroke="#A2412F"
            strokeWidth="1.2"
          />
        );
      })}
      <path
        d="M34 122 L110 56 L186 122"
        fill="none"
        stroke="#F2994A"
        strokeWidth="1.2"
        opacity="0.7"
      />
      {/* Round attic window */}
      <circle
        cx="110"
        cy="96"
        r="9"
        fill={`url(#${windowId})`}
        stroke="#6B4A33"
        strokeWidth="2"
      />
      <path d="M110 87 V105 M101 96 H119" stroke="#6B4A33" strokeWidth="1.5" />
      {/* Housewarming garland along the eaves */}
      <path
        d="M52 118 Q110 132 168 118"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1"
      />
      {[60, 72, 84, 96, 108, 120, 132, 144, 156].map((x, i) => {
        const t = (x - 52) / 116;
        const y = 118 + 2 * (1 - t) * t * 14;
        return (
          <path
            key={x}
            d={`M${x - 4} ${y} L${x + 4} ${y} L${x} ${y + 7} Z`}
            fill={["#E86A92", "#F2C14E", "#4FB3A9"][i % 3]}
          />
        );
      })}
      {/* Windows with guests */}
      {[62, 124].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="136"
            width="34"
            height="30"
            fill={`url(#${windowId})`}
            stroke="#6B4A33"
            strokeWidth="3"
          />
          <path
            d={`M${x + 17} 136 V166 M${x} 151 H${x + 34}`}
            stroke="#6B4A33"
            strokeWidth="1.5"
          />
        </g>
      ))}
      <circle cx="72" cy="150" r="4.5" fill="#3A2A3E" opacity="0.85" />
      <path d="M66 166 q6 -12 12 0 Z" fill="#3A2A3E" opacity="0.85" />
      <circle cx="86" cy="152" r="4" fill="#3A2A3E" opacity="0.85" />
      <path d="M81 166 q5 -10 10 0 Z" fill="#3A2A3E" opacity="0.85" />
      <circle cx="142" cy="150" r="4.5" fill="#3A2A3E" opacity="0.85" />
      <path d="M136 166 q6 -12 12 0 Z" fill="#3A2A3E" opacity="0.85" />
      {/* Front door with a lit transom, porch lamp and step */}
      <circle cx="128" cy="180" r="9" fill="#F6D27A" opacity="0.35" />
      <circle cx="128" cy="180" r="2.5" fill="#FBE3A0" />
      <rect
        x="98"
        y="172"
        width="24"
        height="38"
        rx="1"
        fill="#2F6F6A"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      <rect x="101" y="175" width="18" height="6" fill={`url(#${windowId})`} />
      <circle cx="117" cy="193" r="1.6" fill="#F2C14E" />
      <rect
        x="93"
        y="209"
        width="34"
        height="4"
        fill="#C9B79A"
        stroke="#0E1226"
        strokeWidth="1"
      />

      {/* String lights from the house to the tree */}
      <path
        d="M168 124 Q260 168 352 128"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1.2"
      />
      {bulbs.map((x) => {
        const t = (x - 168) / 184;
        const y = 124 + 2 * (1 - t) * t * 44 + (1 - t) * 0 + t * 4 + 4;
        return (
          <g key={x}>
            <circle cx={x} cy={y} r="7" fill="#F6D27A" opacity="0.22" />
            <circle cx={x} cy={y} r="2.6" fill="#FBE3A0" />
          </g>
        );
      })}

      {/* Ground and bushes with flowers */}
      <path d="M0 206 Q200 192 400 206 V260 H0 Z" fill="#141A36" />
      <ellipse cx="30" cy="210" rx="34" ry="18" fill="#1E2A4A" />
      <ellipse cx="200" cy="214" rx="26" ry="12" fill="#1E2A4A" />
      {[
        [18, 202, "#E86A92"],
        [34, 198, "#F4A6B7"],
        [46, 206, "#E86A92"],
        [192, 208, "#F4A6B7"],
        [206, 205, "#E86A92"],
      ].map(([x, y, c], i) => (
        <circle
          key={i}
          cx={x as number}
          cy={y as number}
          r="3"
          fill={c as string}
        />
      ))}

      {/* Dancing guests on the lawn */}
      {[
        { x: 214, color: "#E86A92", arms: "M-9 -22 L0 -14 L9 -24" },
        { x: 238, color: "#4FB3A9", arms: "M-10 -24 L0 -14 L8 -18" },
        { x: 196, color: "#F2C14E", arms: "M-8 -16 L0 -14 L10 -25" },
      ].map((d) => (
        <g key={d.x} transform={`translate(${d.x} 222)`}>
          <circle cx="0" cy="-27" r="4.5" fill="#0E1226" />
          <path d="M-6 -2 L0 -20 L6 -2 Z" fill={d.color} />
          <path
            d={d.arms}
            fill="none"
            stroke="#0E1226"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-3 -2 L-5 8 M3 -2 L6 8"
            stroke="#0E1226"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Music notes floating out of the house */}
      {[
        [182, 150, "#F2C14E"],
        [194, 132, "#E86A92"],
        [176, 116, "#4FB3A9"],
      ].map(([x, y, c], i) => (
        <g key={i} fill={c as string}>
          <ellipse cx={x as number} cy={y as number} rx="4" ry="3" />
          <rect
            x={(x as number) + 3}
            y={(y as number) - 14}
            width="1.6"
            height="14"
          />
          <path
            d={`M${(x as number) + 4.6} ${(y as number) - 14} q6 2 6 8 q-2 -4 -6 -4 Z`}
          />
        </g>
      ))}

      {/* Garden table with cocktails and candles */}
      <rect x="262" y="206" width="84" height="6" rx="2" fill="#6B4A33" />
      <rect x="270" y="212" width="5" height="30" fill="#4E3626" />
      <rect x="333" y="212" width="5" height="30" fill="#4E3626" />
      {/* Cocktail glass (pink) */}
      <path d="M274 184 h18 l-9 10 Z" fill="#E86A92" opacity="0.9" />
      <rect x="282" y="194" width="2" height="9" fill="#F4EEE4" />
      <rect x="277" y="203" width="12" height="2" fill="#F4EEE4" />
      {/* Tumbler (orange) */}
      <rect
        x="300"
        y="188"
        width="12"
        height="17"
        rx="1.5"
        fill="#F2994A"
        opacity="0.9"
      />
      <circle cx="306" cy="190" r="3" fill="#F6C445" />
      {/* Candles */}
      {[322, 336].map((x) => (
        <g key={x}>
          <circle cx={x} cy={192} r="9" fill="#F6D27A" opacity="0.25" />
          <rect x={x - 3} y="194" width="6" height="11" fill="#F4EEE4" />
          <path d={`M${x} 186 q3 4 0 8 q-3 -4 0 -8 Z`} fill="#FBE3A0" />
        </g>
      ))}
    </svg>
  );
}

/** Two cocktail glasses clinking, with sparkles. */
export function CocktailsCheers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 130" className={className} aria-hidden>
      {/* Sparkles */}
      {[
        [80, 14, 6],
        [58, 26, 3.5],
        [104, 24, 4],
        [122, 50, 2.5],
        [36, 48, 2.5],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x} ${y - r * 2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`}
          fill="#F2C14E"
        />
      ))}
      {/* Left glass: pink cocktail, tilted right */}
      <g transform="rotate(14 60 80)">
        <path d="M36 50 H84 L64 78 H56 Z" fill="#E86A92" opacity="0.9" />
        <path d="M36 50 H84" stroke="#F4EEE4" strokeWidth="2" />
        <rect x="58.5" y="78" width="3" height="30" fill="#F4EEE4" />
        <rect x="48" y="106" width="24" height="3" rx="1.5" fill="#F4EEE4" />
        <circle cx="76" cy="50" r="6" fill="#F6C445" />
        <path d="M76 50 l-6 -2" stroke="#F2994A" strokeWidth="2" />
      </g>
      {/* Right glass: orange spritz, tilted left */}
      <g transform="rotate(-14 104 80)">
        <path
          d="M86 52 Q86 92 104 96 Q122 92 122 52 Z"
          fill="#F2994A"
          opacity="0.9"
        />
        <path d="M86 52 H122" stroke="#F4EEE4" strokeWidth="2" />
        <rect x="102.5" y="96" width="3" height="14" fill="#F4EEE4" />
        <rect x="92" y="108" width="24" height="3" rx="1.5" fill="#F4EEE4" />
        <circle cx="96" cy="62" r="6" fill="#F6C445" opacity="0.9" />
        <path
          d="M112 30 L106 66"
          stroke="#E4572E"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const PARTY_COLORS = ["#E86A92", "#F2C14E", "#4FB3A9", "#F2994A", "#B98CF0"];

/** Colourful confetti scattered over the night sky. */
export function Confetti({ className }: { className?: string }) {
  // Fixed positions so server and client render the same.
  const pieces = [
    [8, 18, 20],
    [16, 52, -30],
    [24, 34, 45],
    [33, 70, 10],
    [42, 22, -15],
    [55, 46, 60],
    [63, 14, -40],
    [71, 64, 25],
    [79, 30, -20],
    [88, 56, 35],
    [93, 22, 5],
    [12, 80, -10],
    [47, 84, 30],
    [84, 82, -35],
    [60, 76, 15],
    [28, 92, 40],
    [70, 40, -5],
    [38, 58, -25],
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {pieces.map(([x, y, rotate], i) =>
        i % 3 === 0 ? (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.7"
            fill={PARTY_COLORS[i % PARTY_COLORS.length]}
          />
        ) : (
          <rect
            key={i}
            x={x}
            y={y}
            width="1.6"
            height="0.7"
            rx="0.2"
            fill={PARTY_COLORS[i % PARTY_COLORS.length]}
            transform={`rotate(${rotate} ${x} ${y})`}
            opacity="0.9"
          />
        ),
      )}
    </svg>
  );
}

/** String lights with colourful party bulbs. */
export function PartyLights({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 440 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 6 Q110 38 220 12 T440 10"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {bulbs.map((i) => {
        const x = 18 + i * 40;
        const y = 22 + Math.sin(i * 1.1) * 7;
        const color = PARTY_COLORS[i % PARTY_COLORS.length];
        return (
          <g key={i}>
            <circle cx={x} cy={y + 7} r="12" fill={color} opacity="0.22" />
            <ellipse cx={x} cy={y + 7} rx="4.5" ry="5.5" fill={color} />
            <rect x={x - 2} y={y - 1} width="4" height="4" fill="#0E1226" />
          </g>
        );
      })}
    </svg>
  );
}

/** A disco ball hanging on a string, with light rays. */
export function DiscoBall({ className }: { className?: string }) {
  const rays = [-60, -35, -10, 15, 40, 65, 120, 150, 200, 235];
  return (
    <svg viewBox="0 0 140 170" className={className} aria-hidden>
      <defs>
        <clipPath id="disco-clip">
          <circle cx="70" cy="90" r="34" />
        </clipPath>
      </defs>
      <line x1="70" y1="0" x2="70" y2="56" stroke="#C9C3D6" strokeWidth="1.5" />
      {rays.map((angle, i) => (
        <line
          key={angle}
          x1="70"
          y1="90"
          x2={70 + Math.cos((angle * Math.PI) / 180) * 70}
          y2={90 + Math.sin((angle * Math.PI) / 180) * 70}
          stroke={PARTY_COLORS[i % PARTY_COLORS.length]}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
        />
      ))}
      <circle cx="70" cy="90" r="34" fill="#9EA3BF" />
      <g clipPath="url(#disco-clip)">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={36 + col * 9}
              y={56 + row * 9}
              width="8"
              height="8"
              fill={
                (row + col) % 3 === 0
                  ? "#F4F1FA"
                  : (row + col) % 3 === 1
                    ? "#C9C3D6"
                    : "#7E83A3"
              }
            />
          )),
        )}
      </g>
      <circle cx="58" cy="78" r="7" fill="#fff" opacity="0.6" />
      {[
        [26, 48, 4],
        [116, 60, 5],
        [112, 128, 3.5],
        [30, 126, 3],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x} ${y - r * 2} L${x + r * 0.5} ${y - r * 0.5} L${x + r * 2} ${y} L${x + r * 0.5} ${y + r * 0.5} L${x} ${y + r * 2} L${x - r * 0.5} ${y + r * 0.5} L${x - r * 2} ${y} L${x - r * 0.5} ${y - r * 0.5} Z`}
          fill="#FBE3A0"
        />
      ))}
    </svg>
  );
}

/** A firework burst: coloured rays with sparkling tips. */
export function Firework({
  className,
  colors = ["#E86A92", "#F2C14E"],
}: {
  className?: string;
  colors?: [string, string];
}) {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="30" fill={colors[0]} opacity="0.12" />
      {rays.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const inner = 12 + (i % 2) * 4;
        const outer = i % 2 ? 44 : 54;
        const color = colors[i % 2];
        return (
          <g key={angle}>
            <line
              x1={60 + Math.cos(rad) * inner}
              y1={60 + Math.sin(rad) * inner}
              x2={60 + Math.cos(rad) * outer}
              y2={60 + Math.sin(rad) * outer}
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle
              cx={60 + Math.cos(rad) * (outer + 5)}
              cy={60 + Math.sin(rad) * (outer + 5)}
              r="1.8"
              fill={color}
            />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="3" fill="#FBE3A0" />
    </svg>
  );
}

/** Coloured stage spotlights sweeping up from the ground. */
export function Spotlights({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="beam-pink" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E86A92" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E86A92" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-gold" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F2C14E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F2C14E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-purple" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B98CF0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B98CF0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="8,100 2,100 40,0 62,0" fill="url(#beam-pink)" />
      <polygon points="98,100 92,100 38,0 60,0" fill="url(#beam-gold)" />
      <polygon points="52,100 48,100 6,0 26,0" fill="url(#beam-purple)" />
      <polygon points="52,100 48,100 76,0 96,0" fill="url(#beam-purple)" />
    </svg>
  );
}
