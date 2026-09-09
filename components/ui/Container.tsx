import { clsx } from "@/lib/clsx";

/**
 * Shared page-shell width. 1200px matches the approved prototype's own
 * maxWidth convention (project/arc-main.jsx's TopBar), widening slightly
 * at xl so a 1920px monitor isn't mostly dead space — one deliberate
 * breakpoint step, not a new grid system.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1200px] px-5 md:px-10 xl:max-w-[1320px] xl:px-[60px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
