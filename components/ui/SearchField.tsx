import { clsx } from "@/lib/clsx";
import { Icon } from "./Icon";

export function SearchField({
  label = "Search",
  className,
  ...rest
}: {
  label?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <label className={clsx("relative flex items-center", className)}>
      <span className="sr-only">{label}</span>
      <Icon
        name="search"
        size={16}
        className="pointer-events-none absolute left-4 text-sky-800"
      />
      <input
        type="search"
        placeholder={label}
        className="min-h-11 w-full bg-arc-mist rounded-none border-0 pl-11 pr-4 font-body text-[16px] text-arc-ink placeholder:text-sky-800"
        {...rest}
      />
    </label>
  );
}
