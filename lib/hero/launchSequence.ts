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
  { p: 0.07, t: 0.0, phase: "ignition" },
  { p: 0.16, t: 0.45, phase: "liftoff" },
  { p: 0.3, t: 1.4, phase: "ascent" },
  { p: 0.52, t: 2.8, phase: "transition" },
  { p: 1.0, t: 4.21, phase: "transition" },
];

/** Scroll progress at which the vehicle has fully cleared the top of frame. */
const P_MOVE_START = 0.15;
const P_GONE = 0.38;
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

  /**
   * 0..1 the frame washing out to daylight as the vehicle climbs, which is what
   * carries the page from the launch into the paper theme the course is set in.
   */
  washout: number;
  /** 0..1 the course heading arriving inside the pinned frame */
  handoff: number;
  /** 0..1 instrumentation and nav clearing as the frame goes to paper */
  uiFade: number;
  /** 0..1 opacity of the trajectory rule that carries into the next section */
  trailLine: number;

  /** per-word opacity for the headline, in order */
  words: number[];
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
  const travel = TRAVEL_GONE * Math.pow(rise, 3.4);

  // derivative of travel, for blur — high speed smears along one axis only
  const dTravel =
    rise <= 0
      ? 0
      : (TRAVEL_GONE * 3.4 * Math.pow(rise, 2.4)) / (P_GONE - P_MOVE_START);
  const rocketBlur = Math.min(14, (dTravel / 400) * 14);
  const rocketScale = 1 / (1 + travel / 260);
  const rocketFade = 1 - span(p, 0.33, 0.43);

  // --- ignition and smoke -------------------------------------------------
  const flash = Math.pow(1 - span(p, 0.07, 0.1), 2) * (p >= 0.07 ? 1 : 0);
  const plume = span(p, 0.075, 0.11) * (1 - span(p, 0.34, 0.44));
  // hardest emission through ignition and liftoff, trailing off in ascent
  const smokeRate =
    span(p, 0.07, 0.115) * (1 - 0.55 * span(p, 0.24, 0.38)) * (1 - span(p, 0.38, 0.6));

  // Physical vibration from a nearby motor: ramps in at ignition, decays as the
  // vehicle climbs away. Sub-pixel to ~2px, never a game-style screen shake.
  const shake =
    2.6 * smooth(span(p, 0.07, 0.13)) * (1 - 0.75 * span(p, 0.16, 0.36));

  // --- frame travelling up into thinner, darker air -----------------------
  // The launch used to end on an empty sky and then cut to a white page. It now
  // brightens into that page instead, and the course heading arrives while the
  // smoke is still clearing, so there is never a frame with nothing in it.
  const washout = smooth(span(p, 0.34, 0.82));
  // the heading waits for the background to actually be paper before it
  // arrives, or it spends half its life as navy text on a dark sky
  const handoff = smooth(span(p, 0.52, 0.86));
  // everything built to read on the dark plate has to be gone by then
  const uiFade = 1 - span(p, 0.36, 0.62);
  const trailLine = span(p, 0.3, 0.46) * (1 - span(p, 0.6, 0.82));

  // --- copy ---------------------------------------------------------------
  // Each word leaves as the vehicle crosses its own baseline, bottom word last.
  // each line leaves as the vehicle crosses its own baseline, top line first
  const words = [0, 1, 2].map((i) => 1 - span(p, 0.26 + i * 0.03, 0.34 + i * 0.03));
  const copyShift = -1.2 * span(p, 0, 0.15) - 16 * Math.pow(span(p, 0.24, 0.54), 1.8);
  const copyFade = 1 - span(p, 0.26, 0.4);
  const navFade = (1 - 0.75 * span(p, 0.07, 0.15)) * (1 - span(p, 0.36, 0.6));

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
    washout,
    handoff,
    uiFade,
    trailLine,
    words,
    copyShift,
    copyFade,
    navFade,
  };
}

/** The status word shown beside the vehicle. */
export function statusLabel(s: SceneState): string {
  if (s.p < 0.035) return "READY";
  if (s.p < 0.07) return "ARMED";
  if (s.p < 0.16) return "IGNITION";
  if (s.flight.t < 1.05) return "LIFTOFF";
  if (s.p < 0.52) return "BURNOUT";
  return "ASCENT NOMINAL";
}
