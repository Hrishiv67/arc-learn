import { getModule, getModuleQuiz } from "@/lib/content/loadModule";
import { notFound } from "next/navigation";
import { QuizClient } from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getModule(slug) || !getModuleQuiz(slug)) notFound();
  return <QuizClient slug={slug} />;
}
