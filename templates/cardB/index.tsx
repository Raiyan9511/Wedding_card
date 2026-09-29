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
import Envelope from "./Envelope";
import Hero from "./Hero";
import Greeting from "./Greeting";
import Countdown from "./Countdown";
import DateReveal from "./DateReveal";
import Events from "./Events";
import Gallery from "./Gallery";
import Location from "./Location";
import Rsvp from "./Rsvp";
import Footer from "./Footer";
import MusicButton from "./MusicButton";
import { DROP, TEAR } from "./motion";
import s from "./cardB.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Card B — Maroon Floral. Velvet & torn paper; reveals tear, drop and bloom. */
export default function CardB({ config }: CardProps) {
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const music = useAudio(has(config.music.src) ? config.music.src : undefined);
  useSmoothScroll(opened);

  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  // Card B's reveal language (hero excluded — it has its own intro):
  //   .tear / .tearX → torn edge sweeps in (clip-path), .js-drop → drops & settles, .js-bloom → spins open.
  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return;
      const q = (sel: string) => [...root.current!.querySelectorAll<HTMLElement>(sel)].filter((el) => !el.closest(".js-hero"));
      const batch = (els: HTMLElement[], vars: gsap.TweenVars) =>
        els.length && ScrollTrigger.batch(els, { start: "top 88%", once: true, onEnter: (b) => gsap.to(b, { ...vars, overwrite: true }) });

      const tears = q(`.${s.tear}`);
      const tearsX = q(`.${s.tearX}`);
      const drops = q(".js-drop");
      const blooms = q(".js-bloom");
      gsap.set(tears, { "--t": "-8%" });
      gsap.set(tearsX, { "--t": "-6%" });
      gsap.set(drops, { autoAlpha: 0, y: -48, rotation: -5 });
      gsap.set(blooms, { scale: 0, rotation: -180 });

      batch(tears, { "--t": "110%", ...TEAR, clearProps: "--t" });
      batch(tearsX, { "--t": "106%", ...TEAR, clearProps: "--t" });
      batch(drops, { autoAlpha: 1, y: 0, rotation: 0, ...DROP });
      batch(blooms, { scale: 1, rotation: 0, duration: 0.8, stagger: 0.12, ease: "back.out(2)" });
    },
    { scope: root },
  );

  // Optional per-client colour override (primary = maroon, accent = gold, background = ivory).
  const t = config.theme;
  const vars = {
    ...(has(t?.primary) && { "--maroon": t.primary }),
    ...(has(t?.accent) && { "--gold": t.accent }),
    ...(has(t?.background) && { "--ivory": t.background }),
  } as CSSProperties;

  return (
    <div ref={root} className={`${s.root} ${serif.className}`} style={vars}>
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
        <Countdown config={config} />
        <DateReveal config={config} />
        <Events config={config} />
        <Gallery config={config} />
        <Location config={config} />
        <Rsvp config={config} />
        <Footer config={config} />
      </main>
      {opened && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
