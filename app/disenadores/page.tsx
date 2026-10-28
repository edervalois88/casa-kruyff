"use client";

import { useLanguage } from "@/lib/language-context";
import { langIndex } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";

export default function DisenadoresPage() {
  const { t, lang } = useLanguage();
  const { DESIGNERS } = useSiteData();
  const L = langIndex(lang);

  return (
    <section style={{ padding: "clamp(64px,8vw,128px) clamp(24px,5vw,88px) clamp(96px,10vw,160px)", display: "flex", flexDirection: "column", gap: 56 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 40, alignItems: "end" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(56px,7vw,112px)", lineHeight: 0.95 }}>{t.navDesigners}</h1>
        <p style={{ margin: 0, maxWidth: "44ch", fontSize: 17, lineHeight: 1.7, color: "var(--ck-muted-2)" }}>{t.designersIntro}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(54,40,31,.26)" }}>
        {DESIGNERS.map((d) => (
          <div
            key={d.id}
            className="ck-designer-row"
            style={{
              display: "grid",
              gridTemplateColumns: "var(--ck-designer-columns,minmax(0,1fr) auto)",
              gap: "var(--ck-designer-gap,clamp(20px,3vw,48px))",
              alignItems: "center",
              padding: "24px 0",
              borderBottom: "1px solid rgba(54,40,31,.14)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(34px,4vw,56px)", lineHeight: 1 }}>{d.name}</span>
              <span style={{ fontSize: 15, color: "var(--ck-muted-2)" }}>{d.disc[L]}</span>
            </div>
            <span className="ck-designer-origin font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
              {d.origin}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
