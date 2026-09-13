import { clsx } from "@/lib/clsx";

export type RadioOption = {
  value: string;
  label: string;
  state?: "correct" | "incorrect";
};

/** Circular radio indicators are the other exception to zero-radius. */
export function RadioGroup({
  name,
  legend,
  hideLegend,
  options,
  value,
  onChange,
  className,
  disabled = false,
  cards = false,
}: {
  name: string;
  legend: string;
  hideLegend?: boolean;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  cards?: boolean;
}) {
  return (
    <fieldset
      disabled={disabled}
      className={clsx("flex flex-col gap-[10px]", className)}
    >
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
            className={clsx(
              "inline-flex items-center gap-4 min-h-[52px] select-none transition-colors duration-200",
              !disabled && "cursor-pointer",
              cards &&
                "border p-4 focus-within:outline-2 focus-within:outline-arc-navy",
              cards &&
                (opt.state === "correct"
                  ? "border-go bg-go-tint"
                  : opt.state === "incorrect"
                    ? "border-caution bg-caution-tint"
                    : checked
                      ? "border-arc-navy bg-arc-mist"
                      : "border-navy-200 bg-mist-200 hover:bg-arc-mist"),
            )}
          >
            <span className="relative inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange?.(opt.value)}
                className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
              />
              <span
                className={clsx(
                  "pointer-events-none absolute inset-0 rounded-full border border-navy-200 bg-arc-mist transition-colors duration-200 ease-arc",
                  "peer-checked:border-arc-navy peer-checked:border-[6px]",
                  "peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-arc-sky peer-focus-visible:outline-offset-2",
                )}
              />
            </span>
            <span className="font-body text-[16px] text-arc-ink">
              {opt.label}
              {opt.state && (
                <span className="block text-sm font-bold mt-1">
                  {opt.state === "correct"
                    ? "Correct answer"
                    : "Your answer · review below"}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
