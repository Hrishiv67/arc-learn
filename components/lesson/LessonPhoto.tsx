import { clsx } from "@/lib/clsx";

/**
 * Lesson photo with a short student-facing caption.
 * Prefer real part/flight photos over decorative diagrams.
 */
export function LessonPhoto({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={clsx("my-6", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static lesson assets from /public */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-sm border border-mist-500 bg-mist-300 object-contain"
        loading="lazy"
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-sky-800 leading-snug">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
