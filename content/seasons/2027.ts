import { seasonSchema, type Season } from "@/lib/schemas/season";

/**
 * 2027 season parameters, verified against the published rules the team
 * uploaded to the design-export bundle (uploads/arc-resources/resource/
 * 2027-american-rocketry-challenge-rules). No mass limit is stated in that
 * source — do not add one here without a citation from the team handbook.
 *
 * This is the ONLY file in the app that may contain these literals. The
 * parameter-leak lint (scripts/lint-parameters.ts) fails the build if a
 * number matching these patterns turns up in a timeless module.
 */
const season2027: Season = {
  year: 2027,
  isCurrent: true,
  rulesUrl:
    "https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/",
  parameters: {
    targetAltitude: { value: 800, unit: "ft", label: "Altitude target" },
    durationWindow: { value: "37–40", unit: "sec", label: "Flight duration" },
    payload: {
      count: 2,
      eachMass: "55–63 g each",
      label: "Payload, uncracked",
    },
  },
};

export const SEASON = seasonSchema.parse(season2027);

export function getCurrentSeason(): Season {
  return SEASON;
}
