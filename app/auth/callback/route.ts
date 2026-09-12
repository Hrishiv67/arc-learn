import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && getSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error)
        return NextResponse.redirect(new URL("/modules", request.url));
    } catch {
      /* Expired links and unavailable auth return a recoverable screen. */
    }
  }
  return NextResponse.redirect(
    new URL("/account?auth_error=confirmation", request.url),
  );
}
