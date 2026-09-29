"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

/**
 * Lenis smooth scroll driven by GSAP's ticker, so Lenis and ScrollTrigger read the
 * same scroll position on the same frame (no desync on fast flicks). Starts once `enabled`.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    // Mobile URL-bar show/hide fires resize constantly; recalculating every trigger then is pure jank.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Positions were measured while the page was locked behind the intro; web fonts can also
    // shift layout after that — re-measure now and once fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    document.fonts?.ready.then(refresh);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // native scrolling

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
