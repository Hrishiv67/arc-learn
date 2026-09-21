import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_6_QUIZ = quizSchema.parse({
  moduleId: "thrust-impulse-and-motors",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "In C6-5, what does the 6 represent?",
      options: [
        "Burn time",
        "Nominal average thrust in newtons",
        "Number of igniters",
      ],
      answerIndex: 1,
      why: "The middle number describes average thrust. The final number describes delay.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "The motor burns out while the rocket is climbing. What happens next?",
      options: [
        "It instantly stops",
        "The parachute must instantly open",
        "It coasts upward while slowing",
      ],
      answerIndex: 2,
      why: "Momentum carries the rocket upward after thrust ends; gravity and drag slow it.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "Two motors share an impulse class. Must their thrust curves match?",
      options: [
        "No; the push can be spread differently over time",
        "Yes; the class specifies every moment of thrust",
        "Yes; all motors burn for the same time",
      ],
      answerIndex: 0,
      why: "Impulse is the accumulated push, not its exact time pattern.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt:
        "A motor appears in OpenRocket. Does that prove it is allowed in ARC?",
      options: [
        "Yes",
        "No; check the current ARC-approved list",
        "Only if its picture is shown",
      ],
      answerIndex: 1,
      why: "Simulation libraries include motors beyond the competition’s approved list.",
    },
  ],
});
