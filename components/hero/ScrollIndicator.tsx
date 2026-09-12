"use client";

import type { Ref } from "react";

export function ScrollIndicator({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className="hero__indicator" ref={ref} aria-hidden="true">
      <span className="hero__indicatorIndex">01 / LAUNCH</span>
      <span className="hero__indicatorTrack">
        <span className="hero__indicatorBar" data-bar />
      </span>
      <span className="hero__indicatorLabel" data-label>
        SCROLL TO IGNITE
      </span>
    </div>
  );
}
