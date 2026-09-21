import { seasonSchema, type Season } from "@/lib/schemas/season";

/**
 * Checked against the full 2027 Rules, sections 4.3–4.6, and Parameters
 * sheet on 2026-09-20. The starter kit contains conflicting older targets.
 *
 * This is the ONLY file in the app that may contain these literals. The
 * parameter-leak lint (scripts/lint-parameters.ts) fails the build if a
 * number matching these patterns turns up in a timeless module.
 */
const season2027: Season = {
  year: 2027,
  isCurrent: true,
  rulesUrl:
    "https://www.rocketrychallenge.org/wp-content/uploads/2027_AmericanRocketryChallenge_Rules.pdf",
  parameters: {
    targetAltitude: { value: 800, unit: "ft", label: "Altitude target" },
    durationWindow: { value: "37–40", unit: "sec", label: "Flight duration" },
    payload: {
      count: 2,
      eachMass: "55–63 g each",
      label: "Payload, uncracked",
    },
    liftoffMass: { value: 650, unit: "g", label: "Maximum liftoff mass" },
  },
  constraints: {
    minimumLengthMm: 650,
    mainTubeDiameterMm: 66,
    mainTubeLength: "12 in (300 mm in the rules)",
    diameterDifferenceMm: 9,
    maximumMotorClass: "F",
    combinedImpulseNs: 80,
  },
  scoring: { durationMin: 37, durationMax: 40, pointsPerSecond: 4 },
};

export const SEASON = seasonSchema.parse(season2027);

export function getCurrentSeason(): Season {
  return SEASON;
}
