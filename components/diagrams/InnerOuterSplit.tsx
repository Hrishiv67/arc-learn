/**
 * Side-by-side map of outer airframe vs inner flight systems.
 * Used in the anatomy demo module to separate what you see from what flies.
 */
export function InnerOuterSplit({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 280"
      className={className}
      role="img"
      aria-label="Outer rocket parts on the left, inner flight systems on the right"
    >
      <rect x="8" y="8" width="300" height="264" rx="4" fill="var(--color-mist-300)" />
      <rect x="332" y="8" width="300" height="264" rx="4" fill="var(--color-sky-100)" />

      <text x="158" y="36" textAnchor="middle" fill="var(--color-arc-navy)" fontSize="14" fontWeight="700">
        OUTER — airframe
      </text>
      <text x="482" y="36" textAnchor="middle" fill="var(--color-arc-navy)" fontSize="14" fontWeight="700">
        INNER — flight systems
      </text>

      {/* Outer rocket silhouette */}
      <path
        d="M90 70 L130 110 L130 210 L70 210 L70 110 Z"
        fill="var(--color-mist-500)"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />
      <path d="M100 70 L110 48 L120 70 Z" fill="var(--color-arc-navy)" />
      <path d="M70 200 L50 230 L70 210 Z" fill="var(--color-arc-red)" />
      <path d="M130 200 L150 230 L130 210 Z" fill="var(--color-arc-red)" />

      <text x="210" y="95" fill="var(--color-arc-navy)" fontSize="12">Nose cone</text>
      <line x1="120" y1="60" x2="200" y2="90" stroke="var(--color-navy-300)" strokeWidth="1" />
      <text x="210" y="145" fill="var(--color-arc-navy)" fontSize="12">Body tube</text>
      <line x1="130" y1="150" x2="200" y2="140" stroke="var(--color-navy-300)" strokeWidth="1" />
      <text x="210" y="220" fill="var(--color-arc-navy)" fontSize="12">Fins</text>
      <line x1="140" y1="215" x2="200" y2="215" stroke="var(--color-navy-300)" strokeWidth="1" />

      {/* Inner stack */}
      <rect x="400" y="55" width="140" height="28" rx="2" fill="#f4e4bc" stroke="var(--color-arc-navy)" />
      <text x="470" y="74" textAnchor="middle" fontSize="11" fill="var(--color-arc-navy)">Egg case</text>

      <rect x="400" y="90" width="140" height="28" rx="2" fill="#cfe8f5" stroke="var(--color-arc-navy)" />
      <text x="470" y="109" textAnchor="middle" fontSize="11" fill="var(--color-arc-navy)">Altimeter + vents</text>

      <rect x="400" y="125" width="140" height="36" rx="2" fill="#d9f0d9" stroke="var(--color-arc-navy)" />
      <text x="470" y="142" textAnchor="middle" fontSize="11" fill="var(--color-arc-navy)">Parachute</text>
      <text x="470" y="155" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">+ Nomex blanket</text>

      <rect x="400" y="170" width="140" height="28" rx="2" fill="#f5d0c8" stroke="var(--color-arc-navy)" />
      <text x="470" y="189" textAnchor="middle" fontSize="11" fill="var(--color-arc-navy)">Motor (class F)</text>

      <text x="470" y="230" textAnchor="middle" fontSize="11" fill="var(--color-sky-800)">
        Hidden until you open the tube
      </text>
      <text x="470" y="248" textAnchor="middle" fontSize="11" fill="var(--color-sky-800)">
        — but they decide the flight
      </text>
    </svg>
  );
}
