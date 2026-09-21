import type { MDXProps } from "mdx/types";
import { getModuleBySlug, MODULES } from "@/content/modules/registry";
import type { ModuleMeta } from "@/lib/schemas/module";
import type { Quiz } from "@/lib/schemas/quiz";
import Module1Lesson from "@/content/modules/01-this-years-challenge/lesson.mdx";
import { MODULE_1_QUIZ } from "@/content/modules/01-this-years-challenge/quiz";
import Module2Lesson from "@/content/modules/02-what-you-signed-up-for/lesson.mdx";
import { MODULE_2_QUIZ } from "@/content/modules/02-what-you-signed-up-for/quiz";
import Module3Lesson from "@/content/modules/03-safety-first/lesson.mdx";
import { MODULE_3_QUIZ } from "@/content/modules/03-safety-first/quiz";
import Module4Lesson from "@/content/modules/04-anatomy-of-a-rocket/lesson.mdx";
import { MODULE_4_QUIZ } from "@/content/modules/04-anatomy-of-a-rocket/quiz";
import Module5Lesson from "@/content/modules/05-why-rockets-fly-straight/lesson.mdx";
import { MODULE_5_QUIZ } from "@/content/modules/05-why-rockets-fly-straight/quiz";
import Module6Lesson from "@/content/modules/06-thrust-impulse-and-motors/lesson.mdx";
import { MODULE_6_QUIZ } from "@/content/modules/06-thrust-impulse-and-motors/quiz";
import Module7Lesson from "@/content/modules/07-drag-and-altitude/lesson.mdx";
import { MODULE_7_QUIZ } from "@/content/modules/07-drag-and-altitude/quiz";
import Module8Lesson from "@/content/modules/08-simulating-in-openrocket/lesson.mdx";
import { MODULE_8_QUIZ } from "@/content/modules/08-simulating-in-openrocket/quiz";
import Module9Lesson from "@/content/modules/09-building-it/lesson.mdx";
import { MODULE_9_QUIZ } from "@/content/modules/09-building-it/quiz";
import Module10Lesson from "@/content/modules/10-recovery-and-the-egg/lesson.mdx";
import { MODULE_10_QUIZ } from "@/content/modules/10-recovery-and-the-egg/quiz";
import Module11Lesson from "@/content/modules/11-launch-day/lesson.mdx";
import { MODULE_11_QUIZ } from "@/content/modules/11-launch-day/quiz";
import Module12Lesson from "@/content/modules/12-reading-a-flight-and-iterating/lesson.mdx";
import { MODULE_12_QUIZ } from "@/content/modules/12-reading-a-flight-and-iterating/quiz";
import Module13Lesson from "@/content/modules/13-qualification-and-beyond/lesson.mdx";
import { MODULE_13_QUIZ } from "@/content/modules/13-qualification-and-beyond/quiz";

const lessons: Record<string, (props: MDXProps) => React.ReactElement> = {
  "this-years-challenge": Module1Lesson,
  "what-you-signed-up-for": Module2Lesson,
  "safety-first": Module3Lesson,
  "anatomy-of-a-rocket": Module4Lesson,
  "why-rockets-fly-straight": Module5Lesson,
  "thrust-impulse-and-motors": Module6Lesson,
  "drag-and-altitude": Module7Lesson,
  "simulating-in-openrocket": Module8Lesson,
  "building-it": Module9Lesson,
  "recovery-and-the-egg": Module10Lesson,
  "launch-day": Module11Lesson,
  "reading-a-flight-and-iterating": Module12Lesson,
  "qualification-and-beyond": Module13Lesson,
};
const quizzes: Record<string, Quiz> = {
  "this-years-challenge": MODULE_1_QUIZ,
  "what-you-signed-up-for": MODULE_2_QUIZ,
  "safety-first": MODULE_3_QUIZ,
  "anatomy-of-a-rocket": MODULE_4_QUIZ,
  "why-rockets-fly-straight": MODULE_5_QUIZ,
  "thrust-impulse-and-motors": MODULE_6_QUIZ,
  "drag-and-altitude": MODULE_7_QUIZ,
  "simulating-in-openrocket": MODULE_8_QUIZ,
  "building-it": MODULE_9_QUIZ,
  "recovery-and-the-egg": MODULE_10_QUIZ,
  "launch-day": MODULE_11_QUIZ,
  "reading-a-flight-and-iterating": MODULE_12_QUIZ,
  "qualification-and-beyond": MODULE_13_QUIZ,
};
export function getAllModules(): ModuleMeta[] {
  return MODULES;
}
export function getModule(slug: string): ModuleMeta | undefined {
  return getModuleBySlug(slug);
}
export function getModuleLesson(slug: string) {
  return lessons[slug] ?? null;
}
export function getModuleQuiz(slug: string): Quiz | null {
  return quizzes[slug] ?? null;
}
