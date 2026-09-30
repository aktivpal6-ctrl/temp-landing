"use client";

import { useState } from "react";
import { Avatars } from "./Avatars";

export function ExampleJoin() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="apm-plan-foot">
      <div className="apm-interest">
        <Avatars count={3} you={joined} />
        <strong aria-live="polite">{joined ? "4 interested" : "3 interested"}</strong>
      </div>
      <button type="button" className="apm-btn apm-btn--join" aria-pressed={joined} onClick={() => setJoined(!joined)}>
        {joined ? "You're in" : "I'm in"}
      </button>
    </div>
  );
}
