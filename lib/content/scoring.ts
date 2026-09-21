import { SEASON } from "@/content/seasons/2027";

/** Practice scoring only; official eligibility is determined by the observer. */
export function scoreFlight(altitude: number, duration: number) {
  if (
    !Number.isFinite(altitude) ||
    !Number.isFinite(duration) ||
    altitude < 0 ||
    duration < 0
  )
    return null;
  const { durationMin, durationMax, pointsPerSecond } = SEASON.scoring;
  const altitudePoints = Math.abs(
    altitude - Number(SEASON.parameters.targetAltitude.value),
  );
  const durationPoints =
    Math.max(durationMin - duration, 0, duration - durationMax) *
    pointsPerSecond;
  return {
    altitudePoints,
    durationPoints,
    total: altitudePoints + durationPoints,
  };
}
