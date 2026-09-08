import { useId } from "react";
import { clsx } from "@/lib/clsx";
import { Icon } from "./Icon";

type SelectProps = {
  label: string;
  hideLabel?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  hideLabel,
  children,
  className,
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={selectId}
        className={clsx(
          "font-heading font-semibold text-[11px] uppercase tracking-[0.04em] text-arc-navy",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={clsx(
            "min-h-11 w-full appearance-none bg-arc-mist rounded-none border-0 pl-4 pr-10 font-body text-[17px] text-arc-ink",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sky-800"
        />
      </div>
    </div>
  );
}
