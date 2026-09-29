"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { WashEdge, WashStroke } from "./decor";
import s from "./cardC.module.css";

/** Oval cameo frames in a staggered two-column garden + <dialog> lightbox. */
export default function Gallery({ config }: { config: ClientConfig }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const images = config.gallery?.filter((src) => has(src)) ?? [];
  if (!has(images)) return null;

  return (
    <section className={`relative px-5 py-24 ${s.sageWash}`}>
      <WashEdge />
      <div className="text-center">
        <h2 className={`js-float ${script.className} text-5xl text-(--rose) sm:text-7xl`}>Little Moments</h2>
        <WashStroke className={`${s.wash} mx-auto mt-2 w-52`} />
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-10 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => {
              setActive(src);
              dialog.current?.showModal();
            }}
            aria-label={`Open photo ${i + 1}`}
            className={`js-float group relative block ${i % 2 ? "mt-12" : ""}`}
          >
            <span className="relative block aspect-[3/4] overflow-hidden rounded-[50%] border-[5px] border-white shadow-[0_14px_30px_rgb(90_110_80/0.2)] transition-transform duration-700 group-hover:-translate-y-1">
              <Image src={src} alt="" fill sizes="(max-width: 768px) 45vw, 280px" className="object-cover" />
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClick={() => dialog.current?.close()}
        onClose={() => setActive(null)}
        data-lenis-prevent
        className="m-auto h-[85svh] w-[92vw] max-w-3xl bg-transparent backdrop:bg-[rgb(70_80_65/0.8)]"
      >
        {active && <Image src={active} alt="" fill sizes="92vw" className="object-contain" />}
        <button type="button" className="absolute top-2 right-2 size-10 rounded-full bg-(--cream) text-xl text-(--sage-deep)" aria-label="Close">
          ×
        </button>
      </dialog>
    </section>
  );
}
