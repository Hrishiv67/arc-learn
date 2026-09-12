"use client";

import type { Ref } from "react";

/**
 * Range instrumentation, not a HUD. Four values, a leader line to the airframe,
 * and nothing boxed. Everything here is decorative to a screen reader — the
 * readable content of the hero is the heading and the call to action.
 */
export function Telemetry({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className="hero__telemetry" ref={ref} aria-hidden="true">
      <div className="hero__leader">
        <span className="hero__leaderLine" />
        <span className="hero__leaderText">VEHICLE 01</span>
      </div>

      <dl className="hero__readout">
        <div>
          <dt>STATUS</dt>
          <dd data-f="status" className="hero__status">
            READY
          </dd>
        </div>
        <div>
          <dt>WIND</dt>
          <dd>4.2 M/S</dd>
        </div>
        <div>
          <dt>ALT</dt>
          <dd data-f="alt">0 M</dd>
        </div>
        <div>
          <dt>VEL</dt>
          <dd data-f="vel">0 M/S</dd>
        </div>
        <div>
          <dt>RANGE CLOCK</dt>
          <dd data-f="clock">T−00:03</dd>
        </div>
      </dl>
    </div>
  );
}
