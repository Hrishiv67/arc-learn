import { quizSchema } from "@/lib/schemas/quiz";

/** Short, open-book applications of Module One. */
export const MODULE_1_QUIZ = quizSchema.parse({
  moduleId: "this-years-challenge",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "Two flights miss the target: one is 150 feet too high, the other 150 feet too low. Which costs more?",
      options: [
        "Too high",
        "Too low",
        "Both cost the same",
        "Neither costs points",
      ],
      answerIndex: 2,
      why: "Each foot away from the target adds one point, above or below.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt: "What measures the rocket’s highest point?",
      options: [
        "A judge watching from the ground",
        "An approved altimeter inside the rocket",
        "The team’s prediction",
        "The motor label",
      ],
      answerIndex: 1,
      why: "The altimeter measures peak height. A prediction is not a flight measurement.",
      image: "flight",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "A loaded rocket has CP nearer the nose than CG. What should the team do?",
      options: [
        "Launch: it will straighten itself",
        "Add a bigger parachute",
        "Fix the stability before launch",
        "Ignore it if the motor fits",
      ],
      answerIndex: 2,
      why: "For a stable model rocket, CG must be nearer the nose than CP. Check the loaded rocket.",
      image: "stability",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "What is the stability margin?",
      options: [
        "The rocket’s total length",
        "The gap between CG and CP",
        "The width of the fins",
        "The distance from the launch pad",
      ],
      answerIndex: 1,
      why: "CG is the balance point. CP is where the sideways air force acts. Their gap is the stability margin.",
    },
    {
      id: "q5",
      type: "choice",
      verified: true,
      prompt:
        "Your rocket hits the height target but stays up 3 seconds too long. What happens?",
      options: [
        "A perfect score",
        "Time penalty points are added",
        "Only height matters",
        "The target time changes",
      ],
      answerIndex: 1,
      why: "Height and time both count. Perfect height does not cancel a time penalty.",
    },
    {
      id: "q6",
      type: "choice",
      verified: true,
      prompt:
        "A bigger parachute slows the landing. What else might it change?",
      options: [
        "Nothing",
        "It may keep the rocket in the air too long",
        "It changes the height target",
        "It guarantees a better score",
      ],
      answerIndex: 1,
      why: "A slower descent protects the eggs but can add time and wind drift. Test both landing safety and flight time.",
      image: "flight",
    },
    {
      id: "q7",
      type: "choice",
      verified: true,
      prompt:
        "Perfect height. Perfect time. One cracked egg. What is the result?",
      options: [
        "A perfect score",
        "Disqualified",
        "A small penalty",
        "Only the cracked egg is ignored",
      ],
      answerIndex: 1,
      why: "Both eggs must return uncracked. Even a hairline crack disqualifies the flight.",
    },
    {
      id: "q8",
      type: "choice",
      verified: true,
      prompt: "What goes on the scale for liftoff mass?",
      options: [
        "The empty body tube",
        "The complete rocket, ready to fly",
        "Only the motor and eggs",
        "Only the heaviest parts",
      ],
      answerIndex: 1,
      why: "Weigh everything together: rocket, motor, eggs, parachute, electronics, glue, and paint.",
    },
    {
      id: "q9",
      type: "choice",
      verified: true,
      prompt: "Before handling a motor, who should supervise?",
      options: [
        "Nobody",
        "Another student",
        "An adult familiar with the NAR safety code",
        "A parent notified afterward",
      ],
      answerIndex: 2,
      why: "Work with an adult who has read the safety code before handling motors or launching.",
    },
    {
      id: "q10",
      type: "choice",
      verified: true,
      prompt:
        "Find the small surfaces near the bottom of this rocket. What do they do?",
      options: [
        "Measure height",
        "Help keep the rocket pointing forward",
        "Protect the eggs",
        "Slow the landing like a parachute",
      ],
      answerIndex: 1,
      why: "Those are fins. With CG ahead of CP, they help the rocket straighten after a small gust.",
      image: "launch",
    },
    {
      id: "q11",
      type: "choice",
      verified: true,
      prompt:
        "The motor stops burning, but the rocket keeps climbing. Has it reached apogee?",
      options: [
        "Yes: apogee is when the motor stops",
        "No: apogee is the highest point",
        "Yes: apogee is liftoff",
        "Only if the parachute is open",
      ],
      answerIndex: 1,
      why: "The rocket coasts upward after burnout. Apogee comes when it reaches its highest point.",
      image: "flight",
    },
  ],
});
