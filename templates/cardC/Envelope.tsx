"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { formatDate } from "@/lib/config";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { Butterfly, FloralSpray } from "./decor";
import s from "./cardC.module.css";

type Props = {
  config: ClientConfig;
  /** Fires synchronously on tap — the user gesture that unlocks audio. */
  onOpen: () => void;
  /** Fires as the intro starts fading and the site takes over. */
  onReveal: () => void;
};

const UNFOLD = 1;
// Where each butterfly flies to when the envelope blooms open (px from centre).
const FLIGHT = [
  [-170, -300, -20],
  [160, -260, 15],
  [-150, 280, -10],
  [170, 320, 25],
];

/**
 * Pocketfold envelope: four triangular flaps held by a sage pressed-flower seal.
 * Tap → the seal lifts off, the flaps unfold outward like petals, butterflies fly out.
 */
export default function Envelope({ config, onOpen, onReveal }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const revealRef = useRef(onReveal);
  useEffect(() => {
    revealRef.current = onReveal;
  });

  useGSAP(
    () => {
      const reveal = () => revealRef.current();
      if (reducedMotion()) {
        tl.current = gsap
          .timeline({ paused: true })
          .call(reveal)
          .to(root.current, { autoAlpha: 0, duration: 0.4 })
          .set(root.current, { display: "none" });
        return;
      }
      tl.current = gsap
        .timeline({ paused: true })
        .to(".js-hint", { autoAlpha: 0, duration: 0.3 }, 0)
        // seal: a small press, then it lifts away
        .to(".js-seal", { scale: 0.92, duration: 0.15, ease: "power2.in" }, 0)
        .to(".js-seal", { scale: 1.3, y: -30, rotate: -14, autoAlpha: 0, duration: 0.6, ease: "sine.out" }, 0.15)
        // flaps unfold toward the viewer: sides first, then top and bottom
        .addLabel("unfold", 0.4)
        .to(".js-flap-l", { rotateY: -165, duration: UNFOLD, ease: "sine.inOut" }, "unfold")
        .to(".js-flap-r", { rotateY: 165, duration: UNFOLD, ease: "sine.inOut" }, "unfold+=0.08")
        .to(".js-flap-t", { rotateX: 165, duration: UNFOLD, ease: "sine.inOut" }, "unfold+=0.28")
        .to(".js-flap-b", { rotateX: -165, duration: UNFOLD, ease: "sine.inOut" }, "unfold+=0.36")
        .to(".js-flap", { autoAlpha: 0, duration: 0.5, stagger: 0.05 }, "unfold+=1.05")
        // butterflies escape from the centre
        .fromTo(
          ".js-fly",
          { autoAlpha: 0, scale: 0.2 },
          {
            autoAlpha: 1,
            scale: 1,
            x: (i) => FLIGHT[i][0],
            y: (i) => FLIGHT[i][1],
            rotate: (i) => FLIGHT[i][2],
            duration: 1.8,
            ease: "sine.out",
            stagger: 0.08,
          },
          "unfold+=0.55",
        )
        .to(".js-inner", { scale: 1.05, duration: 0.9, ease: "sine.out" }, "unfold+=0.9")
        .addLabel("exit", "unfold+=1.8")
        .to(".js-inner", { scale: 1.2, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, "exit")
        .call(reveal, [], "exit+=0.3")
        .to(root.current, { autoAlpha: 0, duration: 0.7, ease: "sine.inOut" }, "exit+=0.3")
        .set(root.current, { display: "none" });
    },
    { scope: root },
  );

  const open = () => {
    if (!tl.current || tl.current.progress() > 0) return;
    onOpen(); // synchronous inside the tap, so audio.play() is allowed
    tl.current.play();
  };

  // Each flap is a full-size box (so it hinges on its own edge) showing one triangle.
  const flap = (side: "l" | "r" | "t" | "b") => {
    const pts = { t: "0,0 100,0 50,54", b: "0,100 100,100 50,46", l: "0,0 0,100 52,50", r: "100,0 100,100 48,50" }[side];
    const origin = { t: "origin-top", b: "origin-bottom", l: "origin-left", r: "origin-right" }[side];
    const fill = side === "t" || side === "b" ? "#fbf1ea" : "#f6e2da";
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`js-flap js-flap-${side} ${s.flapFace} absolute inset-0 h-full w-full ${origin}`}>
        <polygon points={pts} fill={fill} stroke="#d9b9ae" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-8 overflow-hidden px-4 outline-none ${s.cream}`}
    >
      <FloralSpray className="pointer-events-none absolute -top-4 -left-8 w-60 sm:w-80" />
      <FloralSpray className="pointer-events-none absolute -right-8 -bottom-4 w-60 rotate-180 sm:w-80" />

      <p className="js-hint relative text-xs tracking-[0.4em] text-(--sage-deep) uppercase">A little garden note</p>

      <div className="relative aspect-square w-[min(76vw,340px)] [perspective:1200px]">
        <div className="absolute inset-3 translate-y-3 rounded-lg bg-[rgb(120_90_80/0.18)] blur-lg" />
        <div className={`${s.stage} relative h-full w-full`}>
          <div className="js-inner absolute inset-0 flex flex-col items-center justify-center rounded-md bg-(--cream) px-6 text-center shadow-sm">
            <p className="text-[0.6rem] tracking-[0.35em] text-(--muted) uppercase">Together with their families</p>
            <p className={`${script.className} mt-2 text-5xl leading-tight text-(--rose)`}>
              {config.groomName}
              <br />&amp; {config.brideName}
            </p>
            <p className="mt-3 text-[0.6rem] tracking-[0.3em] text-(--muted) uppercase">{formatDate(config.weddingDate)}</p>
          </div>
          {/* Flaps are direct children of the 3D stage: any wrapper would flatten the unfold. */}
          {flap("l")}
          {flap("r")}
          {flap("t")}
          {flap("b")}
          <div className="js-seal absolute top-1/2 left-1/2 z-10 -mt-10 -ml-10 flex size-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c6d6bf,var(--sage)_55%,var(--sage-deep))] shadow-[inset_0_-3px_6px_rgb(40_60_40/0.35),0_4px_10px_rgb(60_80_60/0.3)]">
            <svg viewBox="-20 -20 40 40" className="absolute inset-2 opacity-35" aria-hidden>
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse key={a} cx="0" cy="-10" rx="5" ry="9" fill="#fff" transform={`rotate(${a})`} />
              ))}
            </svg>
            <span className={`${script.className} relative text-3xl text-white`}>{config.monogram}</span>
          </div>
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="js-fly pointer-events-none invisible absolute top-1/2 left-1/2 -mt-6 -ml-7 w-14">
            <Butterfly tone={i} className={`w-full ${s.flap}`} />
          </div>
        ))}
      </div>

      <p className={`js-hint relative text-sm tracking-[0.3em] text-(--sage-deep) uppercase ${s.hint}`}>Tap the seal to open</p>
    </div>
  );
}
