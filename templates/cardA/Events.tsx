"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { Bloom, Divider, EventArt } from "./decor";
import { reducedMotion } from "./motion";
import s from "./cardA.module.css";

/** "10 December 2026 · 6:00 PM" → big time + small date; anything else is shown as-is. */
function splitTime(text: string) {
  const [date, time] = text.split("·").map((t) => t.trim());
  return time ? { time, date } : { time: text, date: "" };
}

export default function Events({ config }: { config: ClientConfig }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // The line tracks scroll exactly (scrub: true — Lenis already provides the smoothing).
      // Art/text (.js-reveal) and nodes (.js-pop) use the card-wide batch reveal in index.tsx.
      gsap.fromTo(
        ".js-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".js-timeline", start: "top 70%", end: "bottom 70%", scrub: true } },
      );
    },
    { scope: root },
  );

  if (!has(config.events)) return null;

  return (
    <section ref={root} className="relative px-4 pt-32 pb-24">
      <Bloom art="spray" className="top-0 -right-12 w-44" dur={4.4} phase={2} imgClass="-scale-x-100" />
      <Bloom art="bouquet" className="top-[38%] -left-24 w-44" dur={5} phase={5} />
      <Bloom art="cornerBottom" className="-right-16 bottom-0 w-52" dur={3.8} phase={1} />

      <div className="relative text-center">
        <h2 className={`js-reveal ${script.className} text-5xl text-(--gold-deep)`}>Wedding Events</h2>
        <Divider className="js-reveal mx-auto mt-5 w-44 text-(--gold)" />
      </div>

      <div className="js-timeline relative mx-auto mt-14 max-w-4xl">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-(--gold)/25" />
        <div className={`js-line absolute inset-y-0 left-1/2 w-[2px] origin-top -translate-x-1/2 ${s.foil}`} />

        <ol className="relative space-y-14">
          {config.events.map((e, i) => {
            const { time, date } = splitTime(e.time);
            return (
              <li key={`${e.name}-${i}`} className="grid grid-cols-[1fr_2.25rem_1fr] items-center">
                <div className={`js-reveal order-1 text-right`}>
                  <p className="text-2xl leading-tight font-semibold">{time}</p>
                  {date && <p className="mt-1.5 text-[0.7rem] tracking-[0.18em] text-(--muted) uppercase">{date}</p>}
                </div>

                <div className="order-2 flex justify-center">
                  <span className="js-pop block">
                    <span className={`block size-3.5 rotate-45 shadow-[0_0_0_4px_var(--ivory)] ${s.foil}`} />
                  </span>
                </div>

                <div className={`order-3 flex flex-col items-center text-center`}>
                  <div className="js-reveal">
                    <div className={`relative size-[124px] ${s.float}`}>
                      <EventArt icon={e.icon} />
                    </div>
                  </div>
                  <h3 className={`js-reveal ${script.className} mt-1 text-4xl leading-tight text-(--gold-deep)`}>{e.name}</h3>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
