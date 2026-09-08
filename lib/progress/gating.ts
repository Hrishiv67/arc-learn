import type { ModuleMeta } from "@/lib/schemas/module";
import { isModuleComplete, type ProgressState } from "@/lib/schemas/progress";
import { getModule } from "@/lib/content/loadModule";

/**
 * The safety-module prerequisite, enforced here. Honest limitation: for an
 * anonymous (Tier 1) user this is client-side route guarding against
 * localStorage — real, but not unbeatable by someone editing their own
 * browser storage. True server enforcement exists only for signed-in users
 * via Postgres RLS once a Supabase project is connected (lib/supabase).
 */
export function isModuleUnlocked(
  module: ModuleMeta,
  progress: ProgressState,
): boolean {
  return module.prerequisiteIds.every((id) => isModuleComplete(progress[id]));
}

export function lockedReason(
  module: ModuleMeta,
  progress: ProgressState,
): ModuleMeta | null {
  for (const id of module.prerequisiteIds) {
    if (!isModuleComplete(progress[id])) {
      return getModule(id) ?? null;
    }
  }
  return null;
}
