import { getSupabaseConfig } from "./config";
/** Read public provider availability; no secret or management key is needed. */
export async function googleAuthEnabled(): Promise<boolean> {
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
