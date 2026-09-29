"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { EventGlyph, TornEdge, tornPolygon } from "./decor";
import s from "./cardB.module.css";

/** Wavy gold thread, drawn with stroke-dashoffset as you scroll. pathLength is 1000, not 1:
 *  GSAP rounds px values to whole numbers, so a 0–1 range would snap instead of drawing. */
const LEN = 1000;
const THREAD = (() => {
  let d = "M20 0";
  for (let y = 0, i = 0; y < 1000; y += 100, i++) d += ` Q ${i % 2 ? 4 : 36} ${y + 50} 20 ${y + 100}`;
  return d;
})();

export default function Events({ config }: { config: ClientConfig }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        ".js-thread",
        { strokeDashoffset: LEN },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".js-timeline", start: "top 70%", end: "bottom 70%", scrub: true } },
      );
    },
    { scope: root },
  );

  if (!has(config.events)) return null;

  return (
    <section ref={root} className={`relative px-5 py-24 ${s.paper}`}>
      <TornEdge color="var(--ivory)" seed={19} />
      <div className="text-center">
        <h2 className={`${s.tearX} ${script.className} text-5xl text-(--maroon) sm:text-6xl`}>The Celebrations</h2>
        <p className={`${s.tearX} mt-3 text-xs tracking-[0.35em] text-(--muted) uppercase`}>Join us for every moment</p>
      </div>

      <div className="js-timeline relative mx-auto mt-14 max-w-3xl">
        <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="absolute top-0 left-8 h-full w-10 -translate-x-1/2 md:left-1/2" aria-hidden>
          <path d={THREAD} pathLength={LEN} fill="none" stroke="var(--gold)" strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="6 10" />
          <path className="js-thread" d={THREAD} pathLength={LEN} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeDasharray={LEN} strokeDashoffset="0" />
        </svg>

        <ol className="space-y-14">
          {config.events.map((e, i) => {
            const right = i % 2 === 1;
            return (
              <li key={`${e.name}-${i}`} className={`relative pl-20 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-16" : "md:pr-16"}`}>
                <span
                  className={`js-bloom absolute top-6 left-8 z-10 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-(--gold) bg-(--maroon) text-(--gold-soft) shadow-md ${
                    right ? "md:left-0" : "md:right-0 md:left-auto md:translate-x-1/2"
                  }`}
                >
                  <EventGlyph icon={e.icon} className="size-5 text-lg leading-none" />
                </span>
                <div className={`js-drop drop-shadow-[0_12px_16px_rgb(90_30_20/0.18)] ${i % 2 ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"}`}>
                  <div className={`${s.blush} px-6 py-8 text-center`} style={{ clipPath: tornPolygon(23 + i * 5, 6, 18) }}>
                    <h3 className={`${script.className} text-4xl text-(--maroon)`}>{e.name}</h3>
                    <div className="mx-auto my-3 h-px w-12 bg-(--gold)" />
                    <p className="text-base font-medium tracking-wide">{e.time}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
