"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Piece } from "@/lib/site-data";
import { IMG, catName } from "@/lib/site-data";
import { useLanguage } from "@/lib/language-context";

export default function PieceCard({ piece, showCat = true }: { piece: Piece; showCat?: boolean }) {
  const { lang, t } = useLanguage();
  const img = IMG[piece.id];
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
            alt={piece.name}
            fill
            sizes="(max-width: 700px) 50vw, 25vw"
            style={{ objectFit: "cover", transition: "scale 1.6s cubic-bezier(.16,1,.3,1)", scale: hover ? "1.045" : "1" }}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, lineHeight: 1.1 }}>{piece.name}</span>
        {showCat && (
          <span
            className="font-[family-name:var(--font-label)]"
            style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ck-muted)", whiteSpace: "nowrap" }}
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
