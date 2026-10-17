"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { RevisionImagen } from "@/lib/revision-data";

export default function RevisionImage({ img, numero, ambiente }: { img: RevisionImagen; numero: string; ambiente: string }) {
  const ref = useRef<HTMLElement | null>(null);
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
    <figure
      ref={ref}
      className={`rv-figure rv-${img.ambiente} rv-${img.tono}${visible ? " is-visible" : ""}`}
      style={{ maxWidth: img.ancho }}
    >
      <div className="rv-media">
        <Image
          src={`/revision/${img.archivo}`}
          alt={`${ambiente} ${numero}`}
          width={img.ancho}
          height={img.alto}
          unoptimized
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
      <figcaption className="rv-caption font-[family-name:var(--font-label)]">
        <span>{numero}</span>
        <span>{ambiente}</span>
      </figcaption>
    </figure>
  );
}
