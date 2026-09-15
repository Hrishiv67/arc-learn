import type { MDXProps } from "mdx/types";
import { getModuleBySlug, MODULES } from "@/content/modules/registry";
import type { ModuleMeta } from "@/lib/schemas/module";
import { MODULE_1_QUIZ } from "@/content/modules/01-this-years-challenge/quiz";
import { MODULE_4_QUIZ } from "@/content/modules/04-anatomy-of-a-rocket/quiz";
import type { Quiz } from "@/lib/schemas/quiz";
import Module1Lesson from "@/content/modules/01-this-years-challenge/lesson.mdx";
import Module4Lesson from "@/content/modules/04-anatomy-of-a-rocket/lesson.mdx";

export function getAllModules(): ModuleMeta[] {
  return MODULES;
}

export function getModule(slug: string): ModuleMeta | undefined {
  return getModuleBySlug(slug);
}

/** Lessons with real MDX bodies — everything else is a stub. */
export function getModuleLesson(
  slug: string,
): ((props: MDXProps) => React.ReactElement) | null {
  if (slug === "this-years-challenge") return Module1Lesson;
  if (slug === "anatomy-of-a-rocket") return Module4Lesson;
  return null;
}

export function getModuleQuiz(slug: string): Quiz | null {
  if (slug === "this-years-challenge") return MODULE_1_QUIZ;
  if (slug === "anatomy-of-a-rocket") return MODULE_4_QUIZ;
  return null;
}
