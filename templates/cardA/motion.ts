import { gsap } from "gsap";

// Card A's single motion language — every reveal uses these so sections feel related.
export const EASE_OUT = "power3.out";
export const REVEAL = { y: 40, duration: 0.9, stagger: 0.15 };

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Hide before a reveal: 40px low and invisible (no flash of the final state). */
export const hide = (targets: gsap.TweenTarget) => gsap.set(targets, { autoAlpha: 0, y: REVEAL.y });

/**
 * The one text reveal: lines rise 40px → 0 and fade in, 0.15s apart, power3.out.
 * Deliberately NOT turned off by prefers-reduced-motion (many Windows PCs report it by default,
 * and the client wants the rise everywhere) — it is a single short, one-time move.
 */
export function reveal(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.to(targets, { autoAlpha: 1, y: 0, duration: REVEAL.duration, stagger: REVEAL.stagger, ease: EASE_OUT, overwrite: true, ...vars });
}
