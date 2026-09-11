"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/schemas/quiz";
import { Callout } from "@/components/ui/Callout";
import { Button, TextButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { DragLabelDiagram } from "./DragLabelDiagram";
import { DragMatchQuestion } from "./DragMatchQuestion";
import { clsx } from "@/lib/clsx";

export function QuizRunner({
  quiz,
  flagDraft,
  moduleTitle,
  nextModuleTitle,
  isFrontier,
  onComplete,
  onExit,
}: {
  quiz: Quiz;
  flagDraft: boolean;
  moduleTitle: string;
  nextModuleTitle?: string;
  /** True once this is the last live module with no live module after it —
   * i.e. the learner has now taken every quiz that's currently available. */
  isFrontier?: boolean;
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}) {
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState<boolean[]>([]);

  const total = quiz.questions.length;
  const finished = i >= total;
  const score = marks.filter(Boolean).length;
  const pct = finished ? Math.round((score / total) * 100) : 0;
  const passed = finished && score / total >= quiz.passRate;

  function handleAnswered(correct: boolean) {
    const next = [...marks, correct];
    setMarks(next);
    if (i === total - 1) {
      onComplete(next.filter(Boolean).length, total);
    }
    setI(i + 1);
  }

  function retry() {
    setI(0);
    setMarks([]);
  }

  return (
    <div className="max-w-[760px] flex flex-col gap-6">
      <div>
        <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
          Quiz
        </span>
        <h1 className="font-heading font-bold text-arc-navy text-[28px] md:text-[40px] mt-2">
          {moduleTitle}
        </h1>
      </div>

      {!finished && (
        <p className="font-body text-[13px] text-sky-800">
          Question {i + 1} of {total} · answer from the reading, not from memory
          alone
        </p>
      )}

      <div className="flex gap-1.5 items-center">
        {quiz.questions.map((_, k) => (
          <span
            key={k}
            className={clsx(
              "h-[6px] flex-1 transition-colors duration-250 ease-arc",
              k < marks.length
                ? marks[k]
                  ? "bg-go"
                  : "bg-caution"
                : k === i
                  ? "bg-arc-navy"
                  : "bg-mist-600",
            )}
          />
        ))}
      </div>

      {finished ? (
        <>
          <Callout
            tone={passed ? "go" : "caution"}
            title={`${score} of ${total} correct · ${pct}% accuracy`}
          >
            {passed
              ? `Module complete — ${pct}% clears the ${Math.round(quiz.passRate * 100)}% bar. Retake it any time.`
              : `${Math.round(quiz.passRate * 100)}% is the bar for this module. Review the explanations below and try again — no limit, no penalty.`}
          </Callout>

          <div className="flex flex-col border-t border-mist-600">
            {quiz.questions.map((q, k) => (
              <div
                key={q.id}
                className="flex gap-3 items-start border-b border-mist-600 py-3.5"
              >
                <Icon
                  name={marks[k] ? "check" : "x"}
                  size={16}
                  className={clsx(
                    "mt-0.5 shrink-0",
                    marks[k] ? "text-go" : "text-caution",
                  )}
                />
                <div className="min-w-0">
                  <p className="font-body text-[16px] text-arc-ink">
                    {q.prompt}
                  </p>
                  <p className="font-body text-[13px] text-sky-800 mt-1">
                    {q.why}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <Button variant="primary" onClick={onExit}>
              Back to the course
            </Button>
            <TextButton onClick={retry}>Try again</TextButton>
            <TextButton tone="navy" href="/modules/results">
              See your results
            </TextButton>
          </div>

          {isFrontier && passed && (
            <Callout tone="go" title="You're caught up">
              Every module that&rsquo;s live right now is complete. See your
              full scorecard — including what&rsquo;s worth a reread — on the
              results page.
            </Callout>
          )}

          {nextModuleTitle && (
            <div className="border-t border-mist-600 pt-5">
              <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
                Next up
              </span>
              <h3 className="font-heading font-bold text-arc-navy text-[21px] md:text-[24px] mt-2">
                {nextModuleTitle}
              </h3>
              <p className="font-body text-[16px] text-arc-ink mt-1.5">
                Being written now. It opens later this season.
              </p>
            </div>
          )}
        </>
      ) : (
        <QuestionSwitch
          key={quiz.questions[i].id}
          question={quiz.questions[i]}
          flagDraft={flagDraft}
          onAnswered={handleAnswered}
        />
      )}
    </div>
  );
}

function QuestionSwitch({
  question,
  flagDraft,
  onAnswered,
}: {
  question: Quiz["questions"][number];
  flagDraft: boolean;
  onAnswered: (correct: boolean) => void;
}) {
  switch (question.type) {
    case "choice":
      return (
        <ChoiceQuestion
          question={question}
          flagDraft={flagDraft}
          onAnswered={onAnswered}
        />
      );
    case "drag-label":
      return (
        <DragLabelDiagram
          question={question}
          flagDraft={flagDraft}
          onAnswered={onAnswered}
        />
      );
    case "drag-match":
      return (
        <DragMatchQuestion
          question={question}
          flagDraft={flagDraft}
          onAnswered={onAnswered}
        />
      );
  }
}
