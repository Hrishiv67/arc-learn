import { resolveCitation } from "@/content/citations/registry";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

/** Renders a structured citation. Never invents rule language. */
export function Citation({ ruleNumber }: { ruleNumber: string }) {
  const c = resolveCitation(ruleNumber);
  if (!c) return null;
  const verified = !!c.quotedText;
  return (
    <div className="bg-mist-300 border-l-[6px] border-arc-navy p-4 md:p-4.5 flex flex-col gap-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone="navy">
          {c.season ? `${c.season} rule ${c.ruleNumber}` : c.ruleNumber}
        </Badge>
        <span className="inline-flex items-center gap-1.5">
          {verified && <Icon name="check" size={14} className="text-go" />}
          <span
            className={
              "font-heading font-semibold text-[10px] uppercase tracking-[0.03em] " +
              (verified ? "text-go" : "text-caution")
            }
          >
            {verified ? "Verified" : "Not yet verified"}
          </span>
        </span>
      </div>
      <p
        className={
          "font-body text-[16px] md:text-[17px] " +
          (verified ? "italic text-arc-ink" : "text-sky-800")
        }
      >
        {verified
          ? `“${c.quotedText}”`
          : `Pending verification. Topic: ${c.topic}.`}
      </p>
      <a
        href={c.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-arc-navy no-underline hover:text-sky-700"
      >
        Source
        <Icon name="arrow-up-right" size={14} />
      </a>
    </div>
  );
}
