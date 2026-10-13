import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Button({
  className,
  size = "md",
  type = "button",
  ...props
}: ComponentProps<"button"> & { size?: "sm" | "md" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-sm" : "h-9 px-4 text-sm",
        className,
      )}
      {...props}
    />
  );
}
