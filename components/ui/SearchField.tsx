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
    <label
      className={clsx(
        "flex items-center gap-[10px] min-h-[44px] bg-arc-mist rounded-none px-[18px]",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <Icon name="search" size={18} className="shrink-0 text-arc-navy" />
      <input
        type="search"
        placeholder={label}
        className="flex-1 min-w-0 bg-transparent border-0 outline-none py-[12px] font-body font-light text-[16px] text-arc-ink placeholder:text-sky-800"
        {...rest}
      />
    </label>
  );
}
