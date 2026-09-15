/**
 * Egg protection case: cushioned on all sides, removable for inspection.
 */
export function EggCase({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 230"
      className={className}
      role="img"
      aria-label="Egg protection case with cushioning on all sides and room to insert or remove the egg"
    >
      <text x="320" y="28" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-arc-navy)">
        Egg case — cushion every side
      </text>

      {/* Case outer */}
      <rect
        x="160"
        y="50"
        width="200"
        height="140"
        rx="8"
        fill="#f4e4bc"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />
      {/* Foam */}
      <rect x="175" y="65" width="170" height="110" rx="4" fill="#e8d5a8" />
      {/* Egg */}
      <ellipse
        cx="260"
        cy="120"
        rx="28"
        ry="38"
        fill="#f7f2e4"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />

      {/* Labels */}
      <text x="400" y="80" fontSize="12" fill="var(--color-arc-navy)">
        Soft padding on every side
      </text>
      <text x="400" y="100" fontSize="12" fill="var(--color-arc-navy)">
        (foam, cotton, or similar)
      </text>
      <text x="400" y="130" fontSize="12" fill="var(--color-arc-navy)">
        Must open for pre- and
      </text>
      <text x="400" y="148" fontSize="12" fill="var(--color-arc-navy)">
        post-flight egg checks
      </text>
      <text x="400" y="178" fontSize="12" fill="var(--color-sky-800)">
        Fixed mass helps keep CG predictable
      </text>

      {/* Arrows indicating impacts */}
      <path d="M140 120 L165 120" stroke="var(--color-arc-red)" strokeWidth="2" />
      <path d="M380 120 L355 120" stroke="var(--color-arc-red)" strokeWidth="2" />
      <path d="M260 40 L260 55" stroke="var(--color-arc-red)" strokeWidth="2" />
      <path d="M260 205 L260 190" stroke="var(--color-arc-red)" strokeWidth="2" />
      <text x="100" y="215" fontSize="11" fill="var(--color-sky-800)">
        Impacts can come from any direction — pad every face.
      </text>
    </svg>
  );
}
