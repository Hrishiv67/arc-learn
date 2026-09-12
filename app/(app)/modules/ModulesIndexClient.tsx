"use client";

import Link from "next/link";
import { UNITS, MODULES } from "@/content/modules/registry";
import { useProgress, getCoursePct } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { isModuleComplete } from "@/lib/schemas/progress";
import { ProgressRing } from "@/components/ui/StepProgress";
import { Button, TextButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { clsx } from "@/lib/clsx";
import { RocketBuild } from "@/components/rocket/RocketBuild";

export function ModulesIndexClient() {
  const progress = useProgress();
  const completeCount = MODULES.filter((m) =>
    isModuleComplete(progress[m.id]),
  ).length;
  const coursePct = getCoursePct(progress);

  return (
    <Container className="py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-8 md:gap-12 items-start">
        <div className="min-w-0">
          <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
            Course
          </span>
          <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px] mt-2">
            Rocketry for a first-year team
          </h1>

          <p className="mt-3 text-sky-800">
            A practical path from your first lesson to the launch field.
          </p>
          <div className="learning-card mt-6">
            <div>
              <span className="eyebrow">Available now · 9-minute reading</span>
              <h2 className="text-2xl mt-2">This Year&apos;s Challenge</h2>
              <p className="text-sm text-sky-800 mt-2">
                Read the lesson, explore the diagrams, and check your
                understanding.
              </p>
            </div>
            <Button
              href={
                progress["this-years-challenge"]?.read
                  ? "/modules/this-years-challenge/quiz"
                  : "/modules/this-years-challenge/lesson"
              }
            >
              {progress["this-years-challenge"]?.read
                ? "Continue to quiz"
                : "Start learning"}
            </Button>
          </div>
          <div className="mt-8 flex flex-col gap-6 md:hidden">
            <ProgressSummary
              coursePct={coursePct}
              completeCount={completeCount}
            />
          </div>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-mist-600 pb-3">
              <div>
                <span className="eyebrow">Course roadmap</span>
                <h2 className="text-2xl mt-1">What you&apos;ll learn</h2>
              </div>
              <span className="hidden sm:block text-sm text-sky-800">
                4 units · 13 modules
              </span>
            </div>
            {UNITS.map((u) => (
              <details
                key={u.unit}
                className="roadmap-unit border-b border-mist-600"
                open={u.unit === 1}
              >
                <summary className="grid grid-cols-[44px_1fr_auto] items-center gap-3 py-5 list-none">
                  <span className="roadmap-unit-number" aria-hidden="true">
                    {String(u.unit).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-heading font-bold text-arc-navy text-[20px] md:text-[22px]">
                      {u.title}
                    </span>
                    <span className="block text-[13px] text-sky-800 mt-0.5">
                      {u.modules.length} modules
                    </span>
                  </span>
                  <span className="roadmap-chevron" aria-hidden="true">
                    ⌄
                  </span>
                </summary>
                <div className="pb-4">
                  {u.modules.map((m) => {
                    const live = m.status === "live";
                    const unlocked = live && isModuleUnlocked(m, progress);
                    const complete = isModuleComplete(progress[m.id]);
                    const clickable = live && unlocked;
                    const row = (
                      <div
                        className={clsx(
                          // Not "opacity-70" for the locked/coming-soon rows —
                          // that washes text-sky-800 (already close to the AA
                          // floor) below WCAG contrast. The lock icon and
                          // Coming soon/Locked badge already carry the
                          // "not available" meaning at full opacity.
                          "grid grid-cols-[44px_1fr] md:grid-cols-[52px_1fr_130px] gap-[14px] items-center min-h-[64px] px-[14px] py-[14px] border-t border-mist-500 transition-colors duration-200 ease-arc",
                          clickable && "group hover:bg-mist-300",
                        )}
                      >
                        {live && unlocked ? (
                          <ProgressRing
                            pct={complete ? 100 : progress[m.id]?.read ? 40 : 0}
                            done={complete}
                            size={44}
                          />
                        ) : (
                          <span className="flex justify-center">
                            <Icon
                              name="lock"
                              size={18}
                              className="text-sky-800"
                            />
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="flex gap-2 items-baseline flex-wrap">
                            <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
                              Module {m.order}
                            </span>
                            {!live && (
                              <Badge tone="mist" size="sm">
                                Coming soon
                              </Badge>
                            )}
                          </div>
                          <span className="font-heading font-bold text-[18px] md:text-[20px] text-arc-navy group-hover:text-sky-700 transition-colors duration-200 ease-arc block mt-0.5">
                            {m.title}
                          </span>
                          <span className="font-body text-[13px] text-sky-800 block mt-1">
                            {live
                              ? `${m.estimatedMinutes} min · read, then quiz`
                              : `${m.estimatedMinutes} min`}
                          </span>
                        </div>
                        <div className="hidden md:flex justify-end">
                          {live ? (
                            unlocked ? (
                              complete ? (
                                <span className="inline-flex items-center gap-1.5 text-go font-body font-bold text-[13px]">
                                  <Icon name="check" size={16} /> Complete
                                </span>
                              ) : (
                                <span className="font-body font-bold text-[13px] text-arc-navy">
                                  {progress[m.id]?.read
                                    ? "In progress"
                                    : "Start"}
                                </span>
                              )
                            ) : (
                              <Badge tone="caution" size="sm">
                                Locked
                              </Badge>
                            )
                          ) : (
                            <Badge tone="mist" size="sm">
                              Coming soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                    return clickable ? (
                      <Link
                        key={m.id}
                        href={`/modules/${m.slug}`}
                        className="block"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div key={m.id}>{row}</div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>

        <aside className="hidden md:block sticky top-[92px]">
          <ProgressSummary
            coursePct={coursePct}
            completeCount={completeCount}
          />
        </aside>
      </div>
    </Container>
  );
}

function ProgressSummary({
  coursePct,
  completeCount,
}: {
  coursePct: number;
  completeCount: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          Your progress
        </span>
        <div className="flex items-center gap-3.5 mt-3">
          <ProgressRing pct={coursePct} size={56} />
          <span className="font-body text-[14px] text-arc-ink">
            {completeCount} of {MODULES.length} modules complete
          </span>
        </div>
        <div className="h-[8px] bg-mist-600 mt-[14px]">
          <div
            className="h-[8px] bg-go transition-[width] duration-500 ease-arc"
            style={{ width: `${coursePct}%` }}
          />
        </div>
        {completeCount > 0 && (
          <div className="mt-3">
            <TextButton tone="navy" href="/modules/results">
              See your results
            </TextButton>
          </div>
        )}
      </div>
      <div className="border-t border-mist-600 pt-5">
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          What is live
        </span>
        <p className="font-body text-[16px] text-arc-ink mt-2.5">
          Module 1 is available now. The remaining twelve are being written and
          will open through the season.
        </p>
      </div>
      <RocketBuild completeCount={completeCount} total={MODULES.length} />
    </div>
  );
}
