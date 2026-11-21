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

      {/* House */}
      <path d="M40 120 L110 62 L180 120 Z" fill="#2B3463" />
      <rect x="146" y="70" width="14" height="30" fill="#2B3463" />
      <rect x="52" y="118" width="116" height="92" fill="#F4EEE4" />
      <rect
        x="52"
        y="118"
        width="116"
        height="92"
        fill="#1B2340"
        opacity="0.15"
      />
      {/* Windows with guests */}
      <rect
        x="62"
        y="132"
        width="38"
        height="34"
        rx="2"
        fill={`url(#${windowId})`}
      />
      <rect
        x="120"
        y="132"
        width="38"
        height="34"
        rx="2"
        fill={`url(#${windowId})`}
      />
      <circle cx="74" cy="148" r="5" fill="#3A2A3E" opacity="0.8" />
      <path d="M67 166 q7 -14 14 0 Z" fill="#3A2A3E" opacity="0.8" />
      <circle cx="88" cy="150" r="4.5" fill="#3A2A3E" opacity="0.8" />
      <path d="M82 166 q6 -12 12 0 Z" fill="#3A2A3E" opacity="0.8" />
      <circle cx="140" cy="148" r="5" fill="#3A2A3E" opacity="0.8" />
      <path d="M133 166 q7 -14 14 0 Z" fill="#3A2A3E" opacity="0.8" />
      {/* Big glass doors to the garden */}
      <rect x="86" y="174" width="48" height="36" fill={`url(#${windowId})`} />
      <line
        x1="110"
        y1="174"
        x2="110"
        y2="210"
        stroke="#8A6A4A"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="188" r="4" fill="#3A2A3E" opacity="0.75" />
      <path d="M94 210 v-10 q6 -10 12 0 v10 Z" fill="#3A2A3E" opacity="0.75" />

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
