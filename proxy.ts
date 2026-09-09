import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session cookie on every request, when a
 * project is actually configured. This app's anonymous (Tier 1) path must
 * work with zero backend, so this is a no-op — not an error — whenever
 * the Supabase env vars aren't set, which is the default state of this
 * build until a real project is connected.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  // Anonymous (Tier 1) visitors are the overwhelming majority of traffic
  // here by design, and carry no Supabase cookie at all. Without this check
  // every one of them paid a real network round trip to Supabase's auth
  // server on every single navigation, for a session that was never going
  // to exist — the difference between an instant page and a visible pause
  // on every click. Only someone who has ever signed in carries this cookie.
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
  if (!hasAuthCookie) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touch the session so an expiring token gets refreshed before it's read
  // by a Server Component later in the request.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|sw.js).*)"],
};
