import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "outline" | "outline-inverse" | "text";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

const base =
  "inline-flex items-center justify-center gap-2 rounded-none font-heading font-semibold uppercase tracking-[0.02em] transition-colors duration-200 ease-arc select-none disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[13px]",
  lg: "min-h-12 px-6 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-arc-red text-arc-white hover:bg-red-600 active:bg-red-600 disabled:bg-mist-500 disabled:text-sky-700",
  outline:
    "bg-transparent text-arc-navy border border-arc-navy hover:bg-arc-navy hover:text-arc-white active:bg-arc-navy active:text-arc-white",
  "outline-inverse":
    "bg-transparent text-arc-white border border-arc-white hover:bg-arc-white hover:text-arc-navy active:bg-arc-white active:text-arc-navy",
  text: "bg-transparent text-arc-navy px-0 min-h-11 hover:text-sky-700 active:text-sky-700",
};

/** Primary CTA (one per screen — red is action, never decoration), outline, or text button. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    disabled,
    className,
    children,
    href,
    ...rest
  } = props;

  const cls = clsx(
    base,
    sizes[size],
    variants[variant],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        aria-disabled={disabled}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

/** Text-only action, sentence case, no button chrome. */
export function TextButton({
  className,
  children,
  href,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = clsx(
    "inline-flex items-center gap-1.5 min-h-11 font-body font-bold text-[15px] text-arc-navy normal-case tracking-normal transition-colors duration-200 ease-arc hover:text-sky-700",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Circular icon-only action — the one legitimate use of full radius. */
export function IconButton({
  label,
  className,
  children,
  variant = "outline",
  ...rest
}: {
  label: string;
  variant?: "outline" | "solid";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        "inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200 ease-arc",
        variant === "outline"
          ? "border border-navy-200 text-arc-navy hover:bg-mist-300"
          : "bg-arc-navy text-arc-white hover:bg-navy-600",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
