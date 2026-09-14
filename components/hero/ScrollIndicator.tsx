"use client";

import type { Ref } from "react";

/**
 * One instruction and a hairline that fills while the rocket holds on the rail.
 * It leaves at ignition - once the rocket is moving, nobody needs telling to
 * scroll.
 */
export function ScrollIndicator({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className="hero__indicator" ref={ref} aria-hidden="true">
      <span className="hero__indicatorLabel">Scroll to launch</span>
      <span className="hero__indicatorTrack">
        <span className="hero__indicatorBar" data-bar />
      </span>
    </div>
  );
}
