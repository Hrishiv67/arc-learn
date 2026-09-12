import { Loading } from "@/components/ui/Loading";

/**
 * Shown instantly by Next.js while a route segment's real content streams
 * in (see loading.tsx in the sibling route folders) — belt-and-suspenders
 * alongside generateStaticParams, which should make that gap nearly zero
 * for a prefetched link, but a cold direct visit or a slow connection still
 * hits it. Shape roughly matches the two-column lesson/quiz layout so
 * nothing shifts when the real content swaps in.
 */
export function RouteSkeleton({ withRail = true }: { withRail?: boolean }) {
  return (
    <Loading
      label={
        withRail ? "Fueling your next lesson…" : "Opening the flight plan…"
      }
    />
  );
}
