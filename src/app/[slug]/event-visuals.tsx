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
