"use client";
import type { ClientConfig } from "@/lib/types";
import { toDate } from "@/lib/config";
import { useCountdown } from "@/components/shared/useCountdown";
import { script } from "./fonts";
import { TornEdge } from "./decor";
import s from "./cardB.module.css";

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
    <section className={`relative px-4 py-20 text-center ${s.velvet}`}>
      <TornEdge color="var(--maroon)" seed={9} />
      <p className={`${s.tearX} text-xs tracking-[0.45em] text-(--gold-soft) uppercase`}>Counting the days</p>
      {left?.done ? (
        <p className={`${script.className} mt-6 text-5xl ${s.goldText}`}>Today is the day</p>
      ) : (
        <div className="mx-auto mt-8 flex max-w-3xl justify-center divide-x divide-(--gold)/35" role="timer" aria-live="off">
          {units.map((u) => (
            <div key={u.label} className="js-drop flex-1 px-1 sm:px-6">
              <div className="text-4xl font-semibold text-(--ivory) tabular-nums sm:text-6xl">
                {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[0.6rem] tracking-[0.3em] text-(--gold) uppercase sm:text-xs">{u.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
