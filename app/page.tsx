import { Hero } from "@/components/hero/Hero";
import { ModuleTrack } from "@/components/course/ModuleTrack";
import { CourseGate } from "@/components/vehicle/CourseGate";

/**
 * One scroll, three beats: the launch, the course it is advertising, and the
 * account that saves your place in it.
 *
 * The launch is short on purpose. It exists to get a student past the fold —
 * the course is what they came for, so it arrives almost immediately and gets
 * the most room.
 *
 * Runs outside the app chrome (see app/(app)/layout.tsx) because the hero is
 * full-bleed and carries its own navigation.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ModuleTrack />
      <CourseGate />
    </>
  );
}
