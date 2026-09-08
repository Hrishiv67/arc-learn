import { clsx } from "@/lib/clsx";

export type Stat = { value: string; unit: string; label: string };

/**
 * Documented ARC Modules brand extension. Flush navy/mist alternating strip
 * of figures (e.g. season parameters). Value + unit sit on one baseline with
 * generous padding and a flexible track so long values (e.g. "37-40") never
 * overflow the cell — the original prototype hit exactly that bug with a
 * fixed-width value at a narrow track.
 */
export function StatTiles({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid gap-0",
        "grid-cols-1 min-[481px]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        className,
      )}
    >
      {stats.map((s, i) => {
        const dark = i % 2 === 0;
        return (
          <div
            key={i}
            className={clsx(
              "flex flex-col gap-1.5 px-5 py-5 min-w-0",
              dark ? "bg-arc-navy" : "bg-mist-300",
            )}
          >
            <span className="flex items-baseline gap-1.5 flex-wrap min-w-0">
              <span
                className={clsx(
                  "font-heading font-bold leading-none",
                  dark ? "text-white" : "text-arc-navy",
                )}
                style={{ fontSize: 32 }}
              >
                {s.value}
              </span>
              <span
                className={clsx(
                  "font-heading font-semibold text-[13px] uppercase tracking-[0.03em]",
                  dark ? "text-arc-sky" : "text-sky-800",
                )}
              >
                {s.unit}
              </span>
            </span>
            <span
              className={clsx(
                "font-heading font-semibold text-[11px] uppercase tracking-[0.03em]",
                dark ? "text-arc-sky" : "text-sky-800",
              )}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
