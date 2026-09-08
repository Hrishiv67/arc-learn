export function Quote({
  children,
  cite,
}: {
  children: React.ReactNode;
  cite?: string;
}) {
  return (
    <figure className="border-l-[6px] border-arc-navy pl-5 py-1 max-w-[62ch]">
      <blockquote className="font-heading font-bold text-[22px] md:text-[26px] text-arc-navy leading-snug">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mt-2 font-body text-[14px] text-sky-800">
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
