"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

const DEFAULT_HERO = "/images/hero-horse.webp";
const EMPTY_ROOM = "/images/hero/room-without-horse.png";
const HORSE_CUTOUT = "/images/hero/horse-cutout.png";

export default function HeroParallax({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const horseRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const layered = src === DEFAULT_HERO;

  useEffect(() => {
    const stage = stageRef.current;
    const background = backgroundRef.current;
    const horse = horseRef.current;
    const content = contentRef.current;
    if (!stage || !background || (layered && !horse)) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 640px)");
    const update = () => {
      const progress = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / stage.offsetHeight));
      const backgroundPosition = compact.matches ? 0 : 11;
      const backgroundScale = compact.matches ? 1.12 : 1.32;
      background.style.transform = layered
        ? `translate3d(${backgroundPosition}%, ${progress * 2.2}%, 0) scale(${backgroundScale})`
        : "scale(1.04)";
      background.style.filter = layered ? `blur(${progress * 7}px)` : "none";
      if (horse) {
        const exit = Math.min(1, Math.max(0, (progress - 0.68) / 0.32));
        horse.style.transform = `translate3d(-50%, ${progress * stage.offsetHeight * 0.022}px, 0) scale(${1 + progress * 0.06})`;
        horse.style.opacity = String(1 - exit);
      }
      if (content) {
        content.style.opacity = String(1 - progress);
        content.style.transform = `translate3d(0, ${-progress * 20}px, 0)`;
      }
    };

    if (reduceMotion.matches) {
      const backgroundPosition = compact.matches ? 0 : 11;
      const backgroundScale = compact.matches ? 1.12 : 1.32;
      background.style.transform = layered ? `translate3d(${backgroundPosition}%, 0, 0) scale(${backgroundScale})` : "scale(1.04)";
      background.style.filter = "none";
      if (horse) horse.style.transform = "translate3d(-50%, 0, 0) scale(1)";
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [layered]);

  return (
    <section ref={stageRef} className="ck-hero-scene">
      <div ref={backgroundRef} className={`ck-hero-background${layered ? " ck-hero-background-layered" : ""}`}>
        <Image
          src={layered ? EMPTY_ROOM : src}
          alt={layered ? "" : alt}
          fill
          preload
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      {layered && (
        <div ref={horseRef} className="ck-hero-foreground" aria-hidden="true">
          <Image src={HORSE_CUTOUT} alt="" fill sizes="100vw" style={{ objectFit: "contain", objectPosition: "center" }} />
        </div>
      )}
      <div ref={contentRef} className="ck-hero-copy">
        {children}
      </div>
      <div
        aria-hidden
        className="ck-hero-shade"
        style={{
          background: "linear-gradient(180deg,rgba(20,17,16,.45) 0%,rgba(20,17,16,0) 22%,rgba(20,17,16,0) 52%,rgba(20,17,16,.62) 74%,rgba(20,17,16,.85) 100%)",
        }}
      />
    </section>
  );
}

