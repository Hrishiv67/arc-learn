import { SEASON } from "@/content/seasons/2027";

export function SeasonRules() {
  const c = SEASON.constraints;
  return (
    <div className="border border-mist-600 bg-mist-200 p-5">
      <h3 className="text-xl">Before you buy parts</h3>
      <ul>
        <li>
          <strong>Mass:</strong> at most {SEASON.parameters.liftoffMass.value}{" "}
          g, fully loaded. <strong>Length:</strong> at least {c.minimumLengthMm}{" "}
          mm including fins.
        </li>
        <li>
          <strong>Shape:</strong> at least two external tube diameters. One
          section must be at least {c.mainTubeDiameterMm} mm wide and{" "}
          {c.mainTubeLength} long; the other diameter must differ by at least{" "}
          {c.diameterDifferenceMm} mm.
        </li>
        <li>
          <strong>Motor:</strong> one stage; approved class{" "}
          {c.maximumMotorClass} or lower motors, at most {c.combinedImpulseNs}{" "}
          N·s combined impulse, all ignited on the ground. Use positive
          mechanical retention.
        </li>
        <li>
          <strong>Recovery:</strong> parachute required; all parts stay tethered
          except disposable wadding. Cotton is not required.
        </li>
      </ul>
      <a
        className="text-sm"
        href={SEASON.rulesUrl}
        target="_blank"
        rel="noreferrer"
      >
        {SEASON.year} rules · section 4.3 →
      </a>
    </div>
  );
}
