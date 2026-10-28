"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Phase = "static" | "pending" | "visible";

const revealCallbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observerForCards() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealCallbacks.get(entry.target)?.();
        revealCallbacks.delete(entry.target);
        sharedObserver?.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  }
  return sharedObserver;
}

export default function CatalogReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setPhase("visible");
      return;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
      setPhase("visible");
      return;
    }

    let active = true;
    const observer = observerForCards();
    revealCallbacks.set(element, () => {
      if (active) setPhase("visible");
    });
    setPhase("pending");
    observer.observe(element);

    return () => {
      active = false;
      revealCallbacks.delete(element);
      observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`ck-catalog-reveal ck-catalog-reveal--${phase}`}
      style={{ "--ck-catalog-reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
