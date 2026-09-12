import { getModule } from "@/lib/content/loadModule";
import { MODULES } from "@/content/modules/registry";
import { notFound } from "next/navigation";
import { ModuleDetailClient } from "./ModuleDetailClient";

// Every module slug is known at build time, so this renders as static HTML
// instead of hitting a server function on every navigation — the difference
// between an instant page and a visible loading pause on each click.
export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getModule(slug)) notFound();
  return <ModuleDetailClient slug={slug} />;
}
