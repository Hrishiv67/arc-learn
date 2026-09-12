import { getModule, getModuleQuiz } from "@/lib/content/loadModule";
import { MODULES } from "@/content/modules/registry";
import { notFound } from "next/navigation";
import { QuizClient } from "./QuizClient";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getModule(slug) || !getModuleQuiz(slug)) notFound();
  return <QuizClient slug={slug} />;
}
