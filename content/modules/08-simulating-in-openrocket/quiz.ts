import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_8_QUIZ = quizSchema.parse({
  moduleId: "simulating-in-openrocket",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "A simulation hits the target but warns of low speed off the rail. What next?",
      options: [
        "Fly because height is correct",
        "Resolve the warning with your mentor",
        "Hide the warning column",
      ],
      answerIndex: 1,
      why: "A good altitude prediction does not cancel an unsafe launch condition.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "After painting the rocket, which measurement belongs in the model?",
      options: [
        "The original unpainted estimate",
        "Only the motor’s mass",
        "The finished rocket’s actual mass and balance",
      ],
      answerIndex: 2,
      why: "Glue, paint, and assembly differences change the flight model.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "Where do you select the motor and delay?",
      options: [
        "Motors & Configuration",
        "The parachute color setting",
        "The final score form",
      ],
      answerIndex: 0,
      why: "Select the correct mount, motor, and available delay in Motors & Configuration.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Why keep the baseline simulation?",
      options: [
        "To avoid measuring the real rocket",
        "To compare one change against a known setup",
        "To replace all practice flights",
      ],
      answerIndex: 1,
      why: "A saved baseline makes comparisons meaningful. Flights still test the prediction.",
    },
  ],
});
