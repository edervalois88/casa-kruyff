"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

export default function RevealImage(props: ImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        transform: visible ? "scale(1)" : "scale(1.12)",
        transition: "transform 3.4s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <Image {...props} />
    </div>
  );
}
