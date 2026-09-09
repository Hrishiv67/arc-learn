"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getModule, getModuleQuiz } from "@/lib/content/loadModule";
import { useProgress, recordQuizResult } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { LessonRail } from "@/components/lesson/LessonRail";
import { RESOURCES } from "@/app/modules/[slug]/lesson/LessonClient";
import { getNextModule, MODULES } from "@/content/modules/registry";
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
  const isFrontier = !MODULES.some(
    (m) => m.status === "live" && m.order > mod.order,
  );

  return (
    <Container className="py-7 md:py-9 pb-20 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12">
        <QuizRunner
          quiz={quiz}
          flagDraft={mod.needsReview}
          moduleTitle={mod.title}
          nextModuleTitle={
            next?.status === "soon"
              ? `Module ${next.order} · ${next.title}`
              : undefined
          }
          isFrontier={isFrontier}
          onComplete={(score, total) => recordQuizResult(mod.id, score, total)}
          onExit={() => router.push("/modules")}
        />

        <aside className="hidden md:block">
          <LessonRail
            resources={RESOURCES}
            steps={[
              {
                id: "read",
                label: "Read the lesson",
                href: `/modules/${mod.slug}/lesson`,
                state: read ? "done" : "todo",
              },
              {
                id: "check",
                label: "Take the quiz",
                href: `/modules/${mod.slug}/quiz`,
                state: quizDone ? "done" : "current",
              },
            ]}
          />
        </aside>
      </div>
    </Container>
  );
}
