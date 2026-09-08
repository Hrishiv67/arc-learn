import { z } from "zod";

export const moduleStatusSchema = z.enum(["live", "soon"]);

export const moduleMetaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  order: z.number().int().min(1).max(13),
  unit: z.number().int().min(1).max(4),
  unitTitle: z.string(),
  title: z.string(),
  summary: z.string(),
  estimatedMinutes: z.number().int().positive(),
  readMinutes: z.number().int().positive().optional(),
  isTimeless: z.boolean(),
  prerequisiteIds: z.array(z.string()),
  ngssCodes: z.array(z.string()),
  status: moduleStatusSchema,
  needsReview: z.boolean().default(true),
  gradeBand: z.string().optional(),
  objectives: z.array(z.string()).optional(),
});

export type ModuleMeta = z.infer<typeof moduleMetaSchema>;
export type ModuleStatus = z.infer<typeof moduleStatusSchema>;
