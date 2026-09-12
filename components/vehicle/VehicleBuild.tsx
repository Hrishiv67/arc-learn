"use client";

/**
 * Your vehicle, as it stands.
 *
 * Replaces the dashed outline drawing this card used to show. The sections are
 * the same matted photograph the homepage flies and takes apart, so the rocket
 * a student is assembling is recognisably the rocket they watched launch —
 * rather than a second, cartoon rocket that exists only on this screen.
 *
 * Sections are earned bottom-up, the order you actually build one: fin can and
 * motor first, nose cone last.
 */

type Section = {
  id: string;
  /** share of the vehicle's height, nose to tail */
  height: number;
  label: string;
};

/** Nose to tail, matching public/hero/sections.json. */
const SECTIONS: Section[] = [
  { id: "nose", height: 0.18, label: "Nose cone" },
  { id: "payload", height: 0.18, label: "Payload bay" },
  { id: "body-upper", height: 0.21, label: "Body tube" },
  { id: "body-lower", height: 0.205, label: "Recovery bay" },
  { id: "fincan", height: 0.225, label: "Fin can and motor" },
];

/** Build order — tail first. Indices into SECTIONS. */
const BUILD_ORDER = [4, 3, 2, 1, 0];

/** How many sections are earned at a given completion. */
function sectionsEarned(completeCount: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(
    SECTIONS.length,
    Math.floor((completeCount / total) * SECTIONS.length + 1e-9),
  );
}

export function VehicleBuild({
  completeCount,
  total,
}: {
  completeCount: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const earned = sectionsEarned(completeCount, total);
  const earnedSet = new Set(BUILD_ORDER.slice(0, earned));
  const nextIndex = BUILD_ORDER[earned];
  const complete = earned >= SECTIONS.length;

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
            style={{ height: `${s.height * 100}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/hero/section-${s.id}.png`} alt="" draggable={false} />
          </span>
        ))}
        <span className="vbuild__ground" aria-hidden="true" />
      </div>

      <p className="text-sm text-sky-200 mt-3">
        {complete
          ? "Flight-ready. You built the whole vehicle."
          : `Next section: ${SECTIONS[nextIndex].label}`}
      </p>
      <p className="text-xs text-sky-300 mt-1">
        {earned} of {SECTIONS.length} sections · {completeCount} of {total}{" "}
        modules complete
      </p>
    </section>
  );
}
