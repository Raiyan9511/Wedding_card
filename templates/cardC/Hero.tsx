"use client";
import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { formatDate, has } from "@/lib/config";
import { reducedMotion, useVisible } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { FloralSpray, Flutter, Ripples, Swan } from "./decor";
import s from "./cardC.module.css";

// Fixed positions (SSR-safe). The last three only show from sm: up — fewer layers on phones.
const BUTTERFLIES = [
  { left: "8%", top: "30%", w: "w-8", d: "17s", delay: "-3s" },
  { left: "82%", top: "22%", w: "w-7", d: "14s", delay: "-8s" },
  { left: "74%", top: "62%", w: "w-9", d: "19s", delay: "-1s" },
  { left: "14%", top: "70%", w: "w-6", d: "15s", delay: "-11s" },
  { left: "50%", top: "12%", w: "w-6", d: "21s", delay: "-6s" },
  { left: "30%", top: "46%", w: "w-7 hidden sm:block", d: "18s", delay: "-4s" },
  { left: "90%", top: "80%", w: "w-8 hidden sm:block", d: "16s", delay: "-9s" },
  { left: "62%", top: "38%", w: "w-6 hidden sm:block", d: "20s", delay: "-13s" },
];

export default function Hero({ config, opened }: { config: ClientConfig; opened: boolean }) {
  const root = useRef<HTMLElement>(null);
  const visible = useVisible(root);
  const paused = !opened || !visible;

  // Intro once the envelope has opened: swans glide together into a heart, the wreath blooms, text floats up.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      if (!opened) {
        gsap.set(".js-swan-l", { xPercent: -45, autoAlpha: 0 });
        gsap.set(".js-swan-r", { xPercent: 45, autoAlpha: 0 });
        gsap.set(".js-wreath", { scale: 0.7, autoAlpha: 0 });
        gsap.set(".js-rise", { y: 24, autoAlpha: 0 });
        return;
      }
      gsap
        .timeline({ delay: 0.1 })
        .to(".js-wreath", { scale: 1, autoAlpha: 1, duration: 1.4, ease: "sine.out", stagger: 0.12 }, 0)
        .to(".js-rise", { y: 0, autoAlpha: 1, duration: 1.1, ease: "sine.out", stagger: 0.14 }, 0.3)
        .to(".js-swan-l, .js-swan-r", { xPercent: 0, autoAlpha: 1, duration: 2, ease: "sine.inOut" }, 0.4);
    },
    { scope: root, dependencies: [opened] },
  );

  return (
    <section
      ref={root}
      className={`js-hero relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-14 pb-16 text-center ${s.cream} ${paused ? s.paused : ""}`}
    >
      {BUTTERFLIES.map((b, i) => (
        <Flutter key={i} tone={i} className={b.w} style={{ left: b.left, top: b.top, "--d": b.d, "--delay": b.delay } as CSSProperties} />
      ))}

      <p className="js-rise text-[0.7rem] tracking-[0.4em] text-(--sage-deep) uppercase sm:text-xs">Together with their families</p>

      {has(config.coverImage) && (
        <div className="relative mt-14 w-[min(62vw,300px)]">
          <FloralSpray className="js-wreath pointer-events-none absolute -top-[22%] -left-[26%] z-10 w-[78%]" />
          <FloralSpray className="js-wreath pointer-events-none absolute -right-[26%] -bottom-[22%] z-10 w-[78%] rotate-180" />
          <div className="js-wreath relative aspect-square overflow-hidden rounded-full border-[6px] border-white shadow-[0_18px_40px_rgb(120_90_80/0.18)]">
            <div className={`absolute inset-0 ${s.breathe}`}>
              <Image src={config.coverImage!} alt="" fill sizes="300px" className="object-cover" fetchPriority="high" />
            </div>
          </div>
        </div>
      )}

      <h1 className="mt-8 flex flex-col items-center">
        <span className="relative block w-[min(78vw,340px)]">
          <span className="flex">
            <span className="js-swan-l block w-1/2">
              <Swan className={`w-full ${s.bob}`} />
            </span>
            <span className="js-swan-r block w-1/2 -scale-x-100">
              <Swan className={`w-full ${s.bobLate}`} />
            </span>
          </span>
          <Ripples className={`absolute inset-x-0 -bottom-3 w-full ${s.ripple}`} />
          <span className="sr-only">
            {config.groomName} and {config.brideName}
          </span>
        </span>
        <span className={`js-rise ${script.className} mt-6 block text-6xl leading-none text-(--rose) sm:text-7xl`} aria-hidden>
          {config.groomName}
        </span>
        <span className="js-rise my-1 block text-2xl text-(--sage-deep) italic" aria-hidden>
          &amp;
        </span>
        <span className={`js-rise ${script.className} block text-6xl leading-none text-(--rose) sm:text-7xl`} aria-hidden>
          {config.brideName}
        </span>
      </h1>

      <p className="js-rise mt-7 text-sm tracking-[0.3em] text-(--ink) uppercase sm:text-base">{formatDate(config.weddingDate)}</p>
      {has(config.tagline) && <p className="js-rise mt-2 text-lg text-(--muted) italic">{config.tagline}</p>}
    </section>
  );
}
