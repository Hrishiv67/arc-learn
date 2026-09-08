import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * Video is a content slot, never a blocker. This is a designed, intentional
 * placeholder — not a broken embed. No play glyph, no black box, no spinner.
 * Drop a real videoId onto the module later and this component goes away
 * with no other code changes required.
 */
export function VideoPlaceholder({
  minutes,
  covers,
  lessonHref,
}: {
  minutes: number;
  covers: string[];
  lessonHref: string;
}) {
  return (
    <div className="bg-arc-mist p-5 md:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge tone="navy">In production</Badge>
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          {minutes} min once it&apos;s ready
        </span>
      </div>
      <div>
        <p className="font-body text-[16px] text-arc-ink mb-2">
          This module&apos;s video hasn&apos;t been produced yet. Here&apos;s
          what it will cover:
        </p>
        <ul className="font-body text-[16px] text-arc-ink list-disc pl-5 space-y-1">
          {covers.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <Button href={lessonHref} variant="primary">
          Read the lesson instead
        </Button>
      </div>
    </div>
  );
}
