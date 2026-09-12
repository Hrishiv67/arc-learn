"use client";

import { useEffect, useRef } from "react";
import { sequenceAt, statusLabel } from "@/lib/hero/launchSequence";
import { clock } from "@/lib/hero/flightModel";
import { useScrollProgress } from "@/lib/hero/useScrollProgress";
import { createSmokeRenderer, type SmokeRenderer } from "@/lib/hero/smokeRenderer";
import { HeroNav } from "./HeroNav";
import { HeroCopy } from "./HeroCopy";
import { Telemetry } from "./Telemetry";
import { ScrollIndicator } from "./ScrollIndicator";

/** Source plate geometry, measured in scripts/mat_assets.py. */
const PLATE_W = 3041;
const PLATE_H = 1710;
const PLATE_HORIZON = 0.711; // fraction of plate height
const PAD_X = 0.66; // fraction of plate width
const PAD_Y = 0.782; // fraction of plate height — where the airframe meets ground

/** Vehicle height as a fraction of viewport height, at rest. */
const ROCKET_VH = 0.58;
const ROCKET_VH_MOBILE = 0.46;

const SMOKE_SPRITES = [
  "/hero/smoke-01.png",
  "/hero/smoke-02.png",
  "/hero/smoke-03.png",
  "/hero/smoke-04.png",
  "/hero/smoke-05.png",
  "/hero/smoke-06.png",
];

type Layout = {
  drawnW: number;
  drawnH: number;
  offsetX: number;
  offsetY: number;
  padX: number;
  padY: number;
  rocketH: number;
  mobile: boolean;
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLImageElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  const navRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const layout = useRef<Layout>({
    drawnW: 0,
    drawnH: 0,
    offsetX: 0,
    offsetY: 0,
    padX: 0,
    padY: 0,
    rocketH: 0,
    mobile: false,
  });
  const smoke = useRef<SmokeRenderer | null>(null);

  /**
   * Place the plate by its horizon rather than letting object-fit centre-crop it.
   * The vehicle has to stand on the ground at every aspect ratio, so the ground
   * has to be where we say it is — a centred cover crop slides the horizon
   * around and the rocket ends up floating or buried.
   */
  const measure = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const mobile = W < 768;
    const horizonTarget = mobile ? 0.68 : 0.71;

    const scale = Math.max(W / PLATE_W, H / PLATE_H);
    const drawnW = PLATE_W * scale;
    const drawnH = PLATE_H * scale;
    const offsetY = horizonTarget * H - PLATE_HORIZON * drawnH;

    // Align the plate by its launch point, not by centre. On a portrait phone the
    // plate is nearly four times the viewport width, so centring it throws the
    // pad off the right edge entirely. Clamp so the plate still covers.
    const padViewFrac = mobile ? 0.74 : PAD_X;
    const offsetX = Math.min(
      0,
      Math.max(W - drawnW, padViewFrac * W - PAD_X * drawnW),
    );

    layout.current = {
      drawnW,
      drawnH,
      offsetX,
      offsetY,
      padX: offsetX + PAD_X * drawnW,
      padY: offsetY + PAD_Y * drawnH,
      rocketH: H * (mobile ? ROCKET_VH_MOBILE : ROCKET_VH),
      mobile,
    };

    // publish the launch point so CSS-positioned instrumentation tracks it at
    // every aspect ratio instead of guessing a percentage
    const root = sectionRef.current;
    if (root) {
      root.style.setProperty("--pad-x", `${layout.current.padX.toFixed(1)}px`);
      root.style.setProperty("--pad-y", `${layout.current.padY.toFixed(1)}px`);
    }

    const plate = plateRef.current;
    if (plate) {
      plate.style.width = `${drawnW}px`;
      plate.style.height = `${drawnH}px`;
      plate.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    }
    smoke.current?.resize();
  };

  // Vehicle travel in px, from the sequence's vh figure.
  const travelPx = (vh: number) => (vh / 100) * window.innerHeight;

  const paint = (p: number) => {
    const s = sequenceAt(p);
    const L = layout.current;

    // --- camera vibration: the plate, the vehicle and the exhaust only ------
    const scene = sceneRef.current;
    if (scene) {
      const a = s.shake;
      const sx = a * (Math.sin(p * 1900) * 0.6 + Math.sin(p * 2750) * 0.4);
      const sy = a * (Math.sin(p * 2210 + 1.1) * 0.6 + Math.sin(p * 3100) * 0.4);
      scene.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
    }

    // --- vehicle ------------------------------------------------------------
    const rocket = rocketRef.current;
    if (rocket) {
      const h = L.rocketH * s.rocketScale;
      const y = L.padY - travelPx(s.travel) - h;
      rocket.style.height = `${h}px`;
      rocket.style.transform = `translate3d(${(L.padX - (h * 0.128) / 2).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      rocket.style.opacity = String(s.rocketFade);
      // Y-only blur; the filter is only mounted while it is actually doing work
      rocket.style.filter = s.rocketBlur > 0.5 ? "url(#arc-vblur)" : "none";
    }
    if (blurRef.current && s.rocketBlur > 0.5) {
      blurRef.current.setAttribute("stdDeviation", `0 ${s.rocketBlur.toFixed(1)}`);
    }
    if (railRef.current) {
      railRef.current.style.opacity = String(0.55 * (1 - s.darken * 0.8));
    }

    // --- exhaust ------------------------------------------------------------
    smoke.current?.draw(s, (pb) => sequenceAt(pb).travel, { x: L.padX, y: L.padY });

    // --- travelling up into darker air --------------------------------------
    if (gradeRef.current) {
      gradeRef.current.style.opacity = String(s.darken);
    }
    if (trailRef.current) {
      trailRef.current.style.opacity = String(s.trailLine * 0.5);
      trailRef.current.style.transform = `translate3d(${L.padX.toFixed(1)}px, 0, 0)`;
    }

    // --- copy ---------------------------------------------------------------
    if (copyRef.current) {
      copyRef.current.style.transform = `translate3d(0, ${s.copyShift.toFixed(2)}vh, 0)`;
    }
    for (let i = 0; i < 3; i++) {
      const w = wordRefs.current[i];
      if (!w) continue;
      const o = s.words[i];
      w.style.opacity = String(o);
      w.style.transform = `translate3d(0, ${((1 - o) * -9).toFixed(2)}vh, 0)`;
    }
    if (subRef.current) subRef.current.style.opacity = String(s.copyFade);
    if (navRef.current) navRef.current.style.setProperty("--nav-fade", String(s.navFade));

    // --- instrumentation ----------------------------------------------------
    const tel = telemetryRef.current;
    if (tel) {
      const set = (k: string, v: string) => {
        const el = tel.querySelector<HTMLElement>(`[data-f="${k}"]`);
        if (el && el.textContent !== v) el.textContent = v;
      };
      set("clock", clock(s.flight.t));
      set("alt", `${Math.round(s.flight.alt)} M`);
      set("vel", `${Math.round(s.flight.vel)} M/S`);
      set("status", statusLabel(s));
      tel.style.opacity = String(0.55 + 0.45 * Math.min(1, s.p * 6));
      const armed = s.p >= 0.035 && s.p < 0.16;
      tel.dataset.armed = armed ? "true" : "false";
    }

    const ind = indicatorRef.current;
    if (ind) {
      const bar = ind.querySelector<HTMLElement>("[data-bar]");
      if (bar) bar.style.transform = `scaleX(${s.p.toFixed(4)})`;
      const label = ind.querySelector<HTMLElement>("[data-label]");
      const next = s.p < 0.07 ? "SCROLL TO IGNITE" : statusLabel(s);
      if (label && label.textContent !== next) label.textContent = next;
      ind.style.opacity = String(1 - Math.max(0, (s.p - 0.7) / 0.2));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = window.innerWidth < 768;
    const r = createSmokeRenderer(canvas, {
      count: mobile ? 190 : 420,
      spriteUrls: SMOKE_SPRITES,
      flameUrl: "/hero/flame.png",
      maxDpr: mobile ? 1.5 : 2,
    });
    smoke.current = r;

    measure();
    window.addEventListener("resize", measure, { passive: true });
    r.ready.then(() => paint(0));

    return () => {
      window.removeEventListener("resize", measure);
      r.destroy();
      smoke.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollProgress({
    ref: sectionRef,
    onFrame: paint,
    onStatic: paint,
    staticP: 0.06,
  });

  return (
    <section className="hero" ref={sectionRef} aria-label="American Rocketry Challenge">
      <div className="hero__pin">
        <div className="hero__scene" ref={sceneRef}>
          {/* The plate is sized and offset by hand every frame so the horizon
              lands where the sequence expects it; next/image's own layout would
              fight that. Same for the airframe below. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__plate"
            ref={plateRef}
            src="/hero/plate.jpg"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <div className="hero__rail" ref={railRef} aria-hidden="true" />
          <canvas className="hero__fx" ref={canvasRef} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__rocket"
            ref={rocketRef}
            src="/hero/rocket.png"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </div>

        <div className="hero__grade" ref={gradeRef} aria-hidden="true" />
        <div className="hero__trail" ref={trailRef} aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />

        <HeroNav ref={navRef} />
        <HeroCopy
          copyRef={copyRef}
          subRef={subRef}
          registerWord={(i, el) => {
            wordRefs.current[i] = el;
          }}
        />
        <Telemetry ref={telemetryRef} />
        <ScrollIndicator ref={indicatorRef} />
      </div>

      <svg className="hero__defs" aria-hidden="true" focusable="false">
        <filter id="arc-vblur" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
        </filter>
      </svg>
    </section>
  );
}
