"use client";

/**
 * Your rocket, as it stands.
 *
 * Replaces the dashed outline drawing this card used to show. The sections are
 * the same matted photograph the homepage flies and takes apart, so the rocket
 * a student is assembling is recognisably the rocket they watched launch —
 * rather than a second, cartoon rocket that exists only on this screen.
 *
 * Which module earns which part lives in lib/rocket/sections.ts, shared with
 * the homepage track so the two can never disagree.
 */

import { useId } from "react";
import {
  SECTIONS,
  BUILD_STEPS,
  sectionsEarned,
  earnedSectionSet,
  nextSection,
} from "@/lib/rocket/sections";

export function RocketBuild({
  completeCount,
  total,
}: {
  completeCount: number;
  total: number;
}) {
  const titleId = useId();
  const pct = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const earned = sectionsEarned(completeCount, total);
  const earnedSet = earnedSectionSet(completeCount, total);
  const next = nextSection(completeCount, total);
  const complete = next === null;

  return (
    <section className="vbuild" aria-labelledby={titleId}>
      <div className="vbuild__head">
        <div>
          <p className="eyebrow text-sky-300">Your rocket</p>
          <h2 id={titleId} className="text-white text-xl mt-1">
            Build it as you learn.
          </h2>
        </div>
        <span className="vbuild__pct">{pct}%</span>
      </div>

      <div
        className="vbuild__stage"
        role="img"
        aria-label={
          complete
            ? "Your rocket is complete"
            : `Your rocket is ${earned} of ${SECTIONS.length} sections built`
        }
      >
        <span className="vbuild__axis" aria-hidden="true" />
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className="vbuild__section"
            data-earned={earnedSet.has(i) ? "true" : "false"}
            style={{ width: `calc(var(--rb-dia) * ${s.widthD})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/rocket/cad-${s.id}.png`} alt="" draggable={false} />
          </span>
        ))}
      </div>

      <p className="text-sm text-sky-200 mt-3">
        {complete
          ? "Flight-ready. You built the whole rocket."
          : `Next section: ${next.label}`}
      </p>
      {!complete && (
        <p className="text-sm text-sky-200 mt-2">
          {BUILD_STEPS[earned].throughModule - completeCount} more modules to
          earn this section.
        </p>
      )}
      <p className="text-xs text-sky-300 mt-1">
        {earned} of {SECTIONS.length} sections · {completeCount} of {total}{" "}
        modules complete
      </p>
    </section>
  );
}
