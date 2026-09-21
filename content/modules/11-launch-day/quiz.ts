import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_11_QUIZ = quizSchema.parse({
  moduleId: "launch-day",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "Who controls permission to approach the pad?",
      options: [
        "Whoever finishes first",
        "The launch crew or range officer",
        "The youngest teammate",
      ],
      answerIndex: 1,
      why: "Follow the range officer’s commands and safety-line procedure.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "When should the team record setup and its prediction?",
      options: [
        "Only after a successful flight",
        "After changing every part",
        "Before launch",
      ],
      answerIndex: 2,
      why: "A written setup and prediction let you compare the result honestly.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "A person walks into the launch area during countdown. What happens?",
      options: [
        "Stop the countdown",
        "Launch before they get closer",
        "Ask someone to photograph it",
      ],
      answerIndex: 0,
      why: "The range must be clear before launch.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Why inspect the recovered rocket before flying again?",
      options: [
        "To choose a new name",
        "Hidden damage or worn attachments may make the next flight unsafe",
        "Only to check if the paint matches",
      ],
      answerIndex: 1,
      why: "A successful recovery does not prove that every part remains fit for reuse.",
    },
  ],
});
