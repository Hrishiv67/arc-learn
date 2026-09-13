import { MODULES } from "@/content/modules/registry";
import { isModuleComplete, type ProgressState } from "@/lib/schemas/progress";
import { SECTIONS, BUILD_ORDER, sectionIndexForModule } from "./sections";

export function rocketBuild(progress: ProgressState) {
  const parts = SECTIONS.map((section, index) => {
    const modules = MODULES.filter(
      (m) => sectionIndexForModule(m.order) === index,
    );
    const done = modules.filter((m) => isModuleComplete(progress[m.id])).length;
    return {
      ...section,
      modules,
      done,
      fraction: modules.length ? done / modules.length : 0,
    };
  });
  const done = MODULES.filter((m) => isModuleComplete(progress[m.id])).length;
  const next = MODULES.find(
    (m) =>
      m.status === "live" &&
      !isModuleComplete(progress[m.id]) &&
      m.prerequisiteIds.every((id) => isModuleComplete(progress[id])),
  );
  const nextPart = BUILD_ORDER.map((index) => parts[index]).find(
    (p) => p.fraction < 1,
  );
  return {
    parts,
    done,
    total: MODULES.length,
    next,
    nextPart,
    complete: done === MODULES.length,
  };
}
