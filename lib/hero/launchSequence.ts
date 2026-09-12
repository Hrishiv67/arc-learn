/**
 * Scroll progress -> scene state.
 *
 * Pure and total: every value the hero renders is derived here from a single
 * number in [0,1]. Nothing accumulates, so scrubbing backwards is exact.
 *
 * Telemetry follows the real flight model. Screen motion does not: a rocket 4 m
 * from the lens physically leaves frame in under three metres of altitude, which
 * would put it gone by 32% scroll. So the vehicle's on-screen travel runs on a
 * tuned acceleration curve while the numbers stay honest — the brief's
 * "believable progression", not a literal simulation.
 */

import { flightAt, type FlightState } from "./flightModel";

export type Phase = "hold" | "ignition" | "liftoff" | "ascent" | "transition";

/** Phase boundaries in scroll progress, and the flight time each maps to. */
const KEYS: Array<{ p: number; t: number; phase: Phase }> = [
  { p: 0.0, t: -3.0, phase: "hold" },
  { p: 0.1, t: 0.0, phase: "ignition" },
  { p: 0.22, t: 0.45, phase: "liftoff" },
  { p: 0.38, t: 1.4, phase: "ascent" },
  { p: 0.62, t: 2.8, phase: "transition" },
  { p: 1.0, t: 4.21, phase: "transition" },
];

/** Scroll progress at which the vehicle has fully cleared the top of frame. */
const P_MOVE_START = 0.22;
const P_GONE = 0.5;
const TRAVEL_GONE = 130; // vh, enough to carry the whole airframe out

export type SceneState = {
  p: number;
  phase: Phase;
  flight: FlightState;

  /** vh the vehicle has travelled up the frame from its position on the rail */
  travel: number;
  /** 1 at rest, shrinking as it recedes */
  rocketScale: number;
  /** px of vertical-only motion blur */
  rocketBlur: number;
  /** 0..1, the vehicle fading into haze as it outruns the lens */
  rocketFade: number;

  /** particles emitted per unit time, 0..1 */
  smokeRate: number;
  /** 0..1 ignition flash at the nozzle */
  flash: number;
  /** 0..1 visibility of the exhaust plume sprite */
  plume: number;

  /** px, physical camera vibration; never applied to UI text */
  shake: number;

  /** 0..1 how far the frame has travelled into darker air */
  darken: number;
  /** 0..1 opacity of the trajectory rule that carries into the next section */
  trailLine: number;

  /** per-word opacity for BUILD / TEST / FLY */
  words: [number, number, number];
  /** vh the copy column has drifted up */
  copyShift: number;
  /** 0..1 */
  copyFade: number;
  navFade: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Normalised position within [a,b], clamped. */
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/** Smooth, no overshoot — nothing in this scene is allowed to bounce. */
const smooth = (v: number) => v * v * (3 - 2 * v);

function timeAt(p: number): { t: number; phase: Phase } {
  for (let i = KEYS.length - 1; i >= 0; i--) {
    const k = KEYS[i];
    if (p >= k.p || i === 0) {
      const next = KEYS[Math.min(i + 1, KEYS.length - 1)];
      if (next === k) return { t: k.t, phase: k.phase };
      const f = span(p, k.p, next.p);
      return { t: k.t + (next.t - k.t) * f, phase: k.phase };
    }
  }
  return { t: KEYS[0].t, phase: "hold" };
}

export function sequenceAt(pRaw: number): SceneState {
  const p = clamp01(pRaw);
  const { t, phase } = timeAt(p);
  const flight = flightAt(t);

  // --- vehicle ------------------------------------------------------------
  // Aggressive, monotonic acceleration. Exponent 2.6 keeps the first moments
  // almost imperceptible, then the vehicle outruns the eye.
  const rise = span(p, P_MOVE_START, P_GONE);
  const travel = TRAVEL_GONE * Math.pow(rise, 3);

  // derivative of travel, for blur — high speed smears along one axis only
  const dTravel =
    rise <= 0
      ? 0
      : (TRAVEL_GONE * 3 * Math.pow(rise, 2)) / (P_GONE - P_MOVE_START);
  const rocketBlur = Math.min(14, (dTravel / 400) * 14);
  const rocketScale = 1 / (1 + travel / 260);
  const rocketFade = 1 - span(p, 0.44, 0.56);

  // --- ignition and smoke -------------------------------------------------
  const flash = Math.pow(1 - span(p, 0.1, 0.135), 2) * (p >= 0.1 ? 1 : 0);
  const plume = span(p, 0.105, 0.15) * (1 - span(p, 0.46, 0.58));
  // hardest emission through ignition and liftoff, trailing off in ascent
  const smokeRate =
    span(p, 0.1, 0.155) * (1 - 0.55 * span(p, 0.32, 0.5)) * (1 - span(p, 0.5, 0.74));

  // Physical vibration from a nearby motor: ramps in at ignition, decays as the
  // vehicle climbs away. Sub-pixel to ~2px, never a game-style screen shake.
  const shake =
    2.4 * smooth(span(p, 0.1, 0.18)) * (1 - 0.75 * span(p, 0.22, 0.48));

  // --- frame travelling up into thinner, darker air -----------------------
  const darken = smooth(span(p, 0.6, 0.94));
  const trailLine = span(p, 0.48, 0.68) * (1 - 0.15 * span(p, 0.95, 1));

  // --- copy ---------------------------------------------------------------
  // Each word leaves as the vehicle crosses its own baseline, bottom word last.
  const words: [number, number, number] = [
    1 - span(p, 0.4, 0.49),
    1 - span(p, 0.435, 0.525),
    1 - span(p, 0.47, 0.56),
  ];
  const copyShift = -1.2 * span(p, 0, 0.22) - 16 * Math.pow(span(p, 0.34, 0.68), 1.8);
  const copyFade = 1 - span(p, 0.42, 0.6);
  const navFade = 1 - 0.75 * span(p, 0.1, 0.2) - 0.25 * span(p, 0.7, 0.88);

  return {
    p,
    phase,
    flight,
    travel,
    rocketScale,
    rocketBlur,
    rocketFade,
    smokeRate,
    flash,
    plume,
    shake,
    darken,
    trailLine,
    words,
    copyShift,
    copyFade,
    navFade,
  };
}

/** The status word shown beside the vehicle. */
export function statusLabel(s: SceneState): string {
  if (s.p < 0.05) return "READY";
  if (s.p < 0.1) return "ARMED";
  if (s.p < 0.22) return "IGNITION";
  if (s.flight.t < 1.05) return "LIFTOFF";
  if (s.p < 0.62) return "BURNOUT";
  return "ASCENT NOMINAL";
}
