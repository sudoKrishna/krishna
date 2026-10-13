import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function TextShimmer({
  children,
  duration = 1.5,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("text-shimmer", className)}
      style={{ "--shimmer-duration": `${String(duration)}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}
