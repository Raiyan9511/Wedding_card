"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import type { ClientConfig } from "@/lib/types";
import { dateParts, formatDate } from "@/lib/config";
import ScratchCard from "@/components/shared/ScratchCard";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { TornEdge, tornPolygon } from "./decor";
import s from "./cardB.module.css";

const TICKET = tornPolygon(17, 6, 30);

/** Scratch layer: maroon velvet with a gold rosette lattice. */
function paintVelvet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w * 0.3, h * 0.25, 2, w / 2, h / 2, Math.max(w, h));
  g.addColorStop(0, "#8e2238");
  g.addColorStop(0.6, "#5e1224");
  g.addColorStop(1, "#3a0914");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(201,164,92,.45)";
  ctx.lineWidth = 1;
  for (let y = 10; y < h; y += 18)
    for (let x = (y / 18) % 2 ? 19 : 10; x < w; x += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  ctx.fillStyle = "#e3c98f";
  ctx.font = "600 10px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH", w / 2, h / 2 + 4);
}

const PETALS = ["#8e1b30", "#b22f45", "#e8a0a8", "#c9a45c", "#f3dcd3"];

export default function DateReveal({ config }: { config: ClientConfig }) {
  const burstRef = useRef<HTMLDivElement>(null);
  const scratched = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const parts = dateParts(config.weddingDate);

  // Rose-petal burst: ~1.35s, transform/opacity only, host is pointer-events-none.
  const burst = () => {
    const host = burstRef.current;
    if (!host || reducedMotion()) return;
    const count = innerWidth < 640 ? 30 : 46;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const size = 8 + Math.random() * 8;
      p.style.cssText = `position:absolute;left:50%;top:40%;width:${size}px;height:${size * 1.3}px;background:${PETALS[i % PETALS.length]};border-radius:80% 0 80% 0`;
      host.appendChild(p);
      const up = gsap.utils.random(0.35, 0.45);
      gsap
        .timeline({ onComplete: () => p.remove() })
        .to(p, { x: gsap.utils.random(-190, 190), y: gsap.utils.random(-170, -60), rotate: gsap.utils.random(-200, 200), duration: up, ease: "power3.out" })
        .to(p, { x: `+=${gsap.utils.random(-40, 40)}`, y: "+=190", rotate: "+=220", opacity: 0, duration: 1.35 - up, ease: "sine.in" });
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
    <section className={`relative px-5 py-24 text-center ${s.blush}`}>
      <TornEdge color="var(--blush)" seed={13} />
      <h2 className={`${s.tearX} ${script.className} text-5xl text-(--maroon) sm:text-6xl`}>Save the Date</h2>
      <p className={`${s.tearX} mt-3 text-xs tracking-[0.35em] text-(--muted) uppercase`}>Scratch the ticket to reveal</p>

      <div className="js-drop relative mx-auto mt-12 max-w-lg drop-shadow-[0_18px_22px_rgb(90_20_30/0.22)]">
        <div className={`${s.paper} flex px-3 py-7 sm:px-5`} style={{ clipPath: TICKET }}>
          {tiles.map((t, i) => (
            <div key={t.label} className={`flex-1 px-2 sm:px-4 ${i > 0 ? "border-l-2 border-dashed border-(--gold)/50" : ""}`}>
              <span className="text-[0.6rem] tracking-[0.35em] text-(--rose) uppercase">{t.label}</span>
              <ScratchCard paint={paintVelvet} onComplete={onTileDone} className="mt-2 aspect-square rounded-md bg-(--ivory)">
                <div className="flex h-full items-center justify-center">
                  <span className={t.big ? "text-4xl font-bold text-(--maroon) sm:text-5xl" : `${script.className} text-2xl text-(--maroon) sm:text-3xl`}>
                    {t.value}
                  </span>
                </div>
              </ScratchCard>
            </div>
          ))}
        </div>
        <div ref={burstRef} className="pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <p className={`mt-10 text-lg italic transition-opacity duration-700 ${revealed ? "opacity-100" : "opacity-0"}`} aria-live="polite">
        {revealed && `Mark your calendar — ${formatDate(config.weddingDate)}`}
      </p>
    </section>
  );
}
