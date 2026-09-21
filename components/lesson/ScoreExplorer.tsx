"use client";

import { useState } from "react";
import { SEASON } from "@/content/seasons/2027";
import { scoreFlight } from "@/lib/content/scoring";

export function ScoreExplorer() {
  const target = Number(SEASON.parameters.targetAltitude.value);
  const [altitude, setAltitude] = useState(String(target + 10));
  const [duration, setDuration] = useState(
    String(SEASON.scoring.durationMax + 2),
  );
  const [cracked, setCracked] = useState(false);
  const score =
    altitude.trim() && duration.trim()
      ? scoreFlight(Number(altitude), Number(duration))
      : null;
  return (
    <section
      aria-label="Practice flight score"
      className="border border-mist-600 bg-mist-200 p-5 sm:p-6"
    >
      <h3 className="text-xl">Try a flight score</h3>
      <p className="text-sm text-sky-800">
        Change a number. Lower is better; zero is the goal.
      </p>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm font-bold">
          Peak altitude (ft)
          <input
            className="mt-2 block w-full border border-sky-800 bg-white p-3 text-arc-navy"
            type="number"
            min="0"
            step="1"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
          />
        </label>
        <label className="text-sm font-bold">
          Official duration (sec)
          <input
            className="mt-2 block w-full border border-sky-800 bg-white p-3 text-arc-navy"
            type="number"
            min="0"
            step="0.01"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={cracked}
          onChange={(e) => setCracked(e.target.checked)}
        />
        An egg cracked
      </label>
      <div
        role="status"
        aria-live="polite"
        className="mt-3 border-t border-mist-600 pt-4"
      >
        {cracked ? (
          <strong>Disqualified — an egg must not crack.</strong>
        ) : score ? (
          <>
            <strong className="block text-3xl text-arc-navy">
              {Number(score.total.toFixed(2))} points
            </strong>
            <span className="text-sm">
              {Number(score.altitudePoints.toFixed(2))} altitude +{" "}
              {Number(score.durationPoints.toFixed(2))} duration
            </span>
          </>
        ) : (
          <span>Enter a nonnegative altitude and duration.</span>
        )}
      </div>
      <p className="mt-3 text-xs text-sky-800">
        Practice calculator for qualification targets. It assumes the flight
        meets all other rules; the observer determines the official result.
      </p>
    </section>
  );
}
