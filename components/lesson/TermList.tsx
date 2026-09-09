import { GLOSSARY_BY_ID } from "@/content/glossary/terms";

/**
 * Plain-language-first vocabulary block: the brand's "explain before you
 * name" rule. One row per term — a fixed-width label column (plain name +
 * "Engineers call it") and a flexible definition column that reads as
 * normal flowing text, not a narrow card. A 2-up card grid here (an earlier
 * version of this component) squeezed definitions into ~300px columns and
 * wrapped badly; a single label+definition row per term, stacked, is both
 * the source design's actual layout and the one that reads cleanly.
 */
export function TermList({ ids }: { ids: string[] }) {
  return (
    <dl className="flex flex-col gap-0 border-t border-mist-600">
      {ids.map((id) => {
        const t = GLOSSARY_BY_ID[id];
        if (!t) return null;
        return (
          <div
            key={id}
            className="grid grid-cols-1 sm:grid-cols-[190px_minmax(0,1fr)] gap-[6px] sm:gap-[20px] border-b border-mist-600 py-[14px]"
          >
            <dt>
              <span className="font-heading font-bold text-[17px] text-arc-navy block">
                {t.plain}
              </span>
              <span className="font-heading font-semibold text-[13px] uppercase tracking-[0.03em] text-sky-800 block mt-[2px]">
                Engineers call it: {t.term.toLowerCase()}
              </span>
            </dt>
            <dd className="font-body text-[16px] md:text-[17px] text-arc-ink m-0">
              {t.definition}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
