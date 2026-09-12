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
  "inline-flex items-center justify-center gap-[10px] rounded-[8px] font-heading font-semibold transition-colors duration-200 ease-arc select-none disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "min-h-[44px] px-[22px] py-[12px] text-[16px]",
  lg: "min-h-[48px] px-[24px] py-[14px] text-[16px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-arc-red text-arc-white hover:bg-red-600 active:bg-red-600 disabled:bg-mist-500 disabled:text-sky-700",
  outline:
    "bg-transparent text-arc-navy border border-arc-navy hover:bg-arc-navy hover:text-arc-white active:bg-arc-navy active:text-arc-white",
  "outline-inverse":
    "bg-transparent text-arc-white border border-arc-white hover:bg-arc-white hover:text-arc-navy active:bg-arc-white active:text-arc-navy",
  text: "bg-transparent text-arc-navy px-0 min-h-[44px] hover:text-sky-700 active:text-sky-700",
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

type TextButtonTone = "red" | "navy" | "onDark";

const textButtonTones: Record<TextButtonTone, string> = {
  red: "text-arc-red border-arc-red hover:text-red-600 hover:border-red-600",
  navy: "text-arc-navy border-arc-navy hover:text-sky-700 hover:border-sky-700",
  onDark: "text-arc-white border-arc-sky hover:text-arc-sky",
};

/**
 * Uppercase, black-weight, underlined — a bold link, not a quiet one. Red
 * by default (matching the real component's own default tone), which reads
 * as unusual next to this project's "red is the one action color" rule
 * until you see it used for exactly the secondary actions the artifact
 * uses it for (Continue without an account, Back to the course, Try again).
 */
export function TextButton({
  className,
  children,
  href,
  tone = "red",
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  href?: string;
  tone?: TextButtonTone;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = clsx(
    "inline-flex items-center gap-[10px] font-body font-black text-[16px] uppercase tracking-[0.04em] border-b-2 transition-colors duration-200 ease-arc",
    textButtonTones[tone],
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
        "inline-flex items-center justify-center w-[44px] h-[44px] rounded-full transition-colors duration-200 ease-arc",
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
