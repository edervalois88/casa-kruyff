"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SiteContent } from "./cms-types";
import type { Lang } from "./site-data";

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({ initial, children }: { initial: SiteContent; children: ReactNode }) {
  const [content, setContent] = useState(initial);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/site", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const next: SiteContent = await response.json();
        if (!controller.signal.aborted) setContent((current) => next.revision > current.revision ? next : current);
      } catch {
        // Keep the last successfully rendered publication when the connection drops.
      }
    }
    const onVisible = () => { if (!document.hidden) void refresh(); };
    void refresh();
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      controller.abort();
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const content = useContext(SiteContentContext);
  if (!content) throw new Error("SiteContentProvider is required");
  return content;
}

export function useSiteData() {
  const content = useSiteContent();
  return useMemo(() => {
    const images = { ...content.images };
    for (const piece of content.pieces) {
      if (piece.images[0]) images[piece.id] = { src: piece.images[0], credit: "", href: "" };
      else delete images[piece.id];
    }
    const digits = content.settings.phone.replace(/\D/g, "");
    return {
      PIECES: content.pieces,
      CATS: content.cats,
      COLLECTIONS: content.cats,
      IMG: images,
      PROJECTS: content.projects,
      DESIGNERS: content.designers,
      HERO_A: content.heroes.home,
      HERO_INTERIOR: content.heroes.interiorHome,
      HERO_INT: content.heroes.interior,
      HERO_CASA: content.heroes.house,
      HERO_JOURNAL: content.heroes.journal,
      HERO_CONTACTO: content.heroes.contact,
      CONTACT_PHONE: content.settings.phone,
      CONTACT_TEL: `tel:+${digits}`,
      whatsappLink: (message: string) => `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
      catName: (lang: Lang, id: string, allLabel: string) => content.cats.find((cat) => cat[0] === id)?.[lang === "es" ? 1 : 2] ?? allLabel,
      settings: content.settings,
    };
  }, [content]);
}
