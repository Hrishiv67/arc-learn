"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress/local";
import { rocketBuild } from "@/lib/rocket/build";

export function RocketBuild() {
  const titleId = useId();
  const progress = useProgress();
  const build = rocketBuild(progress);
  const [selected, setSelected] = useState<string | null>(null);
  const part =
    build.parts.find((p) => p.id === selected) ??
    build.nextPart ??
    build.parts[0];
  const nextHref = build.next
    ? "/modules/" +
      build.next.slug +
      (progress[build.next.id]?.read ? "/quiz" : "/lesson")
    : null;
  return (
    <section className="rocket-build" aria-labelledby={titleId}>
      <div className="rocket-build__head">
        <p className="rocket-build__eyebrow">Your rocket</p>
        <h2 id={titleId}>
          {build.complete
            ? "Ready for launch."
            : build.done
              ? "It’s coming together."
              : "Start small. Aim high."}
        </h2>
        <p>Every module brings your rocket a little closer.</p>
      </div>
      <div
        className="rocket-build__scene"
        role="img"
        aria-label={
          "Your rocket: " +
          build.done +
          " of " +
          build.total +
          " modules complete"
        }
      >
        <span className="rocket-build__guide" aria-hidden="true" />
        <div className="rocket-build__assembly" aria-hidden="true">
          {build.parts.map((p) => (
            <span
              key={p.id}
              className="rocket-build__part"
              data-selected={part.id === p.id}
              style={{
                width: "calc(var(--build-diameter) * " + p.widthD + ")",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rocket-build__ghost"
                src={"/rocket/cad-" + p.id + ".png"}
                alt=""
                draggable={false}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rocket-build__earned"
                src={"/rocket/cad-" + p.id + ".png"}
                alt=""
                draggable={false}
                style={{
                  // parts point nose-right, so the earned fill grows from the tail
                  clipPath: "inset(0 " + (1 - p.fraction) * 100 + "% 0 0)",
                }}
              />
            </span>
          ))}
        </div>
        <span className="rocket-build__stage-label" aria-hidden="true">
          {build.complete ? "ASSEMBLED" : "WORK IN PROGRESS"}
        </span>
      </div>
      <div className="rocket-build__progress">
        <span>
          <strong>{build.done}</strong> / {build.total} modules
        </span>
        <span>{Math.round((build.done / build.total) * 100)}% built</span>
      </div>
      <div
        className="rocket-build__track"
        role="progressbar"
        aria-label="Rocket build"
        aria-valuemin={0}
        aria-valuemax={build.total}
        aria-valuenow={build.done}
      >
        <span style={{ width: (build.done / build.total) * 100 + "%" }} />
      </div>
      <div
        className="rocket-build__parts"
        role="group"
        aria-label="Explore your rocket parts"
      >
        {build.parts.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={part.id === p.id}
            onClick={() => setSelected(p.id)}
            aria-label={
              p.label +
              ": " +
              p.done +
              " of " +
              p.modules.length +
              " modules complete"
            }
          >
            <span>{p.short}</span>
            <span aria-hidden="true">
              {p.fraction === 1 ? "✓" : p.done + "/" + p.modules.length}
            </span>
          </button>
        ))}
      </div>
      <div className="rocket-build__detail" aria-live="polite">
        <h3>{part.label}</h3>
        <p>
          {part.fraction === 1 ? "Part complete. " : ""}
          {part.earns}.
        </p>
      </div>
      {nextHref ? (
        <Link className="rocket-build__next" href={nextHref}>
          {build.done ? "Keep building" : "Start your first module"}
          <span aria-hidden="true">↗</span>
        </Link>
      ) : (
        <p className="rocket-build__saved">
          {build.complete
            ? "You built it. Look back at how far you’ve come."
            : "You’re up to date. Keep your progress here while new modules arrive."}
        </p>
      )}
    </section>
  );
}
