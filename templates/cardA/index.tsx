"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CardProps } from "@/lib/types";
import { has } from "@/lib/config";
import { useAudio } from "@/components/shared/useAudio";
import { useSmoothScroll } from "@/components/shared/useSmoothScroll";
import { serif } from "./fonts";
import Envelope from "./Envelope";
import Hero from "./Hero";
import Greeting from "./Greeting";
import DateReveal from "./DateReveal";
import Countdown from "./Countdown";
import Events from "./Events";
import Location from "./Location";
import Footer from "./Footer";
import MusicButton from "./MusicButton";
import { REVEAL, hide, reducedMotion, reveal } from "./motion";
import s from "./cardA.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Card A — Ivory & Gold Royal. Reference card: section order and patterns get reused, the look does not. */
export default function CardA({ config }: CardProps) {
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const music = useAudio(has(config.music.src) ? config.music.src : undefined);
  useSmoothScroll(opened);

  // One reveal system for every section: `.js-reveal` lines rise + fade (shared `reveal()`), `.js-pop` scales in.
  // Batching staggers whatever enters together; `once` kills each trigger after it fires.
  useGSAP(
    () => {
      if (!root.current) return;
      const q = (sel: string) => root.current!.querySelectorAll<HTMLElement>(sel);

      hide(q(".js-reveal"));
      ScrollTrigger.batch(q(".js-reveal"), {
        start: "top 88%",
        once: true,
        // A fast fling/jump batches everything it passed; staggering those would queue on-screen
        // lines seconds behind. Already scrolled-past lines just appear; the rest rise in.
        onEnter: (els) => {
          const past = els.filter((el) => el.getBoundingClientRect().bottom < 0);
          const next = els.filter((el) => !past.includes(el));
          if (past.length) gsap.set(past, { autoAlpha: 1, y: 0 }); // (empty targets make GSAP warn)
          if (next.length) reveal(next);
        },
      });

      if (reducedMotion()) return; // no pop

      gsap.set(q(".js-pop"), { scale: 0, rotate: -90 });
      ScrollTrigger.batch(q(".js-pop"), {
        start: "top 85%",
        once: true,
        onEnter: (els) => gsap.to(els, { scale: 1, rotate: 0, duration: 0.7, stagger: REVEAL.stagger, ease: "back.out(1.8)", overwrite: true }),
      });
    },
    { scope: root },
  );

  // Page stays locked behind the envelope until it opens.
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  // Optional per-client colour override (theme.primary = gold, accent = wax seal, background = ivory).
  const t = config.theme;
  const vars = {
    ...(has(t?.primary) && { "--gold": t.primary }),
    ...(has(t?.accent) && { "--seal": t.accent }),
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
      <main className={s.shell}>
        <Hero config={config} opened={opened} />
        <Greeting config={config} />
        <DateReveal config={config} />
        <Countdown config={config} />
        <Events config={config} />
        <Location config={config} />
        <Footer config={config} />
      </main>
      {opened && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
