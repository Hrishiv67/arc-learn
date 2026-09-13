import { describe, it, expect } from "vitest";
import { rocketBuild } from "@/lib/rocket/build";
import { MODULES } from "@/content/modules/registry";
const passed = { read: true, quiz: { score: 8, total: 10 } };
describe("course-earned rocket", () => {
  it("starts with fins and a playable lesson", () => {
    const b = rocketBuild({});
    expect(b.done).toBe(0);
    expect(b.nextPart?.id).toBe("fincan");
    expect(b.next?.status).toBe("live");
  });
  it("shows the very first passed module without granting a whole part", () => {
    const b = rocketBuild({ [MODULES[0].id]: passed });
    expect(b.parts[4].fraction).toBeCloseTo(1 / 3);
    expect(b.done).toBe(1);
    expect(b.complete).toBe(false);
  });
  it("earns the actual part for an out-of-order completion", () => {
    const b = rocketBuild({ [MODULES[12].id]: passed });
    expect(b.parts[0].fraction).toBe(1);
    expect(b.parts[4].fraction).toBe(0);
    expect(b.nextPart?.id).toBe("fincan");
  });
  it("moves from fins to body and completes only with all modules", () => {
    const first = Object.fromEntries(
      MODULES.slice(0, 3).map((m) => [m.id, passed]),
    );
    expect(rocketBuild(first).nextPart?.id).toBe("body");
    const all = rocketBuild(
      Object.fromEntries(MODULES.map((m) => [m.id, passed])),
    );
    expect(all.complete).toBe(true);
    expect(all.parts.every((p) => p.fraction === 1)).toBe(true);
    expect(all.next).toBeUndefined();
  });
  it("does not grant progress for a failed quiz or reading alone", () => {
    expect(
      rocketBuild({
        [MODULES[0].id]: { read: true, quiz: { score: 6, total: 10 } },
      }).done,
    ).toBe(0);
  });
});
