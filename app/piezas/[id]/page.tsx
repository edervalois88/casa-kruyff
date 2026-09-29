"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useQuote } from "@/lib/quote-context";
import { IMG, PIECES, catName, langIndex } from "@/lib/site-data";

export default function PiezaPage() {
  const params = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { addPiece, hasPiece } = useQuote();
  const L = langIndex(lang);

  const piece = PIECES.find((p) => p.id === params.id);
  if (!piece) notFound();

  const img = IMG[piece.id];
  const inQuote = hasPiece(piece.id);
  const specs = [piece.mat[L], piece.dim, `${piece.designer}, ${piece.origin}`, t.leadTime].map((v, i) => ({
    k: t.specs[i],
    v,
  }));

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
        gap: "clamp(40px,5vw,88px)",
        padding: "clamp(32px,4vw,56px) clamp(24px,5vw,88px) clamp(80px,10vw,140px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--ck-sand)", overflow: "hidden" }}>
          {img && <Image src={img.src} alt={piece.name} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ position: "relative", aspectRatio: "1", background: "var(--ck-sand)" }} />
          <div style={{ position: "relative", aspectRatio: "1", background: "var(--ck-sand)" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, alignSelf: "start", position: "sticky", top: 120 }}>
        <Link
          href="/colecciones"
          className="font-[family-name:var(--font-label)]"
          style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-muted)" }}
        >
          ← {t.navCollections} / {catName(lang, piece.cat, t.all)}
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(48px,5vw,80px)", lineHeight: 1 }}>{piece.name}</h1>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
            {piece.designer} · {piece.origin}
          </span>
        </div>
        <p style={{ margin: 0, maxWidth: "46ch", fontSize: 17, lineHeight: 1.75, color: "var(--ck-muted-2)" }}>{t.pieceDesc}</p>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(54,40,31,.14)" }}>
          {specs.map((s) => (
            <div key={s.k} style={{ display: "grid", gridTemplateColumns: "160px minmax(0,1fr)", gap: 16, padding: "16px 0", borderBottom: "1px solid rgba(54,40,31,.14)" }}>
              <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-muted)", paddingTop: 3 }}>
                {s.k}
              </span>
              <span style={{ fontSize: 15, lineHeight: 1.5 }}>{s.v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button
            type="button"
            onClick={() => addPiece(piece.id)}
            className="font-[family-name:var(--font-label)]"
            style={{
              cursor: "pointer",
              background: "var(--ck-brown-deep)",
              color: "var(--ck-ivory)",
              border: "1px solid var(--ck-brown-deep)",
              padding: "18px 32px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {inQuote ? t.added : t.add}
          </button>
          <Link
            href="/contacto"
            className="font-[family-name:var(--font-label)]"
            style={{
              cursor: "pointer",
              background: "transparent",
              color: "var(--ck-ink)",
              border: "1px solid rgba(54,40,31,.26)",
              padding: "18px 32px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            {t.appointment}
          </Link>
        </div>
        <span style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ck-muted)" }}>{t.quoteNote}</span>
      </div>
    </section>
  );
}
