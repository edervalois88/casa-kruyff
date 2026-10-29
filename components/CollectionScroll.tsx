"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function CollectionScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const resetDepth = () => {
      const cards = stack.querySelectorAll<HTMLElement>(".ck-home-collection");
      cards.forEach(card => {
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
      const viewportHeight = window.innerHeight;

      cards.forEach(card => {
        const bounds = card.getBoundingClientRect();
        if (bounds.top > viewportHeight || bounds.bottom < 0) return;
        const progress = clamp(-bounds.top / Math.max(1, bounds.height * .7));
        const eased = progress * progress * (3 - 2 * progress);
        card.querySelector<HTMLElement>(".ck-home-collection__image")?.style.setProperty("filter", `blur(${(eased * 2.5).toFixed(2)}px)`);
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

  return <div ref={ref} className="ck-home-collection-scroll">{children}</div>;
}
