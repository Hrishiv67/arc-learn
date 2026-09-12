/**
 * The rocket, and which module earns which part of it.
 *
 * The course is the point; the rocket is the reason to come back for the next
 * module. Both the homepage module track and the build card on the course index
 * read this file, so they can never disagree about what a student has earned.
 *
 * Parts are listed nose to tail, which is how they are drawn. They are *earned*
 * in course order, which starts at the fin can — the first thing you physically
 * build — and finishes with the nose cone going on at qualification.
 */

export type RocketSection = {
  id: string;
  /** share of the assembled rocket's length, nose to tail */
  height: number;
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
};

export const SECTIONS: RocketSection[] = [
  {
    id: "nose",
    height: 0.2244,
    widthD: 1.7467,
    label: "Nose cone",
    short: "Nose cone",
    earns: "Trim drag and hit the altitude window",
  },
  {
    id: "payload",
    height: 0.1731,
    widthD: 1.3467,
    label: "Payload bay",
    short: "Payload bay",
    earns: "Carry two eggs and get them back intact",
  },
  {
    id: "body",
    height: 0.2179,
    widthD: 1.7,
    label: "Body tube",
    short: "Body tube",
    earns: "Lay out an airframe that holds together",
  },
  {
    id: "recovery",
    height: 0.1731,
    widthD: 1.3467,
    label: "Recovery bay",
    short: "Recovery bay",
    earns: "Size a parachute and pack it properly",
  },
  {
    id: "fincan",
    height: 0.2115,
    widthD: 1.6533,
    label: "Fin can and motor",
    short: "Fin can",
    earns: "Fly straight on the right motor",
  },
];

/**
 * Which part each unit of the course builds, and the module that finishes it.
 *
 * Mapped by unit rather than by counting modules evenly, because an even split
 * cuts across unit boundaries and produces nonsense — a module on stability
 * claiming to build the parachute bay. Following the syllabus instead means the
 * part a student earns is the part they just learned about.
 *
 * Unit 1 (through module 3) — safety and the mission: the motor mount and fins,
 * the first thing you physically build. Unit 2 (through 7) — how rockets work:
 * the airframe. Unit 3 (through 10) — design and build: recovery. Unit 4
 * (through 12, then 13) — the egg goes in, and the nose cone goes on when you
 * qualify.
 */
export const BUILD_STEPS: Array<{ section: number; throughModule: number }> = [
  { section: 4, throughModule: 3 }, // fin can and motor
  { section: 2, throughModule: 7 }, // body tube
  { section: 3, throughModule: 10 }, // recovery bay
  { section: 1, throughModule: 12 }, // payload bay
  { section: 0, throughModule: 13 }, // nose cone
];

/** Indices into SECTIONS, in the order a student earns them. */
export const BUILD_ORDER = BUILD_STEPS.map((s) => s.section);

/** Which part a module contributes to. */
export function sectionIndexForModule(order: number): number {
  for (const step of BUILD_STEPS) {
    if (order <= step.throughModule) return step.section;
  }
  return BUILD_STEPS[BUILD_STEPS.length - 1].section;
}

/**
 * How many parts are finished. Modules are counted rather than checked
 * individually, which assumes a student works roughly in order — true enough
 * for a linear course, and it never claims a part they have not earned.
 */
export function sectionsEarned(completeCount: number, total: number): number {
  if (total <= 0) return 0;
  return BUILD_STEPS.filter((s) => completeCount >= s.throughModule).length;
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
  if (earned >= BUILD_ORDER.length) return null;
  return SECTIONS[BUILD_ORDER[earned]];
}
