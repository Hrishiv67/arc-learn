"use client";

import { useMemo, useRef } from "react";
import { notFound } from "next/navigation";
import { getModule, getModuleLesson } from "@/lib/content/loadModule";
import { useProgress, markRead } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { Button, TextButton } from "@/components/ui/Button";
import { ReviewFlag } from "@/components/lesson/ReviewFlag";
import { LessonRail } from "@/components/lesson/LessonRail";
import { Container } from "@/components/ui/Container";

const RESOURCES = [
  { title: "Module 1 student handout", pages: 4 },
  { title: "Module 1 worksheets", pages: 3 },
  { title: "Module 1 instructor guide", pages: 6 },
];

export function LessonClient({ slug }: { slug: string }) {
  const mod = getModule(slug);
  const Lesson = useMemo(() => getModuleLesson(slug), [slug]);
  const progress = useProgress();
  const contentRef = useRef<HTMLDivElement>(null);

  if (!mod || !Lesson) notFound();
  if (!isModuleUnlocked(mod, progress)) notFound();

  const read = !!progress[mod.id]?.read;
  const quizDone = !!progress[mod.id]?.quiz;

  return (
    <Container className="py-7 md:py-9 pb-20 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12">
        <div className="min-w-0 flex flex-col gap-6">
          <div>
            <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
              Module {mod.order} · Reading
            </span>
            <h1 className="font-heading font-bold text-arc-navy text-[28px] md:text-[40px] mt-2">
              {mod.title}
            </h1>
            <p className="font-body text-[17px] md:text-[19px] text-arc-ink mt-3 max-w-[58ch]">
              {mod.summary}
            </p>
          </div>

          {mod.needsReview && <ReviewFlag />}

          <div
            ref={contentRef}
            className="prose-lesson flex flex-col gap-4 max-w-[64ch]"
          >
            {/* getModuleLesson resolves to a fixed, statically-imported MDX
                component per slug (never a fresh function per call), so this
                doesn't hit the "component created during render" concern
                react-hooks/static-components is checking for. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Lesson />
          </div>

          <div className="flex gap-4 items-center flex-wrap pt-2">
            <Button
              href={`/modules/${mod.slug}/quiz`}
              variant="primary"
              onClick={() => markRead(mod.id)}
            >
              Next: Take the quiz
            </Button>
            <TextButton href="/modules">Back to the course</TextButton>
          </div>
        </div>

        <aside className="hidden md:block">
          <LessonRail
            contentRef={contentRef}
            resources={RESOURCES}
            steps={[
              {
                id: "read",
                label: "Read the lesson",
                href: `/modules/${mod.slug}/lesson`,
                state: read ? "done" : "current",
              },
              {
                id: "check",
                label: "Take the quiz",
                href: `/modules/${mod.slug}/quiz`,
                state: quizDone ? "done" : "todo",
              },
            ]}
          />
        </aside>
      </div>
    </Container>
  );
}
