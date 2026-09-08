import { SEASON } from "@/content/seasons/2027";
import { Icon } from "@/components/ui/Icon";

const MISS = 150;

/**
 * V1 — annotated vertical scale. Kills the most common first-year
 * misconception: that higher is better. Every number is derived from the
 * season config at render time; nothing here is a literal.
 */
export function AltitudeNumberLine({ className }: { className?: string }) {
  const target = Number(SEASON.parameters.targetAltitude.value);
  const unit = SEASON.parameters.targetAltitude.unit;
  const rows = [
    {
      y: 30,
      label: `${target + MISS} ${unit}`,
      note: `${MISS} ${unit} over`,
      tone: "caution" as const,
    },
    {
      y: 100,
      label: `${target} ${unit}`,
      note: "on target",
      tone: "go" as const,
    },
    {
      y: 170,
      label: `${target - MISS} ${unit}`,
      note: `${MISS} ${unit} under`,
      tone: "caution" as const,
    },
  ];
  return (
    <svg
      viewBox="0 0 480 200"
      className={className}
      role="img"
      aria-label={`Vertical scale showing the ${target} ${unit} altitude target, with equal penalty markers 150 ${unit} above and below`}
    >
      <line
        x1={60}
        y1={15}
        x2={60}
        y2={185}
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <rect x={45} y={85} width={30} height={30} fill="var(--color-arc-navy)" />

      {rows.map((r) => (
        <g key={r.label}>
          <line
            x1={50}
            y1={r.y}
            x2={70}
            y2={r.y}
            stroke="var(--color-arc-navy)"
            strokeWidth={2}
          />
          <circle
            cx={140}
            cy={r.y}
            r={9}
            fill={r.tone === "go" ? "var(--color-go)" : "var(--color-caution)"}
          />
          <foreignObject x={160} y={r.y - 22} width={300} height={44}>
            <div className="flex flex-col justify-center h-full">
              <div className="flex items-center gap-1.5">
                {r.tone === "go" ? (
                  <Icon name="check" size={14} className="text-go" />
                ) : (
                  <Icon
                    name="triangle-alert"
                    size={14}
                    className="text-caution"
                  />
                )}
                <span className="font-heading font-bold text-[15px] text-arc-navy">
                  {r.label}
                </span>
              </div>
              <span className="font-body text-[12px] text-sky-800">
                {r.note}
              </span>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}
