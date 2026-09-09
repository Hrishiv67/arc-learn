import { getModule, getModuleLesson } from "@/lib/content/loadModule";
import { MODULES } from "@/content/modules/registry";
import { notFound } from "next/navigation";
import { LessonClient } from "./LessonClient";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getModule(slug) || !getModuleLesson(slug)) notFound();
  return <LessonClient slug={slug} />;
}
