"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function CollectionStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const resetDepth = () => {
      const cards = stack.querySelectorAll<HTMLElement>(".ck-home-collection");
      cards.forEach(card => {
        card.style.removeProperty("--ck-card-radius");
        card.style.removeProperty("--ck-card-shadow");
        card.style.removeProperty("--ck-card-scale");
        card.querySelector<HTMLElement>(".ck-home-collection__image")?.style.removeProperty("filter");
      });
    };

    const update = () => {
      frame = 0;
      if (reduceMotion.matches) {
        resetDepth();
        return;
      }

      const cards = Array.from(stack.querySelectorAll<HTMLElement>(".ck-home-collection"));
      const images = cards.map(card => card.querySelector<HTMLElement>(".ck-home-collection__image"));
      const viewportHeight = window.innerHeight;

      cards.forEach((card, index) => {
        const targetTop = Number.parseFloat(getComputedStyle(card).top) || 0;
        const progress = clamp((viewportHeight - card.getBoundingClientRect().top) / Math.max(1, viewportHeight - targetTop));
        const eased = progress * progress * (3 - 2 * progress);
        const depth = 1 - eased;
        const radius = 2 + depth * 10;
        const shadowY = 5 + depth * 20;
        const shadowBlur = 18 + depth * 40;
        const shadowAlpha = 0.16 + depth * 0.16;

        card.style.setProperty("--ck-card-radius", `${radius.toFixed(1)}px`);
        card.style.setProperty("--ck-card-scale", (1 - depth * 0.015).toFixed(4));
        card.style.setProperty("--ck-card-shadow", `0 ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(22,16,12,${shadowAlpha.toFixed(3)})`);

        if (index > 0) {
          images[index - 1]?.style.setProperty("filter", `blur(${(eased * 4).toFixed(2)}px)`);
        }
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    reduceMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reduceMotion.removeEventListener("change", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      resetDepth();
    };
  }, []);

  return <div ref={ref} className="ck-home-collection-stack">{children}</div>;
}
