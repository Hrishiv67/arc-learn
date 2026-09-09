import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    node.props &&
    typeof node.props === "object" &&
    "children" in node.props
  ) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Every lesson h2 gets a stable, slugified id so the desktop lesson rail
 * (components/lesson/LessonRail.tsx) can scroll-jump to it and its
 * IntersectionObserver can track which section is active.
 */
const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 id={slugify(textOf(children))} className="scroll-mt-[90px]" {...props}>
      {children}
    </h2>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
