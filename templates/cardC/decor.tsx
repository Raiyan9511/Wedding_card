import type { CSSProperties, ReactNode } from "react";
import { eventIcon } from "@/lib/config";
import s from "./cardC.module.css";

type P = { className?: string };

/** Shared gradients, rendered once per page. (No SVG filters: feTurbulence/feDisplacementMap rasterise far too slowly on phones.) */
export function WatercolorDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <radialGradient id="c-blush" cx="50%" cy="85%" r="85%">
          <stop offset="0" stopColor="#e39c9e" />
          <stop offset=".55" stopColor="#f2cac5" stopOpacity=".92" />
          <stop offset="1" stopColor="#fbe9e4" stopOpacity=".6" />
        </radialGradient>
        <radialGradient id="c-peach" cx="50%" cy="85%" r="85%">
          <stop offset="0" stopColor="#eaa982" />
          <stop offset=".55" stopColor="#f7d3b9" stopOpacity=".92" />
          <stop offset="1" stopColor="#fdeee2" stopOpacity=".6" />
        </radialGradient>
        <radialGradient id="c-lilac" cx="50%" cy="85%" r="85%">
          <stop offset="0" stopColor="#b09bc9" />
          <stop offset=".55" stopColor="#d9cce7" stopOpacity=".92" />
          <stop offset="1" stopColor="#f2ecf7" stopOpacity=".6" />
        </radialGradient>
        <linearGradient id="c-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d9a77" stopOpacity=".9" />
          <stop offset="1" stopColor="#bfd1b8" stopOpacity=".75" />
        </linearGradient>
        <linearGradient id="c-swan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf9" />
          <stop offset="1" stopColor="#f1e3d8" />
        </linearGradient>
        {[
          ["#cdb8e0", "#f3cdd0"],
          ["#f7c9a8", "#f2b8bf"],
          ["#c9dcc2", "#d8c8e6"],
        ].map(([a, b], i) => (
          <linearGradient key={i} id={`c-wing${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

type Tone = "blush" | "peach" | "lilac";
const EDGE: Record<Tone, string> = { blush: "#c77f84", peach: "#c98a5f", lilac: "#8e78a8" };
const PETAL = "M0 0C-15-5-21-27 0-37C21-27 15-5 0 0Z";

/** Soft layered bloom (ranunculus-like), radius ≈ 37·s. */
function Flower({ x, y, s: k = 1, rot = 0, tone = "blush" }: { x: number; y: number; s?: number; rot?: number; tone?: Tone }) {
  const ring = (n: number, scale: number, off: number, op: number) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={`${scale}-${i}`}
        d={PETAL}
        fill={`url(#c-${tone})`}
        stroke={EDGE[tone]}
        strokeOpacity=".28"
        strokeWidth={0.8 / scale}
        opacity={op}
        transform={`rotate(${off + (360 / n) * i}) scale(${scale})`}
      />
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      {ring(7, 1, 0, 0.8)}
      {ring(6, 0.72, 26, 0.9)}
      {ring(5, 0.44, 10, 1)}
      <circle r="5.5" fill="#f0c98e" opacity=".9" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} r="1.2" cx={Math.cos((a * Math.PI) / 180) * 3} cy={Math.sin((a * Math.PI) / 180) * 3} fill="#b98a4e" />
      ))}
    </g>
  );
}

/** Eucalyptus sprig: stem grows along -y (rot 90 = pointing right). */
function Sprig({ x, y, rot, s: k = 1 }: { x: number; y: number; rot: number; s?: number }) {
  const leaves: [number, number, number][] = [
    [-2, -20, 11],
    [3, -42, 10],
    [-1, -64, 8.5],
    [2, -85, 7],
    [0, -104, 5.5],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <path d="M0 0C4-40-4-80 2-118" stroke="#7d9a77" strokeWidth="1.6" fill="none" opacity=".8" />
      {leaves.map(([lx, ly, r], i) => (
        <g key={i} fill="url(#c-leaf)">
          <ellipse cx={lx - r * 0.95} cy={ly} rx={r} ry={r * 0.8} />
          <ellipse cx={lx + r * 0.95} cy={ly - 7} rx={r} ry={r * 0.8} />
        </g>
      ))}
    </g>
  );
}

const Breath = ({ pts }: { pts: [number, number][] }) => (
  <g fill="#fff" stroke="#9db497" strokeWidth=".7">
    {pts.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2 + (i % 2)} />
    ))}
  </g>
);

/** Watercolour corner spray. Grows toward the bottom-right from its top-left. */
export function FloralSpray({ className, style }: P & { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 260" className={className} style={style} aria-hidden>
      <g>
        <Sprig x={62} y={68} rot={100} s={1.25} />
        <Sprig x={62} y={68} rot={152} s={1.15} />
        <Sprig x={62} y={68} rot={126} s={0.95} />
        <Sprig x={130} y={46} rot={78} s={0.9} />
        <Sprig x={40} y={120} rot={175} s={0.8} />
        <Breath pts={[[232, 60], [244, 74], [226, 82], [190, 150], [204, 160], [96, 214], [110, 228]]} />
        <Flower x={150} y={60} s={0.85} rot={20} tone="peach" />
        <Flower x={58} y={148} s={0.8} rot={-10} tone="lilac" />
        <Flower x={128} y={122} s={0.55} rot={40} tone="blush" />
        <Flower x={72} y={70} s={1.3} tone="blush" />
      </g>
    </svg>
  );
}

/** A small centred bloom with two sprigs — used as a watercolour divider. */
export function WashStroke({ className, tone = "sage" }: P & { tone?: "sage" | "blush" }) {
  const fill = tone === "sage" ? "#aec3a7" : "#ecb9b5";
  return (
    <svg viewBox="0 0 260 44" className={className} aria-hidden>
      <g>
        <path d="M14 24C70 10 190 12 246 21C190 32 70 36 14 24Z" fill={fill} opacity=".4" />
        <path d="M44 22C94 15 168 16 218 21C168 27 94 28 44 22Z" fill={fill} opacity=".5" />
        <Sprig x={116} y={24} rot={-96} s={0.36} />
        <Sprig x={144} y={24} rot={96} s={0.36} />
        <Flower x={130} y={22} s={0.4} tone="blush" />
      </g>
    </svg>
  );
}

/**
 * One swan of the pair (the left one). Mirror it for the right: the two necks meet at x=200
 * and together outline a heart.
 */
export function Swan({ className }: P) {
  const neck = "M193 160C160 142 112 114 116 74C120 38 172 32 186 64";
  return (
    <svg viewBox="0 0 200 180" className={className} aria-hidden>
      <path d={neck} fill="none" stroke="#d6c8bc" strokeWidth="13" strokeLinecap="round" />
      <path d={neck} fill="none" stroke="#fffdf9" strokeWidth="10.4" strokeLinecap="round" />
      <path d="M198 166C192 147 164 139 132 143C100 147 70 139 42 124C48 147 70 163 104 169C140 175 186 176 198 166Z" fill="url(#c-swan)" stroke="#d6c8bc" strokeWidth="1.2" />
      <path d="M174 152C152 119 108 101 62 103C79 112 86 120 77 127C100 124 111 131 104 139C131 141 157 147 174 152Z" fill="#fffdf9" stroke="#d6c8bc" strokeWidth="1.1" />
      <path d="M150 140C128 126 104 118 84 118M160 146C138 134 118 130 100 131" fill="none" stroke="#e8d9cd" strokeWidth="1" />
      <ellipse cx="184" cy="63" rx="11" ry="8.4" transform="rotate(28 184 63)" fill="#fffdf9" stroke="#d6c8bc" strokeWidth="1.2" />
      <path d="M190 66L202 80L191.5 73.5Z" fill="#eea17c" stroke="#c97c5a" strokeWidth=".6" />
      <path d="M188 63.5L191.5 68L188.5 69Z" fill="#4e4a44" />
      <circle cx="182.5" cy="60.5" r="1.5" fill="#4e4a44" />
    </svg>
  );
}

/** Water under the swans. */
export function Ripples({ className }: P) {
  return (
    <svg viewBox="0 0 400 30" className={className} aria-hidden fill="none" strokeLinecap="round">
      <path d="M60 10H340" stroke="#a9c3cf" strokeWidth="2" opacity=".6" />
      <path d="M100 18H300" stroke="#a9c3cf" strokeWidth="1.6" opacity=".45" />
      <path d="M150 25H250" stroke="#a9c3cf" strokeWidth="1.2" opacity=".35" />
    </svg>
  );
}

/** Pastel butterfly, front view — flap it with scaleX. */
export function Butterfly({ className, tone = 0 }: P & { tone?: number }) {
  return (
    <svg viewBox="-22 -18 44 36" className={className} aria-hidden>
      <g fill={`url(#c-wing${tone % 3})`} stroke="#9c7f96" strokeOpacity=".55" strokeWidth=".6">
        <path d="M0 0C-5-13-19-19-19-7C-19 1-9 3 0 0Z" />
        <path d="M0 0C5-13 19-19 19-7C19 1 9 3 0 0Z" />
        <path d="M0 1C-7 3-15 10-10 14C-5 16-1 8 0 1Z" />
        <path d="M0 1C7 3 15 10 10 14C5 16 1 8 0 1Z" />
      </g>
      <path d="M0-6V10" stroke="#6b5a64" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M0-6C-2-10-4-12-6-13M0-6C2-10 4-12 6-13" stroke="#6b5a64" strokeWidth=".6" fill="none" />
    </svg>
  );
}

/** A butterfly that drifts in a slow loop while flapping. Positioned by the caller. */
export function Flutter({ className = "", style, tone }: P & { style?: CSSProperties; tone?: number }) {
  return (
    <div className={`pointer-events-none absolute ${s.drift} ${className}`} style={style} aria-hidden>
      <Butterfly tone={tone} className={`w-full ${s.flap}`} />
    </div>
  );
}

/** Soft wavy watercolour edge on top of a section, in the section's own base colour (--base). */
export function WashEdge() {
  return (
    <svg viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full h-6 w-full sm:h-10">
      <path d="M0 40V22C90 8 180 30 290 20S470 4 590 15S800 34 900 17S980 11 1000 15V40Z" fill="var(--base)" opacity=".5" />
      <path d="M0 40V30C120 19 220 37 340 28S540 13 660 24S860 37 1000 23V40Z" fill="var(--base)" />
    </svg>
  );
}

/* ---------- Event glyphs (fine line art, C style) ---------- */
const GLYPHS: Record<string, ReactNode> = {
  ring: (
    <>
      <circle cx="12" cy="14.5" r="6" />
      <path d="M9.5 5.5 12 8.5l2.5-3L12 3z" />
    </>
  ),
  henna: (
    <>
      <path d="M12 21c-4-3-6-7-4-11s4-6 4-8c0 2 2 4 4 8s0 8-4 11z" />
      <path d="M12 21V9M12 13l-2-2M12 16l2-2" />
    </>
  ),
  dinner: (
    <>
      <circle cx="13" cy="12" r="6" />
      <circle cx="13" cy="12" r="3.2" />
      <path d="M4 4v5.5M2.8 4v4a1.2 1.2 0 0 0 2.4 0V4M4 9.5V20M21 4c-1.8 1.2-1.8 5.5 0 7v9" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  moon: (
    <>
      <path d="M15 4a8 8 0 1 0 5 13 6.5 6.5 0 0 1-5-13z" />
      <path d="M18 3v3M16.5 4.5h3" />
    </>
  ),
  default: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8C10 6 11 3.5 12 3c1 .5 2 3 0 6.8zM12 14.2c-2 3.8-1 6.3 0 6.8 1-.5 2-3 0-6.8zM9.8 12C6 10 3.5 11 3 12c.5 1 3 2 6.8 0zM14.2 12c3.8-2 6.3-1 6.8 0-.5 1-3 2-6.8 0z" />
    </>
  ),
};

export function EventGlyph({ icon, className }: P & { icon?: string }) {
  const kind = eventIcon(icon);
  if ("emoji" in kind) return <span className={className} aria-hidden>{kind.emoji}</span>;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {GLYPHS[kind.key]}
    </svg>
  );
}
