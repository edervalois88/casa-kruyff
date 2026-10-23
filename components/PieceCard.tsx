"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Piece } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";
import { useLanguage } from "@/lib/language-context";

export default function PieceCard({ piece, showCat = true }: { piece: Piece; showCat?: boolean }) {
  const { lang, t } = useLanguage();
  const { IMG, catName } = useSiteData();
  const img = IMG[piece.id];
  const name = lang === "en" && piece.nameEn ? piece.nameEn : piece.name;
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/piezas/${piece.id}`}
      style={{ display: "flex", flexDirection: "column", gap: 14, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--ck-sand)", overflow: "hidden" }}>
        {img && (
          <Image
            src={img.src}
            alt={name}
            fill
            sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "scale 1.6s cubic-bezier(.16,1,.3,1)", scale: hover ? "1.045" : "1" }}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, lineHeight: 1.1 }}>{name}</span>
        {showCat && (
          <span
            className="font-[family-name:var(--font-label)]"
            style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ck-muted)", maxWidth: "100%", overflowWrap: "anywhere" }}
          >
            {catName(lang, piece.cat, t.all)}
          </span>
        )}
      </div>
      <span
        className="font-[family-name:var(--font-label)]"
        style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ck-muted)" }}
      >
        {piece.designer} · {piece.origin}
      </span>
    </Link>
  );
}
