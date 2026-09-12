"use client";

import { useRef } from "react";
import Link from "next/link";
import { useScrollProgress } from "@/lib/hero/useScrollProgress";

/**
 * The vehicle, taken apart.
 *
 * The hero ends with the rocket gone. This section brings the same airframe
 * back as a schematic and pulls it into its sections — the documentary cut from
 * footage to technical drawing. Each section is a real part, and each part is a
 * module, so the thing that just flew turns out to be the syllabus.
 *
 * The parts are Y-slices of the same matted photograph the hero flies, so there
 * is no second illustration style anywhere on the page.
 */

type Part = {
  id: string;
  /** nose-to-tail placement on the assembled vehicle, as fractions */
  top: number;
  height: number;
  name: string;
  moduleNumber: string;
  moduleTitle: string;
  slug: string;
};

const PARTS: Part[] = [
  {
    id: "nose",
    top: 0,
    height: 0.18,
    name: "Nose cone",
    moduleNumber: "07",
    moduleTitle: "Drag and altitude",
    slug: "drag-and-altitude",
  },
  {
    id: "payload",
    top: 0.18,
    height: 0.18,
    name: "Payload bay",
    moduleNumber: "10",
    moduleTitle: "Recovery and the egg",
    slug: "recovery-and-the-egg",
  },
  {
    id: "body-upper",
    top: 0.36,
    height: 0.21,
    name: "Body tube",
    moduleNumber: "04",
    moduleTitle: "Anatomy of a rocket",
    slug: "anatomy-of-a-rocket",
  },
  {
    id: "body-lower",
    top: 0.57,
    height: 0.205,
    name: "Recovery bay",
    moduleNumber: "09",
    moduleTitle: "Building it",
    slug: "building-it",
  },
  {
    id: "fincan",
    top: 0.775,
    height: 0.225,
    name: "Fin can and motor",
    moduleNumber: "05",
    moduleTitle: "Why rockets fly straight",
    slug: "why-rockets-fly-straight",
  },
];

/**
 * The assembled height lives in CSS as --vehicle-h (hero.css), so the responsive
 * override has to move the parts too. Everything positional here is expressed as
 * a fraction of that variable rather than a number duplicated on both sides.
 */
/** How far the outermost sections travel apart, in vh. */
const SPREAD_VH = 5.5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function VehicleExploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const partRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRefs = useRef<Array<HTMLLIElement | null>>([]);
  const introRef = useRef<HTMLDivElement>(null);

  const paint = (q: number) => {
    const H = window.innerHeight;
    const unit = H / 100;
    const mid = (PARTS.length - 1) / 2;

    // The vehicle arrives from above, still carrying the launch's momentum,
    // and decelerates into the frame rather than fading in.
    const entry = smooth(span(q, 0, 0.2));
    const stage = stageRef.current;
    if (stage) {
      const y = (1 - entry) * -78 * unit;
      stage.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      stage.style.opacity = String(Math.min(1, entry * 1.6));
    }

    const spread = smooth(span(q, 0.18, 0.66)) * SPREAD_VH;
    const drift = Math.pow(span(q, 0.82, 1), 1.6) * -10;

    for (let i = 0; i < PARTS.length; i++) {
      const el = partRefs.current[i];
      if (el) {
        const offset = (i - mid) * spread + drift;
        el.style.transform = `translate3d(0, ${(offset * unit).toFixed(1)}px, 0)`;
      }
      const label = labelRefs.current[i];
      if (label) {
        // labels resolve one after another, top down, as the gaps open
        const o = span(q, 0.26 + i * 0.055, 0.4 + i * 0.055);
        label.style.opacity = String(o);
        label.style.transform = `translate3d(${((1 - o) * 14).toFixed(1)}px, ${(
          ((i - mid) * spread + drift) *
          unit
        ).toFixed(1)}px, 0)`;
      }
    }

    if (introRef.current) {
      introRef.current.style.opacity = String(span(q, 0.04, 0.22));
    }
  };

  useScrollProgress({
    ref: sectionRef,
    onFrame: paint,
    onStatic: paint,
    staticP: 0.72,
  });

  return (
    <section className="vehicle" ref={sectionRef} aria-label="The vehicle">
      <div className="vehicle__pin">
        <div className="vehicle__intro" ref={introRef}>
          <p className="vehicle__eyebrow">02 / The vehicle</p>
          <h2 className="vehicle__title">
            You don&rsquo;t take a course.
            <br />
            You build a rocket.
          </h2>
          <p className="vehicle__lede">
            Every module earns one section of the airframe. Finish all thirteen
            and the vehicle you assembled is the one that flies.
          </p>
        </div>

        <div className="vehicle__stage" ref={stageRef} aria-hidden="true">
          {PARTS.map((part, i) => (
            <div
              key={part.id}
              className="vehicle__part"
              ref={(el) => {
                partRefs.current[i] = el;
              }}
              style={{
                top: `calc(var(--vehicle-h) * ${part.top})`,
                height: `calc(var(--vehicle-h) * ${part.height})`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/hero/section-${part.id}.png`} alt="" draggable={false} />
            </div>
          ))}
        </div>

        <ul className="vehicle__labels">
          {PARTS.map((part, i) => (
            <li
              key={part.id}
              className="vehicle__label"
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              style={{
                top: `calc(50vh - var(--vehicle-h) / 2 + var(--vehicle-h) * ${(
                  part.top +
                  part.height / 2
                ).toFixed(4)})`,
              }}
            >
              <span className="vehicle__leader" aria-hidden="true" />
              <Link className="vehicle__labelBody" href={`/modules/${part.slug}`}>
                <span className="vehicle__partName">{part.name}</span>
                <span className="vehicle__partModule">
                  Module {part.moduleNumber} · {part.moduleTitle}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
