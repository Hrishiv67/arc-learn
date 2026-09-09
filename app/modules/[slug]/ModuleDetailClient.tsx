"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule } from "@/lib/content/loadModule";
import { useProgress } from "@/lib/progress/local";
import { isModuleUnlocked, lockedReason } from "@/lib/progress/gating";
import { isModuleComplete } from "@/lib/schemas/progress";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Badge } from "@/components/ui/Badge";
import { VideoPlaceholder } from "@/components/lesson/VideoPlaceholder";
import { Container } from "@/components/ui/Container";

export function ModuleDetailClient({ slug }: { slug: string }) {
  const mod = getModule(slug);
  const progress = useProgress();

  if (!mod) notFound();

  if (mod.status !== "live") {
    return (
      <Container className="py-12">
        <Badge tone="mist">Coming soon</Badge>
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[36px] mt-4">
          {mod.title}
        </h1>
        <p className="font-body text-[17px] text-arc-ink mt-4 max-w-[58ch]">
          {mod.summary} This module is being written and will open later this
          season.
        </p>
        <Button href="/modules" variant="outline" className="mt-6">
          Back to the course
        </Button>
      </Container>
    );
  }

  const unlocked = isModuleUnlocked(mod, progress);

  if (!unlocked) {
    const blocker = lockedReason(mod, progress);
    return (
      <Container className="py-12">
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[36px]">
          {mod.title}
        </h1>
        <Callout tone="caution" title="Locked" className="mt-6">
          {blocker
            ? `Finish "${blocker.title}" first — it's a prerequisite for this module, not a formality. Safety content has to come before build or launch content.`
            : "This module isn't available yet."}
        </Callout>
        {blocker && (
          <Button
            href={`/modules/${blocker.slug}`}
            variant="primary"
            className="mt-6"
          >
            Go to {blocker.title}
          </Button>
        )}
      </Container>
    );
  }

  const complete = isModuleComplete(progress[mod.id]);

  return (
    <Container className="py-12 flex flex-col gap-6">
      <div>
        <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.03em] text-sky-800">
          Module {mod.order} · {mod.unitTitle}
        </span>
        <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[36px] mt-2">
          {mod.title}
        </h1>
        <p className="font-body text-[18px] text-arc-ink mt-4 max-w-[58ch]">
          {mod.summary}
        </p>
      </div>

      <VideoPlaceholder
        minutes={mod.estimatedMinutes}
        covers={[
          "This season's flight goal, figure by figure",
          "The parts of a competition rocket",
          "How a score is calculated from altitude and duration",
        ]}
        lessonHref={`/modules/${mod.slug}/lesson`}
      />

      {complete && (
        <div>
          <Button
            href={`/modules/${mod.slug}/quiz`}
            variant="outline"
            size="lg"
          >
            Retake the quiz
          </Button>
        </div>
      )}

      <Link
        href="/modules"
        className="font-body font-bold text-[15px] text-arc-navy hover:text-sky-700 w-fit"
      >
        Back to the course
      </Link>
    </Container>
  );
}
