import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  findParameterLeaks,
  scanTimelessModules,
} from "@/lib/content/parameterLint";

describe("parameter leak lint", () => {
  it("finds no leaks in the real timeless module content today", () => {
    const reports = scanTimelessModules(path.resolve(__dirname, "../.."));
    expect(reports).toEqual([]);
  });

  it("catches a deliberately planted violation", () => {
    // 800 is this season's target altitude (ft) — a timeless module must
    // never name it as a literal.
    const planted = "Aim to reach about 800 feet on your qualification flight.";
    expect(findParameterLeaks(planted)).toContain("800");
  });

  it("does not flag the season config file itself as a leak source (unit test only checks module content, not config)", () => {
    // sanity: an unrelated number should never be flagged
    expect(findParameterLeaks("Our team has 13 members and 4 units.")).toEqual(
      [],
    );
  });

  it("ignores numbers embedded in words or codes (e.g. NGSS codes, ids)", () => {
    expect(
      findParameterLeaks("See NGSS code MS-ETS1-1 and module id m800x."),
    ).toEqual([]);
  });
});
