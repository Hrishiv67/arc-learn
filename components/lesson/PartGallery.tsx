import { clsx } from "@/lib/clsx";
import { LessonPhoto } from "@/components/lesson/LessonPhoto";

type Part = {
  src: string;
  label: string;
  alt: string;
};

/** Grid of real part photos for student lessons. */
export function PartGallery({
  parts,
  className,
}: {
  parts: Part[];
  className?: string;
}) {
  return (
    <ul
      className={clsx(
        "my-6 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4",
        className,
      )}
    >
      {parts.map((p) => (
        <li
          key={p.src}
          className="overflow-hidden rounded-sm border border-mist-500 bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.alt}
            className="aspect-square w-full object-contain bg-mist-300 p-2"
            loading="lazy"
          />
          <p className="border-t border-mist-500 px-2 py-1.5 text-center text-sm font-semibold text-arc-navy">
            {p.label}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function PartPair({
  left,
  right,
  className,
}: {
  left: { src: string; alt: string; caption?: string };
  right: { src: string; alt: string; caption?: string };
  className?: string;
}) {
  return (
    <div className={clsx("my-6 grid gap-4 sm:grid-cols-2", className)}>
      <LessonPhoto src={left.src} alt={left.alt} caption={left.caption} />
      <LessonPhoto src={right.src} alt={right.alt} caption={right.caption} />
    </div>
  );
}
