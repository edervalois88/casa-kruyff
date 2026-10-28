"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type Ref } from "react";

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

  return <div className="ck-image-gallery flex w-full items-stretch gap-2" role="group" aria-label={ariaLabel}>
    {images.map((image, index) => <button
      key={image.src}
      ref={element => { buttons.current[index] = element; }}
      type="button"
      className="ck-image-gallery-panel relative overflow-hidden"
      style={{ "--ck-gallery-weight": selectedIndex === index ? 8 : 1 } as CSSProperties}
      aria-label={`${photoLabel} ${index + 1}`}
      aria-pressed={selectedIndex === index}
      onPointerEnter={event => { if (event.pointerType === "mouse") onSelect(index); }}
      onFocus={() => onSelect(index)}
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
      <span ref={selectedIndex === index ? selectedImageRef : undefined} className="ck-photo-scene" style={{ viewTransitionName: selectedIndex === index && !enlarged ? "ck-piece-photo" : "none" }}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 80vw, 48vw" style={{ objectFit: selectedIndex === index ? "contain" : "cover" }} preload={index === 0} />
      </span>
      <span className="ck-image-gallery-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    </button>)}
  </div>;
}
