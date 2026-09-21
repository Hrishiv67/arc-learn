import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_10_QUIZ = quizSchema.parse({
  moduleId: "recovery-and-the-egg",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "What usually happens with a larger working parachute?",
      options: [
        "Faster descent and a harder landing",
        "Slower descent and more flight time",
        "No change to descent",
      ],
      answerIndex: 1,
      why: "More canopy drag usually slows descent, but can increase time and drift.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "Why put cushioning between the eggs?",
      options: [
        "To make the altimeter read higher",
        "To change motor impulse",
        "To stop the shells striking each other",
      ],
      answerIndex: 2,
      why: "Eggs need protection from each other as well as the bay walls and hardware.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "A packed parachute jams in the tube. What should happen before flight?",
      options: [
        "Repack and resolve the fit problem",
        "Push it in harder and launch",
        "Remove all heat protection",
      ],
      answerIndex: 0,
      why: "The recovery system must leave the bay freely; a jam can prevent deployment.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "A safe flight lasts too long. What is a useful response?",
      options: [
        "Remove recovery entirely",
        "Investigate recovery size and conditions while preserving safe landing",
        "Squeeze the eggs into less padding",
      ],
      answerIndex: 1,
      why: "Tune duration using evidence without sacrificing safe recovery or payload protection.",
    },
  ],
});
