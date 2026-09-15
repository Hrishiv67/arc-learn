import { getSupabaseConfig } from "./config";

/**
 * True when Google OAuth should be offered on the account screen.
 *
 * Prefer the live Supabase auth settings (`external.google`). Also honor
 * NEXT_PUBLIC_GOOGLE_AUTH=1 so a freshly enabled provider can be forced on
 * while edge caches catch up.
 */
export async function googleAuthEnabled(): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_GOOGLE_AUTH?.trim() === "1") return true;
  const config = getSupabaseConfig();
  if (!config) return false;
  try {
    const response = await fetch(config.url + "/auth/v1/settings", {
      headers: { apikey: config.key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const settings = await response.json();
    return settings.external?.google === true;
  } catch {
    return false;
  }
}
