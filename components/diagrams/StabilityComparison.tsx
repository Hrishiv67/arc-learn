import { Icon } from "@/components/ui/Icon";

function RocketOutline({ x }: { x: number }) {
  return (
    <g transform={`translate(${x},0)`}>
      <path
        d="M0 60 L24 30 L150 30 L150 90 L24 90 Z"
        fill="var(--color-mist-300)"
        stroke="var(--color-arc-navy)"
        strokeWidth={2}
      />
      <path
        d="M150 40 L175 20 L175 100 L150 80 Z"
        fill="var(--color-mist-300)"
        stroke="var(--color-arc-navy)"
        strokeWidth={2}
      />
    </g>
  );
}

function CgMark({ x }: { x: number }) {
  return (
    <g transform={`translate(${x},60)`}>
      <circle r={7} fill="var(--color-arc-navy)" />
      <path d="M-7 0 L0 12 L7 0 Z" fill="var(--color-arc-navy)" />
      <text
        y={30}
        textAnchor="middle"
        className="fill-arc-navy"
        style={{ font: "700 11px var(--font-heading)" }}
      >
        CG
      </text>
    </g>
  );
}

function CpMark({ x }: { x: number }) {
  return (
    <g transform={`translate(${x},60)`}>
      <circle
        r={8}
        fill="var(--color-arc-white)"
        stroke="var(--color-sky-700)"
        strokeWidth={2}
      />
      <line
        x1={-8}
        y1={0}
        x2={8}
        y2={0}
        stroke="var(--color-sky-700)"
        strokeWidth={1.5}
      />
      <line
        x1={0}
        y1={-8}
        x2={0}
        y2={8}
        stroke="var(--color-sky-700)"
        strokeWidth={1.5}
      />
      <text
        y={30}
        textAnchor="middle"
        className="fill-sky-700"
        style={{ font: "700 11px var(--font-heading)" }}
      >
        CP
      </text>
    </g>
  );
}

function Panel({
  label,
  tone,
  cgX,
  cpX,
  arrowD,
}: {
  label: string;
  tone: "go" | "caution";
  cgX: number;
  cpX: number;
  arrowD: string;
}) {
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={260}
        height={170}
        fill="var(--color-arc-white)"
      />
      <rect
        x={0}
        y={0}
        width={10}
        height={10}
        fill={tone === "go" ? "var(--color-go)" : "var(--color-caution)"}
      />
      <text
        x={20}
        y={16}
        style={{ font: "700 12px var(--font-heading)" }}
        className="fill-arc-navy"
      >
        {label}
      </text>
      <g transform="translate(30,50)">
        <RocketOutline x={0} />
        <CgMark x={cgX} />
        <CpMark x={cpX} />
        <path
          d={arrowD}
          fill="none"
          stroke={tone === "go" ? "var(--color-go)" : "var(--color-caution)"}
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
        {/* gust arrow */}
        <path
          d="M195 5 L175 25"
          stroke="var(--color-navy-400)"
          strokeWidth={2}
          markerEnd="url(#arrowhead-gust)"
        />
      </g>
    </g>
  );
}

/**
 * V3 — two-panel CG/CP comparison. Memorizing "CG ahead of CP" means
 * nothing without seeing why the order produces self-correction or tumble;
 * the gust-and-recovery arrows carry that.
 */
export function StabilityComparison({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 190"
      className={className}
      role="img"
      aria-label="Two panels comparing a stable rocket, with center of gravity ahead of center of pressure, to an unstable rocket with the order reversed"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth={8}
          markerHeight={8}
          refX={6}
          refY={4}
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
        </marker>
        <marker
          id="arrowhead-gust"
          markerWidth={8}
          markerHeight={8}
          refX={6}
          refY={4}
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--color-navy-400)" />
        </marker>
      </defs>
      <Panel
        label="Stable — CG ahead of CP"
        tone="go"
        cgX={45}
        cpX={110}
        arrowD="M60 90 Q30 60 55 40"
      />
      <g transform="translate(300,0)">
        <Panel
          label="Unstable — CP ahead of CG"
          tone="caution"
          cgX={110}
          cpX={45}
          arrowD="M60 90 Q90 120 60 145"
        />
      </g>
      <foreignObject x={0} y={165} width={560} height={25}>
        <div className="flex items-center gap-1.5">
          <Icon name="info" size={12} className="text-sky-800 shrink-0" />
          <span className="font-body text-[11px] text-sky-800">
            Gust from above; curved arrow shows how the nose responds.
          </span>
        </div>
      </foreignObject>
    </svg>
  );
}
