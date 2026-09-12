import { Container } from "@/components/ui/Container";

/**
 * Route loading state.
 *
 * Replaces an animated cartoon rocket with stars and an exhaust flame. A page
 * that takes a moment to arrive is not an occasion for a cartoon, and that one
 * was the loudest thing in the app while being the least important.
 *
 * A hairline that fills, and a line of text. Radius 0, no shadow, one
 * animation — the same rules as every other surface here.
 */
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <Container className="py-16 md:py-24">
      <div role="status" aria-live="polite" className="loading">
        <span className="loading__track" aria-hidden="true">
          <span className="loading__bar" />
        </span>
        <p className="loading__label">{label}</p>
      </div>
    </Container>
  );
}
