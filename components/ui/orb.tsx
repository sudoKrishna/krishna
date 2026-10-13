import { cn } from "@/lib/utils";

export type OrbVariant = "S1" | "S2" | "S3" | "S4";

const SPEEDS: Record<OrbVariant, string> = {
  S1: "2.4s",
  S2: "1.8s",
  S3: "1.2s",
  S4: "3s",
};

export function Orb({
  variant = "S1",
  label,
  className,
}: {
  variant?: OrbVariant;
  label?: string;
  className?: string;
}) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      title={label}
      data-variant={variant}
      style={{ "--orb-speed": SPEEDS[variant] } as React.CSSProperties}
      className={cn("ui-orb", className)}
    />
  );
}
