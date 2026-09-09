import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * True once a real Supabase project's URL + anon key are set (see
 * .env.example). Every Tier 2 (account) code path checks this first and
 * falls back to Tier 1 (anonymous, localStorage-only) behavior instead of
 * throwing, so the app works with zero backend configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Browser client for Client Components. Reads the two public env vars —
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — from
 * .env.local (see .env.example). Callers must check isSupabaseConfigured()
 * first — constructing this before those vars are set throws at runtime.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
