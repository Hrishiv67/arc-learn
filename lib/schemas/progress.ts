import { z } from "zod";

/**
 * Tier 1 (anonymous, localStorage) progress shape. Tier 2/3 (Supabase)
 * mirrors this shape server-side once a real project exists — see
 * lib/supabase and supabase/migrations.
 */
export const moduleProgressSchema = z.object({
  read: z.boolean().default(false),
  quiz: z
    .object({ score: z.number().int(), total: z.number().int() })
    .optional(),
});

export const progressStateSchema = z.record(z.string(), moduleProgressSchema);

export type ModuleProgress = z.infer<typeof moduleProgressSchema>;
export type ProgressState = z.infer<typeof progressStateSchema>;

export function isModuleComplete(p: ModuleProgress | undefined): boolean {
  if (!p?.quiz) return false;
  return p.quiz.score / p.quiz.total >= 0.7;
}
