import Image from "next/image";
import { clsx } from "@/lib/clsx";

/** Full-bleed photo + navy scrim + bottom-left headline. No gradients, no patterns. */
export function Hero({
  src,
  alt,
  eyebrow,
  title,
  standfirst,
  actions,
  className,
  priority,
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  standfirst?: string;
  actions?: React.ReactNode;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-navy-800 min-h-[320px] md:min-h-[420px] flex items-end",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,29,41,0.35) 0%, rgba(8,29,41,0.78) 100%)",
        }}
      />
      <div className="relative z-10 max-w-[1240px] w-full mx-auto px-5 md:px-10 py-8 md:py-12">
        {eyebrow && (
          <span className="block font-heading font-semibold text-[11px] uppercase tracking-[0.04em] text-arc-sky mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="font-heading font-bold text-white text-[34px] md:text-[52px] leading-[1.1]">
          {title}
        </h1>
        {standfirst && (
          <p className="font-body text-white text-[17px] md:text-[20px] mt-4 max-w-[58ch]">
            {standfirst}
          </p>
        )}
        {actions && <div className="mt-6 flex flex-wrap gap-4">{actions}</div>}
        <p className="sr-only">{alt}</p>
      </div>
    </div>
  );
}
