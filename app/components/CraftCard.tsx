"use client";

import { type ReactNode } from "react";
import { IconGripVertical } from "@tabler/icons-react";

type CraftCardProps = {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  onIconClick?: () => void;
  onGripDown?: (event: React.PointerEvent) => void;
};

export function CraftCard({
  label,
  icon,
  children,
  onIconClick,
  onGripDown,
}: CraftCardProps) {
  return (
    <div className="flex w-[384px] flex-col">
      <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-[20px] bg-[#EDEDED]">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={onGripDown}
          className="absolute top-3.5 left-3.5 z-10 flex size-7 cursor-grab touch-none items-center justify-center rounded-full bg-[#1a1a1a] text-white active:cursor-grabbing"
        >
          <IconGripVertical className="size-3.5" />
        </button>

        <div className="flex w-full items-center justify-center px-6">{children}</div>
      </div>

      <p className="mt-4 text-[15px] text-[#1a1a1a]">{label}</p>
      <button
        type="button"
        onClick={onIconClick}
        className="mt-2 flex size-7 items-center justify-center rounded-full bg-[#1a1a1a] text-white"
      >
        {icon}
      </button>
    </div>
  );
}

export function CraftsRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-start gap-6 px-6">{children}</div>;
}
