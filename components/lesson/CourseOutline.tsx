import Link from "next/link";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/Icon";
import { UNITS } from "@/content/modules/registry";
import { isModuleUnlocked } from "@/lib/progress/gating";
import { isModuleComplete } from "@/lib/schemas/progress";
import type { ProgressState } from "@/lib/schemas/progress";

/**
 * Whole-course outline, collapsed into the lesson/quiz rail so a student
 * can jump to any unlocked module without backing out to /modules first —
 * the rail otherwise only ever showed the two steps of the module you're
 * already on. Current module is highlighted; locked/coming-soon rows are
 * inert, matching ModulesIndexClient's own gating rules exactly.
 */
export function CourseOutline({
  progress,
  currentSlug,
}: {
  progress: ProgressState;
  currentSlug: string;
}) {
  return (
    <div className="flex flex-col gap-[14px]">
      <span className="font-heading font-semibold text-[11px] uppercase tracking-[0.04em] text-sky-800">
        Course outline
      </span>
      <div className="flex flex-col gap-[16px]">
        {UNITS.map((u) => (
          <div key={u.unit}>
            <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.03em] text-sky-700 block mb-[6px]">
              Unit {u.unit} · {u.title}
            </span>
            <div className="flex flex-col">
              {u.modules.map((m) => {
                const live = m.status === "live";
                const unlocked = live && isModuleUnlocked(m, progress);
                const complete = isModuleComplete(progress[m.id]);
                const current = m.slug === currentSlug;
                const clickable = live && unlocked && !current;

                const row = (
                  <span
                    className={clsx(
                      "flex items-center gap-[8px] min-h-[32px] py-[4px] px-[6px] -mx-[6px] font-body text-[13px] transition-colors duration-200 ease-arc",
                      current && "font-bold text-arc-navy bg-mist-300",
                      !current && (live && unlocked ? "text-arc-ink" : "text-sky-700"),
                      clickable && "hover:bg-mist-300",
                    )}
                  >
                    {complete ? (
                      <Icon
                        name="circle-check"
                        size={14}
                        className="text-go shrink-0"
                      />
                    ) : live && unlocked ? (
                      <span className="w-[14px] h-[14px] rounded-full border-2 border-navy-300 shrink-0" />
                    ) : (
                      <Icon
                        name="lock"
                        size={12}
                        className="text-sky-700 shrink-0"
                      />
                    )}
                    <span className="truncate">{m.title}</span>
                  </span>
                );

                return clickable ? (
                  <Link key={m.id} href={`/modules/${m.slug}`}>
                    {row}
                  </Link>
                ) : (
                  <div key={m.id}>{row}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
