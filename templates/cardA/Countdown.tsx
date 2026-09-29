"use client";
import type { ClientConfig } from "@/lib/types";
import { toDate } from "@/lib/config";
import { useCountdown } from "@/components/shared/useCountdown";
import { script } from "./fonts";
import { Bloom } from "./decor";
import s from "./cardA.module.css";

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
    <section className={`relative px-6 py-20 text-center`}>
      <Bloom art="spray" className="-top-14 -left-20 w-48" dur={3.8} phase={4} />
      <Bloom art="spray" className="-right-20 -bottom-14 w-48" dur={4.4} phase={1} imgClass="-scale-x-100" />
      <div className="relative">
      <p className="js-reveal text-sm tracking-[0.3em] text-(--muted) uppercase">Counting down to forever</p>
      {left?.done ? (
        <p className={`${script.className} mt-6 text-5xl ${s.foilText}`}>The celebration has begun</p>
      ) : (
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 gap-2" role="timer" aria-live="off">
          {units.map((u) => (
            <div key={u.label} className="js-reveal flex flex-col items-center">
              <div className={`flex aspect-square w-full max-w-24 items-center justify-center rounded-full p-[2px] ${s.foil}`}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-(--ivory) shadow-[inset_0_0_0_4px_var(--ivory),inset_0_0_0_5px_color-mix(in_srgb,var(--gold)_40%,transparent)]">
                  <span className="text-2xl font-semibold tabular-nums">
                    {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <span className="mt-2 text-[0.65rem] tracking-[0.2em] text-(--muted) uppercase">{u.label}</span>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
