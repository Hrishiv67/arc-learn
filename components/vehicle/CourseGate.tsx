import Link from "next/link";
import { UNITS } from "@/content/modules/registry";

/**
 * 03 — the course, and the account.
 *
 * The last dark section before the paper theme takes over. It lists the four
 * units against the assembly each one earns, then asks for the account that
 * the build progress is saved to. Free is stated plainly and more than once,
 * because "create an account" in front of a school resource reads as a paywall
 * unless you say otherwise.
 */

const ASSEMBLY: Record<number, string> = {
  1: "The pad",
  2: "Airframe",
  3: "Payload and recovery",
  4: "Flight",
};

export function CourseGate() {
  return (
    <section className="course" aria-label="The course">
      <div className="course__head">
        <p className="course__eyebrow">03 / The course</p>
        <h2 className="course__title">Four units. Thirteen modules.</h2>
        <p className="course__lede">
          Written for a first-year team with no rocketry background. Read the
          concept, check yourself against a real quiz, then take the part you
          earned.
        </p>
      </div>

      <ol className="course__units">
        {UNITS.map(({ unit, title, modules }) => (
          <li key={unit} className="course__unit">
            <span className="course__unitIndex">
              {String(unit).padStart(2, "0")}
            </span>
            <span className="course__unitBody">
              <span className="course__unitTitle">{title}</span>
              <span className="course__unitMeta">
                {modules.length} modules
              </span>
            </span>
            <span className="course__unitAssembly">{ASSEMBLY[unit]}</span>
          </li>
        ))}
      </ol>

      <div className="course__gate">
        <div>
          <h3 className="course__gateTitle">Start building.</h3>
          <p className="course__gateLede">
            An account keeps your progress and your vehicle across devices. The
            entire course is free — every module, every quiz, forever.
          </p>
        </div>
        <div className="course__gateActions">
          <Link className="course__cta" href="/account?next=/modules">
            Create your free account
            <span className="course__ctaArrow" aria-hidden="true" />
          </Link>
          <Link className="course__signin" href="/account">
            Already have one? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
