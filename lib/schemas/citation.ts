import { z } from "zod";

/**
 * A rule citation is structured data, never prose. Rendering is derived
 * from this shape by the <Citation> component — quotedText is empty and
 * verifiedAt is undefined until a subject-matter expert confirms the quote
 * against the published rules, in which case the UI shows "not yet
 * verified" rather than inventing rule language.
 */
export const citationSchema = z.object({
  id: z.string(),
  season: z.number().int().optional(),
  ruleNumber: z.string(),
  topic: z.string(),
  quotedText: z.string().optional(),
  sourceUrl: z.string().url(),
  verifiedAt: z.string().optional(),
});

export type Citation = z.infer<typeof citationSchema>;
