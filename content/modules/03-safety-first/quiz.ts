import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_3_QUIZ = quizSchema.parse({
  moduleId: "safety-first",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "A motor does not ignite. What should the team do?",
      options: [
        "Walk to the pad immediately",
        "Try pulling the rocket off the guide",
        "Stay back while the operator disconnects power or removes the interlock, then waits at least 60 seconds",
      ],
      answerIndex: 2,
      why: "A misfire does not prove the motor is safe to approach. Follow the range officer and the safety-code waiting procedure.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "A rocket lands on a power line. What should you do?",
      options: [
        "Use a long pole",
        "Keep away and tell the adult launch crew",
        "Climb only if the rocket is low",
      ],
      answerIndex: 1,
      why: "Do not touch, climb, or try to recover a rocket from power lines.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "You find a loose fin before launch. What comes next?",
      options: [
        "Stop and have the damage checked",
        "Launch quickly before it falls off",
        "Use a stronger motor",
      ],
      answerIndex: 0,
      why: "Known structural damage is a reason to stop, repair, and recheck before flight.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Who may speak up to stop an unsafe launch?",
      options: [
        "Only the person holding the controller",
        "Only the team captain",
        "Anyone who notices a problem",
      ],
      answerIndex: 2,
      why: "Everyone can call a stop. The launch crew resolves the problem before continuing.",
    },
  ],
});
