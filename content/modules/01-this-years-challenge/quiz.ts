import { quizSchema, type Quiz } from "@/lib/schemas/quiz";

/**
 * 11 questions: 9 multiple-choice (application-style, not pure recall) plus
 * 2 interactive question types — a drag-label diagram and a drag-match —
 * built on @dnd-kit/core. Pass bar is 70%; explanations show either way.
 */
const raw: Quiz = {
  moduleId: "this-years-challenge",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: false,
      prompt:
        "This season's altitude figure is a target, not a minimum. If one flight lands 150 feet above target and another lands 150 feet below, how do the two penalties compare?",
      options: [
        "The overshoot costs more",
        "The undershoot costs more",
        "They cost exactly the same",
        "Neither is penalized",
      ],
      answerIndex: 2,
      why: "The target is a height to hit, not a floor to clear. A miss above and an equal miss below cost the same — draft pending confirmation against the scoring formula in the team handbook.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "How is a rocket's altitude actually determined during a qualification flight?",
      options: [
        "A judge estimates it by eye from the ground",
        "An onboard altimeter records it during the flight",
        "Teams self-report their expected altitude",
        "It is calculated afterward from the motor's total impulse",
      ],
      answerIndex: 1,
      why: "The altimeter rides inside the rocket and logs the flight. Nobody measures altitude by watching from the pad.",
    },
    {
      id: "q3",
      type: "choice",
      verified: false,
      prompt:
        "A simulation shows the center of pressure sitting ahead of the center of gravity. What does that predict about the flight?",
      options: [
        "The rocket self-corrects after a gust",
        "The rocket flies exactly as designed, unaffected",
        "The rocket diverges further off course and the flight ends early and unpredictably",
        "The parachute deploys early",
      ],
      answerIndex: 2,
      why: "CG ahead of CP lets a rocket straighten itself out after a gust. Reversed, small disturbances get worse instead of correcting — a physics claim, still pending subject-matter review.",
    },
    {
      id: "q4",
      type: "choice",
      verified: false,
      prompt:
        "Stability margin is the distance between which two points on the airframe?",
      options: [
        "The nose cone and the fins",
        "The center of gravity and the center of pressure",
        "The motor mount and the payload bay",
        "Apogee and the pad",
      ],
      answerIndex: 1,
      why: "Stability margin measures the gap between CG and CP — the bigger that gap, the more the rocket resists tumbling. Draft pending review.",
    },
    {
      id: "q5",
      type: "choice",
      verified: false,
      prompt:
        "A flight lands exactly on the altitude target but 3 seconds outside the duration window. How does it score compared to a flight that lands in the middle of both windows?",
      options: [
        "Better, since the altitude was perfect",
        "Worse — duration penalty points are added even though altitude was exact",
        "The same, because only altitude is scored",
        "No score can be calculated",
      ],
      answerIndex: 1,
      why: "Both halves of the flight goal are scored and penalties add together, so a perfect altitude does not cancel out a duration miss. Draft pending confirmation against the published scoring formula.",
    },
    {
      id: "q6",
      type: "choice",
      verified: false,
      prompt:
        "Your team fits a larger parachute to protect the eggs on landing. If your original flight was already inside the duration window, what is the most likely effect on your score?",
      options: [
        "No effect at all",
        "The longer descent could push duration past the top of the window and add penalty points",
        "The altitude target automatically adjusts to match",
        "It guarantees a better score",
      ],
      answerIndex: 1,
      why: "A bigger parachute slows descent, which extends flight time — helpful for protecting the payload, but it can carry duration outside the window. Draft pending review.",
    },
    {
      id: "q7",
      type: "choice",
      verified: true,
      prompt:
        "A flight lands at the exact target altitude and exactly on the target duration, but one egg has a hairline crack. What does this flight score?",
      options: [
        "A perfect score, since altitude and duration were exact",
        "Full penalty points regardless of how accurate the altitude and duration were",
        "A partial score based on the size of the crack",
        "It depends on which of the two eggs cracked",
      ],
      answerIndex: 1,
      why: "The rules require the payload to survive uncracked. A broken payload is a failed flight even when the altitude and duration are exact — quoted directly in the payload rule.",
    },
    {
      id: "q8",
      type: "choice",
      verified: true,
      prompt:
        "Which of these is the correct way to determine a rocket's liftoff mass?",
      options: [
        "Weigh the bare airframe before the motor and payload go in",
        "Weigh it fully assembled, with motor, parachute, and eggs installed",
        "Add up the manufacturer's listed part weights",
        "Estimate it from the body tube diameter",
      ],
      answerIndex: 1,
      why: "Liftoff mass means the rocket as it sits on the pad, ready to fly — motor, parachute, and eggs included, weighed as one assembly, not in pieces.",
    },
    {
      id: "q9",
      type: "choice",
      verified: true,
      prompt:
        "Who has to be present before a motor is loaded into a rocket on this course?",
      options: [
        "Nobody in particular",
        "Another student on the team",
        "An adult who has read the NAR Model Rocket Safety Code",
        "A parent, notified afterward by text",
      ],
      answerIndex: 2,
      why: "Adult supervision by someone who has read the safety code is the floor for every launch on this course — not optional, and not satisfied by another student.",
    },
    {
      id: "q10",
      type: "drag-label",
      verified: true,
      prompt:
        "Drag each part name onto the matching spot on the cutaway. This is the vocabulary set the rules and the handbook use.",
      why: "This is the vocabulary set that lets you read the rules, a simulation, and the team handbook without guessing — worth having cold before you touch a build module.",
      diagram: "rocket-cutaway",
      labels: [
        { id: "nose-cone", text: "Nose cone" },
        { id: "payload-bay", text: "Payload bay" },
        { id: "altimeter", text: "Altimeter" },
        { id: "recovery-system", text: "Recovery system" },
        { id: "body-tube", text: "Body tube" },
        { id: "motor-mount", text: "Motor mount" },
        { id: "fins", text: "Fins" },
      ],
      targets: [
        { id: "t-nose-cone", correctLabelId: "nose-cone" },
        { id: "t-payload-bay", correctLabelId: "payload-bay" },
        { id: "t-altimeter", correctLabelId: "altimeter" },
        { id: "t-recovery-system", correctLabelId: "recovery-system" },
        { id: "t-body-tube", correctLabelId: "body-tube" },
        { id: "t-motor-mount", correctLabelId: "motor-mount" },
        { id: "t-fins", correctLabelId: "fins" },
      ],
    },
    {
      id: "q11",
      type: "drag-match",
      verified: true,
      prompt: "Drag each term to its definition.",
      why: "These six terms carry the rest of the course — apogee and duration score your flight, payload and liftoff mass constrain your build, and CG/CP decide whether it flies straight at all.",
      pairs: [
        {
          id: "apogee",
          term: "Apogee",
          definition: "The highest point the rocket reaches",
        },
        {
          id: "duration",
          term: "Duration",
          definition: "How long the flight lasts, pad to landing",
        },
        {
          id: "payload",
          term: "Payload",
          definition: "What the rocket carries — the eggs",
        },
        {
          id: "liftoff-mass",
          term: "Liftoff mass",
          definition: "What the whole rocket weighs on the pad, ready to fly",
        },
        {
          id: "center-of-gravity",
          term: "Center of gravity (CG)",
          definition: "The point where the rocket balances",
        },
        {
          id: "center-of-pressure",
          term: "Center of pressure (CP)",
          definition: "The point where aerodynamic force effectively acts",
        },
      ],
    },
  ],
};

export const MODULE_1_QUIZ: Quiz = quizSchema.parse(raw);
