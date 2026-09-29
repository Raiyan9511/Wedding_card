"use client";
import { useSyncExternalStore } from "react";

const tick = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

/** Live countdown to `target`. Returns null during SSR / first paint (avoids hydration mismatch). */
export function useCountdown(target: Date) {
  const now = useSyncExternalStore(tick, () => Math.floor(Date.now() / 1000), () => null);
  if (now === null) return null;
  const s = Math.max(0, Math.floor(target.getTime() / 1000) - now);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor(s / 3600) % 24,
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
    done: s === 0,
  };
}
