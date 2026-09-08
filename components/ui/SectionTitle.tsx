import { clsx } from "@/lib/clsx";

export function SectionTitle({
  eyebrow,
  title,
  size = "md",
  className,
}: {
  eyebrow?: string;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-[22px] md:text-[26px]",
    md: "text-[26px] md:text-[32px]",
    lg: "text-[30px] md:text-[42px]",
  } as const;
  return (
    <div className={className}>
      {eyebrow && (
        <span className="block font-heading font-semibold text-[11px] uppercase tracking-[0.04em] text-sky-800 mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className={clsx("font-heading font-bold text-arc-navy", sizes[size])}>
        {title}
      </h2>
    </div>
  );
}
