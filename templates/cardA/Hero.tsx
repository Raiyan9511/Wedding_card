"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { formatDate, has } from "@/lib/config";
import { useVisible } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { Bloom, Divider, Petal } from "./decor";
import { hide, reveal } from "./motion";
import heroVideo from "./assets/hero/hero.mp4";
import heroPoster from "./assets/hero/hero-poster.webp";
import s from "./cardA.module.css";

const PETAL_COLORS = ["#f2d3c9", "#f7e7c6", "#e5c07e", "#fbeee6"];

/** Integer-only "random" so server and client render identical markup. The card is phone-width everywhere, so 6 is plenty. */
const PETALS = Array.from({ length: 6 }, (_, i) => {
  const dur = 12 + ((i * 7) % 9);
  return {
    left: `${(i * 37 + 5) % 100}%`,
    size: 9 + ((i * 5) % 10),
    dur: `${dur}s`,
    delay: `-${(i * 13) % dur}s`,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  };
});

export default function Hero({ config, opened }: { config: ClientConfig; opened: boolean }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useVisible(root);

  // coverVideo: "built-in" = Card A's own video + poster; a path = the client's video (poster = coverImage).
  const builtIn = config.coverVideo?.trim() === "built-in";
  const videoSrc = builtIn ? heroVideo : config.coverVideo;
  const poster = builtIn ? heroPoster.src : config.coverImage;

  // Plays only once the envelope is open, and only while on screen in a visible tab.
  // Loops from the moment the envelope video ends (also with reduced motion — it is the card itself).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (opened && visible) v.play().catch((err) => console.error("[hero] video play() rejected", err));
    else v.pause();
  }, [opened, visible]);

  useGSAP(
    () => {
      if (!opened) hide(".js-in");
      else reveal(".js-in", { delay: 0.2 });
    },
    { scope: root, dependencies: [opened] },
  );

  return (
    <section ref={root} className={`relative h-[100dvh] min-h-[560px] overflow-hidden ${!opened || !visible ? s.paused : ""}`}>
      {/* Media + scrim fade out at the bottom (mask), so the page pattern continues underneath — no seam. */}
      <div className={`absolute inset-0 ${s.heroFade}`}>
      {has(videoSrc) ? (
        <video
          ref={video}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : has(config.coverImage) ? (
        <div className={`absolute inset-0 ${s.kenBurns}`}>
          <Image src={config.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 480px" className="object-cover" fetchPriority="high" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ivory)_0%,var(--cream)_100%)]" />
      )}
      <div className={`absolute inset-0 ${s.heroScrim}`} />
      </div>
      <Bloom art="cornerBottom" className="-right-14 bottom-2 w-48" dur={4.2} phase={1} />

      {PETALS.map((p, i) => (
        <span
          key={i}
          className={`${s.petal} opacity-70`}
          style={{ left: p.left, width: p.size, "--dur": p.dur, "--delay": p.delay } as CSSProperties}
        >
          <Petal color={p.color} className="block w-full" />
        </span>
      ))}

      {/* Text sits in the upper third — the sky of the video. */}
      <div className={`relative flex flex-col items-center px-6 pt-[max(10dvh,56px)] text-center ${s.heroText}`}>
        <p className="js-in text-xs font-semibold tracking-[0.42em] text-(--ink) uppercase">The Wedding Of</p>
        <h1 className={`js-in ${script.className} mt-3 text-[clamp(3.2rem,15vw,4.6rem)] leading-[1.05] text-balance text-(--gold-deep)`}>
          {config.groomName} <span className="text-[0.72em]">&amp;</span> {config.brideName}
        </h1>
        <Divider className="js-in mt-3 w-44 text-(--gold)" />
        <p className="js-in mt-3 text-2xl text-(--ink) italic">are getting married</p>
        <p className="js-in mt-4 text-sm font-bold tracking-[0.2em] text-(--ink) uppercase">{formatDate(config.weddingDate)}</p>
        {has(config.venue.city) && (
          <p className="js-in mt-1.5 text-sm font-semibold tracking-[0.35em] text-(--gold-deep) uppercase">{config.venue.city}</p>
        )}
      </div>

      <div className="js-in absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center" aria-hidden>
        <div className={`flex flex-col items-center text-(--gold-deep) ${s.heroText} ${s.bounce}`}>
          <span className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase">Scroll down</span>
          <svg viewBox="0 0 24 24" className="mt-1 size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
