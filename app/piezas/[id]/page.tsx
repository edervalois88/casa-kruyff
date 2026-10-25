"use client";

import PieceGallery from "@/components/PieceGallery";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useQuote } from "@/lib/quote-context";
import { langIndex } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";

export default function PiezaPage() {
  const params = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { IMG, PIECES, catName, whatsappLink } = useSiteData();
  const { addPiece, hasPiece } = useQuote();
  const L = langIndex(lang);

  const piece = PIECES.find((p) => p.id === params.id);
  if (!piece) notFound();

  const img = IMG[piece.id];
  const name = lang === "en" && piece.nameEn ? piece.nameEn : piece.name;
  const inQuote = hasPiece(piece.id);
  const specs = [piece.mat[L], piece.dim, `${piece.designer}, ${piece.origin}`, t.leadTime].map((v, i) => ({
    k: t.specs[i],
    v,
  }));

  return (
    <section className="ck-piece-detail">
      <PieceGallery key={piece.id} piece={piece} fallback={img?.src} />
      <div className="ck-piece-info">
        <Link
          href="/colecciones"
          className="font-[family-name:var(--font-label)]"
          style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-muted)" }}
        >
          ← {t.navCollections} / {catName(lang, piece.cat, t.all)}
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(40px,4.3vw,68px)", lineHeight: 1 }}>{name}</h1>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
            {piece.designer} · {piece.origin}
          </span>
        </div>
        <p style={{ margin: 0, maxWidth: "46ch", fontSize: 17, lineHeight: 1.75, color: "var(--ck-muted-2)" }}>{piece.description?.[L] || t.pieceDesc}</p>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(54,40,31,.14)" }}>
          {specs.map((s) => (
            <div key={s.k} style={{ display: "grid", gridTemplateColumns: "minmax(100px,.7fr) minmax(0,1fr)", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(54,40,31,.14)" }}>
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
          <a
            href={whatsappLink(t.waPiece + name)}
            target="_blank"
            rel="noreferrer"
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
            {t.askPiece}
          </a>
        </div>
        <span style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ck-muted)" }}>{t.quoteNote}</span>
      </div>
    </section>
  );
}
