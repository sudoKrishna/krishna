"use client";

import { playSound, SOUNDS } from "@/app/lib/sound";
import { toast } from "@/components/ui/toast";

// Dark charcoal button with a pressed/debossed frame
const BUTTON =
  "rounded-[16px] border border-white/8 bg-[#2A2A2A] px-6 py-3 text-[19px] leading-none font-normal text-[#F0F0F0] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.5)]";

function fire(src: string, run: () => void) {
  playSound(src, 0.6);
  run();
}

export function ToastDemo() {
  return (
    <div className="w-full rounded-[20px] bg-[#1C1C1C] p-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={BUTTON}
          onClick={() => fire(SOUNDS.click, () => toast("Saved to your library."))}
        >
          Message
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.click, () =>
              toast({
                message: "Item moved",
                description: "It now lives in the Archive collection.",
              }),
            )
          }
        >
          Description
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.click, () =>
              toast({
                message: "Item deleted",
                action: {
                  label: "Undo",
                  run: () =>
                    fire(SOUNDS.pop, () => toast({ message: "Restored.", state: "success" })),
                },
              }),
            )
          }
        >
          Action
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.click, () => toast({ message: "Working on it…", state: "pending" }))
          }
        >
          Promise
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.success, () => toast({ message: "Upload complete.", state: "success" }))
          }
        >
          Success
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.error, () => toast({ message: "Something went wrong.", state: "error" }))
          }
        >
          Error
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.warning, () => toast({ message: "Careful with that.", state: "warning" }))
          }
        >
          Warning
        </button>

        <button
          type="button"
          className={BUTTON}
          onClick={() =>
            fire(SOUNDS.info, () => toast({ message: "For your information.", state: "info" }))
          }
        >
          Info
        </button>
      </div>
    </div>
  );
}
