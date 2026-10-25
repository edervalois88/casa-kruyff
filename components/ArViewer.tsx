"use client";

import { useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "@google/model-viewer";
import type { Piece } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";

export default function ArViewer({ piece, poster, embedded = false }: { piece: Piece; poster?: string; embedded?: boolean }) {
  const { t } = useLanguage();
  const viewer = useRef<ModelViewerElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(embedded);
  const [loaded, setLoaded] = useState(false);
  const [canAR, setCanAR] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [source, setSource] = useState(piece.model?.glb);

  useEffect(() => {
    if (!embedded) return;
    let live = true;
    import("@google/model-viewer").then(() => {
      if (live) { setOpen(true); setLoading(false); }
    }).catch(() => {
      if (live) { setError(true); setLoading(false); }
    });
    return () => { live = false; };
  }, [embedded]);

  useEffect(() => {
    const element = viewer.current;
    if (!open || !element) return;
    const onLoad = () => { setLoaded(true); setCanAR(element.canActivateAR); };
    const onError = () => setError(true);
    const onStatus = (event: Event) => {
      if ((event as CustomEvent<{ status: string }>).detail.status === "failed") setError(true);
    };
    element.addEventListener("load", onLoad);
    element.addEventListener("error", onError);
    element.addEventListener("ar-status", onStatus);
    queueMicrotask(() => { if (element.isConnected && element.loaded) onLoad(); });
    return () => {
      element.removeEventListener("load", onLoad);
      element.removeEventListener("error", onError);
      element.removeEventListener("ar-status", onStatus);
    };
  }, [open, attempt]);

  async function openViewer() {
    if (error && piece.model) {
      const retryUrl = new URL(piece.model.glb, window.location.href);
      retryUrl.searchParams.set("ck_retry", String(attempt + 1));
      setSource(retryUrl.href);
    }
    setAttempt(count => count + 1);
    setOpen(false);
    setLoaded(false);
    setCanAR(false);
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

  const model = open && piece.model && <model-viewer
    key={attempt}
    ref={viewer}
    src={source ?? piece.model.glb}
    ios-src={piece.model.usdz}
    poster={poster}
    alt={`${piece.name} · ${t.model3d}`}
    camera-controls
    touch-action="pan-y"
    ar
    ar-modes="webxr scene-viewer quick-look"
    ar-scale="fixed"
    shadow-intensity="1"
    style={{ display: "block", width: "100%", height: embedded ? "100%" : "clamp(300px,50vh,560px)" }}
  ><button slot="ar-button" type="button" style={{ display: "none" }} aria-hidden="true" tabIndex={-1} /></model-viewer>;

  const controls = <>
    {(!open || error) && <button type="button" className="ck-action" disabled={!piece.model || loading} onClick={openViewer}>
      {loading ? t.loading3d : t.view3d}
    </button>}
    <button type="button" className="ck-action ck-action-outline" disabled={!loaded || !canAR || error} onClick={async () => {
      try { await viewer.current?.activateAR(); } catch { setError(true); }
    }}>{t.viewInSpace}</button>
  </>;

  if (embedded) return <div className="ck-ar-embedded" aria-label={t.explore3d}>
    <div className="ck-ar-viewport">{model}{!error && !loaded && <p className="ck-ar-progress" role="status">{t.loading3d}</p>}</div>
    <div className="ck-ar-compact-controls">
      {controls}
      {error ? <p role="alert">{t.modelError}</p> : loaded && !canAR && <p>{t.arDeviceHint}</p>}
    </div>
  </div>;

  return <section className="ck-ar-gallery" aria-label={t.explore3d}>
    <h2>{t.explore3d}</h2>
    <p>{piece.model ? t.modelInstructions : t.modelUnavailable}</p>
    {model}
    <div className="ck-contact-actions">{controls}</div>
    {open && !canAR && !error && <p role="status">{loaded ? t.arDeviceHint : t.loading3d}</p>}
    {error && <p role="alert">{t.modelError}</p>}
  </section>;
}
