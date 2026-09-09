"use client";

import { useState, useId } from "react";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/Icon";

export type AccordionItem = { title: string; content: React.ReactNode };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border-t border-mist-600">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <AccordionRow
            key={i}
            item={item}
            isOpen={isOpen}
            onToggle={() => setOpen(isOpen ? null : i)}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div className={clsx("border-b border-mist-600", isOpen && "bg-mist-300")}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-[20px] min-h-[44px] px-[20px] text-left"
      >
        <span className="font-heading font-bold text-[24px] text-arc-navy">
          {item.title}
        </span>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={22}
          className="shrink-0 text-arc-navy"
        />
      </button>
      <div
        id={`${id}-panel`}
        className="grid transition-[grid-template-rows] duration-250 ease-arc"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-[20px] pb-[20px] font-body font-light text-[16px] text-arc-ink max-w-[65ch]">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}
