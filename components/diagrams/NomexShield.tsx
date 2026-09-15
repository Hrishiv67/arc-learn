/**
 * Nomex fire blanket placement between ejection charge and packed recovery gear.
 */
export function NomexShield({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 200"
      className={className}
      role="img"
      aria-label="Nomex blanket placed between the ejection charge and the parachute"
    >
      <text x="320" y="28" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-arc-navy)">
        Packing order inside the recovery bay
      </text>

      {/* Tube */}
      <rect
        x="40"
        y="50"
        width="560"
        height="90"
        rx="6"
        fill="var(--color-mist-400)"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />

      {/* Motor / eject end */}
      <rect x="55" y="65" width="90" height="60" fill="#f5d0c8" stroke="var(--color-arc-navy)" />
      <text x="100" y="95" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-arc-navy)">
        Ejection
      </text>
      <text x="100" y="110" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">
        hot gas →
      </text>

      {/* Nomex */}
      <rect x="160" y="65" width="110" height="60" fill="#f4e4bc" stroke="var(--color-arc-navy)" strokeWidth="2" />
      <text x="215" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Nomex
      </text>
      <text x="215" y="112" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">
        fire blanket
      </text>

      {/* Chute + cord */}
      <rect x="285" y="65" width="140" height="60" fill="#d9f0d9" stroke="var(--color-arc-navy)" />
      <text x="355" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Parachute
      </text>
      <text x="355" y="112" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">
        + shock cord
      </text>

      {/* Nose / forward */}
      <rect x="440" y="65" width="140" height="60" fill="var(--color-mist-500)" stroke="var(--color-arc-navy)" />
      <text x="510" y="100" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Toward nose
      </text>

      <text x="320" y="170" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Nomex blocks embers — it does not seal pressure. Keep the wrap loose so the chute can open.
      </text>
    </svg>
  );
}
