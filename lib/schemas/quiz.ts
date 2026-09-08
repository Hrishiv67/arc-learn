import { z } from "zod";

const baseQuestion = {
  id: z.string(),
  verified: z.boolean(),
  why: z.string(),
};

export const choiceQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("choice"),
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  answerIndex: z.number().int().min(0),
});

/** Drag each label onto its matching drop target on a named diagram. */
export const dragLabelQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("drag-label"),
  prompt: z.string(),
  diagram: z.literal("rocket-cutaway"),
  labels: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
  targets: z
    .array(z.object({ id: z.string(), correctLabelId: z.string() }))
    .min(2),
});

/** Drag each term onto its definition. */
export const dragMatchQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("drag-match"),
  prompt: z.string(),
  pairs: z
    .array(
      z.object({ id: z.string(), term: z.string(), definition: z.string() }),
    )
    .min(2),
});

export const quizQuestionSchema = z.discriminatedUnion("type", [
  choiceQuestionSchema,
  dragLabelQuestionSchema,
  dragMatchQuestionSchema,
]);

export const quizSchema = z.object({
  moduleId: z.string(),
  passRate: z.number().min(0).max(1).default(0.7),
  questions: z.array(quizQuestionSchema).min(1),
});

export type ChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type DragLabelQuestion = z.infer<typeof dragLabelQuestionSchema>;
export type DragMatchQuestion = z.infer<typeof dragMatchQuestionSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
