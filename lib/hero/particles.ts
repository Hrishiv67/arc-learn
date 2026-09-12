/**
 * Photographic smoke field.
 *
 * The particles are real matted puffs cut from the source launch photograph, so
 * this module only decides where each one is, how big, and how opaque.
 *
 * Everything is a closed form of scroll progress. A particle's whole life is
 * determined by its seed and its birth progress, never by integrating frame to
 * frame — because the user can scroll backwards at any speed, and an
 * accumulating simulation desynchronises the instant they do. Evaluating
 * analytically also makes the result frame-rate independent.
 *
 * Units are vh (1 = 1% of viewport height) relative to the pad, x positive right
 * and y positive down, so the field composes the same way at any window size.
 */

export type Puff = {
  /** scroll progress at which this puff is born */
  pb: number;
  /** 0 = ground pancake rolling across the grass, 1 = column following the rocket */
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

/** Deterministic PRNG — identical field on every load and in every direction. */
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
  const groundShare = 0.62;

  for (let i = 0; i < count; i++) {
    const column = i / count >= groundShare;
    // Births cluster hard at ignition, then thin out — that is what makes the
    // pad cloud erupt rather than fade up.
    const u = rnd();
    const pb = column
      ? 0.16 + Math.pow(rnd(), 0.85) * 0.46
      : 0.15 + Math.pow(u, 2.1) * 0.34;

    if (column) {
      out.push({
        pb,
        column: true,
        ox: (rnd() - 0.5) * 3.5,
        oy: 0,
        reachX: (rnd() - 0.5) * 16,
        reachY: -(6 + rnd() * 22),
        tau: 0.1 + rnd() * 0.22,
        buoy: 2 + rnd() * 7,
        life: 0.3 + rnd() * 0.5,
        size0: 3 + rnd() * 5.5,
        grow: 0.7 + rnd() * 1.6,
        rot: rnd() * Math.PI * 2,
        rotRate: (rnd() - 0.5) * 1.5,
        sprite: Math.floor(rnd() * sprites),
        density: 0.05 + rnd() * 0.13,
      });
    } else {
      const dir = rnd() < 0.5 ? -1 : 1;
      // A pad cloud spreads sideways far more than it rises — that horizontal
      // race across the grass is the signature of a launch seen from low down.
      out.push({
        pb,
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
 * `travelAt` supplies the rocket's height so column puffs are laid down along
 * the path it actually took, leaving a trail rather than a plume stuck to the pad.
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
