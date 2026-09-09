"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/Icon";
import { StepDot } from "@/components/ui/StepDot";
import type { StepState } from "@/components/ui/StepProgress";

export type LessonStep = {
  id: string;
  label: string;
  href: string;
  state: StepState;
};

/**
 * Desktop-only lesson rail: step nav (Read/Quiz), a scrollspy of the MDX
 * lesson's <h2> sections (ids added in mdx-components.tsx), and downloads.
 * Sections are discovered from the DOM rather than structured content data,
 * since lesson bodies are real MDX, not the JSON block arrays this was
 * modeled on.
 */
export function LessonRail({
  steps,
  contentRef,
  resources,
}: {
  steps: LessonStep[];
  contentRef: RefObject<HTMLElement | null>;
  resources: { title: string; pages: number }[];
}) {
  const [sections, setSections] = useState<{ id: string; label: string }[]>(
    [],
  );
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const headings = Array.from(
      root.querySelectorAll<HTMLHeadingElement>("h2[id]"),
    );
    setSections(headings.map((h) => ({ id: h.id, label: h.textContent ?? "" })));
    if (headings.length === 0) return;

    // The artifact this rail is modeled on observes whole <section> blocks
    // (heading + all its body content) with an IntersectionObserver, so a
    // section stays "active" for its full height. Raw MDX has no such
    // wrapper — headings are bare siblings — so observing just the h2 would
    // only flag it active for the instant it crosses the band. Instead:
    // the active section is whichever heading is the last one scrolled
    // above the read line (just below the sticky header).
    const READ_LINE = 110;
    function updateActive() {
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= READ_LINE) current = h.id;
      }
      setActive(current);
    }
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [contentRef]);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 84,
      behavior: "smooth",
    });
  }

  return (
    <div
      className="flex flex-col gap-6 sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto pr-1"
    >
      <div>
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          This module
        </span>
        <div className="mt-3 flex flex-col">
          {steps.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className={clsx(
                "flex items-center gap-3 min-h-11 px-3 border-l-[3px] transition-colors duration-200 ease-arc",
                s.state === "current"
                  ? "bg-mist-300 border-arc-navy"
                  : "border-transparent hover:bg-mist-300",
              )}
            >
              <StepDot state={s.state} />
              <span
                className={clsx(
                  "font-body text-[16px] text-arc-navy",
                  s.state === "current" ? "font-bold" : "font-light",
                )}
              >
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {sections.length > 0 && (
        <div className="border-t border-mist-600 pt-4">
          <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
            In this lesson
          </span>
          <div className="mt-2 flex flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(s.id)}
                className={clsx(
                  "text-left min-h-10 px-2.5 py-2 border-l-[3px] font-body text-[15px] transition-colors duration-200 ease-arc",
                  active === s.id
                    ? "border-arc-navy text-arc-navy font-bold"
                    : "border-transparent text-arc-ink font-light",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-mist-600 pt-4">
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          Downloads
        </span>
        <div className="flex flex-col gap-3 mt-3">
          {resources.map((r) => (
            <a
              key={r.title}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex gap-2.5 items-start no-underline"
            >
              <Icon
                name="download"
                size={15}
                className="text-sky-800 mt-0.5 shrink-0"
              />
              <span>
                <span className="font-body font-bold text-[15px] text-arc-navy block">
                  {r.title}
                </span>
                <span className="font-body text-[13px] text-sky-800">
                  PDF · {r.pages} pages
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
