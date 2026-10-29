"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Piece } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";
import ArViewer from "./ArViewer";
import { transitionView } from "@/lib/view-transition";
import { catalogText } from "@/lib/catalog-language";

function Chevron({ next = false }: { next?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={next ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} /></svg>;
}

export default function PieceGallery({ piece, fallback }: { piece: Piece; fallback?: string }) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [view, setView] = useState<"photos" | "model">("photos");
  const lightbox = useRef<HTMLDialogElement>(null);
  const sourcePhoto = useRef<HTMLSpanElement>(null);
  const enlargedPhoto = useRef<HTMLDivElement>(null);
  const photos = [...new Set(piece.images?.length ? piece.images : fallback ? [fallback] : [])];
  const index = Math.min(selected, Math.max(0, photos.length - 1));
  const name = catalogText(lang === "en" && piece.nameEn ? piece.nameEn : piece.name, lang);
  const english = lang === "en";
  const previousLabel = english ? "Previous photograph" : "Fotografía anterior";
  const nextLabel = english ? "Next photograph" : "Fotografía siguiente";
  function selectPhoto(next: number) {
    if (next === index) return;
    setPrevious(index);
    setSelected(next);
  }
  function move(delta: number) { selectPhoto((index + delta + photos.length) % photos.length); }
  function openLightbox() {
    transitionView(() => {
      if (sourcePhoto.current) sourcePhoto.current.style.viewTransitionName = "none";
      if (enlargedPhoto.current) enlargedPhoto.current.style.viewTransitionName = "ck-piece-photo";
      lightbox.current?.showModal();
    });
  }
  function closeLightbox() {
    transitionView(() => {
      lightbox.current?.close();
      if (enlargedPhoto.current) enlargedPhoto.current.style.viewTransitionName = "none";
      if (sourcePhoto.current) sourcePhoto.current.style.viewTransitionName = "ck-piece-photo";
    });
  }
  function photograph(sizes: string) {
    return <>
      {previous !== null && photos[previous] && <Image key={`previous-${photos[previous]}`} className="ck-photo-previous" src={photos[previous]} alt="" aria-hidden="true" fill sizes={sizes} style={{ objectFit: "contain" }} />}
      <Image key={photos[index]} className={previous !== null ? "ck-photo-current" : undefined} src={photos[index]} alt={`${name} · ${index + 1}`} fill sizes={sizes} style={{ objectFit: "contain" }} preload={index === 0} />
    </>;
  }

  const photoControls = photos.length > 1 && <>
    <button type="button" className="ck-gallery-arrow ck-gallery-previous" aria-label={previousLabel} onClick={() => move(-1)}><Chevron /></button>
    <button type="button" className="ck-gallery-arrow ck-gallery-next" aria-label={nextLabel} onClick={() => move(1)}><Chevron next /></button>
  </>;

  return <div className="ck-piece-gallery">
    <div className="ck-gallery-stage">
      {view === "model" && piece.model?.glb
        ? <ArViewer key={`${piece.id}-${piece.model.glb}`} piece={piece} poster={photos[0]} embedded />
        : photos.length ? <>
          <button type="button" className="ck-gallery-expand" aria-label={english ? `Enlarge photograph of ${name}` : `Ampliar fotografía de ${name}`} onClick={openLightbox}>
            <span ref={sourcePhoto} className="ck-photo-scene" style={{ viewTransitionName: "ck-piece-photo" }}>{photograph("(max-width: 800px) 100vw, 55vw")}</span>
            <span className="ck-gallery-enlarge-label">{english ? "Enlarge" : "Ampliar"}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg></span>
          </button>
          {photoControls}
          <span className="ck-gallery-count" aria-live="polite">{index + 1} / {photos.length}</span>
        </> : <p className="ck-gallery-empty">{english ? "Photographs coming soon" : "Fotografías próximamente"}</p>}
    </div>

    <div className="ck-gallery-tools" role="group" aria-label={english ? "Gallery view" : "Vista de la galería"}>
      <button type="button" aria-pressed={view === "photos"} onClick={() => setView("photos")}>{english ? "Photographs" : "Fotografías"} <span>({photos.length})</span></button>
      <button type="button" aria-pressed={view === "model"} disabled={!piece.model?.glb} onClick={() => setView("model")}>{t.model3d}{!piece.model?.glb && <span> · {english ? "Coming soon" : "Próximamente"}</span>}</button>
    </div>

    {photos.length > 1 && <div className="ck-gallery-thumbnails" role="group" aria-label={english ? "Additional photographs" : "Fotografías adicionales"}>
      {photos.map((src, i) => <button key={src} type="button" aria-label={english ? `Show photograph ${i + 1}` : `Ver fotografía ${i + 1}`} aria-pressed={view === "photos" && i === index} onClick={() => { selectPhoto(i); setView("photos"); }}>
        <Image src={src} alt="" fill sizes="76px" style={{ objectFit: "cover" }} />
      </button>)}
    </div>}

    <dialog ref={lightbox} className="ck-gallery-lightbox" aria-label={english ? `Photographs of ${name}` : `Fotografías de ${name}`} onCancel={event => { event.preventDefault(); closeLightbox(); }} onClick={event => { if (event.target === event.currentTarget) closeLightbox(); }} onKeyDown={event => { if (photos.length < 2) return; if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <div className="ck-lightbox-header"><span>{name} · {index + 1} / {photos.length}</span><button type="button" onClick={closeLightbox}>{english ? "Close" : "Cerrar"}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <div className="ck-lightbox-image"><div ref={enlargedPhoto} className="ck-photo-scene">{photos[index] && photograph("92vw")}</div>{photoControls}</div>
    </dialog>
  </div>;
}
