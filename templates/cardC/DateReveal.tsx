"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import type { ClientConfig } from "@/lib/types";
import { dateParts, formatDate } from "@/lib/config";
import ScratchCard from "@/components/shared/ScratchCard";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { Butterfly, FloralSpray, WashEdge } from "./decor";
import s from "./cardC.module.css";

/** Scratch layer: sage + blush watercolour blooms with a hand-drawn ring. */
function paintWash(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#e6eee0";
  ctx.fillRect(0, 0, w, h);
  const blob = (x: number, y: number, r: number, c: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  blob(w * 0.3, h * 0.3, w * 0.6, "rgba(143,169,138,.75)");
  blob(w * 0.75, h * 0.7, w * 0.55, "rgba(236,176,172,.7)");
  blob(w * 0.7, h * 0.2, w * 0.35, "rgba(205,184,224,.55)");
  // A translucent pencil ring — the brush must still erase to full transparency after this.
  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4f6b4c";
  ctx.font = "italic 600 11px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("scratch", w / 2, h / 2 + 4);
}

const PETALS = ["#f2cac5", "#f7d3b9", "#d9cce7", "#c9dcc2", "#fbe9e4"];

export default function DateReveal({ config }: { config: ClientConfig }) {
  const burstRef = useRef<HTMLDivElement>(null);
  const scratched = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const parts = dateParts(config.weddingDate);

  // Butterflies take off + petals scatter: ~1.6s, transform/opacity only, host is pointer-events-none.
  const burst = () => {
    const host = burstRef.current;
    if (!host || reducedMotion()) return;
    const flies = host.querySelectorAll(".js-bfly");
    gsap.fromTo(
      flies,
      { x: 0, y: 0, scale: 0.3, autoAlpha: 0 },
      {
        x: () => gsap.utils.random(-170, 170),
        y: () => gsap.utils.random(-220, -90),
        rotate: () => gsap.utils.random(-30, 30),
        scale: 1,
        autoAlpha: 1,
        duration: 1.6,
        ease: "sine.out",
        stagger: 0.05,
        onComplete: () => void gsap.to(flies, { autoAlpha: 0, duration: 0.5 }),
      },
    );
    const count = innerWidth < 640 ? 18 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const size = 7 + Math.random() * 7;
      p.style.cssText = `position:absolute;left:50%;top:45%;width:${size}px;height:${size}px;background:${PETALS[i % PETALS.length]};border-radius:50% 0 50% 50%`;
      host.appendChild(p);
      gsap
        .timeline({ onComplete: () => p.remove() })
        .to(p, { x: gsap.utils.random(-160, 160), y: gsap.utils.random(-120, -30), rotate: gsap.utils.random(-120, 120), duration: 0.5, ease: "power2.out" })
        .to(p, { y: "+=150", x: `+=${gsap.utils.random(-30, 30)}`, rotate: "+=140", opacity: 0, duration: 1.1, ease: "sine.in" });
    }
  };

  const onTileDone = () => {
    if (++scratched.current === 3) {
      setRevealed(true);
      burst();
    }
  };

  if (!parts) return null;
  const tiles = [
    { label: "Day", value: parts.day, big: true },
    { label: "Month", value: parts.month, big: false },
    { label: "Year", value: parts.year, big: true },
  ];

  return (
    <section className={`relative overflow-hidden px-5 py-24 text-center ${s.blushWash}`}>
      <WashEdge />
      <FloralSpray className="pointer-events-none absolute -top-6 -left-12 w-44 opacity-80 sm:w-60" />
      <FloralSpray className="pointer-events-none absolute -right-12 -bottom-6 w-44 rotate-180 opacity-80 sm:w-60" />

      <h2 className={`js-float ${script.className} relative text-5xl text-(--rose) sm:text-7xl`}>Save the Date</h2>
      <p className="js-float relative mt-2 text-xs tracking-[0.35em] text-(--muted) uppercase">Gently scratch each bloom</p>

      <div className="relative mx-auto mt-12 flex max-w-md justify-center gap-3 sm:gap-8">
        {tiles.map((t) => (
          <div key={t.label} className="js-bloom flex w-[30%] max-w-32 flex-col items-center">
            <ScratchCard
              paint={paintWash}
              onComplete={onTileDone}
              brush={14}
              className="aspect-square w-full rounded-full bg-(--cream) shadow-[0_10px_24px_rgb(150_100_100/0.18)] ring-4 ring-white"
            >
              <div className="flex h-full items-center justify-center">
                <span className={t.big ? "text-4xl font-medium text-(--sage-deep) sm:text-5xl" : `${script.className} text-3xl text-(--rose) sm:text-4xl`}>{t.value}</span>
              </div>
            </ScratchCard>
            <span className="mt-3 text-[0.65rem] tracking-[0.35em] text-(--sage-deep) uppercase">{t.label}</span>
          </div>
        ))}
        <div ref={burstRef} className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="js-bfly invisible absolute top-1/2 left-1/2 -mt-4 -ml-4 w-8">
              <Butterfly tone={i} className={`w-full ${s.flap}`} />
            </div>
          ))}
        </div>
      </div>

      <p className={`relative mt-10 text-lg italic transition-opacity duration-700 ${revealed ? "opacity-100" : "opacity-0"}`} aria-live="polite">
        {revealed && `We'll be waiting for you — ${formatDate(config.weddingDate)}`}
      </p>
    </section>
  );
}
