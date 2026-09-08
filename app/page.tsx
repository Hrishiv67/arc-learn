import { Hero } from "@/components/ui/Hero";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";

const FEATURES = [
  {
    title: "13 modules",
    body: "Read the lesson, then take the quiz.",
  },
  {
    title: "Built for first-year teams",
    body: "No aerospace background assumed.",
  },
  {
    title: "Works offline",
    body: "Lessons and handouts cache on your device.",
  },
];

export default function HomePage() {
  return (
    <div>
      <Hero
        src="/images/hero-national-finals-banner.jpg"
        alt="Students at an American Rocketry Challenge event, cheering with hands raised"
        eyebrow="Unofficial · free · no account needed"
        title="ARC Learn"
        standfirst="A free course that takes a first-year American Rocketry Challenge team from registration to their first qualification flight. The competition site tells you the rules — this teaches you how to meet them."
        actions={
          <>
            <Button href="/modules" variant="primary" size="lg">
              Start the course
            </Button>
            <Button href="/account" variant="outline-inverse" size="lg">
              Create an account
            </Button>
          </>
        }
        priority
      />

      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 border-t border-mist-600 sm:border-t-0">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={
                "pt-6 sm:pt-0 " +
                (i > 0 ? "sm:border-l sm:border-mist-600 sm:pl-8" : "")
              }
            >
              <span className="block w-10 h-[3px] bg-arc-red mb-3" />
              <h2 className="font-heading font-bold text-[19px] text-arc-navy">
                {f.title}
              </h2>
              <p className="font-body text-[16px] text-arc-ink mt-1.5">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist-300">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-10 md:py-16">
          <SectionTitle eyebrow="Get started" title="Save your progress?" />
          <p className="font-body text-[17px] text-arc-ink mt-4 max-w-[58ch]">
            An account keeps your progress across devices. You can skip it and
            start now — everything works either way, and nothing is gated behind
            signing up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button href="/account" variant="primary" size="lg">
              Create an account
            </Button>
            <Button href="/modules" variant="outline" size="lg">
              Continue without one
            </Button>
          </div>
          <p className="font-body text-[13px] text-sky-800 mt-4">
            Ask a parent or teacher before creating an account.
          </p>
        </div>
      </section>
    </div>
  );
}
