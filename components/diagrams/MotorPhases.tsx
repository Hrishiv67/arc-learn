/**
 * Three-phase motor burn: thrust → delay (coast) → ejection.
 * Labels a sample motor code like C6-6 / F42-x for ARC class F motors.
 */
export function MotorPhases({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 260"
      className={className}
      role="img"
      aria-label="Model rocket motor burn phases: thrust, delay, and ejection"
    >
      {/* Motor casing */}
      <rect
        x="40"
        y="40"
        width="420"
        height="70"
        rx="6"
        fill="var(--color-mist-400)"
        stroke="var(--color-arc-navy)"
        strokeWidth="2"
      />
      <text x="250" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-arc-navy)">
        Motor casing (cardboard + clay) — example code: F42-6
      </text>

      {/* Propellant / delay / ejection zones */}
      <rect x="55" y="52" width="200" height="46" fill="var(--color-arc-red)" opacity="0.85" />
      <text x="155" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
        Propellant (thrust)
      </text>

      <rect x="255" y="52" width="120" height="46" fill="#e8b84a" />
      <text x="315" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        Delay charge
      </text>

      <rect x="375" y="52" width="70" height="46" fill="#5a8f6a" />
      <text x="410" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
        Eject
      </text>

      {/* Nozzle */}
      <path d="M40 55 L20 75 L40 95 Z" fill="var(--color-arc-navy)" />
      <text x="28" y="120" textAnchor="middle" fontSize="10" fill="var(--color-sky-800)">
        nozzle
      </text>

      {/* Code callouts */}
      <text x="155" y="145" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Letter = total impulse class
      </text>
      <text x="155" y="162" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Number = average thrust (N)
      </text>
      <line x1="155" y1="130" x2="155" y2="98" stroke="var(--color-navy-300)" />

      <text x="315" y="145" textAnchor="middle" fontSize="12" fill="var(--color-arc-navy)">
        Final number = delay seconds
      </text>
      <text x="315" y="162" textAnchor="middle" fontSize="12" fill="var(--color-sky-800)">
        (smoke only — no thrust)
      </text>
      <line x1="315" y1="130" x2="315" y2="98" stroke="var(--color-navy-300)" />

      {/* Timeline */}
      <line x1="60" y1="200" x2="560" y2="200" stroke="var(--color-arc-navy)" strokeWidth="2" />
      <circle cx="120" cy="200" r="6" fill="var(--color-arc-red)" />
      <circle cx="300" cy="200" r="6" fill="#e8b84a" />
      <circle cx="480" cy="200" r="6" fill="#5a8f6a" />

      <text x="120" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        1. Thrust
      </text>
      <text x="120" y="242" textAnchor="middle" fontSize="11" fill="var(--color-sky-800)">
        Hot gas out the nozzle
      </text>

      <text x="300" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        2. Delay / coast
      </text>
      <text x="300" y="242" textAnchor="middle" fontSize="11" fill="var(--color-sky-800)">
        Climb to apogee
      </text>

      <text x="480" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-arc-navy)">
        3. Ejection
      </text>
      <text x="480" y="242" textAnchor="middle" fontSize="11" fill="var(--color-sky-800)">
        Pop the recovery bay
      </text>
    </svg>
  );
}
