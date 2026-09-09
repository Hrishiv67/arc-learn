import { clsx } from "@/lib/clsx";

export type RadioOption = { value: string; label: string };

/** Circular radio indicators are the other exception to zero-radius. */
export function RadioGroup({
  name,
  legend,
  hideLegend,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  legend: string;
  hideLegend?: boolean;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={clsx("flex flex-col gap-[10px]", className)}>
      <legend
        className={clsx(
          "font-heading font-semibold text-[14px] uppercase tracking-[0.04em] text-arc-navy mb-1",
          hideLegend && "sr-only",
        )}
      >
        {legend}
      </legend>
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className="inline-flex items-center gap-[20px] min-h-[44px] cursor-pointer select-none"
          >
            <span className="relative inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange?.(opt.value)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "absolute inset-0 rounded-full border border-navy-200 bg-arc-mist transition-colors duration-200 ease-arc",
                  "peer-checked:border-arc-navy peer-checked:border-[6px]",
                  "peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-arc-sky peer-focus-visible:outline-offset-2",
                )}
              />
            </span>
            <span className="font-body text-[16px] text-arc-ink">
              {opt.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
