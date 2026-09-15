/**
 * Outer airframe callouts: body tube diameter/length rules, nose cone, fins.
 */
export function OuterAirframe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 680 240"
      className={className}
      role="img"
      aria-label="Outer airframe with body tube, nose cone, and fins labeled with ARC size rules"
    >
      {/* Rocket */}
      <path d="M80 120 L140 70 L480 70 L480 170 L140 170 Z" fill="var(--color-mist-400)" stroke="var(--color-arc-navy)" strokeWidth="2" />
      <path d="M80 120 L140 70 L140 170 Z" fill="var(--color-arc-navy)" />
      <path d="M480 150 L540 200 L480 170 Z" fill="var(--color-arc-red)" />
      <path d="M480 90 L540 40 L480 70 Z" fill="var(--color-arc-red)" />

      <text x="110" y="50" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Nose cone
      </text>
      <text x="300" y="55" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Body tube (≥ 47 mm / 1.85 in diameter)
      </text>
      <text x="520" y="130" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Fins
      </text>

      {/* Length bracket */}
      <line x1="80" y1="200" x2="540" y2="200" stroke="var(--color-arc-navy)" strokeWidth="2" />
      <line x1="80" y1="190" x2="80" y2="210" stroke="var(--color-arc-navy)" />
      <line x1="540" y1="190" x2="540" y2="210" stroke="var(--color-arc-navy)" />
      <text x="310" y="225" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Overall length ≥ 650 mm — same diameter nose to tail
      </text>

      <text x="40" y="20" fontSize="11" fill="var(--color-sky-800)">
        Lightweight, non-metal structure (NAR Safety Code)
      </text>
    </svg>
  );
}
