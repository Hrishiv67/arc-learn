import { SEASON } from "@/content/seasons/2027";
import { StatTiles } from "@/components/ui/StatTile";

type ParamName = "targetAltitude" | "durationWindow" | "payload";

/**
 * Resolves a single season figure inline, in prose. Never a literal —
 * always pulled from the current season config so a year rollover is a
 * one-file change, not a content hunt.
 */
export function Parameter({ name }: { name: ParamName }) {
  const p = SEASON.parameters;
  if (name === "payload") {
    return (
      <span className="font-bold">
        {p.payload.count} eggs ({p.payload.eachMass})
      </span>
    );
  }
  const param = p[name];
  return (
    <span className="font-bold">
      {param.value} {param.unit}
    </span>
  );
}

/** The three headline season figures as a flush navy/mist stat row. */
export function SeasonFigures() {
  const p = SEASON.parameters;
  return (
    <div>
      <StatTiles
        stats={[
          {
            value: String(p.targetAltitude.value),
            unit: p.targetAltitude.unit,
            label: p.targetAltitude.label,
          },
          {
            value: String(p.durationWindow.value),
            unit: p.durationWindow.unit,
            label: p.durationWindow.label,
          },
          {
            value: String(p.payload.count),
            unit: "eggs",
            label: p.payload.label,
          },
        ]}
      />
      <p className="font-body text-[13px] text-sky-800 mt-2.5">
        Grade A Large, {p.payload.eachMass}, carried in any orientation. Season{" "}
        {SEASON.year}, quoted from the published rules — check them again before
        your qualification flight.
      </p>
    </div>
  );
}
