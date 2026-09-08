import { clsx } from "@/lib/clsx";

/** Squared card, no shadow. Hairline border on white, or mist fill in a grid. */
export function Card({
  variant = "hairline",
  className,
  children,
}: {
  variant?: "hairline" | "mist";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-none",
        variant === "hairline"
          ? "bg-arc-white border border-navy-200"
          : "bg-mist-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
