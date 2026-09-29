"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { formatDate, has } from "@/lib/config";
import { reducedMotion, useVisible } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { RoseCluster, tornPolygon } from "./decor";
import s from "./cardB.module.css";

const BANNER = tornPolygon(11, 9, 26);

export default function Hero({ config, opened }: { config: ClientConfig; opened: boolean }) {
  const root = useRef<HTMLElement>(null);
  const visible = useVisible(root);
  const paused = !opened || !visible;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // Photo drifts slower than the page (transform only).
      gsap.to(".js-parallax", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (reducedMotion()) return;
      if (!opened) {
        gsap.set(".js-banner", { "--t": "-2%" });
        gsap.set(".js-rose-l", { xPercent: -30, yPercent: -30, autoAlpha: 0 });
        gsap.set(".js-rose-r", { xPercent: 30, yPercent: 30, autoAlpha: 0 });
        gsap.set(".js-fade", { autoAlpha: 0 });
        return;
      }
      gsap
        .timeline({ delay: 0.15 })
        .to(".js-rose-l, .js-rose-r", { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "power3.out" }, 0)
        .to(".js-banner", { "--t": "104%", duration: 1.3, ease: "power2.inOut", clearProps: "--t" }, 0.25)
        .to(".js-fade", { autoAlpha: 1, duration: 1, stagger: 0.15, ease: "power1.out" }, 0.9);
    },
    { scope: root, dependencies: [opened] },
  );

  return (
    <section ref={root} className={`js-hero relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden bg-(--maroon-deep) ${paused ? s.paused : ""}`}>
      <div className="js-parallax absolute inset-x-0 -top-[8%] h-[116%]">
        {has(config.coverImage) ? (
          <Image src={config.coverImage} alt="" fill sizes="100vw" className="object-cover" fetchPriority="high" />
        ) : (
          <div className={`absolute inset-0 ${s.velvet}`} />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(58_9_20/0.72)_0%,rgb(58_9_20/0.35)_40%,rgb(58_9_20/0.55)_70%,rgb(40_5_12/0.92)_100%)]" />

      <div className="js-rose-l pointer-events-none absolute -top-8 -left-12 w-[62vw] max-w-[420px]">
        <RoseCluster className={`w-full ${s.sway}`} />
      </div>
      <div className="js-rose-r pointer-events-none absolute -right-12 -bottom-8 w-[62vw] max-w-[420px] rotate-180">
        <RoseCluster className={`w-full ${s.swayR}`} />
      </div>

      <div className="relative flex w-full flex-col items-center px-4 text-center">
        <p className="js-fade text-[0.7rem] tracking-[0.4em] text-(--gold-soft) uppercase sm:text-xs">Together with their families</p>

        {/* Outer: tear-in reveal clip. Inner: permanent torn-paper shape. (One clip-path per element.) */}
        <div className={`js-banner ${s.tear} relative mt-6 w-[min(92vw,560px)] -rotate-2 drop-shadow-[0_16px_24px_rgb(20_0_5/0.5)]`}>
          <div className={`${s.paper} px-6 py-10 sm:px-12 sm:py-12`} style={{ clipPath: BANNER }}>
            <h1 className="flex flex-col items-center leading-none text-(--maroon)">
              <span className={`${script.className} text-6xl sm:text-7xl`}>{config.groomName}</span>
              <span className="my-2 text-sm font-semibold tracking-[0.5em] text-(--gold) uppercase">and</span>
              <span className={`${script.className} text-6xl sm:text-7xl`}>{config.brideName}</span>
            </h1>
          </div>
        </div>

        <p className="js-fade mt-8 text-sm font-semibold tracking-[0.3em] text-(--ivory) uppercase sm:text-base">{formatDate(config.weddingDate)}</p>
        {has(config.tagline) && <p className="js-fade mt-2 text-lg text-(--gold-soft) italic">{config.tagline}</p>}
      </div>

      <div className="js-fade absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-(--gold-soft)" aria-hidden>
        <span className="text-[0.6rem] tracking-[0.45em] uppercase">Scroll</span>
        <span className={`block h-10 w-px bg-(--gold) ${s.drip}`} />
      </div>
    </section>
  );
}
