import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using ARC Learn, a free and unofficial rocketry course for American Rocketry Challenge students.",
};

const EFFECTIVE = "September 13, 2026";
const REPO = "https://github.com/Hrishiv67/arc-learn";
const SAFETY_CODE =
  "https://www.nar.org/safety-information/model-rocket-safety-code/";

const link = "underline text-arc-navy hover:text-sky-700";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2
        id={id}
        className="font-heading font-bold text-arc-navy text-[22px] md:text-[26px] leading-tight mt-6"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 flex flex-col gap-2 marker:text-sky-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <Container className="py-12 md:py-16">
      <article className="flex flex-col gap-6 font-body text-[17px] leading-relaxed text-read max-w-[70ch]">
        <header className="flex flex-col gap-3">
          <p className="eyebrow">ARC Learn · Terms</p>
          <h1 className="font-heading font-bold text-arc-navy text-[34px] md:text-[48px] leading-tight">
            Terms of Use
          </h1>
          <p className="text-[15px] text-sky-800">Effective {EFFECTIVE}</p>
        </header>

        <p>
          These are the rules for using ARC Learn. If you’re a student, read them
          with a parent, guardian, or teacher — they’re short, and they cover
          safety as well as your account.
        </p>

        <Section id="what" title="What ARC Learn is">
          <p>
            ARC Learn is a free, unofficial study course for students preparing
            for the American Rocketry Challenge. It is not run by, affiliated
            with, or endorsed by the American Rocketry Challenge, the Aerospace
            Industries Association (AIA), or the National Association of
            Rocketry (NAR).
          </p>
          <p>
            The official rules and team handbook published by the American
            Rocketry Challenge are the only authority on eligibility, scoring
            and qualification. If anything on ARC Learn disagrees with them, the
            official documents win.
          </p>
        </Section>

        <Section id="using" title="Using the course">
          <List
            items={[
              "The course is free. There is no paid tier, trial, or upgrade.",
              "You may use it for your own learning, and teachers and team mentors may use it with their students.",
              "You may print or save lessons for personal and classroom study. Please don’t republish the course or sell it.",
            ]}
          />
        </Section>

        <Section id="accounts" title="Accounts">
          <List
            items={[
              "You can use the course without an account. Without one, your progress is kept in the browser on the device you’re using.",
              "An account saves your progress so you can pick up on another device. You can sign up with an email address and password, or with Google where that option is shown.",
              "Keep your password to yourself, and use an email address you actually check. You are responsible for what happens on your account.",
            ]}
          />
        </Section>

        <Section id="under-13" title="Students under 13">
          <p>
            If you are under 13, you need permission from a parent or guardian
            before creating an account, and they should help you set it up.
          </p>
          <p>
            If you are a parent or guardian and believe your child created an
            account without your permission, contact us using the details
            below and we will delete the account and its progress.
          </p>
        </Section>

        <Section id="safety" title="Rocketry is a supervised activity">
          <List
            items={[
              "ARC Learn is educational content. It does not replace hands-on instruction from a qualified adult.",
              <>
                Model rocketry requires adult supervision at every stage —
                building, handling motors, and launching. Always follow the{" "}
                <a href={SAFETY_CODE} target="_blank" rel="noreferrer" className={link}>
                  NAR Model Rocket Safety Code
                </a>{" "}
                and the rules of your launch site.
              </>,
              "You are responsible for how you build and fly your rocket. ARC Learn is not responsible for injury, damage, or loss that results from building, handling, or launching rockets.",
            ]}
          />
        </Section>

        <Section id="accuracy" title="Accuracy">
          <p>
            Some lessons are marked as draft while they wait for review by a
            subject-matter expert. Where a rule is quoted, it links to its source
            — check that source yourself before relying on it for a
            qualification flight.
          </p>
          <p>
            We work to keep the course correct, but we can’t promise it is free
            of errors, or that following it will get your team a particular
            result.
          </p>
        </Section>

        <Section id="conduct" title="Things you must not do">
          <List
            items={[
              "Try to get into anyone else’s account or data.",
              "Interfere with the site, overload it, or look for ways around its security.",
              "Upload or send anything harmful, such as malware.",
              "Copy the course in bulk to republish or sell it.",
            ]}
          />
        </Section>

        <Section id="data" title="Your information">
          <p>If you use an account, ARC Learn stores:</p>
          <List
            items={[
              "Your email address — and, if you sign in with Google, the basic profile details Google shares with the sign-in service.",
              "For each module: whether you have completed it, your quiz score, where you left off in a lesson video, and when it was last updated.",
            ]}
          />
          <p>
            That information is stored with Supabase, the database service ARC
            Learn uses, with access rules that let only your own sign-in read
            your progress. Like any website, the servers that deliver ARC Learn
            keep standard technical logs.
          </p>
          <p>
            We don’t sell your information, show ads, or add advertising or
            analytics trackers to the site. You can ask us to delete your
            account and its progress at any time.
          </p>
        </Section>

        <Section id="credits" title="Photos and names">
          <p>
            Launch photography on the homepage is used under Creative Commons
            and public-domain licences; credits are listed in the project’s{" "}
            <a href={`${REPO}/blob/main/CREDITS.md`} target="_blank" rel="noreferrer" className={link}>
              credits file
            </a>
            . The American Rocketry Challenge, AIA and NAR names belong to their
            owners, and ARC Learn does not use their logos.
          </p>
        </Section>

        <Section id="warranty" title="No guarantees">
          <p>
            ARC Learn is provided as it is. We may change, pause, or remove
            parts of it, and it may sometimes be unavailable. To the extent the
            law allows, we are not liable for indirect or incidental losses that
            come from using it.
          </p>
        </Section>

        <Section id="changes" title="Changes to these terms">
          <p>
            If these terms change, the date at the top of this page will change
            with them. Using ARC Learn after a change means you accept the
            updated terms.
          </p>
        </Section>

        <Section id="contact" title="Contact">
          <p>
            For questions, or to ask for an account to be deleted, open an issue
            on the{" "}
            <a href={`${REPO}/issues`} target="_blank" rel="noreferrer" className={link}>
              ARC Learn project page
            </a>
            . Issues are public: describe what you need, but don’t post your
            email address, password, or anything else private — we’ll reply
            there with how to confirm the account is yours.
          </p>
          <p>
            See also the{" "}
            <Link href="/legal" className={link}>
              Legal
            </Link>{" "}
            page.
          </p>
        </Section>
      </article>
    </Container>
  );
}
