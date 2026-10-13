import { Check, LoaderCircle } from "lucide-react";

export function StatusBadge({ state }: { state: "loading" | "done" }) {
  if (state === "done") {
    return <Check className="size-4 text-success" aria-hidden />;
  }
  return <LoaderCircle className="size-4 animate-spin text-muted-foreground" aria-hidden />;
}
