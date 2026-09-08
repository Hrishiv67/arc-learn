import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser client for Client Components. Reads the two public env vars —
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — from
 * .env.local (see .env.example). No project is connected yet in this
 * environment; calling this before those vars are set throws at runtime,
 * which is why every Tier 1 (anonymous) code path in this app avoids
 * importing anything under lib/supabase entirely.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
