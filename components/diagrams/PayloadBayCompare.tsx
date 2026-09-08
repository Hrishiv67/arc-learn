import { Icon } from "@/components/ui/Icon";

/**
 * V4 — payload bay cutaway plus a landing-outcome comparison strip.
 * Descent-rate figures are left blank rather than invented; an instructor
 * fills them from current data.
 */
export function PayloadBayCompare({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 200"
      className={className}
      role="img"
      aria-label="A padded payload bay cutaway next to a comparison of a slow, cushioned landing against a fast, hard landing"
    >
      {/* Payload bay cutaway */}
      <g transform="translate(10,20)">
        <rect
          x={0}
          y={0}
          width={230}
          height={130}
          fill="none"
          stroke="var(--color-arc-navy)"
          strokeWidth={2}
        />
        <rect
          x={10}
          y={10}
          width={210}
          height={110}
          fill="var(--color-mist-300)"
        />
        <ellipse
          cx={80}
          cy={65}
          rx={26}
          ry={34}
          fill="var(--color-arc-white)"
          stroke="var(--color-navy-400)"
          strokeWidth={1.5}
        />
        <ellipse
          cx={150}
          cy={65}
          rx={26}
          ry={34}
          fill="var(--color-arc-white)"
          stroke="var(--color-navy-400)"
          strokeWidth={1.5}
        />
        <text
          x={115}
          y={150}
          textAnchor="middle"
          style={{ font: "600 11px var(--font-heading)" }}
          className="fill-sky-800 uppercase"
        >
          Foam cradle, tube wall
        </text>
      </g>

      {/* Comparison strip */}
      <g transform="translate(280,20)">
        <g>
          <rect
            x={0}
            y={0}
            width={270}
            height={62}
            fill="var(--color-go-tint)"
          />
          <foreignObject x={12} y={6} width={246} height={50}>
            <div className="flex items-center gap-3 h-full">
              <Icon
                name="circle-check"
                size={20}
                className="text-go shrink-0"
              />
              <div>
                <p className="font-heading font-bold text-[13px] text-arc-navy leading-tight">
                  Large parachute, slow descent
                </p>
                <p className="font-body text-[12px] text-sky-800">
                  ___ ft/s · egg intact
                </p>
              </div>
            </div>
          </foreignObject>
        </g>
        <g transform="translate(0,68)">
          <rect
            x={0}
            y={0}
            width={270}
            height={62}
            fill="var(--color-caution-tint)"
          />
          <foreignObject x={12} y={6} width={246} height={50}>
            <div className="flex items-center gap-3 h-full">
              <Icon
                name="triangle-alert"
                size={20}
                className="text-caution shrink-0"
              />
              <div>
                <p className="font-heading font-bold text-[13px] text-arc-navy leading-tight">
                  Small parachute, fast descent
                </p>
                <p className="font-body text-[12px] text-sky-800">
                  ___ ft/s · egg cracked
                </p>
              </div>
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
  );
}
