/**
 * V2 — labeled cutaway diagram. Side view, nose left, fins right, upper
 * half cut away to show internal parts. Shared between the lesson (fully
 * labeled) and the drag-label quiz question (unlabeled, with drop zones) —
 * callers supply `renderLabel` to place either static text or a droppable
 * target at each part's anchor point.
 */
export const ROCKET_PARTS = [
  { id: "nose-cone", label: "Nose cone", x: 55, y: 30 },
  { id: "payload-bay", label: "Payload bay", x: 150, y: 30 },
  { id: "altimeter", label: "Altimeter", x: 240, y: 30 },
  { id: "recovery-system", label: "Recovery system", x: 330, y: 30 },
  { id: "body-tube", label: "Body tube", x: 420, y: 172 },
  { id: "motor-mount", label: "Motor mount", x: 470, y: 30 },
  { id: "fins", label: "Fins", x: 545, y: 172 },
] as const;

export type RocketPartId = (typeof ROCKET_PARTS)[number]["id"];

export function RocketCutaway({
  renderLabel,
  className,
}: {
  renderLabel?: (partId: RocketPartId, x: number, y: number) => React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 200"
      className={className}
      role="img"
      aria-label="Side-view cutaway of a competition rocket, nose on the left, fins on the right"
    >
      {/* Lower half: solid external outline */}
      <path
        d="M20 100 L60 140 L440 140 L440 160 L520 160 L560 100 L520 100 Z"
        fill="none"
        stroke="var(--color-arc-navy)"
        strokeWidth={2}
      />
      {/* Upper half: cutaway outline */}
      <path
        d="M20 100 L60 60 L440 60 L440 100"
        fill="none"
        stroke="var(--color-arc-navy)"
        strokeWidth={2}
      />
      <line
        x1={20}
        y1={100}
        x2={560}
        y2={100}
        stroke="var(--color-navy-200)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Internal compartments (upper half) */}
      <rect
        x={75}
        y={64}
        width={110}
        height={34}
        fill="var(--color-mist-400)"
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <circle
        cx={215}
        cy={81}
        r={13}
        fill="var(--color-sky-300)"
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <rect
        x={255}
        y={64}
        width={110}
        height={34}
        fill="var(--color-mist-400)"
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />
      <rect
        x={395}
        y={64}
        width={45}
        height={34}
        fill="var(--color-navy-200)"
        stroke="var(--color-navy-300)"
        strokeWidth={1}
      />

      {/* Eggs inside payload bay */}
      <ellipse
        cx={110}
        cy={81}
        rx={9}
        ry={12}
        fill="var(--color-arc-white)"
        stroke="var(--color-navy-400)"
        strokeWidth={1}
      />
      <ellipse
        cx={150}
        cy={81}
        rx={9}
        ry={12}
        fill="var(--color-arc-white)"
        stroke="var(--color-navy-400)"
        strokeWidth={1}
      />

      {/* Leader lines to label anchors */}
      {ROCKET_PARTS.map((p) => {
        const originX =
          p.id === "nose-cone"
            ? 35
            : p.id === "payload-bay"
              ? 130
              : p.id === "altimeter"
                ? 215
                : p.id === "recovery-system"
                  ? 310
                  : p.id === "motor-mount"
                    ? 417
                    : p.id === "body-tube"
                      ? 250
                      : 500;
        const originY = p.id === "body-tube" || p.id === "fins" ? 145 : 64;
        return (
          <line
            key={p.id}
            x1={originX}
            y1={originY}
            x2={p.x}
            y2={p.id === "body-tube" || p.id === "fins" ? p.y - 20 : p.y + 20}
            stroke="var(--color-sky-700)"
            strokeWidth={1}
          />
        );
      })}

      {ROCKET_PARTS.map((p) => (
        // Width is deliberately narrower than the closest anchor spacing
        // (90 units, nose-cone through recovery-system) so neighboring
        // label/drop-target boxes never overlap — when they did, dnd-kit's
        // closestCenter collision detection could resolve a drop to the
        // wrong adjacent target.
        <foreignObject
          key={p.id}
          x={p.x - 40}
          y={p.y - 16}
          width={80}
          height={32}
        >
          {renderLabel ? (
            renderLabel(p.id, p.x, p.y)
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.02em] text-arc-navy bg-arc-white px-1 text-center leading-tight">
                {p.label}
              </span>
            </div>
          )}
        </foreignObject>
      ))}
    </svg>
  );
}
