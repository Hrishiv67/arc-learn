import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/modules";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/modules";
  return raw;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  if (code && getSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, request.url));
    } catch {
      /* Expired links and unavailable auth return a recoverable screen. */
    }
  }
  return NextResponse.redirect(
    new URL("/account?auth_error=confirmation", request.url),
  );
}
