/**
 * Altimeter in a protected bay with vent holes — pressure sensing needs airflow.
 */
export function AltimeterBay({ className }: { className?: string }) {
  const permitted = [
    "PerfectFlite Pnut",
    "PerfectFlite FireFly",
    "Jolly Logic Altimeter One",
    "Jolly Logic Altimeter Two",
  ];

  return (
    <svg
      viewBox="0 0 640 270"
      className={className}
      role="img"
      aria-label="Altimeter bay with vent holes and the four ARC-permitted altimeters"
    >
      {/* Body tube section */}
      <rect
        x="40"
        y="50"
        width="280"
        height="160"
        rx="8"
        fill="var(--color-mist-400)"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />
      <text x="180" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-arc-navy)">
        Altimeter bay (needs air)
      </text>

      {/* Case */}
      <rect
        x="100"
        y="90"
        width="120"
        height="70"
        rx="4"
        fill="#cfe8f5"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />
      <text x="160" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Altimeter
      </text>
      <text x="160" y="140" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">
        in a hard case
      </text>

      {/* Vent holes */}
      {[70, 95, 120].map((y) => (
        <circle key={y} cx="55" cy={y} r="5" fill="var(--color-arc-navy)" />
      ))}
      <text x="70" y="200" fontSize="11" fill="var(--color-arc-navy)">
        Vent holes → outside air
      </text>
      <text x="70" y="216" fontSize="11" fill="var(--color-sky-800)">
        Pressure change = altitude
      </text>

      {/* Permitted list */}
      <text x="360" y="70" fontSize="13" fontWeight="700" fill="var(--color-arc-navy)">
        ARC-permitted altimeters
      </text>
      {permitted.map((name, i) => (
        <g key={name}>
          <rect
            x="360"
            y={90 + i * 36}
            width="250"
            height="28"
            rx="3"
            fill="var(--color-mist-300)"
            stroke="var(--color-navy-300)"
          />
          <text x="375" y={109 + i * 36} fontSize="12" fill="var(--color-arc-navy)">
            {i + 1}. {name}
          </text>
        </g>
      ))}
    </svg>
  );
}
