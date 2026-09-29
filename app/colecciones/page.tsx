"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { CATS, PIECES, catName, langIndex } from "@/lib/site-data";
import PieceCard from "@/components/PieceCard";

function ColeccionesContent() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") ?? "all";
  const L = langIndex(lang);

  const setCat = (id: string) => {
    if (id === "all") router.push("/colecciones");
    else router.push(`/colecciones?cat=${id}`);
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
            className="font-[family-name:var(--font-label)]"
            style={{
              background: "none",
              border: 0,
              margin: 0,
              font: "inherit",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: cat === "all" ? "var(--ck-ink)" : "var(--ck-muted)",
              borderBottom: `1px solid ${cat === "all" ? "var(--ck-gold)" : "transparent"}`,
              paddingBottom: 4,
            }}
          >
            {t.all}
          </button>
          {CATS.map(([id, esLabel, enLabel]) => (
            <button
              type="button"
              key={id}
              onClick={() => setCat(id)}
              className="font-[family-name:var(--font-label)]"
              style={{
                background: "none",
                border: 0,
                margin: 0,
                font: "inherit",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: cat === id ? "var(--ck-ink)" : "var(--ck-muted)",
                borderBottom: `1px solid ${cat === id ? "var(--ck-gold)" : "transparent"}`,
                paddingBottom: 4,
              }}
            >
              {[esLabel, enLabel][L]}
            </button>
          ))}
        </div>
      </section>
      <section
        style={{
          padding: "0 clamp(24px,5vw,88px) clamp(96px,10vw,160px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "64px clamp(20px,2.4vw,40px)",
        }}
      >
        {filtered.map((p) => (
          <PieceCard key={p.id} piece={p} />
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
