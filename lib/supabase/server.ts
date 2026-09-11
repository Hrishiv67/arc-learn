import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";
import type { Database } from "./types";

/**
 * Server client for Server Components, Server Actions, and Route Handlers.
 * Cookie writes are wrapped in try/catch because Server Components can't
 * write cookies — only Server Actions and Route Handlers can — and calling
 * this from a Server Component is expected to no-op on the write side,
 * per the standard @supabase/ssr App Router pattern.
 */
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Account sync is not configured.");
  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — middleware refreshes the
          // session instead. Safe to ignore.
        }
      },
    },
  });
}
