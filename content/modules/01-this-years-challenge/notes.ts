import { SEASON } from "@/content/seasons/2027";

export const CHALLENGE_NOTES = [
  {
    id: "limits",
    title: "Build limits",
    points: [
      `Length: at least ${SEASON.constraints.minimumLengthMm} mm. Use at least two external tube diameters.`,
      `One section: at least ${SEASON.constraints.mainTubeDiameterMm} mm wide and ${SEASON.constraints.mainTubeLength} long. Another diameter must differ by at least ${SEASON.constraints.diameterDifferenceMm} mm.`,
      `One stage; approved ${SEASON.constraints.maximumMotorClass} or lower motors; at most ${SEASON.constraints.combinedImpulseNs} N·s combined impulse. Ignite all motors on the ground.`,
      "Secure the motor with a mechanical retainer. Use a parachute; keep all parts connected except disposable wadding.",
    ],
  },
  {
    id: "goal",
    title: "The flight goal",
    points: [
      `Reach ${SEASON.parameters.targetAltitude.value} ${SEASON.parameters.targetAltitude.unit}; stay in the air ${SEASON.parameters.durationWindow.value} seconds.`,
      `Carry ${SEASON.parameters.payload.count} raw eggs (${SEASON.parameters.payload.eachMass}). Both must return uncracked.`,
      `Ready-to-fly mass: at most ${SEASON.parameters.liftoffMass.value} g, including everything.`,
      "Apogee = highest point. An approved onboard altimeter measures it.",
      "Duration = first motion to first ground/tree contact, or loss from view. Official timers measure it.",
    ],
  },
  {
    id: "score",
    title: "Lower score wins",
    points: [
      "Height points = feet away from the target. Too high and too low count equally.",
      `Time points = 0 inside the window. Outside it: seconds from the nearest edge × ${SEASON.scoring.pointsPerSecond}.`,
      "Add height and time points. One cracked egg means disqualification.",
    ],
  },
  {
    id: "parts",
    title: "Know the parts",
    points: [
      "Nose cone: front tip. Body tube: main structure. Fins: help keep the rocket pointing forward.",
      "Motor mount: holds the motor straight. Payload bay: protects the eggs.",
      "Altimeter: measures height. Parachute: slows landing. Shock cord: keeps the sections connected.",
    ],
  },
  {
    id: "stability",
    title: "Keep it stable",
    points: [
      "CG = balance point. CP = where the sideways air force effectively acts.",
      "Keep CG closer to the nose than CP. Their gap is the stability margin.",
      "Check the fully loaded rocket. A bigger gap is not automatically better.",
    ],
  },
  {
    id: "recovery",
    title: "Bring the eggs home",
    points: [
      "Cushion every side. Keep eggs apart and away from hard parts.",
      "A larger parachute usually slows landing, but adds time and wind drift.",
      "Burn → coast → apogee → recover. The motor stops before the rocket stops climbing.",
    ],
  },
  {
    id: "safety",
    title: "Before handling motors",
    points: [
      "Work with an adult who has read the NAR Model Rocket Safety Code.",
      "Students make the design; mentors teach and supervise.",
    ],
  },
] as const;
export type NoteId = (typeof CHALLENGE_NOTES)[number]["id"];
export const QUESTION_NOTE: Record<string, NoteId> = {
  q1: "score",
  q2: "goal",
  q3: "stability",
  q4: "stability",
  q5: "score",
  q6: "recovery",
  q7: "recovery",
  q8: "goal",
  q9: "safety",
  q10: "parts",
  q11: "recovery",
};
