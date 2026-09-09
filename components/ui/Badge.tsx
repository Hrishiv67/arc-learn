import { clsx } from "@/lib/clsx";

type Tone = "navy" | "red" | "sky" | "mist" | "go" | "caution" | "outline";

const toneClasses: Record<Tone, string> = {
  navy: "bg-arc-navy text-arc-white",
  red: "bg-arc-red text-arc-white",
  sky: "bg-arc-sky text-arc-navy",
  mist: "bg-mist-300 text-arc-navy",
  go: "bg-go-tint text-go",
  caution: "bg-caution-tint text-caution",
  outline: "bg-transparent text-arc-navy border border-navy-200",
};

/**
 * Small squared status/metadata label. Uppercase, label face.
 *
 * "md" (default) matches the design system's own Badge (14px, 10/5px
 * padding) — used for rule-citation tags ("2027 RULE 2", "VERIFIED"). "sm"
 * matches the artifact's separate, bespoke module-row status pill (10px,
 * 8/4px padding) — used for "Coming soon"/"Locked" in a tight list column,
 * where the larger size wraps onto two lines.
 */
export function Badge({
  children,
  tone = "navy",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-heading font-semibold uppercase tracking-[0.04em] rounded-none",
        size === "md"
          ? "px-[10px] py-[5px] text-[14px] leading-[1.1]"
          : "px-[8px] py-[4px] text-[10px] leading-[1.2]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
