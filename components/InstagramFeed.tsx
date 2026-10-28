"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteData } from "@/lib/site-content-context";
import { useLanguage } from "@/lib/language-context";

export default function InstagramFeed() {
  const { lang, t } = useLanguage();
  const { settings, PIECES, CATS, IMG, catName } = useSiteData();
  const highlights = CATS.map(([category]) => PIECES.find((piece) => piece.cat === category && piece.published !== false && IMG[piece.id]?.src))
    .filter((piece) => piece !== undefined)
    .slice(0, 4);

  if (!highlights.length) return null;

  return (
    <section className="ck-instagram" aria-labelledby="instagram-title">
      <div className="ck-instagram-header">
        <div className="ck-section-intro">
          <span className="ck-section-label">Instagram · @{settings.instagramUsername}</span>
          <h2 id="instagram-title">{t.instagramTitle}</h2>
          <p>{t.instagramBody}</p>
        </div>
        <a href={`https://www.instagram.com/${settings.instagramUsername}/`} target="_blank" rel="noreferrer" className="ck-action ck-action-outline">
          {t.instagramVisit}
        </a>
      </div>
      <div className="ck-instagram-gallery" aria-label={lang === "es" ? "Selección de piezas del catálogo" : "A selection of pieces from the collection"}>
        {highlights.map((piece, index) => {
          const name = lang === "en" && piece.nameEn ? piece.nameEn : piece.name;
          const image = IMG[piece.id];
          return (
            <Link className={`ck-instagram-card ck-instagram-card-${index + 1}`} href={`/piezas/${piece.id}`} key={piece.id}>
              <div className="ck-instagram-image">
                <Image src={image.src} alt={name} fill sizes="(max-width: 600px) 46vw, (max-width: 1000px) 44vw, 24vw" />
              </div>
              <div className="ck-instagram-caption">
                <span>{catName(lang, piece.cat, t.all)}</span>
                <h3>{name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
