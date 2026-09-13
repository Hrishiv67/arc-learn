"use client";

import { useState } from "react";
import type { ChoiceQuestion as ChoiceQuestionType } from "@/lib/schemas/quiz";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { clsx } from "@/lib/clsx";

export function ChoiceQuestion({
  question,
  flagDraft,
  onAnswered,
  readingHref,
}: {
  question: ChoiceQuestionType;
  flagDraft: boolean;
  readingHref?: string;
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
      <h2 className="font-heading font-bold text-arc-navy text-[22px] md:text-[26px] leading-[1.25]">
        {question.prompt}
      </h2>
      <RadioGroup
        name={question.id}
        legend={question.prompt}
        hideLegend
        cards
        disabled={answered}
        value={picked === null ? undefined : String(picked)}
        onChange={(value) => setPicked(Number(value))}
        options={question.options.map((label, index) => ({
          value: String(index),
          label,
          state:
            answered && index === question.answerIndex
              ? "correct"
              : answered && index === picked
                ? "incorrect"
                : undefined,
        }))}
      />

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-[280ms] ease-arc",
          answered ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" hidden={!answered}>
          <Callout
            tone={right ? "go" : "caution"}
            title={right ? "Correct" : "Not this time"}
          >
            {question.why}
            {readingHref && (
              <a
                href={readingHref}
                className="block mt-3 text-sm font-bold underline underline-offset-4"
              >
                Review this in the reading
              </a>
            )}
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
