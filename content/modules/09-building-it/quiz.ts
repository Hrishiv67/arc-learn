import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_9_QUIZ = quizSchema.parse({
  moduleId: "building-it",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "What should happen before permanent gluing?",
      options: [
        "Dry-fit and check the parts",
        "Paint over the joints",
        "Load a live motor for a fit test",
      ],
      answerIndex: 0,
      why: "Dry-fitting catches size and access problems before the joint is permanent.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "What does a fin fillet do?",
      options: [
        "Guarantees perfect altitude",
        "Spreads load along the fin joint",
        "Replaces the need to align the fin",
      ],
      answerIndex: 1,
      why: "A properly made fillet reinforces the joint. Excess glue also adds mass.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "The motor fits tightly by friction. What else does ARC require?",
      options: [
        "A different paint color",
        "No further check",
        "Positive mechanical retention",
      ],
      answerIndex: 2,
      why: "Use a suitable hook, clip, or screw-on retainer; friction alone is not sufficient.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt:
        "A printed fin looks smooth. Does that prove it is strong enough?",
      options: [
        "No; inspect and test the construction with your mentor",
        "Yes; appearance proves strength",
        "Yes; printed parts cannot break",
      ],
      answerIndex: 0,
      why: "Material, layer direction, geometry, and construction affect strength. Looks alone cannot establish it.",
    },
  ],
});
