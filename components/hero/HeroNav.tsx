"use client";

import type { Ref } from "react";
import Link from "next/link";

/* Real routes only — a nav that links to pages that don't exist reads as a
   mockup, which is the opposite of the point. */
const LINKS = [
  { label: "COURSE", href: "/modules" },
  { label: "ACCOUNT", href: "/account" },
];

export function HeroNav({ ref }: { ref?: Ref<HTMLElement> }) {
  return (
    <header className="hero__nav" ref={ref}>
      <Link className="hero__mark" href="/">
        ARC<span>/</span>LEARN
      </Link>
      <nav className="hero__links" aria-label="Primary">
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link className="hero__start" href="/account?next=/modules">
          START <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </header>
  );
}
