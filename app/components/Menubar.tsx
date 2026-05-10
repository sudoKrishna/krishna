"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Edu_NSW_ACT_Cursive } from "next/font/google";
import { useCodeMode } from "../context/CodeModeContext";
import { Code } from "lucide-react";
import { useRouter } from "next/navigation";

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tabs = ["The Life", "The Work"];

export default function MenuBar() {
  const [active, setActive] = useState(0);

  const { codeMode, setCodeMode } = useCodeMode();

  const router = useRouter();

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeTab = buttonRefs.current[active];

    if (!activeTab || !activeBgRef.current) return;

    const parentRect = activeTab.parentElement?.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    if (!parentRect) return;

    const targetWidth = Math.min(tabRect.width * 0.6, 70);

    gsap.to(activeBgRef.current, {
      x: tabRect.left - parentRect.left + (tabRect.width - targetWidth) / 2,
      width: targetWidth,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [active]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (active === index) return;

    const border = borderRefs.current[index];
    if (!border) return;

    const rect = border.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;

    gsap.to(border, {
      x,
      y,
      duration: 0.1,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = (index: number) => {
    const border = borderRefs.current[index];
    if (!border) return;

    gsap.to(border, {
      x: 0,
      y: 0,
      duration: 0.15,
      ease: "power2.out",
    });
  };

  const handleTabClick = (index: number) => {
    setActive(index);

    if (index === 0) {
      router.push("/");
    } else if (index === 1) {
      router.push("/work");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative flex gap-3 px-6 py-0 rounded-xl bg-[#F5F3EB] border border-white/10 shadow-xl w-[460px] h-[30px] items-center">

        {/* ACTIVE BACKGROUND */}
        <div
          ref={activeBgRef}
          className="absolute top-1 left-0 h-[20px] w-[30px] rounded-lg bg-[#6E7B4E]"
        />

        {/* TABS */}
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleTabClick(index)}
            className="relative flex-1 text-center py-0"
          >
            {/* BORDER EFFECT */}
            {active !== index && (
              <div
                ref={(el) => {
                  borderRefs.current[index] = el;
                }}
                className="
                  absolute inset-0 rounded-xl
                  border border-transparent
                  hover:border-gray-300
                  transition-colors duration-150
                "
              />
            )}

            {/* TEXT */}
            <span
              className={`
                ${cursiveFont.className}
                relative z-10 text-sm font-medium transition-colors duration-200
                ${
                  active === index
                    ? "text-[#F5F3EB]"
                    : "text-[#4A5D23]"
                }
              `}
            >
              {tab}
            </span>
          </button>
        ))}

        {/* CODE MODE BUTTON */}
        <button
          onClick={() => setCodeMode(!codeMode)}
          className="
            ml-2 flex items-center gap-1 rounded-full
            bg-[#4A5D23] px-3 py-1 text-xs text-[#F5F3EB]
            transition-all hover:scale-105
          "
        >
          <Code size={14} />
          {codeMode ? "Normal" : "Code"}
        </button>
      </div>
    </div>
  );
}