"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getModule, getModuleQuiz } from "@/lib/content/loadModule";
import { useProgress, recordQuizResult } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { StepProgress } from "@/components/ui/StepProgress";
import { getNextModule } from "@/content/modules/registry";
import { Container } from "@/components/ui/Container";

export function QuizClient({ slug }: { slug: string }) {
  const router = useRouter();
  const mod = getModule(slug);
  const quiz = getModuleQuiz(slug);
  const progress = useProgress();

  if (!mod || !quiz) notFound();
  if (!isModuleUnlocked(mod, progress)) notFound();

  const next = getNextModule(mod.order);
  const read = !!progress[mod.id]?.read;
  const quizDone = !!progress[mod.id]?.quiz;

  return (
    <Container className="py-7 md:py-9 pb-20 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12 items-start">
        <QuizRunner
          quiz={quiz}
          flagDraft={mod.needsReview}
          moduleTitle={mod.title}
          nextModuleTitle={
            next?.status === "soon"
              ? `Module ${next.order} · ${next.title}`
              : undefined
          }
          onComplete={(score, total) => recordQuizResult(mod.id, score, total)}
          onExit={() => router.push("/modules")}
        />

        <aside className="hidden md:flex flex-col gap-6 sticky top-28">
          <div>
            <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
              This module
            </span>
            <div className="mt-3">
              <StepProgress
                steps={[
                  { label: "Read the lesson", state: read ? "done" : "todo" },
                  {
                    label: "Take the quiz",
                    state: quizDone ? "done" : "current",
                  },
                ]}
              />
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
