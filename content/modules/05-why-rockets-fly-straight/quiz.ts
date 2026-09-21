import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_5_QUIZ = quizSchema.parse({
  moduleId: "why-rockets-fly-straight",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "Which layout has the restoring tendency needed for a stable model rocket?",
      options: [
        "CP nearer the nose than CG",
        "CG nearer the nose than CP",
        "CG and CP labels can go anywhere",
      ],
      answerIndex: 1,
      why: "CG should be forward of CP so a small tilt produces a restoring turning effect.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "You install a heavier motor in the tail. What should you recheck?",
      options: [
        "Only the paint",
        "Nothing if the fins did not change",
        "Loaded CG and the stability margin",
      ],
      answerIndex: 2,
      why: "A heavier tail moves the balance point backward, so the old stability result may no longer apply.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "Why not keep adding nose ballast indefinitely?",
      options: [
        "It adds mass and changes performance",
        "It removes all drag",
        "It makes the rocket’s total mass smaller",
      ],
      answerIndex: 0,
      why: "Ballast shifts CG but also changes acceleration and altitude. Simulate and check the real rocket.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt:
        "A simulation has positive stability margin. Is that the only safety check needed?",
      options: [
        "Yes, regardless of wind",
        "No; launch speed, wind, and the real build also matter",
        "Yes, if the rocket looks straight",
      ],
      answerIndex: 1,
      why: "The margin is one check. A rocket must also leave its guide safely and match the checked design.",
    },
  ],
});
