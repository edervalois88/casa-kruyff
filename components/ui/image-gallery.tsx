"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type Ref } from "react";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
  photoLabel: string;
  selectedImageRef?: Ref<HTMLSpanElement>;
  enlarged?: boolean;
}

export default function ImageGallery({ images, selectedIndex, onSelect, ariaLabel, photoLabel, selectedImageRef, enlarged = false }: ImageGalleryProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number; horizontal: boolean; vertical: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState(0);

  return <div className="ck-image-gallery flex w-full items-stretch gap-2" role="group" aria-label={ariaLabel}
    data-dragging={drag !== 0}
    onPointerDown={event => {
      if (!matchMedia("(max-width: 800px)").matches || event.button !== 0) return;
      suppressClick.current = false;
      gesture.current = { x: event.clientX, y: event.clientY, horizontal: false, vertical: false };
    }}
    onPointerMove={event => {
      const start = gesture.current;
      if (!start || start.vertical) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (!start.horizontal && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { start.vertical = true; return; }
      if (!start.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        start.horizontal = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (start.horizontal) setDrag(Math.max(-130, Math.min(130, dx)));
    }}
    onPointerUp={event => {
      const start = gesture.current;
      if (start?.horizontal) {
        suppressClick.current = true;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) >= 48) onSelect((selectedIndex + (dx < 0 ? 1 : images.length - 1)) % images.length);
      }
      gesture.current = null;
      setDrag(0);
    }}
    onPointerCancel={() => { gesture.current = null; setDrag(0); }}>
    {images.map((image, index) => <button
      key={image.src}
      ref={element => { buttons.current[index] = element; }}
      type="button"
      className="ck-image-gallery-panel relative overflow-hidden"
      style={{ "--ck-gallery-weight": selectedIndex === index ? 8 : 1,
        "--ck-deck-rank": (index - selectedIndex + images.length) % images.length,
        "--ck-deck-drag": selectedIndex === index ? `${drag}px` : "0px",
        "--ck-deck-tilt": selectedIndex === index ? `${drag * .025}deg` : "0deg",
        "--ck-deck-order": images.length - (index - selectedIndex + images.length) % images.length,
      } as CSSProperties}
      data-deck-visible={(index - selectedIndex + images.length) % images.length < 3}
      tabIndex={selectedIndex === index ? 0 : -1}
      aria-label={`${photoLabel} ${index + 1}`}
      aria-pressed={selectedIndex === index}
      onPointerEnter={event => { if (event.pointerType === "mouse" && matchMedia("(min-width: 801px)").matches) onSelect(index); }}
      onFocus={() => onSelect(index)}
      onClick={() => { if (!suppressClick.current) onSelect(index); }}
      onKeyDown={event => {
        let next: number;
        if (event.key === "ArrowRight") next = (index + 1) % images.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + images.length) % images.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = images.length - 1;
        else return;
        event.preventDefault();
        onSelect(next);
        requestAnimationFrame(() => buttons.current[next]?.focus());
      }}
    >
      <span ref={selectedIndex === index ? selectedImageRef : undefined} className="ck-photo-scene" style={{ viewTransitionName: selectedIndex === index && !enlarged ? "ck-piece-photo" : "none" }}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 80vw, 48vw" style={{ objectFit: selectedIndex === index ? "contain" : "cover" }} preload={index === 0} />
      </span>
      <span className="ck-image-gallery-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    </button>)}
  </div>;
}
