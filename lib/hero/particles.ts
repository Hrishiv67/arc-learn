/**
 * Photographic smoke field, and the sparks thrown off the pad at ignition.
 *
 * The smoke particles are real matted puffs cut from the source launch
 * photograph, so this module only decides where each one is, how big, and how
 * opaque. Sparks are short streaks of light and carry no image.
 *
 * Everything is a closed form of scroll progress. A particle's whole life is
 * determined by its seed and its birth progress, never by integrating frame to
 * frame - because the user can scroll backwards at any speed, and an
 * accumulating simulation desynchronises the instant they do. Evaluating
 * analytically also makes the result frame-rate independent.
 *
 * Units are vh (1 = 1% of viewport height) relative to the pad, x positive right
 * and y positive down, so the field composes the same way at any window size.
 */

export type Puff = {
  /** scroll progress at which this puff is born */
  pb: number;
  /** false = ground cloud rolling across the grass, true = trail behind the rocket */
  column: boolean;
  ox: number;
  oy: number;
  reachX: number;
  reachY: number;
  /** drag time constant, in progress units */
  tau: number;
  buoy: number;
  life: number;
  size0: number;
  grow: number;
  rot: number;
  rotRate: number;
  sprite: number;
  density: number;
};

export type PuffFrame = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rot: number;
  sprite: number;
};

/** Deterministic PRNG - identical field on every load and in every direction. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildField(count: number, sprites: number, seed = 0x5eed): Puff[] {
  const rnd = mulberry32(seed);
  const out: Puff[] = [];
  const groundShare = 0.5;

  for (let i = 0; i < count; i++) {
    const column = i / count >= groundShare;

    if (column) {
      // The trail, laid down at the height the rocket was at when each puff was
      // born. The rocket accelerates hard (travel goes as the 3.4th power of
      // scroll), so births are bunched late by the inverse power: that spreads
      // them evenly up the frame instead of piling them at the pad, and the
      // rocket draws one continuous line up out of shot. Small and tight at the
      // nozzle, swelling behind it.
      out.push({
        pb: 0.21 + 0.2 * Math.pow(rnd(), 0.3),
        column: true,
        ox: (rnd() - 0.5) * 2,
        oy: 0,
        reachX: (rnd() - 0.5) * 9,
        reachY: -(1 + rnd() * 6),
        tau: 0.08 + rnd() * 0.18,
        buoy: 1 + rnd() * 3,
        life: 0.22 + rnd() * 0.35,
        size0: 2.5 + rnd() * 4,
        grow: 1.2 + rnd() * 2.4,
        rot: rnd() * Math.PI * 2,
        rotRate: (rnd() - 0.5) * 1.5,
        sprite: Math.floor(rnd() * sprites),
        density: 0.12 + rnd() * 0.16,
      });
    } else {
      const dir = rnd() < 0.5 ? -1 : 1;
      // Births cluster hard at ignition, then thin out - that is what makes the
      // pad cloud erupt rather than fade up. A pad cloud spreads sideways far
      // more than it rises: that race across the grass is the signature of a
      // launch seen from low down.
      out.push({
        pb: 0.13 + Math.pow(rnd(), 2.1) * 0.3,
        column: false,
        ox: (rnd() - 0.5) * 5,
        oy: -(rnd() * 2),
        reachX: dir * (9 + Math.pow(rnd(), 0.7) * 48),
        reachY: -(0.5 + rnd() * 5),
        tau: 0.08 + rnd() * 0.2,
        buoy: 0.4 + rnd() * 1.8,
        life: 0.34 + rnd() * 0.52,
        size0: 6.5 + rnd() * 10,
        grow: 0.6 + rnd() * 1.5,
        rot: rnd() * Math.PI * 2,
        rotRate: (rnd() - 0.5) * 0.8,
        sprite: Math.floor(rnd() * sprites),
        density: 0.1 + rnd() * 0.2,
      });
    }
  }
  return out;
}

/**
 * Evaluate one puff at progress p.
 * `travelAt` supplies the rocket's height so trail puffs are laid down along the
 * path it actually took, leaving a trail rather than a plume stuck to the pad.
 * Returns null when the puff has not been born or has fully dissipated.
 */
export function puffAt(
  q: Puff,
  p: number,
  travelAt: (p: number) => number,
): PuffFrame | null {
  const age = p - q.pb;
  if (age <= 0 || age >= q.life) return null;

  const d = 1 - Math.exp(-age / q.tau);
  const originY = q.column ? -travelAt(q.pb) : 0;

  const x = q.ox + q.reachX * d;
  const y = originY + q.oy + q.reachY * d - q.buoy * age;
  const size = q.size0 * (1 + q.grow * age);

  const n = age / q.life;
  const fadeIn = Math.min(1, n / 0.12);
  const fadeOut = 1 - Math.pow(Math.max(0, (n - 0.35) / 0.65), 1.5);
  const alpha = Math.max(0, fadeIn * fadeOut * q.density);
  if (alpha <= 0.004) return null;

  return { x, y, size, alpha, rot: q.rot + q.rotRate * age, sprite: q.sprite };
}

export type Spark = {
  pb: number;
  /** initial velocity, vh per unit progress */
  vx: number;
  vy: number;
  /** drag time constant, in progress units */
  drag: number;
  life: number;
  /** streak length, vh */
  len: number;
};

export type SparkFrame = {
  x: number;
  y: number;
  /** instantaneous velocity, for the direction of the streak */
  dx: number;
  dy: number;
  alpha: number;
  /** 1 at birth, 0 at death - how white-hot it still is */
  hot: number;
  len: number;
};

/**
 * Sparks thrown off the blast deflector at ignition. Most skim outward, low
 * across the pad; a few fan upward. Same rules as the smoke: a seeded,
 * closed-form path each, so the burst replays identically in both directions.
 */
export function buildSparks(count: number, seed = 0x5a4b): Spark[] {
  const rnd = mulberry32(seed);
  const out: Spark[] = [];
  for (let i = 0; i < count; i++) {
    const low = rnd() < 0.7;
    const side = rnd() < 0.5 ? -1 : 1;
    // y is positive downward, so an upward heading has a negative angle
    const lift = 0.05 + rnd() * 0.4;
    const angle = low
      ? side > 0
        ? -lift
        : Math.PI + lift
      : -Math.PI / 2 + (rnd() - 0.5) * 1.6;
    const speed = 160 + rnd() * 420;
    out.push({
      pb: 0.13 + Math.pow(rnd(), 1.8) * 0.085,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      drag: 0.012 + rnd() * 0.022,
      life: 0.018 + rnd() * 0.05,
      len: 0.5 + rnd() * 1.6,
    });
  }
  return out;
}

/** vh per progress squared - enough to arc the sparks back down onto the grass */
const SPARK_GRAVITY = 1100;

export function sparkAt(q: Spark, p: number): SparkFrame | null {
  const age = p - q.pb;
  if (age <= 0 || age >= q.life) return null;

  const e = Math.exp(-age / q.drag);
  const reach = q.drag * (1 - e);
  const x = q.vx * reach;
  // clamp at the ground line so nothing sinks into the field
  const y = Math.min(1.5, q.vy * reach + SPARK_GRAVITY * age * age);
  const dx = q.vx * e;
  const dy = q.vy * e + 2 * SPARK_GRAVITY * age;

  const hot = 1 - age / q.life;
  return {
    x,
    y,
    dx,
    dy,
    alpha: Math.pow(hot, 1.4),
    hot,
    len: q.len * (0.35 + 0.65 * hot),
  };
}
