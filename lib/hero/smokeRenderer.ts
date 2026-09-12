/**
 * Canvas compositor for the exhaust: ground cloud, ignition flash, plume, trail.
 *
 * Draw order matters physically. The pad cloud sits nearest the camera at the
 * base, the plume burns through it, and the column the vehicle leaves behind
 * rides in front of both. Smoke composites with ordinary alpha — additive would
 * make it glow, which is the single fastest way to make real smoke look fake.
 * Only the ignition flash is additive, because that is genuinely emissive.
 */

import { buildField, puffAt, type Puff } from "./particles";
import type { SceneState } from "./launchSequence";

export type SmokeOpts = {
  count: number;
  spriteUrls: string[];
  flameUrl: string;
  maxDpr: number;
};

export type SmokeRenderer = {
  /** `pad` is the launch point in CSS pixels, supplied per frame by the layout. */
  draw: (
    s: SceneState,
    travelAt: (p: number) => number,
    pad: { x: number; y: number },
  ) => void;
  resize: () => void;
  destroy: () => void;
  ready: Promise<void>;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(img);
    img.src = src;
  });
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

  let sprites: HTMLImageElement[] = [];
  let flame: HTMLImageElement | null = null;

  const ready = Promise.all([
    Promise.all(opts.spriteUrls.map(loadImage)),
    loadImage(opts.flameUrl),
  ]).then(([s, f]) => {
    sprites = s;
    flame = f;
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

  const draw = (
    s: SceneState,
    travelAt: (p: number) => number,
    pad: { x: number; y: number },
  ) => {
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (s.p < 0.068) return;

    const unit = H / 100; // 1 vh
    const px = pad.x;
    const py = pad.y;
    // the nozzle climbs with the vehicle
    const nozzleY = py - s.travel * unit;

    ctx.globalCompositeOperation = "source-over";
    drawPuffs(ground, s, travelAt, px, py, unit);

    // plume: real matted exhaust, stretched under the nozzle and pinned to it
    if (s.plume > 0.01 && flame && flame.width) {
      const h = (6 + 15 * Math.min(1, s.travel / 40)) * unit;
      const w = h * (flame.width / flame.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = s.plume * 0.8;
      ctx.drawImage(flame, px - w / 2, nozzleY - h * 0.06, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    // ignition flash — brief, emissive, at the nozzle
    if (s.flash > 0.01) {
      const r = (3 + 26 * s.flash) * unit;
      const g = ctx.createRadialGradient(px, nozzleY, 0, px, nozzleY, r);
      g.addColorStop(0, `rgba(255,248,228,${0.95 * s.flash})`);
      g.addColorStop(0.35, `rgba(255,196,120,${0.5 * s.flash})`);
      g.addColorStop(1, "rgba(255,170,90,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, nozzleY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    drawPuffs(column, s, travelAt, px, py, unit);
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
