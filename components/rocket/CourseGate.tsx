import Link from "next/link";

/**
 * 03 — the account, and the page's legal line.
 *
 * Deliberately short. The course above is the pitch; this is just the door.
 * "Free" is said plainly and more than once, because asking a student to make
 * an account reads as a paywall unless you tell them otherwise.
 *
 * The homepage runs outside the app chrome, so it has no site footer — which
 * left the one page most visitors see without the safety and non-affiliation
 * line every other page carries. It lives here now.
 */
export function CourseGate() {
  return (
    <section className="gate" aria-label="Create an account">
      <div className="gate__inner">
        <div>
          <p className="gate__eyebrow">03 / Sign in</p>
          <h2 className="gate__title">Start with module one.</h2>
          <p className="gate__lede">
            An account saves your progress and the rocket you are building. The
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

      <p className="gate__legal">
        Educational content only. Model rocketry requires adult supervision —
        follow the{" "}
        <a
          href="https://www.nar.org/safety-information/model-rocket-safety-code/"
          target="_blank"
          rel="noreferrer"
        >
          NAR Model Rocket Safety Code
        </a>
        . ARC Learn is unofficial and not affiliated with or endorsed by AIA or
        NAR. <Link href="/terms">Terms of Use</Link>
        {" · "}
        <Link href="/legal">Legal</Link>
      </p>
    </section>
  );
}
