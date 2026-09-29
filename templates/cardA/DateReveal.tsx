"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import type { ClientConfig } from "@/lib/types";
import { dateParts, formatDate } from "@/lib/config";
import ScratchCard from "@/components/shared/ScratchCard";
import { script, serif } from "./fonts";
import { Divider } from "./decor";
import { reducedMotion } from "./motion";
import s from "./cardA.module.css";

/** Arch outline (semicircle top, straight sides) inset by `i` px — follows the tile's rounded-t-full edge. */
function arch(ctx: CanvasRenderingContext2D, w: number, h: number, i: number) {
  ctx.beginPath();
  ctx.moveTo(i, h - i);
  ctx.lineTo(i, w / 2);
  ctx.arc(w / 2, w / 2, w / 2 - i, Math.PI, 0);
  ctx.lineTo(w - i, h - i);
  ctx.closePath();
}

/** Gold foil: diagonal base, fine grain, a soft light sheen, a double gold rule and a quiet "scratch here". */
function paintGold(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#8a6424");
  base.addColorStop(0.3, "#c89b4a");
  base.addColorStop(0.5, "#e6c886");
  base.addColorStop(0.7, "#c49646");
  base.addColorStop(1, "#7e5a1f");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < (w * h) / 6; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? `rgba(255,246,220,${Math.random() * 0.2})` : `rgba(70,45,10,${Math.random() * 0.18})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }

  const sheen = ctx.createLinearGradient(0, h * 0.1, w, h * 0.7);
  sheen.addColorStop(0.3, "rgba(255,250,232,0)");
  sheen.addColorStop(0.5, "rgba(255,250,232,.42)");
  sheen.addColorStop(0.7, "rgba(255,250,232,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,240,200,.8)";
  arch(ctx, w, h, 6);
  ctx.stroke();
  ctx.strokeStyle = "rgba(95,65,20,.45)";
  arch(ctx, w, h, 9.5);
  ctx.stroke();

  // four-point sparkle + hint, low visual weight
  const cx = w / 2;
  const cy = h * 0.55;
  ctx.fillStyle = "rgba(255,248,226,.92)";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 9);
  ctx.quadraticCurveTo(cx, cy, cx + 9, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + 9);
  ctx.quadraticCurveTo(cx, cy, cx - 9, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - 9);
  ctx.fill();
  ctx.fillStyle = "rgba(70,45,12,.62)";
  ctx.font = `italic 500 13px ${serif.style.fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillText("scratch here", cx, cy + 25);
}

const CONFETTI = ["#b8893b", "#e9cf8f", "#fff3cf", "#7a1f2b", "#f2d3c9"];

export default function DateReveal({ config }: { config: ClientConfig }) {
  const burstRef = useRef<HTMLDivElement>(null);
  const scratched = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const parts = dateParts(config.weddingDate);

  // Quick celebratory burst: ~1.3s total, transform/opacity only, pointer-events-none host
  // (never blocks scrolling). Pieces remove themselves, so no GSAP context/cleanup is needed.
  const burst = () => {
    const host = burstRef.current;
    if (!host || reducedMotion()) return;
    const count = innerWidth < 640 ? 36 : 56;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("i");
      bit.style.cssText = `position:absolute;left:50%;top:45%;width:${5 + Math.random() * 5}px;height:${8 + Math.random() * 7}px;background:${CONFETTI[i % CONFETTI.length]};border-radius:1px`;
      host.appendChild(bit);
      const up = gsap.utils.random(0.4, 0.5);
      gsap
        .timeline({ onComplete: () => bit.remove() })
        .to(bit, {
          x: gsap.utils.random(-180, 180),
          y: gsap.utils.random(-200, -60),
          rotate: gsap.utils.random(-300, 300),
          duration: up,
          ease: "power3.out",
        })
        .to(bit, { y: "+=200", rotate: "+=160", opacity: 0, duration: 1.3 - up, ease: "power1.in" });
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
    <section className="relative px-6 py-20 text-center">
      <h2 className={`js-reveal ${script.className} text-5xl text-(--gold-deep)`}>Save the Date</h2>
      <p className="js-reveal mt-3 text-sm tracking-[0.25em] text-(--muted) uppercase">Scratch the golden tiles to reveal</p>
      <Divider className="js-reveal mx-auto mt-5 w-44 text-(--gold)" />

      <div className="relative mx-auto mt-12 flex max-w-md justify-center gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="js-reveal flex flex-1 flex-col items-center">
            <div className={`w-full rounded-t-full p-[1.5px] shadow-[0_14px_26px_-10px_rgb(110_75_25/0.5)] ${s.foil}`}>
              <ScratchCard paint={paintGold} onComplete={onTileDone} className="aspect-[3/4] rounded-t-full border-[3px] border-(--ivory) bg-(--ivory)">
                <div className="flex h-full items-center justify-center pt-4">
                  <span className={t.big ? "text-5xl font-semibold" : `${script.className} text-2xl`}>{t.value}</span>
                </div>
              </ScratchCard>
            </div>
            <span className="mt-3 text-xs tracking-[0.3em] text-(--muted) uppercase">{t.label}</span>
          </div>
        ))}
        <div ref={burstRef} className="pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <p className={`mt-10 text-lg italic transition-opacity duration-700 ${revealed ? "opacity-100" : "opacity-0"}`} aria-live="polite">
        {revealed && `We can't wait to celebrate with you on ${formatDate(config.weddingDate)}`}
      </p>
    </section>
  );
}
