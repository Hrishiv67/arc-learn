import { describe, expect, it } from "vitest";
import { MODULES } from "@/content/modules/registry";
import { getModuleLesson, getModuleQuiz } from "@/lib/content/loadModule";
import { scoreFlight } from "@/lib/content/scoring";
import { SEASON } from "@/content/seasons/2027";
import { COURSE_RESOURCES } from "@/content/resources";

describe("published course content", () => {
  it("every live module has a lesson and a valid, answerable quiz", () => {
    for (const mod of MODULES.filter((m) => m.status === "live")) {
      expect(getModuleLesson(mod.slug), mod.slug).toBeTruthy();
      const quiz = getModuleQuiz(mod.slug)!;
      expect(quiz.moduleId).toBe(mod.id);
      expect(new Set(quiz.questions.map((q) => q.id)).size).toBe(
        quiz.questions.length,
      );
      for (const q of quiz.questions) {
        if (q.type === "choice")
          expect(q.options[q.answerIndex], `${mod.id}/${q.id}`).toBeTruthy();
        if (q.type === "drag-label")
          for (const target of q.targets)
            expect(
              q.labels.some((label) => label.id === target.correctLabelId),
            ).toBe(true);
      }
    }
  });
  it("resource IDs are unique and use secure original links", () => {
    expect(new Set(COURSE_RESOURCES.map((r) => r.id)).size).toBe(
      COURSE_RESOURCES.length,
    );
    for (const r of COURSE_RESOURCES)
      expect(new URL(r.href).protocol).toBe("https:");
  });
});

describe("qualification scoring", () => {
  const altitude = Number(SEASON.parameters.targetAltitude.value);
  const { durationMin, durationMax, pointsPerSecond } = SEASON.scoring;
  it("includes both duration boundaries in the zero-penalty window", () => {
    expect(scoreFlight(altitude, durationMin)?.total).toBe(0);
    expect(scoreFlight(altitude, durationMax)?.total).toBe(0);
  });
  it("scores equal altitude misses equally and adds duration penalties", () => {
    expect(scoreFlight(altitude + 10, durationMax + 2)?.total).toBe(
      10 + 2 * pointsPerSecond,
    );
    expect(scoreFlight(altitude - 10, durationMin - 2)?.total).toBe(
      10 + 2 * pointsPerSecond,
    );
    expect(scoreFlight(altitude, durationMax + 0.25)?.total).toBe(
      pointsPerSecond / 4,
    );
  });
  it("rejects invalid readings instead of displaying a plausible score", () => {
    expect(scoreFlight(NaN, durationMin)).toBeNull();
    expect(scoreFlight(altitude, -1)).toBeNull();
    expect(scoreFlight(Infinity, durationMin)).toBeNull();
  });
});
