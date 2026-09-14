"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UNITS } from "@/content/modules/registry";
import {
  SECTIONS,
  sectionIndexForModule,
  moduleRangeForSection,
} from "@/lib/rocket/sections";

/**
 * The course, which is the point of the site.
 *
 * The launch above is what gets a student to scroll; this is what they came for,
 * so it gets the same care — the real thirteen modules, in the real four units,
 * with what each one actually teaches.
 *
 * The blow-up pinned above the list is deliberately secondary. It is there so a
 * fourteen-year-old has a reason to come back for module four: every module
 * finishes a piece of it. The module being read lights the part it builds, the
 * parts already built by the modules above it stay solid, and the rest wait as
 * ghosts — so scrolling down the list visibly assembles the rocket left to right.
 */

const ASSEMBLY: Record<number, string> = {
  1: "Get to the pad",
  2: "Make it fly straight",
  3: "Build and recover it",
  4: "Qualify",
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export function ModuleTrack() {
  const [activeOrder, setActiveOrder] = useState(1);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const stripRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const rows = rowRefs.current.filter((r): r is HTMLLIElement => Boolean(r));
    if (!rows.length) return;

    // Scrollspy, evaluated synchronously on every scroll event.
    //
    // The rocket strip is pinned to the top of the screen, so the module a
    // student is actually reading sits just underneath it - not at the middle
    // of the viewport. The active module is the last one whose top has crossed
    // a reading line a third of the way down the space below the strip.
    //
    // Two earlier versions lagged a module behind the reader. An
    // IntersectionObserver only re-evaluated when a row crossed a visibility
    // threshold, and a row gliding through mid-screen crosses nothing. A
    // requestAnimationFrame-scheduled update was no better: a throttled or
    // backgrounded tab holds that frame back, and every scroll event that
    // arrives while it waits is dropped. Measuring thirteen rows per scroll
    // event costs nothing, so it is simply done every time.
    const update = () => {
      const stripBottom = stripRef.current?.getBoundingClientRect().bottom ?? 0;
      const line = stripBottom + (window.innerHeight - stripBottom) * 0.33;
      // At the very end of the page the last modules can run out of scroll
      // before they reach the reading line, so any row on screen counts there.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      let order = Number(rows[0].dataset.order);
      for (const row of rows) {
        const top = row.getBoundingClientRect().top;
        if (top <= line || (atBottom && top < window.innerHeight)) {
          order = Number(row.dataset.order);
        } else {
          break;
        }
      }
      setActiveOrder((prev) => (prev === order ? prev : order));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeIndex = sectionIndexForModule(activeOrder);
  const active = SECTIONS[activeIndex];
  const range = moduleRangeForSection(activeIndex);

  return (
    <section className="track" id="course" aria-label="The course">
      <div className="track__body">
        {/* Drawn tail to nose, left to right, in the order the parts are
            earned — so the highlight only ever moves one way down the list. */}
        <aside className="track__rocket" ref={stripRef} aria-hidden="true">
          <div className="track__exploded">
            {SECTIONS.map((s, i) => (
              <span
                key={s.id}
                className="track__part"
                data-state={
                  i < activeIndex ? "built" : i === activeIndex ? "active" : "ghost"
                }
                style={{ width: `calc(var(--rocket-dia) * ${s.widthD})` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/rocket/cad-${s.id}.png`} alt="" draggable={false} />
              </span>
            ))}
          </div>
          <div className="track__caption">
            <p className="track__rocketLabel">
              Your rocket · Module {pad2(activeOrder)}
            </p>
            <p className="track__partName">{active.label}</p>
            <p className="track__partRange">
              Modules {pad2(range.from)}–{pad2(range.to)} build this part
            </p>
            <p className="track__partEarns">{active.earns}</p>
          </div>
        </aside>

        <div className="track__units">
          {UNITS.map(({ unit, title, modules }) => (
            <section key={unit} className="track__unit">
              <header className="track__unitHead">
                <span className="track__unitIndex">Unit {pad2(unit)}</span>
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
                      data-active={m.order === activeOrder ? "true" : "false"}
                      ref={(el) => {
                        rowRefs.current[m.order - 1] = el;
                      }}
                    >
                      <Link
                        className="track__rowLink"
                        href={`/modules/${m.slug}`}
                        aria-label={`Module ${m.order}: ${m.title}`}
                      >
                        <span className="track__num">{pad2(m.order)}</span>
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
