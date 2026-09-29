"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { EventGlyph, WashEdge, WashStroke } from "./decor";
import s from "./cardC.module.css";

/** Winding vine through the whole list: x = 50 ± 34 (% of width), y = 0..1000. */
const vineX = (t: number) => 50 + 34 * Math.sin(t * Math.PI * 5);
const VINE = Array.from({ length: 81 }, (_, i) => `${i ? "L" : "M"}${vineX(i / 80).toFixed(2)} ${(i * 12.5).toFixed(1)}`).join(" ");
// Leaves sprout along the vine; t = how far down the vine (0..1).
const LEAVES = Array.from({ length: 12 }, (_, i) => {
  const t = (i + 0.5) / 12;
  const slope = Math.cos(t * Math.PI * 5); // direction the vine is heading
  return { t, x: vineX(t), side: i % 2 ? 1 : -1, rot: slope * 35 };
});

export default function Events({ config }: { config: ClientConfig }) {
  const root = useRef<HTMLElement>(null);

  // One scrubbed timeline: the vine "draws" and each leaf sprouts exactly as the vine reaches it.
  // The draw is transform-only (no stroke-dashoffset repaint of a page-tall SVG): a clip box slides
  // down while the vine inside counter-slides up by the same amount, so the vine stays put and is uncovered.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".js-vine-wrap", start: "top 75%", end: "bottom 75%", scrub: 0.4 } });
      tl.fromTo(".js-vine-clip", { yPercent: -100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
      tl.fromTo(".js-vine", { yPercent: 100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
      gsap.utils.toArray<HTMLElement>(".js-leaf").forEach((el, i) => {
        tl.fromTo(el, { scale: 0 }, { scale: 1, ease: "back.out(2)", duration: 0.05 }, LEAVES[i].t - 0.02);
      });
    },
    { scope: root },
  );

  if (!has(config.events)) return null;

  return (
    <section ref={root} className={`relative px-5 py-24 ${s.cream}`}>
      <WashEdge />
      <div className="text-center">
        <h2 className={`js-float ${script.className} text-5xl text-(--rose) sm:text-7xl`}>The Celebrations</h2>
        <WashStroke tone="blush" className={`${s.wash} mx-auto mt-2 w-52`} />
      </div>

      <div className="js-vine-wrap relative mx-auto mt-12 max-w-2xl">
        <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={VINE} fill="none" stroke="var(--sage)" strokeOpacity=".25" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="2 7" />
        </svg>
        <div className="js-vine-clip pointer-events-none absolute inset-0 overflow-hidden will-change-transform">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="js-vine absolute inset-0 h-full w-full will-change-transform" aria-hidden>
            <path d={VINE} fill="none" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        {LEAVES.map((l, i) => (
          <svg
            key={i}
            viewBox="-2 -10 34 20"
            className="js-leaf pointer-events-none absolute w-6 sm:w-8"
            style={{ left: `${l.x}%`, top: `${l.t * 100}%`, transform: `translate(-2px, -50%) rotate(${l.side > 0 ? l.rot : 180 + l.rot}deg)`, transformOrigin: "2px 50%" }}
            aria-hidden
          >
            <path d="M0 0C8-9 22-9 30 0C22 9 8 9 0 0Z" fill="url(#c-leaf)" />
            <path d="M1 0H26" stroke="#6f8c6a" strokeWidth=".8" />
          </svg>
        ))}

        <ol className="relative space-y-20 py-6">
          {config.events.map((e, i) => (
            <li key={`${e.name}-${i}`} className={`js-float relative mx-auto max-w-[17.5rem] sm:max-w-xs ${i % 2 ? "sm:translate-x-16" : "sm:-translate-x-16"}`}>
              <span className="js-bloom absolute -top-7 left-1/2 z-10 -ml-7 flex size-14 items-center justify-center rounded-full border border-(--sage)/50 bg-(--blush) text-(--sage-deep) shadow-sm">
                <EventGlyph icon={e.icon} className="size-7 text-2xl leading-none" />
              </span>
              <div className="rounded-[2.5rem] bg-(--cream) px-4 pt-11 pb-8 text-center shadow-[0_14px_36px_rgb(95_124_92/0.16)] ring-1 ring-(--sage)/25">
                <h3 className={`${script.className} text-5xl text-(--rose)`}>{e.name}</h3>
                <p className="mt-3 text-base">{e.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
