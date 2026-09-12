"use client";

import { MODULES } from "@/content/modules/registry";
import { useProgress, getCoursePct } from "@/lib/progress/local";
import { isModuleComplete } from "@/lib/schemas/progress";
import { ProgressRing } from "@/components/ui/StepProgress";
import { Callout } from "@/components/ui/Callout";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Button, TextButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

// A passed quiz clears 70% (lib/schemas/progress.ts's isModuleComplete). A
// score in [70, 90) still counts as complete but reads as shaky — that's
// the line between "solid" and "worth a re-read" below.
const SOLID_BAR = 0.9;

type Attempt = {
  module: (typeof MODULES)[number];
  score: number;
  total: number;
};

/**
 * "How am I doing across the whole course" screen — real data only: every
 * live module's quiz score, drawn straight from progress state. No invented
 * subject scores or grading beyond what the learner actually answered.
 * Reachable any time from the course index and from a finished quiz, not
 * just once at a literal end — since the course itself ships module by
 * module through the season, "caught up" means "solid on everything live
 * right now," and this re-evaluates that every time it's opened.
 */
export function ResultsClient() {
  const progress = useProgress();
  const coursePct = getCoursePct(progress);
  const liveModules = MODULES.filter((m) => m.status === "live");

  const attempts: Attempt[] = liveModules.flatMap((m) => {
    const quiz = progress[m.id]?.quiz;
    return quiz ? [{ module: m, score: quiz.score, total: quiz.total }] : [];
  });

  const completedCount = attempts.filter((a) =>
    isModuleComplete(progress[a.module.id]),
  ).length;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
  const overallAccuracy = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  const needsReview = attempts.filter((a) => a.score / a.total < SOLID_BAR);
  const allLiveDone =
    liveModules.length > 0 &&
    liveModules.every((m) => isModuleComplete(progress[m.id]));

  if (attempts.length === 0) {
    return (
      <Container className="py-8 md:py-12">
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          Your results
        </span>
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px] mt-2">
          Nothing to show yet
        </h1>
        <p className="font-body text-[17px] text-arc-ink mt-3 max-w-[58ch]">
          Take a module&rsquo;s quiz and this screen will fill in with your
          score, your overall accuracy, and which subjects are worth a
          second look.
        </p>
        <div className="mt-6">
          <Button href="/modules">Go to the course</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
        Your results
      </span>
      <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px] mt-2">
        {allLiveDone ? "You're caught up" : "Your results so far"}
      </h1>
      <p className="font-body text-[17px] text-arc-ink mt-3 max-w-[58ch]">
        {allLiveDone
          ? "Every module that's live right now is complete. Here's where you're solid and what's worth rereading before the next unit opens."
          : "A running scorecard across every module you've taken the quiz for."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] gap-8 md:gap-12 mt-10 items-start">
        <div className="flex md:flex-col items-center gap-6 md:gap-3 md:w-[200px]">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing pct={coursePct} size={88} done={coursePct === 100} />
            <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
              Full course
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-body font-bold text-[16px] text-arc-navy">
              {completedCount} of {liveModules.length} live modules complete
            </span>
            <span className="font-body text-[14px] text-sky-800">
              {overallAccuracy}% overall quiz accuracy
            </span>
          </div>
        </div>

        <div className="min-w-0 flex flex-col gap-8">
          {needsReview.length > 0 ? (
            <Callout tone="caution" title="Worth a second look">
              {needsReview.length === 1
                ? `${needsReview[0].module.title} came in under ${Math.round(SOLID_BAR * 100)}%. A quick reread before it locks in would help.`
                : `These came in under ${Math.round(SOLID_BAR * 100)}%: ${needsReview
                    .map((a) => a.module.title)
                    .join(", ")}. A quick reread before they lock in would help.`}
            </Callout>
          ) : (
            <Callout tone="go" title="Solid across the board">
              Every module you&rsquo;ve completed is at{" "}
              {Math.round(SOLID_BAR * 100)}% or higher.
            </Callout>
          )}

          <div className="border-t border-mist-600">
            {attempts.map((a) => {
              const pct = Math.round((a.score / a.total) * 100);
              const solid = a.score / a.total >= SOLID_BAR;
              return (
                <div
                  key={a.module.id}
                  className="grid grid-cols-[44px_1fr] gap-[14px] items-center min-h-[64px] px-[14px] py-[16px] border-b border-mist-600"
                >
                  <Icon
                    name={solid ? "circle-check" : "triangle-alert"}
                    size={22}
                    className={solid ? "text-go" : "text-caution"}
                  />
                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-800">
                        Module {a.module.order}
                      </span>
                      <span className="font-heading font-bold text-[18px] text-arc-navy block mt-0.5">
                        {a.module.title}
                      </span>
                      <span className="font-body text-[13px] text-sky-800 block mt-1">
                        {a.score} of {a.total} correct · {pct}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge tone={solid ? "go" : "caution"} size="sm">
                        {solid ? "Solid" : "Worth a reread"}
                      </Badge>
                      <TextButton
                        tone="navy"
                        href={`/modules/${a.module.slug}/lesson`}
                      >
                        Reread
                      </TextButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <Button href="/modules" variant="outline">
              Back to the course
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
