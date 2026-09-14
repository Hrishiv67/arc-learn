/**
 * Canvas compositor for the launch: pad cloud, trail, the light the motor throws
 * on its own smoke, sparks off the deflector, and the flame.
 *
 * Draw order is physical. Smoke goes down first - the pad cloud at the base and
 * the trail the rocket lays down below its nozzle. The motor's light falls on
 * it, sparks spray off the blast deflector, and the flame burns through all of
 * that. The ground is in front of the pad, so no flame is drawn below it.
 *
 * Smoke composites with ordinary alpha - additive smoke glows, which is the
 * fastest way to make real smoke look fake. Everything that genuinely emits
 * light (flame, sparks, the ignition flash, the glow on the smoke) is additive.
 *
 * Every value here is a function of scroll progress, flicker included, so
 * scrubbing backwards replays the launch exactly.
 */

import {
  buildField,
  buildSparks,
  puffAt,
  sparkAt,
  type Puff,
  type Spark,
} from "./particles";
import type { SceneState } from "./launchSequence";

export type SmokeOpts = {
  count: number;
  sparkCount: number;
  spriteUrls: string[];
  flameUrl: string;
  maxDpr: number;
};

export type LaunchPad = {
  /** launch point, CSS px */
  x: number;
  y: number;
  /** drawn width of the airframe, CSS px - the exhaust is sized from it */
  rocketW: number;
};

export type SmokeRenderer = {
  draw: (
    s: SceneState,
    travelAt: (p: number) => number,
    pad: LaunchPad,
  ) => void;
  resize: () => void;
  destroy: () => void;
  ready: Promise<void>;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/**
 * Deterministic flicker in roughly [0.65, 1]: three incommensurate frequencies
 * of scroll progress. Never visibly periodic, identical on every replay.
 */
function flicker(p: number, seed: number): number {
  const n =
    0.5 * Math.sin(p * 947 + seed) +
    0.3 * Math.sin(p * 2203 + seed * 1.7) +
    0.2 * Math.sin(p * 5711 + seed * 2.3);
  return 0.825 + 0.175 * n;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(img);
    img.src = src;
  });
}

/**
 * Feather the flame matte. The source photograph's exhaust runs off the bottom
 * and sides of its crop, and once the flame is drawn long that showed as a flat
 * cut across its tail and a faint box around it. Fading the tail and the outer
 * edges once, at load, leaves a flame that tapers out on its own.
 */
function featherFlame(img: HTMLImageElement): HTMLCanvasElement | null {
  if (!img.width) return null;
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d");
  if (!g) return null;
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = "destination-in";

  const down = g.createLinearGradient(0, 0, 0, c.height);
  down.addColorStop(0, "#000");
  down.addColorStop(0.6, "#000");
  down.addColorStop(0.85, "rgba(0,0,0,0.35)");
  down.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = down;
  g.fillRect(0, 0, c.width, c.height);

  const across = g.createLinearGradient(0, 0, c.width, 0);
  across.addColorStop(0, "rgba(0,0,0,0)");
  across.addColorStop(0.2, "#000");
  across.addColorStop(0.8, "#000");
  across.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = across;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

export function createSmokeRenderer(
  canvas: HTMLCanvasElement,
  opts: SmokeOpts,
): SmokeRenderer {
  const ctx = canvas.getContext("2d", { alpha: true })!;
  let W = 0;
  let H = 0;

  const field: Puff[] = buildField(opts.count, opts.spriteUrls.length);
  const ground = field.filter((q) => !q.column);
  const column = field.filter((q) => q.column);
  const sparks: Spark[] = buildSparks(opts.sparkCount);

  let sprites: HTMLImageElement[] = [];
  let flame: HTMLCanvasElement | null = null;

  const ready = Promise.all([
    Promise.all(opts.spriteUrls.map(loadImage)),
    loadImage(opts.flameUrl),
  ]).then(([s, f]) => {
    sprites = s;
    flame = featherFlame(f);
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const drawPuffs = (
    list: Puff[],
    s: SceneState,
    travelAt: (p: number) => number,
    px: number,
    py: number,
    unit: number,
  ) => {
    for (let i = 0; i < list.length; i++) {
      const f = puffAt(list[i], s.p, travelAt);
      if (!f) continue;
      const img = sprites[f.sprite];
      if (!img || !img.width) continue;

      const size = f.size * unit;
      ctx.globalAlpha = f.alpha;
      ctx.save();
      ctx.translate(px + f.x * unit, py + f.y * unit);
      ctx.rotate(f.rot);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  };

  /** A soft glow, optionally squashed or stretched vertically. */
  const glowAt = (
    x: number,
    y: number,
    radius: number,
    yScale: number,
    stops: Array<[number, string]>,
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, yScale);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    for (const [at, colour] of stops) g.addColorStop(at, colour);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const draw = (
    s: SceneState,
    travelAt: (p: number) => number,
    pad: LaunchPad,
  ) => {
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (s.p < 0.128) return;

    const unit = H / 100; // 1 vh
    const px = pad.x;
    const py = pad.y;
    const rw = Math.max(8, pad.rocketW);
    // the nozzle climbs with the rocket
    const nozzleY = py - s.travel * unit;
    // The ground is in front of the pad. A short tongue of flame can splash past
    // the foot of the rail; anything lower would be shining up through the grass.
    const groundY = py + 3 * unit;

    // The flame holds from ignition until the rocket has left frame. A real
    // motor burns out about a second in, which at this distance is barely off
    // the rail - and a rocket coasting out of shot unlit reads as a dud.
    const thrust = s.plume;
    const fl = flicker(s.p, 1.3);
    // 0 standing on the rail, 1 once it is properly climbing
    const climb = Math.min(1, s.travel / 30);

    // --- smoke ---------------------------------------------------------------
    ctx.globalCompositeOperation = "source-over";
    drawPuffs(ground, s, travelAt, px, py, unit);
    // The trail forms below the nozzle, so it goes under the flame. Drawn on
    // top, it laid a grey disc over the white-hot exit.
    drawPuffs(column, s, travelAt, px, py, unit);

    ctx.globalCompositeOperation = "lighter";

    // --- the motor lighting its own smoke ------------------------------------
    // Strongest while the rocket is low enough to light the ground; gone once
    // it has climbed away. This is most of what makes ignition read as fire.
    const low = 1 - span(s.travel, 0, 32);
    const light = Math.max(s.flash, thrust * low) * fl;
    if (light > 0.01) {
      glowAt(px, py - 1.5 * unit, (16 + 12 * light) * unit, 0.42, [
        [0, `rgba(255,190,120,${(0.55 * light).toFixed(3)})`],
        [0.45, `rgba(255,150,80,${(0.22 * light).toFixed(3)})`],
        [1, "rgba(255,130,60,0)"],
      ]);
    }

    // --- sparks off the deflector --------------------------------------------
    ctx.lineCap = "round";
    for (let i = 0; i < sparks.length; i++) {
      const f = sparkAt(sparks[i], s.p);
      if (!f) continue;
      const len = f.len * unit;
      const mag = Math.hypot(f.dx, f.dy) || 1;
      const hx = px + f.x * unit;
      const hy = py + f.y * unit;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = `rgba(255,${Math.round(190 + 60 * f.hot)},${Math.round(
        120 + 110 * f.hot,
      )},${f.alpha.toFixed(3)})`;
      ctx.lineWidth = 1 + 1.4 * f.hot;
      ctx.beginPath();
      ctx.moveTo(hx - (f.dx / mag) * len, hy - (f.dy / mag) * len);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    }

    // --- flame ---------------------------------------------------------------
    if (thrust > 0.01) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, groundY);
      ctx.clip();

      // Sized from the drawn airframe, so the thicker rocket gets a flame to
      // match. Short and broad on the rail, stretching into a long column as
      // the rocket picks up speed, flickering in length and width.
      const aspect = flame && flame.width ? flame.width / flame.height : 0.375;
      const w = rw * (0.5 + 0.1 * climb) * (0.94 + 0.12 * fl);
      const len = (w / aspect) * (0.8 + 1.4 * climb) * (0.88 + 0.24 * fl);

      // A halo of light around the flame. Without it the matted flame reads as
      // a sticker; with it, it is the brightest thing in the frame. Kept tight
      // to the flame - drawn wide, it read as a tinted box once the flame grew.
      glowAt(px, nozzleY + len * 0.28, rw * 0.5, 1.4 + 2.2 * climb, [
        [0, `rgba(255,236,200,${(0.6 * thrust * fl).toFixed(3)})`],
        [0.25, `rgba(255,186,110,${(0.26 * thrust * fl).toFixed(3)})`],
        [0.6, `rgba(255,150,70,${(0.07 * thrust * fl).toFixed(3)})`],
        [1, "rgba(255,140,60,0)"],
      ]);

      if (flame && flame.width) {
        ctx.globalAlpha = Math.min(1, thrust);
        ctx.drawImage(flame, px - w / 2, nozzleY - len * 0.04, w, len);
        // A narrower second pass. Added onto the first it saturates the core to
        // white and leaves the edges orange - a hot composite motor, not a candle.
        ctx.globalAlpha = Math.min(1, thrust * 0.85);
        ctx.drawImage(
          flame,
          px - w * 0.3,
          nozzleY - len * 0.03,
          w * 0.6,
          len * 0.62,
        );
      }

      // white-hot at the nozzle exit itself
      glowAt(px, nozzleY + 0.4 * unit, rw * 0.26, 1.35, [
        [0, `rgba(255,255,245,${(0.95 * thrust).toFixed(3)})`],
        [1, "rgba(255,220,170,0)"],
      ]);
      ctx.restore();
    }

    // --- ignition flash ------------------------------------------------------
    if (s.flash > 0.01) {
      glowAt(px, nozzleY, (3 + 26 * s.flash) * unit, 1, [
        [0, `rgba(255,248,228,${(0.95 * s.flash).toFixed(3)})`],
        [0.35, `rgba(255,196,120,${(0.5 * s.flash).toFixed(3)})`],
        [1, "rgba(255,170,90,0)"],
      ]);
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  };

  const onResize = () => resize();
  window.addEventListener("resize", onResize, { passive: true });

  return {
    draw,
    resize,
    ready,
    destroy: () => window.removeEventListener("resize", onResize),
  };
}
