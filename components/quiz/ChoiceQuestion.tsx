"use client";

import { useState } from "react";
import type { ChoiceQuestion as ChoiceQuestionType } from "@/lib/schemas/quiz";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";

export function ChoiceQuestion({
  question,
  flagDraft,
  onAnswered,
}: {
  question: ChoiceQuestionType;
  flagDraft: boolean;
  onAnswered: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const right = answered && picked === question.answerIndex;

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
      <div className="flex flex-col gap-0.5">
        {question.options.map((option, i) => {
          const isPicked = picked === i;
          const showRight = answered && i === question.answerIndex;
          const showWrong = answered && isPicked && i !== question.answerIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={clsx(
                "text-left min-h-[52px] px-[16px] py-[14px] flex gap-3 items-center transition-colors duration-200 ease-arc",
                showRight
                  ? "bg-go-tint border-l-[6px] border-go"
                  : showWrong
                    ? "bg-caution-tint border-l-[6px] border-caution"
                    : isPicked
                      ? "bg-arc-navy text-arc-white border-l-[6px] border-transparent"
                      : "bg-arc-mist border-l-[6px] border-transparent",
              )}
            >
              <span
                className={clsx(
                  "font-heading font-semibold text-[11px] shrink-0",
                  isPicked && !answered ? "text-arc-sky" : "text-sky-800",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-body text-[16px] md:text-[17px] flex-1">
                {option}
              </span>
              {showRight && <Icon name="check" size={18} className="text-go" />}
            </button>
          );
        })}
      </div>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-[280ms] ease-arc",
          answered ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <Callout
            tone={right ? "go" : "caution"}
            title={right ? "Correct" : "Not this time"}
          >
            {question.why}
          </Callout>
        </div>
      </div>

      <div>
        {answered ? (
          <Button variant="primary" onClick={() => onAnswered(right)}>
            Next question
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={picked === null}
            onClick={() => setAnswered(true)}
          >
            Check my answer
          </Button>
        )}
      </div>
    </div>
  );
}
