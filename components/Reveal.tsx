"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

export default function Reveal({ children, as: Tag = "div", className = "", style, delay = 0, variant = "text" }: {
  children: ReactNode; as?: ElementType; className?: string; style?: CSSProperties; delay?: number; variant?: "text" | "image";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState("static");
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const show = () => { setPhase("visible"); observer?.disconnect(); };
    const frame = requestAnimationFrame(() => {
      if (reduce.matches || element.getBoundingClientRect().top < innerHeight * .95) { show(); return; }
      setPhase("pending");
      observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) show(); }, { threshold: .12 });
      observer.observe(element);
    });
    const onPreference = () => { if (reduce.matches) show(); };
    reduce.addEventListener("change", onPreference);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); reduce.removeEventListener("change", onPreference); };
  }, []);
  return <Tag ref={ref} className={`ck-entrance ck-entrance--${variant} ${className}`} data-phase={phase}
    style={{ ...style, "--ck-entrance-delay": `${Math.min(180, Math.max(0, delay))}ms` } as CSSProperties}>{children}</Tag>;
}
