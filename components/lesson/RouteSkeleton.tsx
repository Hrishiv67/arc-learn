import { Container } from "@/components/ui/Container";

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
    <Container className="py-7 md:py-9 pb-20 md:pb-20 animate-pulse">
      <div
        className={
          withRail
            ? "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12"
            : "max-w-[720px]"
        }
      >
        <div className="min-w-0 flex flex-col gap-6">
          <div className="flex flex-col gap-[10px]">
            <div className="h-[12px] w-[140px] bg-mist-300" />
            <div className="h-[38px] w-3/4 bg-mist-300" />
            <div className="h-[19px] w-1/2 bg-mist-300 mt-[6px]" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-[17px] w-full bg-mist-300" />
            <div className="h-[17px] w-full bg-mist-300" />
            <div className="h-[17px] w-2/3 bg-mist-300" />
          </div>
          <div className="h-[200px] w-full bg-mist-300" />
        </div>
        {withRail && (
          <div className="hidden md:flex flex-col gap-4">
            <div className="h-[12px] w-[100px] bg-mist-300" />
            <div className="h-[44px] w-full bg-mist-300" />
            <div className="h-[44px] w-full bg-mist-300" />
          </div>
        )}
      </div>
    </Container>
  );
}
