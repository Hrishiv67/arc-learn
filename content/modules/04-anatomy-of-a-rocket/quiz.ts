import { quizSchema, type Quiz } from "@/lib/schemas/quiz";

/**
 * Demo-module quiz for Anatomy of a Rocket — application questions plus
 * drag-label (inner vs outer) and drag-match (motor phases / recovery).
 */
const raw: Quiz = {
  moduleId: "anatomy-of-a-rocket",
  passRate: 0.7,
  questions: [
    {
      id: "q1",
      type: "choice",
      verified: true,
      prompt:
        "In a motor code like F42-6, what does the final number (6) tell you?",
      options: [
        "Average thrust in Newtons",
        "Total impulse class letter ranking",
        "Seconds of delay after thrust before ejection",
        "How many fins the rocket must use",
      ],
      answerIndex: 2,
      why: "The last number is delay seconds — smoke and coast time before the ejection charge fires. The letter is impulse class; the middle number is average thrust.",
    },
    {
      id: "q2",
      type: "choice",
      verified: true,
      prompt:
        "Which statement correctly describes ARC motor rules in this lesson?",
      options: [
        "Any motor letter class is allowed if the delay is 6 seconds",
        "Only class F motors are allowed",
        "Only Estes black-powder motors under C are allowed",
        "Motors are optional if the altimeter is approved",
      ],
      answerIndex: 1,
      why: "ARC limits teams to class F motors on the approved list. Delay and thrust still matter, but the letter class is not free choice.",
    },
    {
      id: "q3",
      type: "choice",
      verified: true,
      prompt:
        "Your altimeter is sealed in a bay with no vent holes. What is the most likely result?",
      options: [
        "More accurate altitude because wind noise is blocked",
        "Unreliable altitude because the sensor cannot sense outside pressure changes",
        "Faster ejection because pressure builds sooner",
        "No effect — altimeters use GPS only",
      ],
      answerIndex: 1,
      why: "These competition altimeters infer altitude from air pressure. Without vents to outside air, the reading cannot track the real climb.",
    },
    {
      id: "q4",
      type: "choice",
      verified: true,
      prompt: "Which set lists only ARC-permitted altimeters?",
      options: [
        "PerfectFlite Pnut, PerfectFlite FireFly, Jolly Logic Altimeter One, Jolly Logic Altimeter Two",
        "Any barometric watch, PerfectFlite Pnut, and a phone app",
        "Jolly Logic Altimeter Three and StratologgerCF only",
        "Estes AltiTrak and a ground theodolite",
      ],
      answerIndex: 0,
      why: "ARC allows those four onboard units. Ground estimates and unlisted electronics do not replace them for scoring altitude.",
    },
    {
      id: "q5",
      type: "choice",
      verified: true,
      prompt: "For ARC recovery, which parachute material requirement is correct?",
      options: [
        "Any synthetic ripstop is required",
        "Cotton is required",
        "Mylar streamers only",
        "No parachute is allowed — streamer recovery only",
      ],
      answerIndex: 1,
      why: "ARC requires cotton parachutes. Diameter and packing still affect duration and landing loads.",
    },
    {
      id: "q6",
      type: "choice",
      verified: true,
      prompt: "Where should Nomex be placed when packing the recovery bay?",
      options: [
        "Wrapped tightly around the outside of the body tube",
        "Between the ejection charge and the parachute / shock cord",
        "Only under the egg case",
        "Inside the motor nozzle",
      ],
      answerIndex: 1,
      why: "Nomex shields recovery gear from ejection heat and embers. It belongs in the path between the charge and the chute, packed loosely enough to let the chute open.",
    },
    {
      id: "q7",
      type: "choice",
      verified: true,
      prompt:
        "Which ARC body-tube rule pair is stated correctly in this module?",
      options: [
        "Minimum diameter 25 mm and length under 400 mm",
        "Constant diameter at least 47 mm (1.85 in) and overall length at least 650 mm",
        "Metal tubes required above 47 mm",
        "Diameter may taper freely as long as fins are large",
      ],
      answerIndex: 1,
      why: "ARC requires a constant diameter of at least 47 mm and overall length of at least 650 mm, using lightweight non-metal structure.",
    },
    {
      id: "q8",
      type: "choice",
      verified: true,
      prompt:
        "Why do teams run OpenRocket and then still fly practice flights?",
      options: [
        "OpenRocket replaces the altimeter for scoring",
        "Simulations ignore motors, so only flights matter",
        "Real drag, wind, and build quality shift results — flights calibrate the model",
        "OpenRocket only draws pictures and cannot predict altitude",
      ],
      answerIndex: 2,
      why: "OpenRocket narrows designs quickly, but real flights reveal drag and mass errors. Comparing altimeter data to the sim lets you adjust the model.",
    },
    {
      id: "q9",
      type: "choice",
      verified: true,
      prompt:
        "You 3D-print fins in PLA. Which print practice reduces the chance of snapping at the root on landing?",
      options: [
        "Print with layer lines running across the root (perpendicular to the fin span)",
        "Print solid 100% infill metal-filled filament only",
        "Orient layers along the fin’s length and test-flex a sample fin first",
        "Skip fillets because printed plastic never needs reinforcement",
      ],
      answerIndex: 2,
      why: "Layer lines across the root create a weak crack path. Orient strength along the fin, use modest infill for weight, and flex a test print before committing.",
    },
    {
      id: "q10",
      type: "drag-label",
      verified: true,
      prompt:
        "Drag each label onto the matching part of the competition rocket cutaway.",
      diagram: "rocket-cutaway",
      labels: [
        { id: "nose", text: "Nose cone" },
        { id: "payload", text: "Payload / egg bay" },
        { id: "alti", text: "Altimeter" },
        { id: "recovery", text: "Recovery system" },
        { id: "motor", text: "Motor mount" },
        { id: "fins", text: "Fins" },
      ],
      targets: [
        { id: "nose-cone", correctLabelId: "nose" },
        { id: "payload-bay", correctLabelId: "payload" },
        { id: "altimeter", correctLabelId: "alti" },
        { id: "recovery-system", correctLabelId: "recovery" },
        { id: "motor-mount", correctLabelId: "motor" },
        { id: "fins", correctLabelId: "fins" },
      ],
      why: "Outer airframe parts (nose, tube, fins) surround inner systems (payload, altimeter, recovery, motor). Matching names to locations is the first design skill.",
    },
    {
      id: "q11",
      type: "drag-match",
      verified: true,
      prompt: "Match each idea to the definition used in this module.",
      pairs: [
        {
          id: "thrust",
          term: "Thrust phase",
          definition: "Propellant burns; hot gas through the nozzle lifts the rocket",
        },
        {
          id: "delay",
          term: "Delay phase",
          definition: "Smoke and coast time after thrust, before ejection",
        },
        {
          id: "eject",
          term: "Ejection phase",
          definition: "Gas pulse forward that opens the recovery bay",
        },
        {
          id: "nomex",
          term: "Nomex",
          definition: "Fire-resistant fabric between ejection heat and the chute",
        },
      ],
      why: "Motor phases and Nomex placement are easy to mix up under pad pressure. Thrust climbs, delay coasts, ejection deploys, Nomex protects.",
    },
  ],
};

export const MODULE_4_QUIZ: Quiz = quizSchema.parse(raw);
