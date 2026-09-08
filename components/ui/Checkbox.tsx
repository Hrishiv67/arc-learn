import { useId } from "react";
import { clsx } from "@/lib/clsx";
import { Icon } from "./Icon";

export function Checkbox({
  label,
  className,
  id,
  checked,
  ...rest
}: {
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <label
      htmlFor={checkboxId}
      className={clsx(
        "inline-flex items-center gap-3 min-h-11 cursor-pointer select-none",
        className,
      )}
    >
      <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...rest}
        />
        <span
          className={clsx(
            "absolute inset-0 border border-navy-200 bg-arc-mist transition-colors duration-200 ease-arc",
            "peer-checked:bg-arc-navy peer-checked:border-arc-navy",
            "peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-arc-sky peer-focus-visible:outline-offset-2",
          )}
        />
        {checked && (
          <Icon
            name="check"
            size={15}
            className="relative text-arc-white pointer-events-none"
          />
        )}
      </span>
      <span className="font-body text-[16px] text-arc-ink">{label}</span>
    </label>
  );
}
