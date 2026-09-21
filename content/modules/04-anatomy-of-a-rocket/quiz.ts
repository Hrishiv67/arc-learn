import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_4_QUIZ = quizSchema.parse({
  moduleId: "anatomy-of-a-rocket",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt: "A sealed altimeter bay has no vents. What is the problem?",
      options: [
        "The motor will burn longer",
        "Outside pressure changes cannot reach the sensor correctly",
        "The fins become larger",
      ],
      answerIndex: 1,
      why: "A pressure-sensing altimeter needs properly sized vents and correct mounting.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "What keeps the motor from sliding or ejecting out?",
      options: [
        "The parachute",
        "The nose cone",
        "A positive mechanical motor retainer",
      ],
      answerIndex: 2,
      why: "A hook, clip, or cap retains the motor. The mount aligns and supports it.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "The chute comes back scorched. What do you inspect first?",
      options: [
        "Heat protection and recovery packing",
        "The paint color",
        "The egg’s mass",
      ],
      answerIndex: 0,
      why: "Suitable flame-resistant wadding or a recovery blanket protects the chute from ejection heat.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt:
        "Which pair keeps separated sections connected and slows descent?",
      options: [
        "Altimeter and fins",
        "Shock cord and parachute",
        "Motor mount and rail guides",
      ],
      answerIndex: 1,
      why: "The cord connects the sections; the parachute creates drag to slow descent.",
    },
  ],
});
