/**
 * Four-step cotton parachute fold sequence for ARC recovery packing.
 */
export function ParachuteFold({ className }: { className?: string }) {
  const steps = [
    { n: "1", title: "Lay flat", detail: "Cotton canopy face up" },
    { n: "2", title: "Fold in thirds", detail: "Bring sides to center" },
    { n: "3", title: "Zig-zag lines", detail: "Keep shrouds neat" },
    { n: "4", title: "Wrap Nomex", detail: "Loose — not jammed" },
  ];

  return (
    <svg
      viewBox="0 0 680 220"
      className={className}
      role="img"
      aria-label="Four steps for folding a cotton parachute and wrapping it in Nomex"
    >
      {steps.map((s, i) => {
        const x = 20 + i * 165;
        return (
          <g key={s.n}>
            <rect
              x={x}
              y="20"
              width="150"
              height="170"
              rx="4"
              fill="var(--color-mist-300)"
              stroke="var(--color-navy-300)"
            />
            <circle cx={x + 28} cy="48" r="14" fill="var(--color-arc-navy)" />
            <text
              x={x + 28}
              y="53"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="white"
            >
              {s.n}
            </text>
            <text x={x + 75} y="53" fontSize="13" fontWeight="700" fill="var(--color-arc-navy)">
              {s.title}
            </text>

            {/* Simple visual per step */}
            {i === 0 && (
              <ellipse
                cx={x + 75}
                cy="120"
                rx="48"
                ry="28"
                fill="#d9f0d9"
                stroke="var(--color-arc-navy)"
              />
            )}
            {i === 1 && (
              <rect
                x={x + 45}
                y="95"
                width="60"
                height="50"
                fill="#d9f0d9"
                stroke="var(--color-arc-navy)"
              />
            )}
            {i === 2 && (
              <>
                <rect
                  x={x + 55}
                  y="90"
                  width="40"
                  height="55"
                  fill="#d9f0d9"
                  stroke="var(--color-arc-navy)"
                />
                <path
                  d={`M${x + 75} 145 Q${x + 40} 160 ${x + 75} 170 Q${x + 110} 160 ${x + 75} 145`}
                  fill="none"
                  stroke="var(--color-arc-navy)"
                  strokeWidth="2"
                />
              </>
            )}
            {i === 3 && (
              <>
                <rect
                  x={x + 50}
                  y="95"
                  width="50"
                  height="40"
                  fill="#f4e4bc"
                  stroke="var(--color-arc-navy)"
                />
                <text
                  x={x + 75}
                  y="120"
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-arc-navy)"
                >
                  Nomex
                </text>
              </>
            )}

            <text
              x={x + 75}
              y="175"
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-sky-800)"
            >
              {s.detail}
            </text>

            {i < 3 && (
              <path
                d={`M${x + 152} 105 L${x + 162} 105`}
                stroke="var(--color-arc-navy)"
                strokeWidth="2"
                markerEnd="none"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
