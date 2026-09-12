"use client";

import type { RefObject } from "react";
import Link from "next/link";

const WORDS = ["BUILD.", "TEST.", "FLY."];

export function HeroCopy({
  copyRef,
  subRef,
  registerWord,
}: {
  copyRef: RefObject<HTMLDivElement | null>;
  subRef: RefObject<HTMLDivElement | null>;
  registerWord: (i: number, el: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="hero__copy" ref={copyRef}>
      <p className="hero__eyebrow">American Rocketry Challenge</p>

      <h1 className="hero__title">
        {WORDS.map((w, i) => (
          <span key={w} className="hero__word" ref={(el) => registerWord(i, el)}>
            {w}
          </span>
        ))}
      </h1>

      <div className="hero__sub" ref={subRef}>
        <p className="hero__lede">
          Master the engineering behind competitive rocketry.
        </p>
        <Link className="hero__cta" href="/account?next=/modules">
          BEGIN THE MISSION <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
