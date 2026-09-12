import { Container } from "@/components/ui/Container";

export function RocketLoader({
  label = "Preparing your mission…",
}: {
  label?: string;
}) {
  return (
    <Container className="rocket-loader-shell py-16 md:py-24">
      <div className="rocket-loader" role="status" aria-live="polite">
        <div className="rocket-loader-sky" aria-hidden="true">
          <span className="rocket-loader-star rocket-loader-star-one" />
          <span className="rocket-loader-star rocket-loader-star-two" />
          <span className="rocket-loader-star rocket-loader-star-three" />
          <span className="rocket-loader-ship">
            <svg viewBox="0 0 72 112" width="72" height="112">
              <path
                d="M36 4c15 13 21 32 18 56l-18 16-18-16C15 36 21 17 36 4Z"
                fill="white"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="36" cy="35" r="9" fill="#7db4d1" />
              <path d="m18 52-12 25 20-7M54 52l12 25-20-7" fill="#b42025" />
              <path d="M28 77h16l-3 14H31Z" fill="#113d55" />
            </svg>
            <span className="rocket-loader-flame" />
          </span>
          <span className="rocket-loader-cloud rocket-loader-cloud-one" />
          <span className="rocket-loader-cloud rocket-loader-cloud-two" />
        </div>
        <p className="eyebrow text-white">Launch sequence</p>
        <p className="mt-2 text-lg font-heading font-bold text-white">
          {label}
        </p>
      </div>
    </Container>
  );
}
