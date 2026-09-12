"use client";

import type { RefObject } from "react";
import Link from "next/link";

const WORDS = ["ARC", "LEARN"];

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
          A free rocketry course for students new to rocketry. Thirteen modules,
          from your first launch rail to a qualifying flight.
        </p>
        <Link className="hero__cta" href="/account?next=/modules">
          START MODULE 01 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
