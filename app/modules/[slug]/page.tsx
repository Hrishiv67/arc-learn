import { getModule } from "@/lib/content/loadModule";
import { notFound } from "next/navigation";
import { ModuleDetailClient } from "./ModuleDetailClient";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getModule(slug)) notFound();
  return <ModuleDetailClient slug={slug} />;
}
