/**
 * Flight model for an American Rocketry Challenge vehicle.
 *
 * ARC 2027 mission: two raw Grade A Large eggs to 800 ft (244 m), 37-40 s aloft.
 * Modelled as a 0.62 kg vehicle under constant thrust to burnout, then a coast
 * against gravity and quadratic drag. Both phases have closed forms, so any
 * time can be evaluated directly — no integration, no accumulated state, and
 * identical results whether the user scrolls forward or backward.
 */

export const BURN_TIME = 1.05; // s, motor burn
export const V_BURNOUT = 78; // m/s at burnout
export const A_POWERED = V_BURNOUT / BURN_TIME; // 74.3 m/s^2
export const ALT_BURNOUT = 0.5 * A_POWERED * BURN_TIME * BURN_TIME; // 41.0 m

const G = 9.81;
/** Drag term k = ½ρC_dA/m, tuned so apogee lands on the 244 m mission target. */
const K = 0.002;

const V_TERM = Math.sqrt(G / K); // 70.0 m/s
const RATE = Math.sqrt(G * K); // 0.140 /s
const PHASE0 = Math.atan(V_BURNOUT / V_TERM);

/** Time from liftoff to apogee (s). ~7.0 s for this vehicle. */
export const T_APOGEE = BURN_TIME + PHASE0 / RATE;

export type FlightState = {
  /** seconds relative to liftoff; negative is the hold */
  t: number;
  /** metres above the pad */
  alt: number;
  /** m/s, vertical */
  vel: number;
  /** the milestone that has most recently occurred */
  event: "HOLD" | "IGNITION" | "LIFTOFF" | "BURNOUT" | "ASCENT";
};

export function flightAt(t: number): FlightState {
  if (t <= 0) {
    return { t, alt: 0, vel: 0, event: "HOLD" };
  }

  if (t <= BURN_TIME) {
    const vel = A_POWERED * t;
    const alt = 0.5 * A_POWERED * t * t;
    return { t, alt, vel, event: t < 0.12 ? "IGNITION" : "LIFTOFF" };
  }

  // Coast: dv/dt = -(g + k v²) has the closed form below, valid to apogee.
  const tc = Math.min(t - BURN_TIME, PHASE0 / RATE);
  const vel = V_TERM * Math.tan(PHASE0 - RATE * tc);
  const alt =
    ALT_BURNOUT +
    (1 / (2 * K)) *
      Math.log(
        (1 + (K * V_BURNOUT * V_BURNOUT) / G) / (1 + (K * vel * vel) / G),
      );

  return { t, alt, vel: Math.max(vel, 0), event: "BURNOUT" };
}

/** Formats seconds as the range clock: T-00:03 / T+00:04.21 */
export function clock(t: number): string {
  const sign = t < 0 ? "−" : "+";
  const a = Math.abs(t);
  const mm = Math.floor(a / 60);
  const ss = a - mm * 60;
  if (t < 0) {
    return `T${sign}${String(mm).padStart(2, "0")}:${String(Math.ceil(ss)).padStart(2, "0")}`;
  }
  return `T${sign}${String(mm).padStart(2, "0")}:${ss.toFixed(2).padStart(5, "0")}`;
}
