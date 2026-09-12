import Link from "next/link";

/**
 * 03 — the account.
 *
 * Deliberately short. The course above is the pitch; this is just the door.
 * "Free" is said plainly and more than once, because asking a student to make
 * an account reads as a paywall unless you tell them otherwise.
 */
export function CourseGate() {
  return (
    <section className="gate" aria-label="Create an account">
      <div className="gate__inner">
        <div>
          <p className="gate__eyebrow">03 / Sign in</p>
          <h2 className="gate__title">Start with module one.</h2>
          <p className="gate__lede">
            An account saves your progress and the vehicle you are building. The
            whole course is free — every module, every quiz, no trial, no
            upgrade.
          </p>
        </div>
        <div className="gate__actions">
          <Link className="gate__cta" href="/account?next=/modules">
            Create your free account
            <span className="gate__ctaArrow" aria-hidden="true" />
          </Link>
          <Link className="gate__signin" href="/account">
            Already have one? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
