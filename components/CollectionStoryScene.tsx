"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type ScenePhase = "static" | "pending" | "visible";

export default function CollectionStoryScene({
  image,
  imageAlt,
  name,
  index,
  href,
  action,
  objectPosition = "center",
}: {
  image: string;
  imageAlt: string;
  name: string;
  index: number;
  href: string;
  action: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<ScenePhase>("static");

  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setPhase("visible");
      return;
    }

    const bounds = scene.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) {
      setPhase("visible");
      return;
    }

    setPhase("pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setPhase("visible");
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`ck-home-collection ck-home-collection--${phase}`}
      style={{
        "--ck-collection-stack-index": index + 1,
        "--ck-collection-stack-offset": `${index * 16}px`,
      } as CSSProperties}
    >
      <Image
        className="ck-home-collection__image"
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition }}
      />
      <div aria-hidden className="ck-home-collection__shade" />
      <div className="ck-home-collection__copy">
        <span className="ck-home-collection__number">0{index + 1}</span>
        <h2>{name}</h2>
        <Link href={href} className="ck-home-collection__link">{action}</Link>
      </div>
    </section>
  );
}
