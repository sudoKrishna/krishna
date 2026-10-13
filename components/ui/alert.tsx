import type { ComponentType } from "react";
import { CircleAlert, Info, TriangleAlert } from "lucide-react";

export type AlertTone = "success" | "error" | "warning" | "info";

export type AlertMark = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export const ALERT_MARKS: Record<Exclude<AlertTone, "success">, AlertMark> = {
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};
