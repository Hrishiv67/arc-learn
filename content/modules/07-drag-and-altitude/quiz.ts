import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_7_QUIZ = quizSchema.parse({
  moduleId: "drag-and-altitude",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "What is drag?",
      options: [
        "A force resisting motion through air",
        "The rocket’s highest point",
        "The motor’s delay",
      ],
      answerIndex: 0,
      why: "Drag opposes the rocket’s motion relative to the air.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "Why can a tilted flight reach a lower vertical height?",
      options: [
        "The altitude target changes",
        "Some motion carries the rocket sideways instead of upward",
        "The eggs get lighter",
      ],
      answerIndex: 1,
      why: "Weathercocking can tilt the path, reducing vertical altitude.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "Your model predicts a higher flight than you measure. What is a sensible first check?",
      options: [
        "Assume all software is useless",
        "Ignore the measurement",
        "Compare actual mass, conditions, and the model’s dimensions",
      ],
      answerIndex: 2,
      why: "Check the inputs and real build before changing the drag estimate.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "How do you isolate a surface-finish change in simulation?",
      options: [
        "Change only the finish in a saved copy",
        "Also change the motor and payload",
        "Erase the baseline result",
      ],
      answerIndex: 0,
      why: "One change and a saved baseline make the effect easier to identify.",
    },
  ],
});
