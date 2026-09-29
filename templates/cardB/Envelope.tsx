"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ClientConfig } from "@/lib/types";
import { formatDate } from "@/lib/config";
import { reducedMotion } from "@/components/shared/useVisible";
import { script } from "./fonts";
import { Flourish, RoseCluster } from "./decor";
import s from "./cardB.module.css";

type Props = {
  config: ClientConfig;
  /** Fires synchronously on tap — the user gesture that unlocks audio. */
  onOpen: () => void;
  /** Fires as the intro starts fading and the site takes over. */
  onReveal: () => void;
};

const SWING = 1.25;

/** Gatefold invitation: a wax seal holds two velvet doors shut; the doors swing open toward the viewer. */
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
        // press
        .to(".js-hint", { autoAlpha: 0, duration: 0.3 }, 0)
        .to(".js-seal-l, .js-seal-r", { scale: 0.93, duration: 0.14, ease: "power2.in" }, 0)
        // crack along the seam — each half stays attached to its door
        .addLabel("crack", 0.14)
        .to(".js-seal-l", { scale: 1, x: -7, rotate: -8, duration: 0.35, ease: "back.out(3)" }, "crack")
        .to(".js-seal-r", { scale: 1, x: 7, rotate: 8, duration: 0.35, ease: "back.out(3)" }, "crack")
        // doors swing toward the viewer, shading as they turn edge-on
        .addLabel("swing", "crack+=0.3")
        .to(".js-door-l", { rotateY: -155, duration: SWING, ease: "power3.inOut" }, "swing")
        .to(".js-door-r", { rotateY: 155, duration: SWING, ease: "power3.inOut" }, "swing+=0.08")
        .to(".js-shade", { opacity: 0.7, duration: SWING / 2, ease: "power1.in" }, "swing")
        .to(".js-shade", { opacity: 0.25, duration: SWING / 2, ease: "power1.out" }, `swing+=${SWING / 2}`)
        .to(".js-inner-shadow", { opacity: 0, duration: SWING * 0.8, ease: "power2.out" }, "swing+=0.2")
        // inner card lifts, then everything melts into the site
        .to(".js-inner", { scale: 1.04, y: -6, duration: 0.8, ease: "power2.out" }, `swing+=${SWING * 0.7}`)
        .addLabel("exit", ">+0.35")
        .to(".js-door-l, .js-door-r", { autoAlpha: 0, duration: 0.5 }, "exit")
        .to(".js-inner", { scale: 1.25, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, "exit")
        .call(reveal, [], "exit+=0.35")
        .to(root.current, { autoAlpha: 0, duration: 0.7, ease: "power1.inOut" }, "exit+=0.35")
        .set(root.current, { display: "none" });
    },
    { scope: root },
  );

  const open = () => {
    if (!tl.current || tl.current.progress() > 0) return;
    onOpen(); // synchronous inside the tap, so audio.play() is allowed
    tl.current.play();
  };

  const seal = (half: "l" | "r") => (
    <div
      className={`js-seal-${half} absolute top-1/2 z-10 size-20 -translate-y-1/2 sm:size-24 ${half === "l" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"} ${s.seal} ${half === "l" ? s.sealL : s.sealR}`}
    >
      <div className="absolute inset-[16%] rounded-full border border-[#7a5a1c]/50" />
      <span className={`${script.className} absolute inset-0 flex items-center justify-center text-2xl text-[#6b4a12] sm:text-3xl`}>{config.monogram}</span>
    </div>
  );

  const door = (side: "l" | "r") => (
    <div
      className={`js-door-${side} ${s.panel} ${s.velvet} absolute top-0 h-full w-1/2 ${side === "l" ? "left-0 origin-left rounded-l-md" : "right-0 origin-right rounded-r-md"} shadow-[0_20px_50px_rgb(20_0_5/0.5)]`}
    >
      <div className={`absolute inset-3 border border-(--gold)/60 ${side === "l" ? "rounded-l-sm border-r-0" : "rounded-r-sm border-l-0"}`} />
      <Flourish className={`absolute top-5 w-16 text-(--gold) ${side === "l" ? "left-5" : "right-5 -scale-x-100"}`} />
      <Flourish className={`absolute bottom-5 w-16 text-(--gold) ${side === "l" ? "left-5 -scale-y-100" : "right-5 -scale-100"}`} />
      <div className={`js-shade ${s.panelShade} ${side === "l" ? "bg-linear-to-r" : "bg-linear-to-l"} from-black/10 to-black/60`} />
      {seal(side)}
    </div>
  );

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-8 overflow-hidden px-4 outline-none ${s.velvet}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(20_0_5/0.55)_100%)]" />
      <RoseCluster className="pointer-events-none absolute -top-6 -left-10 w-56 opacity-90 sm:w-80" />
      <RoseCluster className="pointer-events-none absolute -right-10 -bottom-6 w-56 rotate-180 opacity-90 sm:w-80" />

      <p className="js-hint relative text-xs tracking-[0.45em] text-(--gold-soft) uppercase">An invitation for you</p>

      <div className={`relative aspect-[3/4] w-[min(74vw,340px)] [perspective:1400px]`}>
        <div className={`${s.stage} relative h-full w-full`}>
          <div className={`js-inner ${s.paper} absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-md px-6 text-center`}>
            <RoseCluster className="absolute -top-4 -left-6 w-40" />
            <p className="text-[0.6rem] tracking-[0.35em] text-(--muted) uppercase">You are invited</p>
            <p className={`${script.className} mt-2 text-4xl leading-tight text-(--maroon)`}>
              {config.groomName}
              <br />&amp; {config.brideName}
            </p>
            <p className="mt-3 text-[0.6rem] tracking-[0.3em] text-(--muted) uppercase">{formatDate(config.weddingDate)}</p>
            <div className="js-inner-shadow pointer-events-none absolute inset-0 bg-black/45" />
          </div>
          {/* No wrapper around the doors: any non-3D (or faded) ancestor would flatten the swing. */}
          {door("l")}
          {door("r")}
        </div>
      </div>

      <p className={`js-hint relative text-sm tracking-[0.3em] text-(--gold-soft) uppercase ${s.breathe}`}>Tap the seal to open</p>
    </div>
  );
}
