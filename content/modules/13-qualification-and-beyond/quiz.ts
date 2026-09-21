import { quizSchema } from "@/lib/schemas/quiz";
export const MODULE_13_QUIZ = quizSchema.parse({
  moduleId: "qualification-and-beyond",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "A practice flight scores perfectly. Can you declare it official afterward?",
      options: [
        "Yes, if everyone agrees",
        "No; declare before ignition",
        "Only if you filmed it",
      ],
      answerIndex: 1,
      why: "Qualification status must be declared to the observer before the launch.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "What happens after an official flight with a cracked egg?",
      options: [
        "Hide the crack and submit the time",
        "Call it practice retroactively",
        "Report the disqualification using the required process",
      ],
      answerIndex: 2,
      why: "A declared attempt cannot disappear because it went badly. The form specifies the reporting procedure.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt: "What makes a strong Mission Debriefing?",
      options: [
        "Evidence showing how flight data changed the design",
        "Only a polished rocket photo",
        "A claim that every test was perfect",
      ],
      answerIndex: 0,
      why: "The presentation should explain design choices and learning with evidence.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Where should you confirm qualification details?",
      options: [
        "An old training video alone",
        "The current rules and flight report with your adviser and observer",
        "A remembered target from last year",
      ],
      answerIndex: 1,
      why: "Current official documents take priority over old examples and memory.",
    },
  ],
});
