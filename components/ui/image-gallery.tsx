"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
  photoLabel: string;
}

export default function ImageGallery({ images, selectedIndex, onSelect, ariaLabel, photoLabel }: ImageGalleryProps) {
  const [preview, setPreview] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const emphasized = preview ?? selectedIndex;

  return <div className="ck-image-gallery flex w-full items-stretch gap-2" role="group" aria-label={ariaLabel}
    onPointerLeave={() => setPreview(null)}>
    {images.map((image, index) => <button
      key={image.src}
      ref={element => { buttons.current[index] = element; }}
      type="button"
      className="ck-image-gallery-panel relative overflow-hidden"
      style={{ "--ck-gallery-weight": emphasized === index ? 3.5 : 1 } as CSSProperties}
      aria-label={`${photoLabel} ${index + 1}`}
      aria-pressed={selectedIndex === index}
      onPointerEnter={event => { if (event.pointerType === "mouse") setPreview(index); }}
      onFocus={() => setPreview(index)}
      onBlur={() => setPreview(null)}
      onClick={() => onSelect(index)}
      onKeyDown={event => {
        let next: number;
        if (event.key === "ArrowRight") next = (index + 1) % images.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + images.length) % images.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = images.length - 1;
        else return;
        event.preventDefault();
        buttons.current[next]?.focus();
        onSelect(next);
      }}
    >
      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 160px, 340px" style={{ objectFit: "cover" }} />
      <span className="ck-image-gallery-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    </button>)}
  </div>;
}
