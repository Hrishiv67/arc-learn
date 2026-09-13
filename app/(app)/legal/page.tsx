import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <Container className="py-12 flex flex-col gap-6">
      <p className="eyebrow">ARC / LEARN · Site information</p>
      <h1 className="font-heading font-bold text-arc-navy text-[34px] md:text-[48px] leading-tight">
        Legal
      </h1>
      <div className="flex flex-col gap-6 font-body text-[17px] text-arc-ink max-w-[70ch]">
        <p>
          ARC Learn is educational content only. Model rocketry requires adult
          supervision at every stage — building, motor handling, and launch.
          Follow the{" "}
          <a
            href="https://www.nar.org/safety-information/model-rocket-safety-code/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-sky-700"
          >
            NAR Model Rocket Safety Code
          </a>{" "}
          without exception.
        </p>
        <p>
          ARC Learn is an unofficial resource and is not affiliated with or
          endorsed by the Aerospace Industries Association (AIA) or the National
          Association of Rocketry (NAR). It is not a substitute for the official
          American Rocketry Challenge rules, which are the governing document
          for competition eligibility and scoring.
        </p>
        <p>
          Unverified technical content on this site is flagged with a visible
          caution notice at the top of the lesson. Where a rule is quoted, it is
          quoted directly from the published rules with a source link — read the
          source yourself before relying on it for a qualification flight.
        </p>
        <p>
          No ARC logo, wordmark, or official mark appears anywhere on this site.
          Sponsor and partner marks are third-party property and are out of
          scope for this project.
        </p>
      </div>
    </Container>
  );
}
