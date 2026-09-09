"use client";

import Link from "next/link";
import { UNITS, MODULES } from "@/content/modules/registry";
import { useProgress, getCoursePct } from "@/lib/progress/local";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { isModuleComplete } from "@/lib/schemas/progress";
import { ProgressRing } from "@/components/ui/StepProgress";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { clsx } from "@/lib/clsx";

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

          <div className="mt-8 flex flex-col gap-6 md:hidden">
            <ProgressSummary
              coursePct={coursePct}
              completeCount={completeCount}
            />
          </div>

          <div className="mt-10 flex flex-col gap-8">
            {UNITS.map((u) => (
              <section key={u.unit}>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
                    Unit {u.unit}
                  </span>
                  <h2 className="font-heading font-bold text-arc-navy text-[22px] md:text-[26px]">
                    {u.title}
                  </h2>
                </div>
                <div className="mt-3 border-b border-mist-600">
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
                          "grid grid-cols-[44px_1fr] md:grid-cols-[52px_1fr_130px] gap-[14px] items-center min-h-[64px] px-[14px] py-[16px] border-t border-mist-600 transition-colors duration-200 ease-arc",
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
                            {!live && <Badge tone="mist" size="sm">Coming soon</Badge>}
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
                              <Badge tone="caution" size="sm">Locked</Badge>
                            )
                          ) : (
                            <Badge tone="mist" size="sm">Coming soon</Badge>
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
              </section>
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
      </div>
      <div className="border-t border-mist-600 pt-5">
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          What is live
        </span>
        <p className="font-body text-[16px] text-arc-ink mt-2.5">
          Module 1 is complete. The remaining twelve are being written and will
          open through the season.
        </p>
      </div>
    </div>
  );
}
