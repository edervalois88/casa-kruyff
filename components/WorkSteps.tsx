"use client";

import { useEffect, useRef } from "react";

export default function WorkSteps({ steps }: { steps: string[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let inView = false;
    const update = () => {
      frame = 0;
      if (reduce.matches) { element.style.removeProperty("--ck-work-progress"); return; }
      if (!inView) return;
      const rect = element.getBoundingClientRect();
      const distance = innerWidth <= 600 ? rect.height : innerHeight * .35;
      const progress = Math.max(0, Math.min(1, (innerHeight * .8 - rect.top) / distance));
      element.style.setProperty("--ck-work-progress", String(progress));
      element.querySelectorAll<HTMLElement>(".ck-work-step").forEach((step, i) => {
        step.dataset.reached = String(progress >= i / steps.length);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule(); });
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);
    return () => { observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduce.removeEventListener("change", schedule); cancelAnimationFrame(frame); };
  }, [steps.length]);
  return <div ref={ref} className="ck-work-steps">
    {steps.map(([title, body], i) => <div key={title} className="ck-work-step">
      <span className="ck-section-label">{String(i + 1).padStart(2, "0")}</span>
      <h3>{title}</h3><p>{body}</p>
    </div>)}
  </div>;
}
