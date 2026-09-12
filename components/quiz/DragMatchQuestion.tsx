"use client";

import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { DragMatchQuestion as DragMatchQuestionType } from "@/lib/schemas/quiz";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { clsx } from "@/lib/clsx";

function TermChip({
  id,
  text,
  placed,
}: {
  id: string;
  text: string;
  placed?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `term:${id}`,
  });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      className={clsx(
        "font-body font-bold text-[14px] px-3 py-2 cursor-grab touch-none select-none w-full text-left",
        placed ? "bg-arc-navy text-arc-white" : "bg-mist-500 text-arc-navy",
        isDragging && "opacity-50",
      )}
    >
      {text}
    </button>
  );
}

function DefinitionSlot({
  defId,
  definition,
  filledTerm,
  markCorrect,
}: {
  defId: string;
  definition: string;
  filledTerm?: { id: string; text: string };
  markCorrect?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `def:${defId}` });
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col gap-2 p-3 border-2 border-dashed min-h-[76px]",
        isOver ? "border-arc-sky bg-sky-100" : "border-navy-300",
        markCorrect === true && "ring-2 ring-go",
        markCorrect === false && "ring-2 ring-caution",
      )}
    >
      <p className="font-body text-[14px] text-arc-ink">{definition}</p>
      {filledTerm ? (
        <TermChip id={filledTerm.id} text={filledTerm.text} placed />
      ) : (
        <span className="font-heading text-[9px] uppercase tracking-[0.02em] text-sky-700">
          drop a term here
        </span>
      )}
    </div>
  );
}

export function DragMatchQuestion({
  question,
  flagDraft,
  onAnswered,
}: {
  question: DragMatchQuestionType;
  flagDraft: boolean;
  onAnswered: (correct: boolean) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const definitions = [...question.pairs].reverse();
  const placedTermIds = new Set(Object.values(placements));
  const bank = question.pairs.filter((p) => !placedTermIds.has(p.id));
  const allPlaced = question.pairs.every((p) => placements[p.id]);
  const correctCount = question.pairs.filter(
    (p) => placements[p.id] === p.id,
  ).length;
  const allCorrect = checked && correctCount === question.pairs.length;

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over) return;
    const termId = String(e.active.id).replace("term:", "");
    const defId = String(e.over.id).replace("def:", "");
    setPlacements((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (next[k] === termId) delete next[k];
      }
      next[defId] = termId;
      return next;
    });
    setChecked(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {flagDraft && !question.verified && (
        <Callout tone="caution" title="Draft question">
          Awaiting subject-matter review.
        </Callout>
      )}
      <h2 className="font-heading font-bold text-arc-navy text-[22px] md:text-[28px]">
        {question.prompt}
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {definitions.map((def) => {
            const termId = placements[def.id];
            const term = termId
              ? question.pairs.find((p) => p.id === termId)
              : undefined;
            return (
              <DefinitionSlot
                key={def.id}
                defId={def.id}
                definition={def.definition}
                filledTerm={term ? { id: term.id, text: term.term } : undefined}
                markCorrect={checked && termId ? termId === def.id : undefined}
              />
            );
          })}
        </div>

        {bank.length > 0 && (
          <div
            data-testid="term-bank"
            className="flex flex-col gap-2 border-t border-mist-600 pt-4"
          >
            {bank.map((p) => (
              <TermChip key={p.id} id={p.id} text={p.term} />
            ))}
          </div>
        )}
      </DndContext>
      <details className="border border-mist-500 rounded-lg p-4">
        <summary className="text-sm font-bold text-arc-navy">
          Prefer tapping? Choose answers from a list
        </summary>
        <div className="grid gap-4 mt-4">
          {definitions.map((def) => (
            <label key={def.id} className="text-sm">
              {def.definition}
              <select
                aria-label={def.definition}
                className="block w-full border border-navy-300 rounded-lg p-3 mt-2 bg-white"
                value={placements[def.id] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPlacements((prev) => {
                    const next = { ...prev };
                    for (const key of Object.keys(next))
                      if (next[key] === value) delete next[key];
                    next[def.id] = value;
                    return next;
                  });
                  setChecked(false);
                }}
              >
                <option value="">Choose a term</option>
                {question.pairs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.term}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </details>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-[280ms] ease-arc",
          checked ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <Callout
            tone={allCorrect ? "go" : "caution"}
            title={`${correctCount} of ${question.pairs.length} correct`}
          >
            {question.why}
          </Callout>
        </div>
      </div>

      <div>
        {!checked ? (
          <Button
            variant="primary"
            disabled={!allPlaced}
            onClick={() => setChecked(true)}
          >
            Check my answers
          </Button>
        ) : (
          <Button variant="primary" onClick={() => onAnswered(allCorrect)}>
            See your result
          </Button>
        )}
      </div>
    </div>
  );
}
