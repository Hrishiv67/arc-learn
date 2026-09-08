"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  MeasuringStrategy,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { DragLabelQuestion } from "@/lib/schemas/quiz";
import {
  RocketCutaway,
  type RocketPartId,
} from "@/components/diagrams/RocketCutaway";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";

function LabelChip({
  id,
  text,
  placed,
}: {
  id: string;
  text: string;
  placed?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `label:${id}`,
    });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={clsx(
        "font-body font-bold text-[13px] px-2.5 py-1.5 cursor-grab touch-none select-none whitespace-nowrap",
        placed ? "bg-arc-navy text-arc-white" : "bg-mist-500 text-arc-navy",
        isDragging && "opacity-50 z-20 relative",
      )}
    >
      {text}
    </button>
  );
}

function TargetSlot({
  targetId,
  filledLabel,
}: {
  targetId: string;
  filledLabel?: { id: string; text: string };
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `target:${targetId}` });
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        // No min-h here: under this project's 10px spacing base, a
        // min-h-N class is N*10px, far taller than the 32px foreignObject
        // this sits in — h-full alone fills it correctly.
        "flex items-center justify-center h-full border-2 border-dashed transition-colors duration-150",
        isOver
          ? "border-arc-sky bg-sky-100"
          : "border-navy-300 bg-arc-white/70",
      )}
    >
      {filledLabel ? (
        <LabelChip id={filledLabel.id} text={filledLabel.text} placed />
      ) : (
        <span className="font-heading text-[9px] uppercase tracking-[0.02em] text-sky-700">
          drop
        </span>
      )}
    </div>
  );
}

export function DragLabelDiagram({
  question,
  flagDraft,
  onAnswered,
}: {
  question: DragLabelQuestion;
  flagDraft: boolean;
  onAnswered: (correct: boolean) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const placedLabelIds = new Set(Object.values(placements));
  const bank = question.labels.filter((l) => !placedLabelIds.has(l.id));
  const allPlaced = question.targets.every((t) => placements[t.id]);

  const targetByPart = useMemo(
    () =>
      new Map(
        question.targets.map((t) => [t.correctLabelId as RocketPartId, t]),
      ),
    [question.targets],
  );

  const correctCount = question.targets.filter(
    (t) => placements[t.id] === t.correctLabelId,
  ).length;
  const allCorrect = checked && correctCount === question.targets.length;

  function handleDragEnd(e: DragEndEvent) {
    if (!e.over) return;
    const labelId = String(e.active.id).replace("label:", "");
    const targetId = String(e.over.id).replace("target:", "");
    setPlacements((prev) => {
      const next = { ...prev };
      // clear this label from any prior slot
      for (const k of Object.keys(next)) {
        if (next[k] === labelId) delete next[k];
      }
      next[targetId] = labelId;
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
        // The drop targets live inside an SVG <foreignObject>, whose
        // position dnd-kit's default scroll-triggered remeasurement
        // doesn't reliably pick up — on a page tall enough to need
        // scrolling mid-drag (common with the diagram + bank on a short
        // viewport), that leaves stale target rects and a drop can
        // resolve to the wrong target. Forcing continuous remeasurement
        // keeps them accurate throughout the drag.
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
      >
        <RocketCutaway
          className="w-full"
          renderLabel={(partId) => {
            const target = targetByPart.get(partId);
            if (!target) return null;
            const labelId = placements[target.id];
            const label = labelId
              ? question.labels.find((l) => l.id === labelId)
              : undefined;
            const wrong =
              checked && labelId && labelId !== target.correctLabelId;
            const right = checked && labelId === target.correctLabelId;
            return (
              <div
                className={clsx(
                  "h-full",
                  right && "ring-2 ring-go",
                  wrong && "ring-2 ring-caution",
                )}
              >
                <TargetSlot targetId={target.id} filledLabel={label} />
              </div>
            );
          }}
        />

        {bank.length > 0 && (
          <div
            data-testid="label-bank"
            className="flex flex-wrap gap-2 border-t border-mist-600 pt-4"
          >
            {bank.map((l) => (
              <LabelChip key={l.id} id={l.id} text={l.text} />
            ))}
          </div>
        )}
      </DndContext>

      {checked && (
        <Callout
          tone={allCorrect ? "go" : "caution"}
          title={`${correctCount} of ${question.targets.length} correct`}
        >
          {question.why}
        </Callout>
      )}

      <div className="flex gap-4 items-center">
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
            Next question
          </Button>
        )}
        {!allPlaced && (
          <span className="font-body text-[13px] text-sky-800 inline-flex items-center gap-1.5">
            <Icon name="grip" size={14} /> Drag every label onto the diagram
          </span>
        )}
      </div>
    </div>
  );
}
