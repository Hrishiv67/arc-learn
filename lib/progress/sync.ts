import { createClient } from "@/lib/supabase/client";
import { readProgress } from "./local";
import { isModuleComplete } from "@/lib/schemas/progress";

/**
 * Merge-on-signup: when an anonymous user creates an account, their local
 * progress is pushed to Supabase rather than discarded. Never run against
 * a live project in this build — see lib/supabase/client.ts.
 *
 * Merge rule: for each module, keep whichever record represents more
 * progress (a passed quiz beats a read-only record; a higher quiz score
 * beats a lower one for the same module) rather than blindly overwriting
 * server state the user might already have on another device.
 */
export async function mergeLocalProgressOnSignUp(userId: string) {
  const local = readProgress();
  const entries = Object.entries(local);
  if (entries.length === 0) return;

  const supabase = createClient();

  const { data: existingRows } = await supabase
    .from("progress")
    .select("module_id, quiz_score, quiz_total, status")
    .eq("user_id", userId);

  const existingByModule = new Map(
    (existingRows ?? []).map((row) => [row.module_id, row]),
  );

  const upserts = entries
    .map(([moduleId, moduleProgress]) => {
      const existing = existingByModule.get(moduleId);
      const localComplete = isModuleComplete(moduleProgress);
      const localScore = moduleProgress.quiz?.score ?? -1;
      const existingScore = existing?.quiz_score ?? -1;

      // Server already has an equal-or-better record for this module — skip it.
      if (
        existing &&
        existing.status === "complete" &&
        existingScore >= localScore
      ) {
        return null;
      }

      return {
        user_id: userId,
        module_id: moduleId,
        status: (localComplete ? "complete" : "in_progress") as
          "complete" | "in_progress",
        quiz_score: moduleProgress.quiz?.score ?? null,
        quiz_total: moduleProgress.quiz?.total ?? null,
        completed_at: localComplete ? new Date().toISOString() : null,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (upserts.length === 0) return;

  await supabase
    .from("progress")
    .upsert(upserts, { onConflict: "user_id,module_id" });
}
