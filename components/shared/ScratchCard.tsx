"use client";
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** Content revealed underneath. */
  children: ReactNode;
  /** Draws the cover — this is where each card gives the scratch layer its own look. Must be a stable function (define it at module level). */
  paint: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  onComplete?: () => void;
  /** Brush radius in px. */
  brush?: number;
  /** Fraction scratched away before the rest auto-clears. */
  threshold?: number;
  className?: string;
};

/** Canvas scratch-to-reveal. Works with mouse, touch and pen (pointer events); Enter/Space reveals for keyboard users. */
export default function ScratchCard({ children, paint, onComplete, brush = 16, threshold = 0.5, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    paint(ctx, width, height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // opaque brush: a translucent strokeStyle left by paint() would never erase to alpha 0
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush * 2;

    type Pt = { x: number; y: number };
    let done = false;
    let drawing = false;
    let prev: Pt | null = null; // last raw point of the current stroke
    let lastMid: Pt | null = null; // where the smoothed curve currently ends
    const queue: Pt[] = [];
    let raf = 0;
    let lastCheck = 0;

    const finish = () => {
      if (done) return;
      done = true;
      canvas.style.transition = "opacity .6s ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      onCompleteRef.current?.();
    };
    const check = () => {
      // Sample every 16th pixel's alpha — cheap enough to run while dragging.
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 64) {
        total++;
        if (data[i] === 0) clear++;
      }
      if (clear / total >= threshold) finish();
    };
    // Scaled to the size at init, so strokes still land correctly after a resize/rotation.
    const point = (e: PointerEvent): Pt => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * width) / r.width, y: ((e.clientY - r.top) * height) / r.height };
    };

    // Draw once per frame: a quadratic curve through the midpoints of all queued points,
    // so fast swipes become one smooth stroke instead of straight, gappy segments.
    const flush = () => {
      raf = 0;
      if (!queue.length) return;
      ctx.beginPath();
      for (const p of queue) {
        if (!prev || !lastMid) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 0.1, p.y); // a dot for a single tap
          prev = lastMid = p;
          continue;
        }
        const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
        ctx.moveTo(lastMid.x, lastMid.y);
        ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
        prev = p;
        lastMid = mid;
      }
      ctx.stroke();
      queue.length = 0;
      const now = performance.now();
      if (now - lastCheck > 200) {
        lastCheck = now;
        check();
      }
    };
    const add = (e: PointerEvent) => {
      const events = e.getCoalescedEvents?.();
      for (const ev of events?.length ? events : [e]) queue.push(point(ev));
      if (!raf) raf = requestAnimationFrame(flush);
    };

    const down = (e: PointerEvent) => {
      if (done) return;
      drawing = true;
      prev = lastMid = null;
      canvas.setPointerCapture(e.pointerId);
      add(e);
    };
    const move = (e: PointerEvent) => {
      if (drawing) add(e);
    };
    const up = () => {
      if (!drawing) return;
      drawing = false;
      cancelAnimationFrame(raf);
      flush();
      if (prev && lastMid) {
        // close the curve's tail to the final point
        ctx.beginPath();
        ctx.moveTo(lastMid.x, lastMid.y);
        ctx.lineTo(prev.x, prev.y);
        ctx.stroke();
      }
      prev = lastMid = null;
      check();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key);
    };
  }, [paint, brush, threshold]);

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="button"
        aria-label="Scratch to reveal (or press Enter)"
        className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />
    </div>
  );
}
