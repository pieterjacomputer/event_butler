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
  const neonId = `${idPrefix}-neon`;
  const glowId = `${idPrefix}-hw-glow`;
  const bulbs = [226, 248, 270, 292, 314, 336];
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

      {/*
        House, inspired by a Flemish semi-detached home: sand-coloured brick,
        dark tiled roof, a front gable with two small windows, a brick
        chimney and a garage with a dark door. Lit up for the party.
      */}
      {/* Neighbour on the left (cut off), long roof with skylights */}
      <polygon
        points="-10,104 74,104 64,140 -10,140"
        fill="#2B2723"
        stroke="#0E1226"
        strokeWidth="1.2"
      />
      <rect
        x="4"
        y="116"
        width="14"
        height="9"
        fill="#F6D27A"
        opacity="0.7"
        transform="skewX(-12)"
      />
      <rect
        x="32"
        y="114"
        width="14"
        height="9"
        fill="#F6D27A"
        opacity="0.7"
        transform="skewX(-12)"
      />
      <rect x="-10" y="140" width="62" height="64" fill="#B9A682" />
      <rect
        x="0"
        y="158"
        width="38"
        height="24"
        fill="#F2B25C"
        opacity="0.55"
        stroke="#4A4F57"
        strokeWidth="2"
      />

      {/* Main roof with tiles, running over the garage */}
      <polygon
        points="108,64 204,64 212,140 96,140"
        fill="#2B2723"
        stroke="#0E1226"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {[76, 88, 100, 112, 124].map((y) => (
        <line
          key={y}
          x1={108 - (y - 64) * 0.16}
          y1={y}
          x2={204 + (y - 64) * 0.1}
          y2={y}
          stroke="#3D3731"
          strokeWidth="1.2"
        />
      ))}
      {[120, 136, 152, 168, 184, 198].map((x) => (
        <line
          key={x}
          x1={x}
          y1="66"
          x2={x + 2}
          y2="138"
          stroke="#3D3731"
          strokeWidth="0.6"
          strokeDasharray="3 3"
        />
      ))}
      <rect
        x="194"
        y="56"
        width="12"
        height="10"
        fill="#B9A682"
        stroke="#0E1226"
        strokeWidth="1.2"
      />

      {/* Brick walls */}
      <rect
        x="52"
        y="138"
        width="156"
        height="66"
        fill="#D8C6A0"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {/* Front gable */}
      <polygon points="58,140 98,62 138,140" fill="#D8C6A0" />
      {[146, 154, 162, 170, 178, 186, 194].map((y) => (
        <line
          key={y}
          x1="53"
          y1={y}
          x2="207"
          y2={y}
          stroke="#C4B08A"
          strokeWidth="0.8"
        />
      ))}
      {[84, 96, 108, 120, 132].map((y) => {
        const half = ((y - 62) / 78) * 40;
        return (
          <line
            key={y}
            x1={98 - half}
            y1={y}
            x2={98 + half}
            y2={y}
            stroke="#C4B08A"
            strokeWidth="0.8"
          />
        );
      })}
      {/* Gable roof edges */}
      <path
        d="M52 146 L98 56 L144 146"
        fill="none"
        stroke="#2B2723"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M52 146 L98 56 L144 146"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1"
      />
      {/* Brick chimney on the gable */}
      <rect
        x="64"
        y="52"
        width="16"
        height="52"
        fill="#CDBB9A"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      <rect
        x="62"
        y="48"
        width="20"
        height="6"
        fill="#B9A682"
        stroke="#0E1226"
        strokeWidth="1.2"
      />
      <circle cx="74" cy="38" r="6" fill="#C9C3D6" opacity="0.22" />
      <circle cx="82" cy="26" r="8" fill="#C9C3D6" opacity="0.15" />
      {/* Two small gable windows, lit */}
      {[84, 102].map((x) => (
        <rect
          key={x}
          x={x}
          y="92"
          width="12"
          height="17"
          fill={`url(#${windowId})`}
          stroke="#4A4F57"
          strokeWidth="2.5"
        />
      ))}
      {/* Party garland under the gable */}
      <path
        d="M62 138 Q98 150 134 138"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1"
      />
      {[68, 78, 88, 98, 108, 118, 128].map((x, i) => {
        const t = (x - 62) / 72;
        const y = 138 + 2 * (1 - t) * t * 12;
        return (
          <path
            key={x}
            d={`M${x - 3.5} ${y} L${x + 3.5} ${y} L${x} ${y + 6} Z`}
            fill={["#E86A92", "#F2C14E", "#4FB3A9"][i % 3]}
          />
        );
      })}

      {/* Living room window with blinds and guests */}
      <rect
        x="88"
        y="162"
        width="44"
        height="26"
        fill={`url(#${windowId})`}
        stroke="#4A4F57"
        strokeWidth="2.5"
      />
      {[96, 104, 112, 120, 128].map((x) => (
        <line
          key={x}
          x1={x}
          y1="163"
          x2={x}
          y2="187"
          stroke="#E0A04A"
          strokeWidth="0.8"
        />
      ))}
      <circle cx="100" cy="172" r="4" fill="#3A2A3E" opacity="0.85" />
      <path d="M95 188 q5 -11 10 0 Z" fill="#3A2A3E" opacity="0.85" />
      <circle cx="118" cy="173" r="3.6" fill="#3A2A3E" opacity="0.85" />
      <path d="M113 188 q5 -10 10 0 Z" fill="#3A2A3E" opacity="0.85" />
      {/* Garage with a dark door, light leaking out underneath */}
      <rect
        x="150"
        y="156"
        width="50"
        height="48"
        fill="#3B434E"
        stroke="#0E1226"
        strokeWidth="1.5"
      />
      {[164, 172, 180, 188, 196].map((y) => (
        <line
          key={y}
          x1="151"
          y1={y}
          x2="199"
          y2={y}
          stroke="#4A5360"
          strokeWidth="1"
        />
      ))}
      <rect
        x="151"
        y="201"
        width="48"
        height="2.5"
        fill="#F6D27A"
        opacity="0.8"
      />
      <line
        x1="205"
        y1="140"
        x2="205"
        y2="204"
        stroke="#4A4F57"
        strokeWidth="2"
      />

      {/* String lights from the house to the tree */}
      <path
        d="M210 140 Q281 176 352 128"
        fill="none"
        stroke="#0E1226"
        strokeWidth="1.2"
      />
      {bulbs.map((x) => {
        const t = (x - 210) / 142;
        const y = (1 - t) ** 2 * 140 + 2 * (1 - t) * t * 176 + t ** 2 * 128 + 4;
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

      {/* Paved driveway, hedges and ornamental grasses */}
      <polygon points="148,204 202,204 230,260 122,260" fill="#4E3A33" />
      {[214, 226, 240].map((y) => {
        const t = (y - 204) / 56;
        return (
          <line
            key={y}
            x1={148 - t * 26}
            y1={y}
            x2={202 + t * 28}
            y2={y}
            stroke="#3E2E28"
            strokeWidth="1"
          />
        );
      })}
      <rect x="-6" y="202" width="70" height="22" rx="10" fill="#1F3A2E" />
      <rect x="208" y="204" width="22" height="18" rx="8" fill="#1F3A2E" />
      {[96, 104, 112, 222].map((x) => (
        <path
          key={x}
          d={`M${x} 206 q-6 -16 -8 -24 M${x} 206 q0 -18 0 -26 M${x} 206 q6 -16 8 -24`}
          fill="none"
          stroke="#C9B79A"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}

      {/* Side entrance: a path along the right of the house and a glowing arrow */}
      <polygon points="204,198 236,190 240,200 206,206" fill="#6A5246" />
      {/* Neon "Ingang" party sign on the right, pointing left to the side path */}
      <defs>
        <filter id={neonId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="276" y="182" width="3" height="24" fill="#0E1226" />
      <rect
        x="246"
        y="158"
        width="64"
        height="26"
        rx="6"
        fill="#120D24"
        stroke="#0E1226"
        strokeWidth="1"
      />
      <ellipse
        cx="278"
        cy="171"
        rx="38"
        ry="20"
        fill="#FF5FA2"
        opacity="0.14"
      />
      <rect
        x="249"
        y="161"
        width="58"
        height="20"
        rx="4.5"
        fill="none"
        stroke="#FF5FA2"
        strokeWidth="1.4"
        filter={`url(#${neonId})`}
      />
      <path
        d="M264 171 H256 M259.5 167.5 L256 171 L259.5 174.5"
        fill="none"
        stroke="#5FF2E6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${neonId})`}
      />
      <text
        x="285"
        y="175.5"
        textAnchor="middle"
        fill="#FFE3F0"
        stroke="#FF5FA2"
        strokeWidth="0.4"
        fontSize="12"
        filter={`url(#${neonId})`}
        style={{ fontFamily: "var(--font-script), cursive" }}
      >
        Ingang
      </text>

      {/* Dancing guests on the driveway */}
      {[
        { x: 168, color: "#E86A92", arms: "M-9 -22 L0 -14 L9 -24" },
        { x: 186, color: "#4FB3A9", arms: "M-10 -24 L0 -14 L8 -18" },
        { x: 150, color: "#F2C14E", arms: "M-8 -16 L0 -14 L10 -25" },
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
      <rect x="284" y="206" width="62" height="6" rx="2" fill="#6B4A33" />
      <rect x="290" y="212" width="5" height="30" fill="#4E3626" />
      <rect x="333" y="212" width="5" height="30" fill="#4E3626" />
      {/* Cocktail glass (pink) */}
      <path d="M288 184 h16 l-8 10 Z" fill="#E86A92" opacity="0.9" />
      <rect x="295" y="194" width="2" height="9" fill="#F4EEE4" />
      <rect x="290" y="203" width="12" height="2" fill="#F4EEE4" />
      {/* Tumbler (orange) */}
      <rect
        x="308"
        y="188"
        width="12"
        height="17"
        rx="1.5"
        fill="#F2994A"
        opacity="0.9"
      />
      <circle cx="314" cy="190" r="3" fill="#F6C445" />
      {/* Candles */}
      {[326, 338].map((x) => (
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
export function Confetti({
  className,
  colors = PARTY_COLORS,
}: {
  className?: string;
  colors?: string[];
}) {
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
            fill={colors[i % colors.length]}
          />
        ) : (
          <rect
            key={i}
            x={x}
            y={y}
            width="1.6"
            height="0.7"
            rx="0.2"
            fill={colors[i % colors.length]}
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

/** A warm afternoon sun with soft rays. */
export function Sun({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="44" fill="#F6C445" opacity="0.18" />
      {rays.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={60 + Math.cos(rad) * 30}
            y1={60 + Math.sin(rad) * 30}
            x2={60 + Math.cos(rad) * 42}
            y2={60 + Math.sin(rad) * 42}
            stroke="#F2994A"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="60" cy="60" r="24" fill="#F6C445" />
      <circle cx="52" cy="52" r="8" fill="#FFF3C4" opacity="0.6" />
    </svg>
  );
}

/** A soft, puffy cloud. */
export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className} aria-hidden>
      <g fill="#FFFFFF">
        <ellipse cx="34" cy="34" rx="26" ry="14" />
        <ellipse cx="60" cy="24" rx="26" ry="20" />
        <ellipse cx="88" cy="32" rx="24" ry="15" />
        <rect x="18" y="32" width="86" height="16" rx="8" />
      </g>
    </svg>
  );
}

/**
 * An afternoon terrace at the hostel: trees, a parasol, a picnic table with
 * a spritz, a beer and daisies, kids playing with foam swords, and a visit
 * from the Sint.
 */
export function TerraceScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden>
      {/* Trees and hedge in the back */}
      <circle cx="40" cy="96" r="38" fill="#9CC48A" />
      <circle cx="78" cy="110" r="30" fill="#86B676" />
      <circle cx="348" cy="92" r="40" fill="#9CC48A" />
      <circle cx="312" cy="112" r="28" fill="#86B676" />
      <rect x="0" y="132" width="400" height="30" rx="14" fill="#7FAE6E" />
      {/* Grass */}
      <path d="M0 150 Q200 136 400 150 V220 H0 Z" fill="#B7D59A" />
      {/* Flowers in the grass */}
      {[
        [24, 170, "#F4A6B7"],
        [52, 186, "#F6C445"],
        [86, 176, "#FFFFFF"],
        [318, 178, "#F4A6B7"],
        [356, 190, "#FFFFFF"],
        [378, 170, "#F6C445"],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="4" fill={c as string} />
          <circle cx={x as number} cy={y as number} r="1.5" fill="#F2994A" />
        </g>
      ))}

      {/* Parasol */}
      <rect x="198" y="58" width="3" height="104" fill="#6B4A33" />
      <path d="M140 74 Q200 30 260 74 Z" fill="#E4572E" />
      {[160, 180, 200, 220, 240].map((x, i) =>
        i % 2 ? (
          <path
            key={x}
            d={`M${x} 74 Q${x + 10} ${48 + Math.abs(200 - x) * 0.2} ${x + 20} 74 Z`}
            fill="#FBF3E4"
          />
        ) : null,
      )}
      <path
        d="M140 74 Q200 30 260 74"
        fill="none"
        stroke="#B8402A"
        strokeWidth="1.5"
      />

      {/* Picnic table */}
      <rect x="150" y="128" width="100" height="8" rx="2" fill="#B9824F" />
      <rect x="140" y="146" width="120" height="6" rx="2" fill="#A0703F" />
      <path
        d="M162 136 L154 176 M238 136 L246 176"
        stroke="#8A5E35"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Spritz glass with orange slice and straw */}
      <path d="M166 104 h16 l-2 20 h-12 Z" fill="#F2994A" opacity="0.85" />
      <rect x="173" y="124" width="2" height="4" fill="#E8DCCB" />
      <circle
        cx="166"
        cy="106"
        r="5"
        fill="#F6C445"
        stroke="#E8A13A"
        strokeWidth="1"
      />
      <path
        d="M178 104 L184 92"
        stroke="#E4572E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Beer */}
      <rect
        x="192"
        y="106"
        width="14"
        height="22"
        rx="2"
        fill="#F2C14E"
        opacity="0.9"
      />
      <rect x="192" y="102" width="14" height="6" rx="3" fill="#FFFFFF" />
      {/* Vase with daisies */}
      <rect
        x="222"
        y="112"
        width="12"
        height="16"
        rx="3"
        fill="#BFE3DC"
        opacity="0.9"
      />
      {[
        [224, 98],
        [232, 94],
        [228, 104],
      ].map(([x, y], i) => (
        <g key={i}>
          <line
            x1="228"
            y1="112"
            x2={x}
            y2={y}
            stroke="#6A9A58"
            strokeWidth="1.2"
          />
          <circle cx={x} cy={y} r="4" fill="#FFFFFF" />
          <circle cx={x} cy={y} r="1.6" fill="#F6C445" />
        </g>
      ))}

      {/* Kids with foam swords */}
      <g transform="translate(96 172)">
        <circle cx="0" cy="-30" r="6" fill="#F1C7A4" />
        <path d="M-7 -4 L0 -24 L7 -4 Z" fill="#4FB3A9" />
        <path
          d="M-3 -4 L-5 8 M3 -4 L5 8"
          stroke="#2B2140"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M5 -18 L22 -34"
          stroke="#F6C445"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(130 174)">
        <circle cx="0" cy="-28" r="6" fill="#C98E6B" />
        <path d="M-7 -4 L0 -22 L7 -4 Z" fill="#E86A92" />
        <path
          d="M-3 -4 L-5 8 M3 -4 L5 8"
          stroke="#2B2140"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M-5 -16 L-20 -34"
          stroke="#4F8FE0"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* The Sint, waving */}
      <g transform="translate(300 176)">
        <path d="M-14 6 L-10 -30 L10 -30 L14 6 Z" fill="#C8432B" />
        <path d="M-10 -30 L10 -30" stroke="#F6C445" strokeWidth="2" />
        <circle cx="0" cy="-38" r="7" fill="#F1C7A4" />
        <path
          d="M-7 -36 Q0 -22 7 -36 Q4 -28 0 -26 Q-4 -28 -7 -36 Z"
          fill="#FFFFFF"
        />
        <path d="M-7 -44 L0 -60 L7 -44 Z" fill="#C8432B" />
        <path d="M0 -57 V-47 M-3 -52 H3" stroke="#F6C445" strokeWidth="1.5" />
        <path
          d="M14 -20 L22 -34"
          stroke="#C8432B"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M-12 -18 L-18 6" stroke="#F6C445" strokeWidth="2" />
        <path
          d="M-20 4 q2 -14 -2 -24 q6 2 6 6"
          fill="none"
          stroke="#F6C445"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
