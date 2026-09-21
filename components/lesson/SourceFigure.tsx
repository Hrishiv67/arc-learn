import Image from "next/image";

const figures = {
  parts: {
    src: "/images/learning/nasa-parts.gif",
    width: 600,
    height: 386,
    alt: "NASA cutaway of a model rocket: nose cone, parachute, shock cord, protective wadding, body tube, motor mount, engine, launch lugs, and rear fins.",
    caption:
      "Follow the rocket from nose to tail. The motor pushes; the parachute brings it back.",
    source: "model-rockets",
  },
  flight: {
    src: "/images/learning/nasa-flight.gif",
    width: 600,
    height: 387,
    alt: "NASA flight sequence showing launch, powered ascent, coasting, maximum altitude, parachute deployment, and slow descent.",
    caption:
      "Burn → coast → apogee → recover. The motor stops pushing before the rocket stops climbing.",
    source: "flight-of-a-model-rocket",
  },
  stability: {
    src: "/images/learning/nasa-stability.gif",
    width: 600,
    height: 449,
    alt: "NASA comparison: a stable rocket has its center of gravity closer to the nose than its center of pressure; reversing them makes a disturbance grow.",
    caption:
      "CG = balance point. CP = where the sideways air force effectively acts. Keep CG nearer the nose than CP.",
    source: "conditions-for-rocket-stability",
  },
} as const;

export function SourceFigure({ name }: { name: keyof typeof figures }) {
  const f = figures[name];
  return (
    <figure className="my-3 overflow-hidden border border-mist-600 bg-white">
      <a
        href={f.src}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open full-size ${name} diagram`}
        className="block p-3 sm:p-5"
      >
        <Image
          src={f.src}
          alt={f.alt}
          width={f.width}
          height={f.height}
          unoptimized
          className="mx-auto h-auto w-full max-w-[600px]"
        />
      </a>
      <figcaption className="border-t border-mist-600 bg-mist-200 p-4 text-sm leading-relaxed">
        <strong className="block text-arc-navy">{f.caption}</strong>
        <span className="mt-2 block text-sky-800">
          Illustration:{" "}
          <a
            href={`https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/${f.source}/`}
            target="_blank"
            rel="noreferrer"
          >
            NASA Glenn
          </a>
          . Tap the image to enlarge. General model rocket; ARC adds an egg bay
          and altimeter.
        </span>
      </figcaption>
    </figure>
  );
}
