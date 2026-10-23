"use client";

import { useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "@google/model-viewer";
import type { Piece } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";

export default function ArViewer({ piece, poster }: { piece: Piece; poster?: string }) {
  const { t } = useLanguage();
  const viewer = useRef<ModelViewerElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canAR, setCanAR] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = viewer.current;
    if (!open || !element) return;
    const onLoad = () => {
      setLoaded(true);
      setCanAR(element.canActivateAR);
    };
    const onError = () => setError(true);
    const onStatus = (event: Event) => {
      if ((event as CustomEvent<{ status: string }>).detail.status === "failed") setError(true);
    };
    element.addEventListener("load", onLoad);
    element.addEventListener("error", onError);
    element.addEventListener("ar-status", onStatus);
    return () => {
      element.removeEventListener("load", onLoad);
      element.removeEventListener("error", onError);
      element.removeEventListener("ar-status", onStatus);
    };
  }, [open]);

  async function openViewer() {
    setLoading(true);
    setError(false);
    try {
      await import("@google/model-viewer");
      setOpen(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ck-ar-gallery" aria-label={t.explore3d}>
      <h2>{t.explore3d}</h2>
      <p>{piece.model ? t.modelInstructions : t.modelUnavailable}</p>
      {open && piece.model && <model-viewer
        ref={viewer}
        src={piece.model.glb}
        ios-src={piece.model.usdz}
        poster={poster}
        alt={`${piece.name} · ${t.model3d}`}
        camera-controls
        touch-action="pan-y"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        shadow-intensity="1"
        style={{ display: "block", width: "100%", height: "clamp(300px,50vh,560px)" }}
      />}
      <div className="ck-contact-actions">
        {!open && <button type="button" className="ck-action" disabled={!piece.model || loading} onClick={openViewer}>
          {loading ? t.loading3d : t.view3d}
        </button>}
        <button type="button" className="ck-action ck-action-outline" disabled={!loaded || !canAR || error} onClick={async () => {
          try { await viewer.current?.activateAR(); } catch { setError(true); }
        }}>{t.viewInSpace}</button>
      </div>
      {open && !canAR && !error && <p role="status">{loaded ? t.arDeviceHint : t.loading3d}</p>}
      {error && <p role="alert">{t.modelError}</p>}
    </section>
  );
}
