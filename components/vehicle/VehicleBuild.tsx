"use client";

/**
 * Your vehicle, as it stands.
 *
 * Replaces the dashed outline drawing this card used to show. The sections are
 * the same matted photograph the homepage flies and takes apart, so the rocket
 * a student is assembling is recognisably the rocket they watched launch —
 * rather than a second, cartoon rocket that exists only on this screen.
 *
 * Which module earns which part lives in lib/vehicle/sections.ts, shared with
 * the homepage track so the two can never disagree.
 */

import {
  SECTIONS,
  sectionsEarned,
  earnedSectionSet,
  nextSection,
} from "@/lib/vehicle/sections";

export function VehicleBuild({
  completeCount,
  total,
}: {
  completeCount: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const earned = sectionsEarned(completeCount, total);
  const earnedSet = earnedSectionSet(completeCount, total);
  const next = nextSection(completeCount, total);
  const complete = next === null;

  return (
    <section className="vbuild" aria-labelledby="vbuild-title">
      <div className="vbuild__head">
        <div>
          <p className="eyebrow text-sky-300">Your vehicle</p>
          <h2 id="vbuild-title" className="text-white text-xl mt-1">
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
            ? "Your vehicle is complete"
            : `Your vehicle is ${earned} of ${SECTIONS.length} sections built`
        }
      >
        <span className="vbuild__axis" aria-hidden="true" />
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className="vbuild__section"
            data-earned={earnedSet.has(i) ? "true" : "false"}
            style={{ width: `calc(var(--vb-dia) * ${s.ratio})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/vehicle/cad-${s.id}.png`} alt="" draggable={false} />
          </span>
        ))}
      </div>

      <p className="text-sm text-sky-200 mt-3">
        {complete
          ? "Flight-ready. You built the whole vehicle."
          : `Next section: ${next.label}`}
      </p>
      <p className="text-xs text-sky-300 mt-1">
        {earned} of {SECTIONS.length} sections · {completeCount} of {total}{" "}
        modules complete
      </p>
    </section>
  );
}
