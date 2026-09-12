"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UNITS } from "@/content/modules/registry";
import {
  SECTIONS,
  sectionIndexForModule,
} from "@/lib/vehicle/sections";

/**
 * The course, which is the point of the site.
 *
 * The launch above is what gets a student to scroll; this is what they came for,
 * so it gets the same care — the real thirteen modules, in the real four units,
 * with what each one actually teaches.
 *
 * The exploded vehicle on the left is deliberately secondary. It is there so a
 * fourteen-year-old has a reason to come back for module four: every module
 * finishes a piece of it. Scrolling a module into view lights up the part it
 * builds, which is the only job that panel has.
 */

const ASSEMBLY: Record<number, string> = {
  1: "Get to the pad",
  2: "Make it fly straight",
  3: "Build and recover it",
  4: "Qualify",
};

export function ModuleTrack() {
  const [active, setActive] = useState(() => sectionIndexForModule(1));
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!rows.length) return;

    // Light the part belonging to whichever module is nearest the middle of the
    // screen. The observer is only the trigger — the decision is made by
    // measuring every row, because an entry list contains just the rows whose
    // visibility *changed*, and picking from those alone lights up a row that
    // has only left the screen.
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best: { order: number; dist: number } | null = null;
      for (const row of rows) {
        const r = row.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        const order = Number(row.dataset.order);
        if (!best || dist < best.dist) best = { order, dist };
      }
      if (best) setActive(sectionIndexForModule(best.order));
    };

    const io = new IntersectionObserver(pick, {
      rootMargin: "0px",
      threshold: [0, 0.5, 1],
    });
    for (const row of rows) io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <section className="track" id="course" aria-label="The course">
      <div className="track__intro">
        <p className="track__eyebrow">02 / The course</p>
        <h2 className="track__title">
          Rocketry modules for students
          <br />
          new to rocketry.
        </h2>
        <p className="track__lede">
          Thirteen of them, from your first launch rail to a qualifying flight.
          Read it, take the quiz, and finish another part of the rocket.
        </p>
      </div>

      <div className="track__body">
        {/* A blow-up, read left to right like an engineering drawing: nose at
            the left, fin can at the right, gaps where the joints are. Sticky,
            so the part a module builds lights up while that module is read. */}
        <aside className="track__vehicle" aria-hidden="true">
          <div className="track__exploded">
            {SECTIONS.map((s, i) => (
              <span
                key={s.id}
                className="track__part"
                data-active={i === active ? "true" : "false"}
                style={{ width: `calc(var(--veh-dia) * ${s.widthD})` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/vehicle/cad-${s.id}.png`} alt="" draggable={false} />
              </span>
            ))}
          </div>
          <div className="track__caption">
            <p className="track__vehicleLabel">Your vehicle</p>
            <p className="track__partName">{SECTIONS[active].label}</p>
            <p className="track__partEarns">{SECTIONS[active].earns}</p>
          </div>
        </aside>

        <div className="track__units">
          {UNITS.map(({ unit, title, modules }) => (
            <section key={unit} className="track__unit">
              <header className="track__unitHead">
                <span className="track__unitIndex">
                  Unit {String(unit).padStart(2, "0")}
                </span>
                <h3 className="track__unitTitle">{title}</h3>
                <span className="track__unitGoal">{ASSEMBLY[unit]}</span>
              </header>

              <ol className="track__list">
                {modules.map((m) => {
                  const part = SECTIONS[sectionIndexForModule(m.order)];
                  const live = m.status === "live";
                  return (
                    <li
                      key={m.id}
                      className="track__row"
                      data-order={m.order}
                      ref={(el) => {
                        rowRefs.current[m.order - 1] = el;
                      }}
                    >
                      <Link
                        className="track__rowLink"
                        href={`/modules/${m.slug}`}
                        aria-label={`Module ${m.order}: ${m.title}`}
                      >
                        <span className="track__num">
                          {String(m.order).padStart(2, "0")}
                        </span>
                        <span className="track__main">
                          <span className="track__moduleTitle">{m.title}</span>
                          <span className="track__summary">{m.summary}</span>
                        </span>
                        <span className="track__meta">
                          <span className="track__mins">
                            {m.estimatedMinutes} min
                          </span>
                          <span className="track__builds">{part.short}</span>
                        </span>
                        <span
                          className="track__status"
                          data-live={live ? "true" : "false"}
                        >
                          {live ? "Start" : "Soon"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
