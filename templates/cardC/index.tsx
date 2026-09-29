"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CardProps } from "@/lib/types";
import { has } from "@/lib/config";
import { useAudio } from "@/components/shared/useAudio";
import { useSmoothScroll } from "@/components/shared/useSmoothScroll";
import { reducedMotion } from "@/components/shared/useVisible";
import { serif } from "./fonts";
import { WatercolorDefs } from "./decor";
import Envelope from "./Envelope";
import Hero from "./Hero";
import Greeting from "./Greeting";
import Events from "./Events";
import DateReveal from "./DateReveal";
import Countdown from "./Countdown";
import Gallery from "./Gallery";
import Location from "./Location";
import Rsvp from "./Rsvp";
import Footer from "./Footer";
import MusicButton from "./MusicButton";
import { BLOOM, FLOAT, WASH } from "./motion";
import s from "./cardC.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Card C — Pastel Garden. Watercolour florals, swans, butterflies; reveals float, wash and bloom. */
export default function CardC({ config }: CardProps) {
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const music = useAudio(has(config.music.src) ? config.music.src : undefined);
  useSmoothScroll(opened);

  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  // Card C's reveal language (hero excluded — it has its own intro):
  //   .js-float → drifts up softly, .wash → watercolour bleeds in left → right, .js-bloom → opens like a flower.
  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return;
      const q = (sel: string) => [...root.current!.querySelectorAll<HTMLElement>(sel)].filter((el) => !el.closest(".js-hero"));
      const batch = (els: HTMLElement[], vars: gsap.TweenVars) =>
        els.length && ScrollTrigger.batch(els, { start: "top 88%", once: true, onEnter: (b) => gsap.to(b, { ...vars, overwrite: true }) });

      const floats = q(".js-float");
      const washes = q(`.${s.wash}`);
      const blooms = q(".js-bloom");
      gsap.set(floats, { autoAlpha: 0, y: 30 });
      gsap.set(washes, { "--w": "0%" });
      gsap.set(blooms, { autoAlpha: 0, scale: 0.6, rotation: 12 });

      batch(floats, { autoAlpha: 1, y: 0, ...FLOAT });
      batch(washes, { "--w": "100%", ...WASH, clearProps: "--w" });
      batch(blooms, { autoAlpha: 1, scale: 1, rotation: 0, ...BLOOM });
    },
    { scope: root },
  );

  // Optional per-client colour override (primary = sage, accent = rose, background = cream).
  const t = config.theme;
  const vars = {
    ...(has(t?.primary) && { "--sage-deep": t.primary }),
    ...(has(t?.accent) && { "--rose": t.accent }),
    ...(has(t?.background) && { "--cream": t.background }),
  } as CSSProperties;

  return (
    <div ref={root} className={`${s.root} ${serif.className}`} style={vars}>
      <WatercolorDefs />
      <Envelope
        config={config}
        onOpen={() => config.music.autoplayAfterOpen && music.play()}
        onReveal={() => {
          window.scrollTo(0, 0);
          setOpened(true);
        }}
      />
      <main>
        <Hero config={config} opened={opened} />
        <Greeting config={config} />
        <Events config={config} />
        <DateReveal config={config} />
        <Countdown config={config} />
        <Gallery config={config} />
        <Location config={config} />
        <Rsvp config={config} />
        <Footer config={config} />
      </main>
      {opened && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
