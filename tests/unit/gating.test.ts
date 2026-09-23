import { describe, it, expect } from "vitest";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { getModule } from "@/lib/content/loadModule";
import type { ProgressState } from "@/lib/schemas/progress";

describe("safety-gate prerequisite logic", () => {
  const buildingIt = { ...getModule("building-it")!, status: "live" as const };
  const launchDay = { ...getModule("launch-day")!, status: "live" as const };
  const thisYearsChallenge = getModule("this-years-challenge")!;

  it("locks Building It until Safety First is complete", () => {
    const empty: ProgressState = {};
    expect(isModuleUnlocked(buildingIt, empty)).toBe(false);
  });

  it("locks Launch Day until Safety First is complete", () => {
    const empty: ProgressState = {};
    expect(isModuleUnlocked(launchDay, empty)).toBe(false);
  });

  it("unlocks Building It once Safety First quiz passes the 70% bar", () => {
    const progress: ProgressState = {
      "safety-first": { read: true, quiz: { score: 8, total: 10 } },
    };
    expect(isModuleUnlocked(buildingIt, progress)).toBe(true);
  });

  it("does NOT unlock on a failing quiz score below the pass bar", () => {
    const progress: ProgressState = {
      "safety-first": { read: true, quiz: { score: 5, total: 10 } },
    };
    expect(isModuleUnlocked(buildingIt, progress)).toBe(false);
  });

  it("unreleased modules stay locked regardless of prerequisites", () => {
    expect(
      isModuleUnlocked({ ...thisYearsChallenge, status: "soon" }, {}),
    ).toBe(false);
  });

  it("Module 1 has no prerequisites and is always unlocked", () => {
    expect(isModuleUnlocked(thisYearsChallenge, {})).toBe(true);
  });
});
