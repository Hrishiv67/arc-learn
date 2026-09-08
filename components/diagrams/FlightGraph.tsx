import { SEASON } from "@/content/seasons/2027";

/**
 * V5 — altitude vs. time. Teaches students to read the shape of a flight
 * before they ever open simulation software: apogee and duration are two
 * readings off one curve.
 */
export function FlightGraph({ className }: { className?: string }) {
  const altUnit = SEASON.parameters.targetAltitude.unit;
  const durLabel = `${SEASON.parameters.durationWindow.value} ${SEASON.parameters.durationWindow.unit}`;
  return (
    <svg
      viewBox="0 0 560 220"
      className={className}
      role="img"
      aria-label={`Altitude versus time graph showing a flight curve, a dashed line at the target altitude, and a shaded band across the ${durLabel} duration window`}
    >
      {/* axes */}
      <line
        x1={50}
        y1={20}
        x2={50}
        y2={180}
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <line
        x1={50}
        y1={180}
        x2={540}
        y2={180}
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <text
        x={20}
        y={30}
        style={{ font: "600 10px var(--font-heading)" }}
        className="fill-sky-800 uppercase"
      >
        {altUnit}
      </text>
      <text
        x={510}
        y={198}
        style={{ font: "600 10px var(--font-heading)" }}
        className="fill-sky-800 uppercase"
      >
        time
      </text>

      {/* duration window band */}
      <rect
        x={330}
        y={20}
        width={110}
        height={160}
        fill="var(--color-mist-400)"
      />
      <text
        x={385}
        y={196}
        textAnchor="middle"
        style={{ font: "600 10px var(--font-heading)" }}
        className="fill-sky-800 uppercase"
      >
        duration window
      </text>

      {/* target altitude dashed line */}
      <line
        x1={50}
        y1={55}
        x2={540}
        y2={55}
        stroke="var(--color-arc-navy)"
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <text
        x={455}
        y={48}
        style={{ font: "700 11px var(--font-heading)" }}
        className="fill-arc-navy"
      >
        target altitude
      </text>

      {/* flight curve */}
      <path
        d="M50 180 C 140 40, 200 60, 260 65 S 340 100, 385 160"
        fill="none"
        stroke="var(--color-arc-red)"
        strokeWidth={3}
      />
      <circle cx={260} cy={65} r={4} fill="var(--color-arc-red)" />
      <circle cx={385} cy={160} r={4} fill="var(--color-arc-navy)" />

      <foreignObject x={200} y={78} width={150} height={30}>
        <span className="font-body text-[11px] text-arc-red">
          missed altitude by ___ ft
        </span>
      </foreignObject>
      <foreignObject x={395} y={130} width={140} height={30}>
        <span className="font-body text-[11px] text-go">
          landed inside the window
        </span>
      </foreignObject>
    </svg>
  );
}
