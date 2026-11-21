import { Info, Sparkles } from "lucide-react";
import { ReactNode } from "react";

export function Callout({ type = "short", children }: { type?: "short" | "note"; children: ReactNode }) {
  const isShort = type === "short";
  const Icon = isShort ? Sparkles : Info;
  return <div className="rounded-xl border border-gray-200/80 bg-[#FAFAFA] p-5">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]"><Icon size={16}/>{isShort ? "In short" : "Note"}</div>
    <div className="text-[15px] leading-7 text-[#4B5563]">{children}</div>
  </div>;
}