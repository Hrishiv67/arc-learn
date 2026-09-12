import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Module gate.
 *
 * An account is required before any module, including the first one. The course
 * itself is free — the account exists so a student's progress, and the rocket
 * they are assembling from it, survive changing devices.
 *
 * When no Supabase project is configured this falls through instead of locking
 * the app: the zero-backend path is how this repo runs in development and in
 * tests, and a gate that cannot check a session must not pretend it can.
 */
export default async function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  if (getSupabaseConfig()) {
    const { slug } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect(`/account?next=${encodeURIComponent(`/modules/${slug}`)}`);
    }
  }
  return <>{children}</>;
}
