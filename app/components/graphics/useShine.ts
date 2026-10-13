"use client";

import { useState } from "react";

/**
 * Slow, randomised shine timing — computed once per instance so each logo's
 * sweep has its own pace and idle gap.
 */
export function useShine() {
  const [shine] = useState(() => ({
    duration: 3.8 + Math.random() * 2.6, // 3.8s – 6.4s sweep
    repeatDelay: 0.8 + Math.random() * 3.4, // 0.8s – 4.2s idle
    dir: Math.random() < 0.5 ? -1 : 1, // random sweep direction
  }));
  return shine;
}
