/**
 * OpenRocket design loop: model → simulate → compare → adjust.
 */
export function OpenRocketLoop({ className }: { className?: string }) {
  const nodes = [
    { t: "Build the model", d: "Tube, nose, fins, motor, chute, egg mass" },
    { t: "Simulate", d: "Altitude, time, stability, descent" },
    { t: "Fly + measure", d: "Compare altimeter to prediction" },
    { t: "Calibrate", d: "Tune drag / weight, then repeat" },
  ];

  return (
    <svg
      viewBox="0 0 680 200"
      className={className}
      role="img"
      aria-label="OpenRocket workflow loop from virtual model to flight calibration"
    >
      {nodes.map((n, i) => {
        const x = 20 + i * 165;
        return (
          <g key={n.t}>
            <rect
              x={x}
              y="40"
              width="150"
              height="100"
              rx="4"
              fill={i % 2 === 0 ? "var(--color-mist-300)" : "#cfe8f5"}
              stroke="var(--color-arc-navy)"
              strokeWidth="2"
            />
            <text x={x + 75} y="75" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-arc-navy)">
              {n.t}
            </text>
            <foreignObject x={x + 10} y="90" width="130" height="40">
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-sky-800)",
                  textAlign: "center",
                  lineHeight: "1.3",
                }}
              >
                {n.d}
              </div>
            </foreignObject>
            {i < 3 && (
              <path
                d={`M${x + 152} 90 L${x + 162} 90`}
                stroke="var(--color-arc-navy)"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}
      <text x="340" y="180" textAnchor="middle" fontSize="12" fill="var(--color-sky-800)">
        Simulation narrows options — practice flights prove them.
      </text>
    </svg>
  );
}
