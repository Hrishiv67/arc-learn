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

/** Small squared status/metadata label. Uppercase, label face. */
export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 font-heading font-semibold text-[10px] uppercase tracking-[0.04em] rounded-none",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
