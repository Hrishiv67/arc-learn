import { glossarySchema, type GlossaryTerm } from "@/lib/schemas/glossary";

/**
 * Shared glossary — same data backs the plain-language-then-term prose
 * blocks in the lesson body and the hover/tap <GlossaryTerm> tooltips
 * wherever a term recurs later in the same lesson.
 */
const raw: GlossaryTerm[] = [
  {
    id: "apogee",
    plain: "The highest point your rocket reaches",
    term: "Apogee",
    definition:
      "The rocket climbs, slows, stops gaining altitude, and starts descending. That top point is apogee — it's what the rules mean by target altitude.",
  },
  {
    id: "duration",
    plain: "How long the flight lasts",
    term: "Duration",
    definition:
      "Timing starts the instant the rocket leaves the pad and stops the instant it touches ground. One number for the whole flight, ascent and descent together.",
  },
  {
    id: "payload",
    plain: "What the rocket carries",
    term: "Payload",
    definition:
      "In this competition the payload is raw eggs, and they have to land uncracked. A broken payload is a failed flight regardless of how accurate the altitude was.",
  },
  {
    id: "liftoff-mass",
    plain: "What the whole rocket weighs on the pad",
    term: "Liftoff mass",
    definition:
      "Airframe, motor, parachute, eggs, tape, paint — everything, weighed ready to fly, not in pieces. Mass isn't scored directly, but it drives both your altitude and your flight time.",
  },
  {
    id: "nose-cone",
    plain: "The pointed front",
    term: "Nose cone",
    definition:
      "Its shape determines how cleanly air moves around it. A blunter nose displaces more air and costs you speed.",
  },
  {
    id: "body-tube",
    plain: "The main tube",
    term: "Body tube",
    definition:
      "Holds the airframe together and carries the structural load of the flight. Most competition tubes are cardboard or a composite wrap.",
  },
  {
    id: "fins",
    plain: "The flat pieces at the back",
    term: "Fins",
    definition:
      "Keep the rocket pointed the direction it's traveling. Their size, shape, and alignment matter more than almost anything else you attach.",
  },
  {
    id: "motor-mount",
    plain: "The tube that holds the motor",
    term: "Motor mount",
    definition:
      "Sits at the rear and keeps the motor aligned with the airframe. A crooked motor mount means a crooked flight.",
  },
  {
    id: "payload-bay",
    plain: "The compartment for the eggs",
    term: "Payload bay",
    definition:
      "A dedicated section for the payload, typically padded with foam or a molded cradle so the eggs never rest against bare cardboard.",
  },
  {
    id: "recovery-system",
    plain: "The parachute and its deployment",
    term: "Recovery system",
    definition:
      "A parachute, a shock cord, and a mechanism that separates the airframe at the right moment so the parachute can open.",
  },
  {
    id: "altimeter",
    plain: "The onboard flight recorder",
    term: "Altimeter",
    definition:
      "Rides inside the rocket and logs altitude through the flight. It's how your altitude is measured — not by anyone watching from the ground.",
  },
  {
    id: "center-of-gravity",
    plain: "The balance point",
    term: "Center of gravity (CG)",
    definition:
      "Balance the finished rocket on one finger; where it balances is the CG. Adding mass anywhere — a heavier nose, a larger motor — shifts it.",
  },
  {
    id: "center-of-pressure",
    plain: "Where the aerodynamic force acts",
    term: "Center of pressure (CP)",
    definition:
      "Air pushes on the whole body in flight, but that distributed force averages to a single effective point: the CP. Larger fins move it toward the rear.",
  },
  {
    id: "stability-margin",
    plain: "The gap that decides if a rocket self-corrects",
    term: "Stability margin",
    definition:
      "The distance between CG and CP. CG ahead of CP means a gust makes the rocket straighten out; CP ahead of CG means a gust makes it tumble.",
  },
  {
    id: "motor",
    plain: "The solid-propellant engine in the tail",
    term: "Motor",
    definition:
      "A cardboard-and-clay casing with propellant, a delay charge, and an ejection charge. For ARC, only class F motors on the approved list are allowed.",
  },
  {
    id: "thrust-phase",
    plain: "The powered climb",
    term: "Thrust phase",
    definition:
      "Propellant burns from the core outward and hot gas exits the nozzle, producing the push that lifts the rocket.",
  },
  {
    id: "delay-phase",
    plain: "The coast after burnout",
    term: "Delay phase",
    definition:
      "A slow-burning charge that makes smoke but no thrust, giving the rocket time to coast toward apogee before ejection.",
  },
  {
    id: "ejection-charge",
    plain: "The pop that opens the chute bay",
    term: "Ejection charge",
    definition:
      "A final gas pulse fired forward into the body tube so the recovery system can deploy.",
  },
  {
    id: "parachute",
    plain: "The canopy that slows descent",
    term: "Parachute",
    definition:
      "For ARC it must be cotton. Larger canopies stretch flight time; packing and spill holes change how fast you come down.",
  },
  {
    id: "nomex",
    plain: "The fire blanket for recovery gear",
    term: "Nomex",
    definition:
      "Fire-resistant fabric placed between the ejection charge and the parachute or shock cord so hot gas and embers do not burn the recovery system.",
  },
  {
    id: "openrocket",
    plain: "Free rocket design and flight simulation software",
    term: "OpenRocket",
    definition:
      "Lets you model the airframe, motor, recovery, and payload, then predict altitude, duration, stability, and descent before you cut parts.",
  },
];

export const GLOSSARY: GlossaryTerm[] = glossarySchema.parse(raw);

export const GLOSSARY_BY_ID: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.id, t]),
);
