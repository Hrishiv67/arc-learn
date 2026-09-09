import { clsx } from "@/lib/clsx";
import { Icon } from "./Icon";
import type { StepState } from "./StepProgress";

/**
 * 24x24 square step marker (the lesson rail's step nav), distinct from the
 * circular <ProgressRing /> used for percentage completion elsewhere.
 */
export function StepDot({ state }: { state: StepState }) {
  return (
    <span
      className={clsx(
        "w-[24px] h-[24px] shrink-0 inline-flex items-center justify-center",
        state === "done" && "bg-go",
        state === "current" && "bg-arc-navy",
        state === "todo" && "bg-transparent border-2 border-mist-600",
      )}
    >
      {state === "done" && <Icon name="check" size={15} className="text-white" />}
    </span>
  );
}
