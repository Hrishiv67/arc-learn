"use client";

import { useMemo } from "react";
import { notFound } from "next/navigation";
import { getModule, getModuleLesson } from "@/lib/content/loadModule";
import { useProgress, markRead } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { Button, TextButton } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/StepProgress";
import { ReviewFlag } from "@/components/lesson/ReviewFlag";
import { Icon } from "@/components/ui/Icon";

const RESOURCES = [
  { title: "Module 1 student handout", pages: 4 },
  { title: "Module 1 worksheets", pages: 3 },
  { title: "Module 1 instructor guide", pages: 6 },
];

export function LessonClient({ slug }: { slug: string }) {
  const mod = getModule(slug);
  const Lesson = useMemo(() => getModuleLesson(slug), [slug]);
  const progress = useProgress();

  if (!mod || !Lesson) notFound();
  if (!isModuleUnlocked(mod, progress)) notFound();

  const read = !!progress[mod.id]?.read;
  const quizDone = !!progress[mod.id]?.quiz;

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-7 md:py-9 pb-20 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12 items-start">
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

          <div className="prose-lesson flex flex-col gap-4 max-w-[64ch]">
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

        <aside className="hidden md:flex flex-col gap-6 sticky top-28">
          <div>
            <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
              This module
            </span>
            <div className="mt-3">
              <StepProgress
                steps={[
                  {
                    label: "Read the lesson",
                    state: read ? "done" : "current",
                  },
                  { label: "Take the quiz", state: quizDone ? "done" : "todo" },
                ]}
              />
            </div>
          </div>
          <div className="border-t border-mist-600 pt-4">
            <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
              Downloads
            </span>
            <div className="flex flex-col gap-3 mt-3">
              {RESOURCES.map((r) => (
                <a
                  key={r.title}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex gap-2.5 items-start no-underline"
                >
                  <Icon
                    name="download"
                    size={15}
                    className="text-sky-800 mt-0.5 shrink-0"
                  />
                  <span>
                    <span className="font-body font-bold text-[15px] text-arc-navy block">
                      {r.title}
                    </span>
                    <span className="font-body text-[13px] text-sky-800">
                      PDF · {r.pages} pages
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
