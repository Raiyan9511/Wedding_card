"use client";
import { useEffect, useState, type RefObject } from "react";

/** True while `ref` is on screen AND the tab is visible — use it to pause decorative loops. */
export function useVisible(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);

  return inView && tabVisible;
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
