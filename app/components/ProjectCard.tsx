import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  /** centered content inside the flat card */
  children: ReactNode;
  /** small circular icon buttons under the title */
  actions?: ReactNode;
  className?: string;
};

/**
 * Flat, muted-gray portrait card — no border, no shadow, no gradient,
 * no glass/blur, no inner ring. Just #EFEFEF and heavily rounded corners.
 */
export function ProjectCard({ title, children, actions, className }: ProjectCardProps) {
  return (
    <div className={cn("w-[380px] max-w-full", className)}>
      {/* card */}
      <div className="flex h-[420px] w-full items-center justify-center rounded-[18px] bg-[#EFEFEF] p-9">
        {children}
      </div>

      {/* below the card */}
      <h3 className="mt-4 text-left text-[16px] font-medium text-[#1a1a1a]">{title}</h3>
      {actions ? <div className="mt-3 flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

type ProjectActionProps = {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};

export function ProjectAction({ label, children, href, onClick }: ProjectActionProps) {
  const className =
    "flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-colors hover:bg-black";

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
