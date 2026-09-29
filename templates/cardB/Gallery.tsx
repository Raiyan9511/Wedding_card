"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { TornEdge } from "./decor";
import s from "./cardB.module.css";

const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

/** Polaroid collage (drops in) + <dialog> lightbox. */
export default function Gallery({ config }: { config: ClientConfig }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const images = config.gallery?.filter((src) => has(src)) ?? [];
  if (!has(images)) return null;

  return (
    <section className={`relative px-4 py-24 ${s.velvet}`}>
      <TornEdge color="var(--maroon)" seed={21} />
      <h2 className={`${s.tearX} ${script.className} text-center text-5xl sm:text-6xl ${s.goldText}`}>Our Moments</h2>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-5 sm:gap-10 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => {
              setActive(src);
              dialog.current?.showModal();
            }}
            aria-label={`Open photo ${i + 1}`}
            className={`js-drop bg-white p-2 pb-8 shadow-[0_14px_30px_rgb(0_0_0/0.4)] transition-[rotate,scale] duration-500 hover:scale-[1.03] hover:rotate-0 sm:p-3 sm:pb-12 ${TILTS[i % TILTS.length]}`}
          >
            <span className="relative block aspect-square overflow-hidden bg-(--blush)">
              <Image src={src} alt="" fill sizes="(max-width: 768px) 45vw, 300px" className="object-cover" />
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClick={() => dialog.current?.close()}
        onClose={() => setActive(null)}
        data-lenis-prevent
        className="m-auto h-[85svh] w-[92vw] max-w-3xl bg-transparent backdrop:bg-[rgb(30_4_10/0.88)]"
      >
        {active && <Image src={active} alt="" fill sizes="92vw" className="object-contain" />}
        <button type="button" className="absolute top-2 right-2 size-10 rounded-full bg-(--maroon) text-xl text-(--ivory)" aria-label="Close">
          ×
        </button>
      </dialog>
    </section>
  );
}
