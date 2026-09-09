import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Legal footer required on every screen: educational content, adult
 * supervision required, follow the NAR Model Rocket Safety Code, unofficial
 * and not affiliated with or endorsed by AIA or NAR. No ARC logo.
 */
export function SiteFooter() {
  return (
    <footer className="bg-arc-paper border-t border-navy-200 py-8">
      <Container className="pb-16 md:pb-0">
        <p className="font-body text-[13px] leading-relaxed text-arc-ink max-w-[70ch]">
          Educational content only. Model rocketry requires adult supervision.
          Follow the{" "}
          <a
            href="https://www.nar.org/safety-information/model-rocket-safety-code/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-sky-700"
          >
            NAR Model Rocket Safety Code
          </a>
          . ARC Learn is unofficial and not affiliated with or endorsed by AIA
          or NAR.{" "}
          <Link href="/legal" className="underline hover:text-sky-700">
            Legal
          </Link>
        </p>
      </Container>
    </footer>
  );
}
