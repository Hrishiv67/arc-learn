import { Hero } from "@/components/hero/Hero";
import { VehicleExploded } from "@/components/vehicle/VehicleExploded";
import { CourseGate } from "@/components/vehicle/CourseGate";

/**
 * The homepage runs outside the app chrome (see app/(app)/layout.tsx) because
 * the launch is full-bleed and carries its own navigation.
 *
 * One continuous scroll: the launch, the vehicle it flew taken apart into the
 * modules that teach each section, then the account the build is saved to.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <VehicleExploded />
      <CourseGate />
    </>
  );
}
