import type { ReactNode } from "react";

/** An illustrative curve; no fabricated measurements or season-specific targets. */
export function FlightGraph({ className }: { className?: string }) {
  const label = (x: number, y: number, text: ReactNode) => (
    <text
      x={x}
      y={y}
      fill="var(--color-arc-navy)"
      fontSize="15"
      fontFamily="var(--font-body)"
    >
      {text}
    </text>
  );
  return (
    <svg
      viewBox="0 0 480 250"
      className={className}
      role="img"
      aria-label="Illustrative altitude versus time graph: a rising curve reaches a flat peak at apogee, then descends to ground level at landing."
    >
      <path
        d="M45 35 V210 H455"
        fill="none"
        stroke="var(--color-sky-800)"
        strokeWidth="1.5"
      />
      <path
        d="M45 210 C95 210 125 70 220 70 S355 115 435 210"
        fill="none"
        stroke="var(--color-arc-navy)"
        strokeWidth="3"
      />
      <circle cx="220" cy="70" r="5" fill="var(--color-arc-navy)" />
      <circle cx="435" cy="210" r="5" fill="var(--color-arc-navy)" />
      {label(10, 24, "Height")}
      {label(391, 242, "Time →")}
      {label(177, 48, "Apogee")}
      {label(62, 133, "Climb")}
      {label(306, 111, "Descent")}
      {label(363, 192, "Landing")}
      {label(12, 232, "Ground")}
    </svg>
  );
}
