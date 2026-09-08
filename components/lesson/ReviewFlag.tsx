import { Callout } from "@/components/ui/Callout";

/**
 * Renders whenever a lesson's needsReview flag is true — visible in every
 * environment, at the top of the lesson body, above the first heading.
 * Non-negotiable: never hidden behind a dev-only flag.
 */
export function ReviewFlag() {
  return (
    <Callout tone="caution" title="Draft lesson text">
      The season figures and quoted rules on this page are taken from the
      published rules. The explanations around them are draft text awaiting
      subject-matter review.
    </Callout>
  );
}
