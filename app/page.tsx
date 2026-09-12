import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <>
      <section className="home-hero-section">
        <Container className="py-12 md:py-20 relative z-10">
          <div className="home-hero">
            <div>
              <p className="eyebrow hero-eyebrow">
                <span aria-hidden="true" /> A small step toward your first
                flight
              </p>
              <h1 className="hero-title">
                Big ideas.
                <br />
                Real rockets.
                <br />
                <span>Your first flight.</span>
              </h1>
              <p className="mt-6 text-lg text-sky-800 max-w-[44ch]">
                Learn the American Rocketry Challenge, one clear lesson at a
                time. Made for curious students and first-year teams.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button href="/modules/this-years-challenge/lesson" size="lg">
                  Start learning ↗
                </Button>
                <Button href="/modules" variant="outline" size="lg">
                  Explore the course
                </Button>
              </div>
              <p className="mt-4 text-sm text-sky-800">
                Free to learn · No account needed · Go at your pace
              </p>
              <div className="hero-proof" aria-label="Course details">
                <span>
                  <strong>9 min</strong> first lesson
                </span>
                <span>
                  <strong>11</strong> quiz questions
                </span>
                <span>
                  <strong>13</strong> rocket milestones
                </span>
              </div>
            </div>
            <div className="hero-photo">
              <Image
                src="/images/hero-launch-field.jpg"
                alt="Student teams celebrating at the American Rocketry Challenge"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="hero-photo-caption">
                <span className="eyebrow">From classroom to launch field</span>
                <p className="text-white text-2xl font-heading font-bold mt-2">
                  Every team starts somewhere.
                </p>
              </div>
              <div className="hero-mission-card">
                <span className="hero-mission-pulse" aria-hidden="true" />
                <span>
                  <strong>Mission 01</strong>
                  Ready to launch
                </span>
              </div>
              <div className="hero-flight-tag" aria-hidden="true">
                <span>Altitude</span>
                <strong>Target locked</strong>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-y border-mist-500 bg-mist-200">
        <Container className="grid sm:grid-cols-3 gap-8 py-8">
          {[
            [
              "01",
              "Learn the essentials",
              "Short readings, clear diagrams, and terms explained as you go.",
            ],
            [
              "02",
              "Try it for yourself",
              "Check your understanding with an interactive quiz and useful feedback.",
            ],
            [
              "03",
              "Pick up where you left off",
              "Every completed module builds another piece of your personal rocket.",
            ],
          ].map(([number, title, body]) => (
            <div key={number}>
              <span className="eyebrow">{number} / HOW IT WORKS</span>
              <h2 className="text-xl mt-3">{title}</h2>
              <p className="text-base text-sky-800 mt-2">{body}</p>
            </div>
          ))}
        </Container>
      </section>
      <Container className="py-12 md:py-16">
        <div className="learning-card">
          <div>
            <p className="eyebrow">Your starting point · Module 01</p>
            <h2 className="text-3xl mt-3">Understand the challenge.</h2>
            <p className="text-sky-800 mt-3 max-w-[55ch]">
              Explore the flight goal, get to know your rocket, and learn how
              scoring works. A 9-minute reading followed by 11 questions.
            </p>
            <p className="text-sm text-sky-800 mt-4">
              1 module available now · 12 more in the course roadmap
            </p>
          </div>
          <Button href="/modules/this-years-challenge/lesson">
            Open the first lesson →
          </Button>
        </div>
      </Container>
    </>
  );
}
