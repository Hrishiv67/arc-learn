"use client";

import { useId, useSyncExternalStore } from "react";

const ACCENTS = {
  red: { label: "Launch red", value: "#b42025" },
  blue: { label: "Sky blue", value: "#287aa3" },
  gold: { label: "Solar gold", value: "#b87300" },
} as const;

type Accent = keyof typeof ACCENTS;

const storageKey = "arc-learn:rocket-accent:v1";
const changeEvent = "arc-learn:rocket-accent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function getAccent(): Accent {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value && value in ACCENTS ? (value as Accent) : "red";
  } catch {
    return "red";
  }
}

function getServerAccent(): Accent {
  return "red";
}

function setAccent(value: Accent) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // The choice remains optional when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

const milestones = [
  "Airframe blueprint",
  "Motor mount",
  "Guidance fins",
  "Payload bay",
  "Recovery system",
  "Flight-ready finish",
];

export function RocketWorkshop({
  completeCount,
  total,
}: {
  completeCount: number;
  total: number;
}) {
  const accent = useSyncExternalStore(subscribe, getAccent, getServerAccent);
  const clipId = useId();
  const pct = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const milestoneIndex = Math.min(
    milestones.length - 1,
    Math.floor((completeCount / Math.max(total, 1)) * milestones.length),
  );

  return (
    <section
      className="rocket-workshop"
      aria-labelledby="rocket-workshop-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-sky-300">Your rocket workshop</p>
          <h2 id="rocket-workshop-title" className="text-white text-xl mt-1">
            Build it as you learn.
          </h2>
        </div>
        <span className="rocket-workshop-level">{pct}%</span>
      </div>

      <div
        className="rocket-blueprint"
        role="img"
        aria-label={`Your rocket is ${pct}% built`}
        style={
          { "--rocket-accent": ACCENTS[accent].value } as React.CSSProperties
        }
      >
        <span className="rocket-orbit-line" aria-hidden="true" />
        <svg viewBox="0 0 180 260" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y={250 - pct * 2.35} width="180" height="250" />
            </clipPath>
          </defs>
          <g className="rocket-drawing rocket-drawing-outline">
            <path d="M90 20C120 48 127 92 119 171H61C53 92 60 48 90 20Z" />
            <path d="M62 137 31 196l37-13M118 137l31 59-37-13" />
            <path d="M72 171h36l-8 39H80Z" />
            <circle cx="90" cy="82" r="18" />
          </g>
          <g
            className="rocket-drawing rocket-drawing-fill"
            clipPath={`url(#${clipId})`}
          >
            <path d="M90 20C120 48 127 92 119 171H61C53 92 60 48 90 20Z" />
            <path d="M62 137 31 196l37-13M118 137l31 59-37-13" />
            <path d="M72 171h36l-8 39H80Z" />
            <circle cx="90" cy="82" r="18" />
          </g>
          <path className="rocket-center-line" d="M90 10v210" />
          <path className="rocket-ground-line" d="M20 222h140" />
        </svg>
      </div>

      <p className="text-sm text-sky-200 mt-3">
        {completeCount === total
          ? "Flight-ready. You built the whole vehicle."
          : `Next build milestone: ${milestones[milestoneIndex]}`}
      </p>
      <p className="text-xs text-sky-300 mt-1">
        Complete modules to reveal the full rocket.
      </p>

      <div className="mt-4">
        <span className="sr-only">Choose your rocket color</span>
        <div className="flex gap-2" aria-label="Rocket paint" role="group">
          {(Object.keys(ACCENTS) as Accent[]).map((key) => (
            <button
              key={key}
              type="button"
              className="rocket-paint"
              aria-label={ACCENTS[key].label}
              aria-pressed={accent === key}
              onClick={() => setAccent(key)}
              style={{ backgroundColor: ACCENTS[key].value }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
