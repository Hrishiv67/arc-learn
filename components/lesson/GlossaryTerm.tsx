"use client";

import { useId, useRef, useState } from "react";
import { GLOSSARY_BY_ID } from "@/content/glossary/terms";

/**
 * Documented ARC Modules brand extension — no counterpart in the supplied
 * brand sources. A technical term gets a dotted underline; hover, tap, or
 * keyboard focus reveals a small definition popup. This is the other
 * legitimate user of the brand's one allowed `--shadow-overlay`, alongside
 * modals. Click/Enter toggles explicitly (not hover-only) so touch and
 * keyboard users get the same behavior as a mouse hover.
 */
export function GlossaryTerm({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const entry = GLOSSARY_BY_ID[id];
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);

  if (!entry) return <>{children}</>;

  return (
    <span
      ref={wrapRef}
      className="relative inline-block group"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={panelId}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="underline decoration-dotted decoration-sky-700 underline-offset-4 decoration-1 text-arc-ink [font:inherit] cursor-help"
      >
        {children}
        <span className="sr-only"> — see definition</span>
      </button>
      <span
        id={panelId}
        role="tooltip"
        hidden={!open}
        className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-2 w-[240px] bg-arc-white p-3.5 text-left"
        style={{ boxShadow: "var(--shadow-overlay)" }}
      >
        <span className="block font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
          {entry.term}
        </span>
        <span className="block font-body text-[14px] leading-snug text-arc-ink mt-1">
          {entry.definition}
        </span>
      </span>
    </span>
  );
}
