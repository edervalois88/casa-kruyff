"use client";

import { Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { langIndex } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";
import PieceCard from "@/components/PieceCard";
import CatalogReveal from "@/components/CatalogReveal";
import { transitionView } from "@/lib/view-transition";

function ColeccionesContent() {
  const { lang, t } = useLanguage();
  const { CATS, PIECES, catName } = useSiteData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") ?? "all";
  const grid = useRef<HTMLElement>(null);
  const L = langIndex(lang);

  const setCat = (id: string) => {
    if (id === cat) return;
    const href = id === "all" ? "/colecciones" : `/colecciones?cat=${encodeURIComponent(id)}`;
    transitionView(() => new Promise<void>(resolve => {
      const element = grid.current;
      if (!element) { router.push(href, { scroll: false }); resolve(); return; }
      const done = () => { observer.disconnect(); clearTimeout(timeout); resolve(); };
      const observer = new MutationObserver(() => { if (element.dataset.category === id) done(); });
      const timeout = setTimeout(done, 1800);
      observer.observe(element, { attributes: true, attributeFilter: ["data-category"] });
      router.push(href, { scroll: false });
    }));
  };

  const filtered = PIECES.filter((p) => cat === "all" || p.cat === cat);
  const title = cat === "all" ? t.navCollections : catName(lang, cat, t.all);

  return (
    <>
      <section style={{ padding: "clamp(64px,8vw,128px) clamp(24px,5vw,88px) 48px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
            {t.navCollections}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(56px,7vw,112px)", lineHeight: 0.95 }}>{title}</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, borderTop: "1px solid rgba(54,40,31,.14)", borderBottom: "1px solid rgba(54,40,31,.14)", padding: "20px 0" }}>
          <button
            type="button"
            onClick={() => setCat("all")}
            aria-pressed={cat === "all"}
            className="font-[family-name:var(--font-label)]"
            style={{
              background: "none",
              position: "relative",
              border: 0,
              margin: 0,
              font: "inherit",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: cat === "all" ? "var(--ck-ink)" : "var(--ck-muted)",
              borderBottom: "1px solid transparent",
              paddingBottom: 4,
            }}
          >
            {t.all}
            {cat === "all" && <span className="ck-filter-line" />}
          </button>
          {CATS.map(([id, esLabel, enLabel]) => (
            <button
              type="button"
              key={id}
              onClick={() => setCat(id)}
              aria-pressed={cat === id}
              className="font-[family-name:var(--font-label)]"
              style={{
                background: "none",
                position: "relative",
                border: 0,
                margin: 0,
                font: "inherit",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: cat === id ? "var(--ck-ink)" : "var(--ck-muted)",
                borderBottom: "1px solid transparent",
                paddingBottom: 4,
              }}
            >
              {[esLabel, enLabel][L]}
              {cat === id && <span className="ck-filter-line" />}
            </button>
          ))}
        </div>
      </section>
      <section
        ref={grid}
        data-category={cat}
        aria-label={title}
        style={{
          padding: "0 clamp(24px,5vw,88px) clamp(96px,10vw,160px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))",
          gap: "64px clamp(20px,2.4vw,40px)",
        }}
      >
        {filtered.length === 0 && <p style={{ gridColumn: "1 / -1", padding: "32px 0", maxWidth: "48ch", color: "var(--ck-muted-2)" }}>
          {cat === "holiday"
            ? lang === "en" ? "Our seasonal selection is coming soon. Discover the rest of our collections in the meantime." : "Nuestra selección de temporada llegará pronto. Mientras tanto, descubre el resto de nuestras colecciones."
            : lang === "en" ? "There are no pieces in this collection yet." : "Aún no hay piezas en esta colección."}
        </p>}
        {filtered.map((p, index) => (
          <div key={p.id} style={{ viewTransitionName: `ck-piece-${p.id.replace(/[^a-zA-Z0-9_-]/g, "-")}` }}>
            <CatalogReveal delay={(index % 4) * 55}><PieceCard piece={p} /></CatalogReveal>
          </div>
        ))}
      </section>
    </>
  );
}

export default function ColeccionesPage() {
  return (
    <Suspense fallback={null}>
      <ColeccionesContent />
    </Suspense>
  );
}
