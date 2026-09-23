import Image from "next/image";

const media = {
  launch: {
    src: "/images/learning/nasa-student-launch.jpg",
    width: 1041,
    height: 1560,
    alt: "A student rocket climbing against blue sky, with small fins at its base and an exhaust flame below.",
    credit: "NASA / MSFC",
    href: "https://www.nasa.gov/image-article/rocket-blasts-off-during-2017-student-launch-challenge/",
    caption:
      "NASA Student Launch, 2017. A different competition; the same basic rocket parts.",
  },
  flight: {
    src: "/images/learning/nasa-flight.gif",
    width: 600,
    height: 387,
    alt: "Model rocket flight: launch, powered climb, coast, highest point, parachute deployment, and descent.",
    credit: "NASA Glenn",
    href: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flight-of-a-model-rocket/",
    caption: "Follow the rocket up, then back down.",
  },
  stability: {
    src: "/images/learning/nasa-stability.gif",
    width: 600,
    height: 449,
    alt: "NASA compares a stable rocket with CG ahead of CP and an unstable rocket with the order reversed.",
    credit: "NASA Glenn",
    href: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/conditions-for-rocket-stability/",
    caption: "CG: balance point. CP: where the air force acts.",
  },
  parts: {
    src: "/images/learning/nasa-parts.gif",
    width: 600,
    height: 386,
    alt: "Labeled NASA model rocket cutaway showing the nose, body, motor, fins, and recovery system.",
    credit: "NASA Glenn",
    href: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/model-rockets/",
    caption: "A basic model rocket. ARC also needs an egg bay and altimeter.",
  },
} as const;

export function QuizImage({ name }: { name: keyof typeof media }) {
  const item = media[name];
  return (
    <figure className="overflow-hidden border border-mist-600 bg-white">
      <a
        href={item.src}
        target="_blank"
        rel="noreferrer"
        aria-label="Enlarge rocket image"
        className="block"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          unoptimized
          loading="eager"
          className={
            name === "launch"
              ? "mx-auto w-full max-w-[400px] h-[300px] sm:h-[340px] object-cover object-[50%_18%]"
              : "mx-auto w-full h-auto max-h-[340px] object-contain p-3"
          }
        />
      </a>
      <figcaption className="border-t border-mist-600 px-4 py-3 text-xs leading-relaxed text-sky-800">
        {item.caption}{" "}
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          {item.credit}
        </a>{" "}
        · Tap to enlarge.
      </figcaption>
    </figure>
  );
}
