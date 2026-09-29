"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import type { ClientConfig } from "@/lib/types";
import { monogram } from "@/lib/config";
import { script } from "./fonts";
import envelopeVideo from "./assets/envelope/envelope-blank-seal.mp4";
import envelopePoster from "./assets/envelope/envelope-poster.webp"; // = frame 0 of the video
import s from "./cardA.module.css";

type Props = {
  config: ClientConfig;
  /** Fires synchronously on tap — the user gesture that unlocks audio. */
  onOpen: () => void;
  /** Fires as the envelope starts fading and the site takes over. */
  onReveal: () => void;
};

/**
 * The opening is a real video (blank wax seal). Closed state = its first frame with the
 * couple's monogram laid over the seal; tap hides the monogram and plays the video in place;
 * when the whole video has played the envelope crossfades (0.5s) into the hero. The guest starts it
 * with a tap, so it plays even with prefers-reduced-motion (many Windows PCs report that by default).
 */
export default function Envelope({ config, onOpen, onReveal }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [tapped, setTapped] = useState(false);
  const [playing, setPlaying] = useState(false); // video's first frame is on screen → drop the poster
  const mark = monogram(config);
  const [first, and, second] = mark.split(/(&)/);
  if (typeof window !== "undefined") console.log("[envelope] monogram", { groomName: config.groomName, brideName: config.brideName, monogram: mark });

  const finish = () => {
    console.log("[envelope] reveal → crossfading into the hero");
    onReveal();
    gsap.to(root.current, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", onComplete: () => gsap.set(root.current, { display: "none" }) });
  };

  const open = () => {
    if (tapped) return;
    console.log("[envelope] tap");
    setTapped(true);
    onOpen(); // synchronous inside the tap, so audio.play() is allowed
    const v = video.current;
    if (!v) return finish();
    console.log("[envelope] video.play()", v.currentSrc);
    v.play().then(
      () => console.log("[envelope] play() resolved"),
      (err) => {
        console.error("[envelope] play() rejected", err);
        finish(); // can't play → don't strand the guest on the envelope
      },
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
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden bg-(--canvas) outline-none"
    >
      {/* Portrait card: full width on phones, phone-sized on larger screens; never taller than the screen. */}
      <div className={`relative aspect-[9/16] w-[min(100vw,calc(100dvh*9/16))] sm:w-[min(480px,calc(100dvh*9/16))] ${s.envelopeCard}`}>
        <video
          ref={video}
          src={envelopeVideo}
          muted
          playsInline
          preload="auto"
          onPlaying={() => {
            console.log("[envelope] playing → poster hidden");
            setPlaying(true);
          }}
          onEnded={() => {
            console.log("[envelope] ended");
            finish();
          }}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <Image
          src={envelopePoster}
          alt=""
          fill
          priority
          unoptimized // the extracted frame itself, full quality
          className={playing ? "invisible" : ""}
        />

        {!tapped && (
          <>
            {/* Seal face centre is 49.3% / 51.4% of the frame; +1% offsets the script font's low baseline. */}
            <span className={`absolute top-[52.4%] left-[49.3%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${script.className} ${s.sealMark}`} aria-hidden>
              {first}
              {and && <span className="text-[0.62em]">{and}</span>}
              {second}
            </span>
            <p className={`absolute inset-x-0 top-[63.5%] text-center text-[3.1cqw] font-semibold tracking-[0.35em] text-(--gold-deep) uppercase ${s.pulse}`}>
              Tap to open
            </p>
          </>
        )}
      </div>
    </div>
  );
}
