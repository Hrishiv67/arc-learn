import { clsx } from "@/lib/clsx";
import { Icon, type IconName } from "./Icon";

type Tone = "go" | "caution" | "info" | "danger";

const toneStyles: Record<Tone, { bar: string; bg: string; icon: IconName }> = {
  go: { bar: "border-go", bg: "bg-go-tint", icon: "circle-check" },
  caution: {
    bar: "border-caution",
    bg: "bg-caution-tint",
    icon: "triangle-alert",
  },
  info: { bar: "border-info", bg: "bg-info-tint", icon: "info" },
  danger: { bar: "border-danger", bg: "bg-danger-tint", icon: "octagon-x" },
};

const iconColor: Record<Tone, string> = {
  go: "text-go",
  caution: "text-caution",
  info: "text-info",
  danger: "text-danger",
};

/**
 * Feedback callout — tinted fill, 6px leading bar, optional icon + title.
 * Used for the needsReview flag, quiz feedback, safety-gate explanations,
 * and account-tier notices. Never uses red (red is reserved for actions).
 */
export function Callout({
  tone = "info",
  title,
  icon = true,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const t = toneStyles[tone];
  return (
    <div
      role={tone === "danger" || tone === "caution" ? "alert" : undefined}
      className={clsx("flex gap-3 border-l-[6px] p-4", t.bar, t.bg, className)}
    >
      {icon && (
        <Icon
          name={t.icon}
          size={18}
          className={clsx("mt-0.5 shrink-0", iconColor[tone])}
        />
      )}
      <div className="min-w-0">
        {title && (
          <p className="font-body font-bold text-[15px] text-arc-ink">
            {title}
          </p>
        )}
        <div className="font-body text-[15px] text-arc-ink mt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
