import { clsx } from "@/lib/clsx";
import { Icon } from "./Icon";

export type StepState = "done" | "current" | "todo";

/**
 * Documented ARC Modules brand extension (no counterpart in the supplied
 * brand sources — added because the course surface needs step-by-step
 * progress feedback). Segmented bar: one cell per step, colored by state.
 */
export function StepProgress({
  steps,
  className,
}: {
  steps: { label: string; state: StepState }[];
  className?: string;
}) {
  return (
    <div
      className={clsx("flex gap-1.5", className)}
      role="progressbar"
      aria-label={`Progress: ${steps.map((s) => s.label).join(", ")}`}
      aria-valuenow={steps.filter((s) => s.state === "done").length}
      aria-valuemin={0}
      aria-valuemax={steps.length}
    >
      {steps.map((s, i) => (
        <span
          key={i}
          className={clsx(
            "h-[6px] flex-1 transition-colors duration-250 ease-arc",
            s.state === "done"
              ? "bg-go"
              : s.state === "current"
                ? "bg-arc-navy"
                : "bg-mist-600",
          )}
          title={s.label}
        />
      ))}
    </div>
  );
}

/** Circular percentage ring, used for module/course completion. */
export function ProgressRing({
  pct,
  size = 44,
  done,
  className,
}: {
  pct: number;
  size?: number;
  done?: boolean;
  className?: string;
}) {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-mist-600)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-go)"
          strokeWidth={4}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
          strokeLinecap="butt"
          className="transition-[stroke-dashoffset] duration-500 ease-arc"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {done ? (
          <Icon name="check" size={size * 0.42} className="text-go" />
        ) : (
          <span
            className="font-body font-bold text-arc-navy"
            style={{ fontSize: size * 0.24 }}
          >
            {Math.round(clamped)}%
          </span>
        )}
      </span>
    </span>
  );
}
