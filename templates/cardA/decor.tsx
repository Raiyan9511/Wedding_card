import type { CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import bouquet from "./assets/decor/bouquet.webp";
import cornerTop from "./assets/decor/corner-top.webp";
import cornerBottom from "./assets/decor/corner-bottom.webp";
import spray from "./assets/decor/spray.webp";
import dhol from "./assets/icons/dhol.webp";
import nikah from "./assets/icons/nikah.webp";
import bride from "./assets/icons/bride.webp";
import dinner from "./assets/icons/dinner.webp";
import reception from "./assets/icons/reception.webp";
import s from "./cardA.module.css";

type P = { className?: string };

/** Dove in flight, facing right. Mirror with `-scale-x-100`. */
export function Dove({ className }: P) {
  return (
    <svg viewBox="0 0 100 64" className={className} aria-hidden fill="currentColor">
      <path
        opacity=".55"
        d="M46 42C50 28 58 16 72 6C71 20 66 32 58 44Z"
      />
      <path d="M8 42C18 40 28 40 38 42C40 28 36 14 26 2C44 8 56 20 60 36C66 32 72 26 80 25C86 24 90 27 92 30L98 31L92 33.5C90 40 84 46 74 50C60 56 44 56 30 52L14 58L18 50L4 52L14 46Z" />
      <circle cx="86" cy="28.5" r="1.3" fill="var(--ivory)" />
    </svg>
  );
}

/** Horizontal floral divider with a lotus centre. */
export function Divider({ className }: P) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden>
      <g stroke="currentColor" fill="none" strokeWidth="1">
        <path d="M0 12H90M150 12H240" />
        <path d="M90 12c6-6 12-6 17 0c-5 6-11 6-17 0z" />
        <path d="M150 12c-6-6-12-6-17 0c5 6 11 6 17 0z" />
      </g>
      <g fill="currentColor">
        <path d="M120 1c5 5 5 14 0 22c-5-8-5-17 0-22z" />
        <path opacity=".7" d="M120 13c6-7 12-9 17-7c-2 7-9 10-17 7zM120 13c-6-7-12-9-17-7c2 7 9 10 17 7z" />
        <circle cx="82" cy="12" r="1.8" />
        <circle cx="158" cy="12" r="1.8" />
        <circle cx="40" cy="12" r="1.2" />
        <circle cx="200" cy="12" r="1.2" />
      </g>
    </svg>
  );
}

function Flower({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.55} ry={r} transform={`rotate(${a})`} opacity=".85" />
      ))}
      <circle r={r * 0.45} fill="var(--ivory)" />
    </g>
  );
}

function Leaf({ x, y, a }: { x: number; y: number; a: number }) {
  return <path d="M0 0c4-5 10-6 14-4c-3 5-9 7-14 4z" transform={`translate(${x} ${y}) rotate(${a})`} />;
}

/** Floral vine for section corners (top-left orientation; rotate/mirror for others). */
export function Corner({ className }: P) {
  return (
    <svg viewBox="0 0 130 130" className={className} aria-hidden>
      <g stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinecap="round">
        <path d="M6 126C6 66 34 26 126 6" />
        <path d="M10 92c12-8 24-8 32 0M22 58c12-4 22 0 28 10M44 32c11 0 19 6 23 16" />
      </g>
      <g fill="currentColor">
        <Leaf x={8} y={110} a={-70} />
        <Leaf x={14} y={76} a={-40} />
        <Leaf x={30} y={48} a={-20} />
        <Leaf x={62} y={24} a={5} />
        <Leaf x={96} y={12} a={20} />
        <Flower x={42} y={92} r={5} />
        <Flower x={50} y={68} r={4} />
        <Flower x={67} y={48} r={4.5} />
        <Flower x={6} y={126} r={3} />
        <Flower x={120} y={8} r={3} />
      </g>
    </svg>
  );
}

export function Petal({ className, color }: P & { color: string }) {
  return (
    <svg viewBox="0 0 20 26" className={className} aria-hidden>
      <path d="M10 0C17 7 19 15 10 26C1 15 3 7 10 0Z" fill={color} />
      <path d="M10 4V22" stroke="#fff" strokeOpacity=".45" strokeWidth=".8" />
    </svg>
  );
}

/* ---------- Painted flowers (section framing) ---------- */

const FLOWERS = { bouquet, cornerTop, cornerBottom, spray };

type BloomProps = P & {
  art: keyof typeof FLOWERS;
  /** Seconds per up-down cycle (3–5) and phase offset — vary them so the flowers never bob in sync. */
  dur?: number;
  phase?: number;
  /** Classes for the image itself (mirroring, e.g. -scale-x-100) — kept off the animated element. */
  imgClass?: string;
  sizes?: string;
};

/** A painted flower fixed at a section corner (cropped by the edge). Its only motion is a slow vertical bob. */
export function Bloom({ art, className = "", dur = 4, phase = 0, imgClass = "", sizes = "(max-width: 640px) 50vw, 240px" }: BloomProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${s.bob} ${className}`} style={{ "--dur": `${dur}s`, "--phase": `-${phase}s` } as CSSProperties}>
      <Image src={FLOWERS[art]} alt="" sizes={sizes} className={`h-auto w-full ${imgClass}`} />
    </div>
  );
}

/* ---------- Event illustrations ---------- */

/** Valid `events[].icon` keys for Card A (listed in client.config.ts too). */
const EVENT_ART: Record<string, StaticImageData> = { dhol, nikah, bride, dinner, reception };

/** Small gold ornament for unknown / missing icons. */
function Ornament({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3c2.5 3 2.5 5.5 0 6.8C9.5 8.5 9.5 6 12 3zM12 21c-2.5-3-2.5-5.5 0-6.8 2.5 1.3 2.5 3.8 0 6.8zM3 12c3-2.5 5.5-2.5 6.8 0-1.3 2.5-3.8 2.5-6.8 0zM21 12c-3 2.5-5.5 2.5-6.8 0 1.3-2.5 3.8-2.5 6.8 0z" />
      <path d="M6 6l1.6 1.6M18 6l-1.6 1.6M6 18l1.6-1.6M18 18l-1.6-1.6" />
    </svg>
  );
}

/** Event illustration by key ("dhol", "nikah", …), contained in its (sized, relative) parent; anything else → the default ornament. */
export function EventArt({ icon }: { icon?: string }) {
  const art = EVENT_ART[icon?.trim().toLowerCase() ?? ""];
  if (!art) return <Ornament className="absolute inset-[26%] text-(--gold)" />;
  return <Image src={art} alt="" fill sizes="130px" className="object-contain" />;
}
