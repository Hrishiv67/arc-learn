import fs from "node:fs";
import path from "node:path";
import { SEASON } from "@/content/seasons/2027";
import { MODULES } from "@/content/modules/registry";

/**
 * Every year-specific competition number lives in content/seasons/2027.ts
 * and nowhere else. This scans timeless module content for numeric literals
 * that match a current season parameter — a number that "looks like a
 * competition parameter" appearing outside the season config is a build
 * failure, not a style nit.
 */
function seasonParameterNumbers(): string[] {
  const p = SEASON.parameters;
  const nums = new Set<string>();
  const collect = (v: unknown) => {
    if (typeof v === "number") nums.add(String(v));
    if (typeof v === "string") {
      // pull individual numbers out of ranges like "37-40" or "55-63 g each"
      for (const m of v.matchAll(/\d+/g)) nums.add(m[0]);
    }
  };
  collect(p.targetAltitude.value);
  collect(p.durationWindow.value);
  collect(p.payload.count);
  collect(p.payload.eachMass);
  return [...nums].filter((n) => n.length >= 2); // skip single digits: too noisy
}

export function findParameterLeaks(content: string): string[] {
  const numbers = seasonParameterNumbers();
  const found: string[] = [];
  for (const n of numbers) {
    const re = new RegExp(`(?<!["'\\w])${n}(?!["'\\w])`, "g");
    if (re.test(content)) found.push(n);
  }
  return found;
}

export type LeakReport = {
  modulePath: string;
  slug: string;
  numbers: string[];
};

export function scanTimelessModules(contentRoot: string): LeakReport[] {
  const reports: LeakReport[] = [];
  for (const mod of MODULES) {
    if (!mod.isTimeless) continue;
    const dir =
      mod.order === 1
        ? "01-this-years-challenge"
        : `${String(mod.order).padStart(2, "0")}-${mod.slug}`;
    const lessonPath = path.join(
      contentRoot,
      "content/modules",
      dir,
      "lesson.mdx",
    );
    if (!fs.existsSync(lessonPath)) continue;
    const content = fs.readFileSync(lessonPath, "utf8");
    const numbers = findParameterLeaks(content);
    if (numbers.length) {
      reports.push({ modulePath: lessonPath, slug: mod.slug, numbers });
    }
  }
  return reports;
}
