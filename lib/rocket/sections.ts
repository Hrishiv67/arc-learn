/**
 * The rocket, and which module earns which part of it.
 *
 * The course is the point; the rocket is the reason to come back for the next
 * module. The homepage module track, the course-index build card and
 * lib/rocket/build.ts all read this file, so they can never disagree about what
 * a student has earned.
 *
 * Parts are listed in the order they are earned, and that is also the order
 * they are drawn: tail on the left, nose on the right. One ordering for both is
 * what keeps the rocket in step with the module list — module 1 lights the
 * leftmost part, module 13 the rightmost, and scrolling down the list only ever
 * moves the highlight one way. It used to be drawn nose-first but earned
 * tail-first, so the highlight jumped back and forth across the rocket.
 *
 * The physical order is a real layout for an egg-lofting competition rocket:
 * fin can and motor, body tube, parachute bay, payload bay, nose cone.
 */

export type RocketSection = {
  id: string;
  /**
   * The part's width measured in body diameters. Not width/height — the fin
   * can's image is taller than a diameter because the fins stick out past the
   * tube, so sizing by aspect shrinks its body against every other part.
   */
  widthD: number;
  label: string;
  /** for tight columns */
  short: string;
  /** what finishing this part means you can now do */
  earns: string;
  /** the last module that builds this part */
  throughModule: number;
};

/**
 * Mapped by unit, not by dividing thirteen modules evenly, because an even
 * split cuts across unit boundaries and produces nonsense — a module on
 * stability claiming to build the parachute bay.
 *
 * Unit 1 (modules 1–3) — safety and the mission: the motor mount and fins, the
 * first thing you physically build. Unit 2 (4–7) — how rockets work: the body
 * tube. Unit 3 (8–10) — design and build: recovery. Unit 4 (11–13) — the eggs go
 * in, and the nose cone goes on when you qualify.
 */
export const SECTIONS: RocketSection[] = [
  {
    id: "fincan",
    widthD: 1.6533,
    label: "Fin can and motor",
    short: "Fin can",
    earns: "Fly straight on the right motor",
    throughModule: 3,
  },
  {
    id: "body",
    widthD: 1.7,
    label: "Body tube",
    short: "Body tube",
    earns: "Lay out an airframe that holds together",
    throughModule: 7,
  },
  {
    id: "recovery",
    widthD: 1.3467,
    label: "Recovery bay",
    short: "Recovery bay",
    earns: "Size a parachute and pack it properly",
    throughModule: 10,
  },
  {
    id: "payload",
    widthD: 1.3467,
    label: "Payload bay",
    short: "Payload bay",
    earns: "Carry two eggs and get them back intact",
    throughModule: 12,
  },
  {
    id: "nose",
    widthD: 1.7467,
    label: "Nose cone",
    short: "Nose cone",
    earns: "Trim drag and hit the altitude window",
    throughModule: 13,
  },
];

/** Indices into SECTIONS, in the order a student earns them — which is SECTIONS order. */
export const BUILD_ORDER = SECTIONS.map((_, i) => i);

/** Which part a module contributes to. */
export function sectionIndexForModule(order: number): number {
  const i = SECTIONS.findIndex((s) => order <= s.throughModule);
  return i === -1 ? SECTIONS.length - 1 : i;
}

/** The first and last module that build a part, e.g. { from: 4, to: 7 }. */
export function moduleRangeForSection(index: number): { from: number; to: number } {
  const to = SECTIONS[index].throughModule;
  const from = index === 0 ? 1 : SECTIONS[index - 1].throughModule + 1;
  return { from, to };
}

/**
 * How many parts are finished. Modules are counted rather than checked
 * individually, which assumes a student works roughly in order — true enough
 * for a linear course, and it never claims a part they have not earned.
 */
export function sectionsEarned(completeCount: number, total: number): number {
  if (total <= 0) return 0;
  return SECTIONS.filter((s) => completeCount >= s.throughModule).length;
}

/** The set of section indices a student has finished. */
export function earnedSectionSet(
  completeCount: number,
  total: number,
): Set<number> {
  return new Set(BUILD_ORDER.slice(0, sectionsEarned(completeCount, total)));
}

/** The next part to be earned, or null when the rocket is complete. */
export function nextSection(
  completeCount: number,
  total: number,
): RocketSection | null {
  const earned = sectionsEarned(completeCount, total);
  if (earned >= SECTIONS.length) return null;
  return SECTIONS[earned];
}
