import { GLOSSARY_BY_ID } from "@/content/glossary/terms";

/**
 * Plain-language-first vocabulary block: the brand's "explain before you
 * name" rule as a visual grid instead of a dry definition list, so a first
 * pass through a section reads the concepts before the jargon.
 */
export function TermList({ ids }: { ids: string[] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-mist-600">
      {ids.map((id) => {
        const t = GLOSSARY_BY_ID[id];
        if (!t) return null;
        return (
          <div
            key={id}
            className="border-b border-mist-600 sm:odd:border-r py-4 sm:pr-6"
          >
            <dt className="font-heading font-bold text-[17px] text-arc-navy">
              {t.plain}
            </dt>
            <dd className="mt-1">
              <span className="font-heading font-semibold text-[12px] uppercase tracking-[0.03em] text-sky-800">
                Engineers call it: {t.term}
              </span>
              <p className="font-body text-[16px] text-arc-ink mt-1">
                {t.definition}
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
