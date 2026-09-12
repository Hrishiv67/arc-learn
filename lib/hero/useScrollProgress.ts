"use client";

import { useEffect, useRef } from "react";

export type ProgressOpts = {
  /** Element whose scroll span drives the sequence. */
  ref: React.RefObject<HTMLElement | null>;
  /** Called once per animation frame with smoothed progress in [0,1]. */
  onFrame: (p: number) => void;
  /** Called once instead, when the viewer prefers reduced motion. */
  onStatic: (p: number) => void;
  /** Progress to hold for reduced motion — the rocket armed on the rail. */
  staticP?: number;
};

/**
 * Drives the hero from scroll position.
 *
 * One rAF loop, one layout read per frame, and geometry cached until the window
 * actually changes size — the sequence must never cause the reflow it is
 * reacting to. Progress is eased toward its target rather than snapped, which is
 * where the sense of mass comes from: the frame keeps moving for a beat after
 * the wheel stops, the way something heavy would.
 *
 * Under prefers-reduced-motion the loop is never started at all, not merely
 * paused, and the scene is painted once as a still frame.
 */
export function useScrollProgress({
  ref,
  onFrame,
  onStatic,
  staticP = 0.06,
}: ProgressOpts) {
  // Kept in a ref so the rAF loop always calls the latest callbacks without
  // tearing down and restarting on every render. Synced in an effect rather
  // than during render, which React forbids.
  const cb = useRef({ onFrame, onStatic });
  useEffect(() => {
    cb.current = { onFrame, onStatic };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      cb.current.onStatic(staticP);
      return;
    }

    let top = 0;
    let span = 1;
    const measure = () => {
      const r = el.getBoundingClientRect();
      top = r.top + window.scrollY;
      span = Math.max(1, el.offsetHeight - window.innerHeight);
    };
    measure();

    let current = -1;
    let raf = 0;
    let running = false;

    const tick = () => {
      const target = Math.min(
        1,
        Math.max(0, (window.scrollY - top) / span),
      );

      if (current < 0) current = target;
      const delta = target - current;
      // ease toward the target; snap once the remainder is invisible
      current = Math.abs(delta) < 0.0002 ? target : current + delta * 0.14;

      cb.current.onFrame(current);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    /*
     * Only animate while the section is actually on screen. The page has more
     * than one pinned sequence, and leaving every one of them running a frame
     * loop for the whole visit costs real frames on the one the reader is
     * looking at. Painted once on the way out so the section is left in its
     * final state rather than mid-transition.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          measure();
          start();
        } else {
          stop();
          cb.current.onFrame(window.scrollY > top ? 1 : 0);
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, staticP]);
}
