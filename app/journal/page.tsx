"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { HERO_JOURNAL, IMG } from "@/lib/site-data";

export default function JournalPage() {
  const { t } = useLanguage();

  return (
    <>
      <section style={{ padding: "clamp(64px,8vw,128px) clamp(24px,5vw,88px) 56px", display: "flex", flexDirection: "column", gap: 56 }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(56px,7vw,112px)", lineHeight: 0.95 }}>Journal</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "clamp(32px,4vw,72px)", alignItems: "center" }}>
          <div style={{ position: "relative", aspectRatio: "3/2", background: "var(--ck-sand)", overflow: "hidden" }}>
            <Image src={HERO_JOURNAL.src} alt={t.feature.title} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
              {t.feature.tag}
            </span>
            <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(38px,4vw,60px)", lineHeight: 1.05 }}>{t.feature.title}</h2>
            <p style={{ margin: 0, maxWidth: "44ch", fontSize: 17, lineHeight: 1.7, color: "var(--ck-muted-2)" }}>{t.feature.dek}</p>
            <span
              className="font-[family-name:var(--font-label)]"
              style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: "1px solid var(--ck-gold)", paddingBottom: 6, alignSelf: "flex-start" }}
            >
              {t.read}
            </span>
          </div>
        </div>
      </section>
      <section
        style={{
          padding: "56px clamp(24px,5vw,88px) clamp(96px,10vw,160px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "56px clamp(24px,3vw,48px)",
          borderTop: "1px solid rgba(54,40,31,.14)",
        }}
      >
        {t.articles.map(([id, tag, title]) => {
          const img = IMG[id];
          return (
            <div key={id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--ck-sand)", overflow: "hidden" }}>
                {img && <Image src={img.src} alt={title} fill sizes="(max-width: 700px) 100vw, 33vw" style={{ objectFit: "cover" }} />}
              </div>
              <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
                {tag}
              </span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, lineHeight: 1.15 }}>{title}</span>
            </div>
          );
        })}
      </section>
    </>
  );
}
