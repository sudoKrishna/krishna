"use client";

import { useEffect } from "react";

export function ArticleReveals() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-inference-article] [data-reveal]",
    );
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute("data-reveal-state", "entered");
        observer.unobserve(target);
      }
    });

    for (const target of targets) {
      if (target.getBoundingClientRect().top >= window.innerHeight) {
        target.setAttribute("data-reveal-state", "pending");
      } else {
        target.setAttribute("data-reveal-state", "entered");
      }
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.removeAttribute("data-reveal-state"));
    };
  }, []);
  return null;
}
