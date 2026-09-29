"use client";
import type { ClientConfig } from "@/lib/types";
import { toDate } from "@/lib/config";
import { useCountdown } from "@/components/shared/useCountdown";
import { script } from "./fonts";
import { WashEdge } from "./decor";
import s from "./cardC.module.css";

// Each unit sits on its own soft watercolour blob.
const BLOBS = [
  "rounded-[58%_42%_55%_45%/48%_56%_44%_52%] bg-(--blush)",
  "rounded-[45%_55%_42%_58%/56%_44%_56%_44%] bg-(--sage-soft)",
  "rounded-[52%_48%_60%_40%/44%_58%_42%_56%] bg-(--peach)",
  "rounded-[40%_60%_48%_52%/58%_42%_58%_42%] bg-(--lilac)",
];

export default function Countdown({ config }: { config: ClientConfig }) {
  const target = toDate(config.weddingDate);
  const left = useCountdown(target);
  if (isNaN(target.getTime())) return null;

  const units = [
    { label: "Days", value: left?.days },
    { label: "Hours", value: left?.hours },
    { label: "Minutes", value: left?.minutes },
    { label: "Seconds", value: left?.seconds },
  ];

  return (
    <section className={`relative px-4 py-20 text-center ${s.cream}`}>
      <WashEdge />
      <h2 className={`js-float ${script.className} text-5xl text-(--sage-deep) sm:text-6xl`}>Until we say yes</h2>
      {left?.done ? (
        <p className={`${script.className} mt-6 text-6xl text-(--rose)`}>Today is the day</p>
      ) : (
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-2 sm:gap-6" role="timer" aria-live="off">
          {units.map((u, i) => (
            <div key={u.label} className="js-bloom flex flex-col items-center">
              <div className={`flex aspect-square w-full max-w-28 items-center justify-center opacity-90 ${BLOBS[i]}`}>
                <span className="text-3xl font-medium text-(--ink) tabular-nums sm:text-5xl">
                  {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-3 text-[0.6rem] tracking-[0.3em] text-(--sage-deep) uppercase sm:text-xs">{u.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
