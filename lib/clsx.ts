export type ClassValue = string | number | false | null | undefined;

/** Minimal className joiner — no need for a dependency for this. */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
