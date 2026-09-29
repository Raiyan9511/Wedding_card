import type { ReactNode } from "react";
import { eventIcon } from "@/lib/config";

type P = { className?: string };

/** Seeded LCG — integer maths, so server and client produce identical torn edges. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** clip-path polygon with torn top and bottom edges (amp in px). */
export function tornPolygon(seed = 7, amp = 7, teeth = 22) {
  const r = rng(seed);
  const top = Array.from({ length: teeth + 1 }, (_, i) => `${((i / teeth) * 100).toFixed(2)}% ${(r() * amp).toFixed(1)}px`);
  const bottom = Array.from({ length: teeth + 1 }, (_, i) => `${(100 - (i / teeth) * 100).toFixed(2)}% calc(100% - ${(r() * amp).toFixed(1)}px)`);
  return `polygon(${[...top, ...bottom].join(",")})`;
}

/** Torn paper edge in `color`, sitting on top of the previous section. White fibres along the tear. */
export function TornEdge({ color, seed = 3, className = "", flip = false }: P & { color: string; seed?: number; flip?: boolean }) {
  const r = rng(seed);
  const pts: string[] = [];
  for (let x = 0; x <= 1000; x += 14 + Math.floor(r() * 18)) pts.push(`${x},${(6 + r() * 20).toFixed(1)}`);
  pts.push(`1000,${(6 + r() * 20).toFixed(1)}`);
  const line = pts.join(" ");
  return (
    <svg
      viewBox="0 0 1000 32"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 h-5 w-full sm:h-8 ${flip ? "top-full -scale-y-100" : "bottom-full"} ${className}`}
    >
      <polygon points={`0,32 ${line} 1000,32`} fill={color} />
      <polyline points={line} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const PETAL = "M0 0C-20-6-28-30-2-44C4-46 8-46 12-42C30-30 20-6 0 0Z";

/** Layered top-view rose (viewBox -50..50). */
function Rose({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  const ring = (n: number, scale: number, offset: number, fill: string) =>
    Array.from({ length: n }, (_, i) => (
      <path key={`${scale}-${i}`} d={PETAL} fill={fill} stroke="#4e0b18" strokeWidth={0.9 / scale} transform={`rotate(${offset + (360 / n) * i}) scale(${scale})`} />
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {ring(5, 1, 0, "#7e1830")}
      {ring(5, 0.74, 36, "#982238")}
      {ring(4, 0.5, 12, "#b22f45")}
      <circle r="9" fill="#a3263b" />
      <path d="M1-5C7-6 9 1 4 5C-1 9-8 4-6-2C-4-7 3-9 7-5" fill="none" stroke="#5a0d1c" strokeWidth="1.3" />
      <path d="M-14-30C-8-38 4-40 10-35" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" />
    </g>
  );
}

function Leaf({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0C10-13 32-15 48-6C32 5 12 7 0 0Z" fill="#35502a" />
      <path d="M2 0C16-4 30-6 44-6" stroke="#5d7a44" strokeWidth="1" fill="none" />
    </g>
  );
}

function Bud({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0C-8-6-8-20 0-28C8-20 8-6 0 0Z" fill="#8e1b30" stroke="#4e0b18" strokeWidth=".8" />
      <path d="M0 2C-6-2-10-8-9-12C-4-8-1-6 0 2ZM0 2C6-2 10-8 9-12C4-8 1-6 0 2Z" fill="#3f5a2c" />
      <path d="M0 2V22" stroke="#3f5a2c" strokeWidth="2" />
    </g>
  );
}

/** Rose cluster for corners. Draws toward the bottom-right from its top-left. */
export function RoseCluster({ className }: P) {
  return (
    <svg viewBox="0 0 300 240" className={className} aria-hidden>
      <Leaf x={120} y={120} rot={-20} s={1.2} />
      <Leaf x={100} y={130} rot={140} s={1.1} />
      <Leaf x={190} y={90} rot={20} />
      <Leaf x={70} y={160} rot={100} />
      <Leaf x={210} y={170} rot={40} s={0.9} />
      <Bud x={262} y={48} rot={35} />
      <Bud x={28} y={96} rot={-40} />
      <Rose x={195} y={165} s={0.55} rot={40} />
      <Rose x={60} y={165} s={0.6} rot={-20} />
      <Rose x={200} y={78} s={0.72} rot={15} />
      <Rose x={112} y={105} s={1.05} rot={5} />
    </svg>
  );
}

/** Ornate gold corner flourish (top-left orientation). */
export function Flourish({ className }: P) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M6 154C6 84 32 32 92 14C120 6 146 6 156 6" />
      <path d="M6 154C4 120 10 96 22 80" />
      <path d="M22 122C30 98 54 94 62 108C68 120 54 130 45 120C39 112 47 104 54 110" />
      <path d="M62 40C82 28 106 38 102 56C99 70 82 70 81 59C80 50 91 48 94 56" />
      <path d="M30 74C38 60 52 56 60 64" />
      <path d="M110 22C120 30 118 42 108 44" />
      <path d="M18 146C26 138 36 138 42 144M150 14C142 22 142 32 148 38" />
      <circle cx="6" cy="154" r="3" fill="currentColor" />
      <circle cx="156" cy="6" r="3" fill="currentColor" />
      <circle cx="54" cy="110" r="1.8" fill="currentColor" />
      <circle cx="94" cy="56" r="1.8" fill="currentColor" />
    </svg>
  );
}

/* ---------- Event glyphs (filled, B style) ---------- */
const GLYPHS: Record<string, ReactNode> = {
  ring: (
    <>
      <path d="M12 9a6.5 6.5 0 1 0 .01 0zm0 2.2a4.3 4.3 0 1 1-.01 0z" fillRule="evenodd" />
      <path d="M9 3h6l-3 5z" />
    </>
  ),
  henna: <path d="M12 22c-5 0-7.5-4-6.5-8.5C6.8 8.2 13 6 14.5 1.5c3 5 3.5 10 1.8 14.2C15.3 18.7 14 22 12 22zm-.8-9.2a2 2 0 1 0 .01 0z" fillRule="evenodd" />,
  dinner: (
    <>
      <path d="M13 5.5a6.5 6.5 0 1 0 .01 0zm0 2.5a4 4 0 1 1-.01 0z" fillRule="evenodd" />
      <path d="M3 3h1v5h1V3h1v5a1.5 1.5 0 0 1-1 1.4V21H4V9.4A1.5 1.5 0 0 1 3 8zM21 3c-2.4 1.2-2.4 6.5 0 8v10h-1.2V3z" />
    </>
  ),
  music: <path d="M9 17.5V6l11-2.5v11.5a2.8 2.8 0 1 1-1.6-2.5V7.4L10.6 9.2v8.3A2.8 2.8 0 1 1 9 17.5z" />,
  moon: (
    <>
      <path d="M14 3a9 9 0 1 0 7 14.6A7.5 7.5 0 0 1 14 3z" />
      <path d="M18.5 4l.8 1.8 2 .2-1.5 1.3.4 2-1.7-1-1.8 1 .5-2-1.5-1.3 2-.2z" />
    </>
  ),
  default: (
    <>
      <path d="M12 14c-4-2.5-4.5-8 0-11.5 4.5 3.5 4 9 0 11.5z" />
      <path d="M12 14c-3 0-5.5-1.5-6.5-4 3-.5 5.3.8 6.5 4zm0 0c3 0 5.5-1.5 6.5-4-3-.5-5.3.8-6.5 4zM11.3 14h1.4v8h-1.4z" opacity=".75" />
    </>
  ),
};

export function EventGlyph({ icon, className }: P & { icon?: string }) {
  const kind = eventIcon(icon);
  if ("emoji" in kind) return <span className={className} aria-hidden>{kind.emoji}</span>;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {GLYPHS[kind.key]}
    </svg>
  );
}
