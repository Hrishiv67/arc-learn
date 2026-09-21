import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_12_QUIZ = quizSchema.parse({
  moduleId: "reading-a-flight-and-iterating",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "What does a steeper downward line on an altitude-time graph mean?",
      options: ["Slower descent", "Faster descent", "More motor thrust"],
      answerIndex: 1,
      why: "A steeper drop means more altitude lost per second.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "You change both the motor and chute. Can you confidently isolate what changed duration?",
      options: [
        "Yes, always the chute",
        "Yes, always the motor",
        "No; test one change at a time",
      ],
      answerIndex: 2,
      why: "Changing multiple variables makes it harder to identify the cause.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "Why record weather with every flight?",
      options: [
        "Conditions can affect altitude, drift, and duration",
        "It changes the official target",
        "It replaces the altimeter",
      ],
      answerIndex: 0,
      why: "Weather helps explain why the same setup can behave differently.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Does every scoring altimeter provide a full graph?",
      options: [
        "Yes",
        "No; some only report peak altitude",
        "No altimeter can record a flight",
      ],
      answerIndex: 1,
      why: "A flight trace requires a data-logging instrument. Peak-only devices report less information.",
    },
  ],
});
