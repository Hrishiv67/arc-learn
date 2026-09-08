import { z } from "zod";

/**
 * Every year-specific competition number lives here and nowhere else.
 * ARC changes altitude target, duration window, egg spec, and mass limit
 * every season — this is the single file that changes when the season rolls.
 */
export const seasonParameterSchema = z.object({
  value: z.union([z.number(), z.string()]),
  unit: z.string(),
  label: z.string(),
});

export const payloadParameterSchema = z.object({
  count: z.number().int().positive(),
  eachMass: z.string(),
  label: z.string(),
});

export const seasonSchema = z.object({
  year: z.number().int(),
  isCurrent: z.boolean(),
  rulesUrl: z.string().url(),
  parameters: z.object({
    targetAltitude: seasonParameterSchema,
    durationWindow: seasonParameterSchema,
    payload: payloadParameterSchema,
    // No mass limit key: the 2027 rules do not state one. Do not add a
    // literal here without a citation from the team handbook first.
  }),
});

export type Season = z.infer<typeof seasonSchema>;
