import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_2_QUIZ = quizSchema.parse({
  moduleId: "what-you-signed-up-for",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "Your first planned flying day is rained out. Which plan helps most?",
      options: [
        "Skip practice and qualify immediately",
        "Include backup flying days in the schedule",
        "Ask an adult to build a new rocket",
      ],
      answerIndex: 1,
      why: "Backup dates give the team time to test safely when weather interrupts a launch.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "What is an appropriate job for an adult mentor?",
      options: [
        "Design and glue the competition rocket",
        "Do the team’s qualification flight",
        "Teach a skill and supervise students as they apply it",
      ],
      answerIndex: 2,
      why: "Students design, build, and fly the entry. Mentors can teach and supervise safety.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "What should go in the shared notebook?",
      options: [
        "Only the best result",
        "Predictions, setup, results, and the next change",
        "Only photos of finished rockets",
      ],
      answerIndex: 1,
      why: "A record of what you expected and what happened lets the next test answer a useful question.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "One teammate does every simulation. What is a useful next step?",
      options: [
        "Have them explain it while someone else tries the controls",
        "Keep it secret so nobody changes anything",
        "Stop using simulations",
      ],
      answerIndex: 0,
      why: "Sharing and rotating tasks helps everyone understand the design.",
    },
  ],
});
