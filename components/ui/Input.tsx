import { useId } from "react";
import { clsx } from "@/lib/clsx";

type InputProps = {
  label: string;
  hideLabel?: boolean;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/** Mist-filled input, no border — brand rule: fill instead of outline. */
export function Input({
  label,
  hideLabel,
  error,
  className,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-[10px]">
      <label
        htmlFor={inputId}
        className={clsx(
          "font-heading font-semibold text-[14px] uppercase tracking-[0.04em] text-arc-navy",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={clsx(
          "min-h-[44px] bg-arc-mist rounded-none border-0 p-[16px] font-body font-light text-[18px] text-arc-ink placeholder:text-sky-800",
          error && "outline outline-2 outline-danger",
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
