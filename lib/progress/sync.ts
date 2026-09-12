import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { readProgress } from "./local";
import {
  isModuleComplete,
  type ModuleProgress,
  type ProgressState,
} from "@/lib/schemas/progress";

/**
 * Merge-on-signup: when an anonymous user creates an account, their local
 * progress is pushed to Supabase rather than discarded.
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

  const { data: existingRows, error: readError } = await supabase
    .from("progress")
    .select("module_id, quiz_score, quiz_total, status")
    .eq("user_id", userId);

  if (readError) throw readError;
  const existingByModule = new Map(
    (existingRows ?? []).map((row) => [row.module_id, row]),
  );

  const upserts = entries
    .map(([moduleId, moduleProgress]) => {
      const existing = existingByModule.get(moduleId);
      const localComplete = isModuleComplete(moduleProgress);
      const localScore = moduleProgress.quiz
        ? moduleProgress.quiz.score / moduleProgress.quiz.total
        : -1;
      const existingScore =
        existing?.quiz_total && existing.quiz_score != null
          ? existing.quiz_score / existing.quiz_total
          : -1;

      // Server already has an equal-or-better record for this module — skip it.
      if (existing && existingScore >= localScore) {
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

  const { error } = await supabase
    .from("progress")
    .upsert(upserts, { onConflict: "user_id,module_id" });
  if (error) throw error;
}

/**
 * Pull-on-signin: reads every progress row Supabase has for this user and
 * shapes it back into the same ProgressState local.ts works with, so the
 * rest of the app (which only ever reads local.ts's useProgress()) doesn't
 * need to know a signed-in user's data actually lives server-side.
 */
export async function fetchRemoteProgress(
  userId: string,
): Promise<ProgressState> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("module_id, quiz_score, quiz_total")
    .eq("user_id", userId);

  if (error) throw error;
  const state: ProgressState = {};
  for (const row of data ?? []) {
    const progress: ModuleProgress = { read: true };
    if (row.quiz_score != null && row.quiz_total != null) {
      progress.quiz = { score: row.quiz_score, total: row.quiz_total };
    }
    state[row.module_id] = progress;
  }
  return state;
}

/**
 * Write-through: pushes the current local progress for one module up to
 * Supabase. Called after every markRead/recordQuizResult while a user is
 * signed in — see components/account/AccountSync.tsx, the one place that
 * knows both "am I signed in" and "did local progress just change."
 */
export async function pushProgress(
  userId: string,
  moduleId: string,
  moduleProgress: ModuleProgress,
) {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const complete = isModuleComplete(moduleProgress);
  const { error } = await supabase.from("progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      status: (complete ? "complete" : "in_progress") as
        "complete" | "in_progress",
      quiz_score: moduleProgress.quiz?.score ?? null,
      quiz_total: moduleProgress.quiz?.total ?? null,
      completed_at: complete ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,module_id" },
  );
  if (error) throw error;
}
