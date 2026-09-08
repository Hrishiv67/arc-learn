import { z } from "zod";

export const glossaryTermSchema = z.object({
  id: z.string(),
  plain: z.string(),
  term: z.string(),
  definition: z.string(),
});

export const glossarySchema = z.array(glossaryTermSchema);

export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
