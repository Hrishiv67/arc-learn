"use client";
import { ModuleDetailClient } from "../ModuleDetailClient";

import { isModuleComplete } from "@/lib/schemas/progress";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getModule, getModuleQuiz } from "@/lib/content/loadModule";
import { useProgress, recordQuizResult } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { QuizRunner } from "@/components/quiz/QuizRunner";

import { getNextModule, MODULES } from "@/content/modules/registry";
import { Container } from "@/components/ui/Container";

export function QuizClient({ slug }: { slug: string }) {
  const router = useRouter();
  const mod = getModule(slug);
  const quiz = getModuleQuiz(slug);
  const progress = useProgress();

  if (!mod || !quiz) notFound();
  if (!isModuleUnlocked(mod, progress))
    return <ModuleDetailClient slug={slug} />;

  const next = getNextModule(mod.order);
  const isFrontier = MODULES.filter(
    (m) => m.status === "live" && m.id !== mod.id,
  ).every((m) => isModuleComplete(progress[m.id]));

  return (
    <Container className="py-7 md:py-9 pb-20 md:pb-20">
      <div>
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
      </div>
    </Container>
  );
}
