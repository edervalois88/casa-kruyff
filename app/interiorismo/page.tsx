"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { HERO_INT, IMG, PROJECTS, langIndex } from "@/lib/site-data";
import Reveal from "@/components/Reveal";
import RevealImage from "@/components/RevealImage";

export default function InteriorismoPage() {
  const { lang, t } = useLanguage();
  const L = langIndex(lang);

  return (
    <>
      <section style={{ position: "relative", height: "78vh", minHeight: 520, background: "var(--ck-brown-deep)", overflow: "hidden" }}>
        <RevealImage src={HERO_INT.src} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        <div aria-hidden style={{ position: "absolute", inset: "auto 0 0 0", height: "70%", background: "linear-gradient(180deg,rgba(20,17,16,0),rgba(20,17,16,.7))" }} />
        <div style={{ position: "absolute", left: "clamp(24px,5vw,88px)", bottom: "clamp(40px,6vw,88px)", display: "flex", flexDirection: "column", gap: 18, color: "var(--ck-ivory)" }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>
            {t.navInterior}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(52px,6.6vw,108px)", lineHeight: 0.96, maxWidth: "14ch" }}>
            {t.interiorTitle}
          </h1>
        </div>
      </section>

      <section style={{ padding: "clamp(80px,10vw,160px) clamp(24px,5vw,88px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "clamp(28px,3.5vw,64px)" }}>
        {t.steps.map(([title, body], i) => (
          <Reveal key={title} delay={i * 90} style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid var(--ck-gold)", paddingTop: 24 }}>
            <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--ck-gold-soft)" }}>
              0{i + 1}
            </span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 36, lineHeight: 1 }}>{title}</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--ck-muted-2)" }}>{body}</p>
          </Reveal>
        ))}
      </section>

      <section
        style={{
          padding: "0 clamp(24px,5vw,88px) clamp(96px,10vw,160px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
          gap: "72px clamp(24px,3vw,48px)",
        }}
      >
        {PROJECTS.map((p) => {
          const img = IMG[p.id];
          return (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ position: "relative", aspectRatio: "4/3", background: "var(--ck-sand)", overflow: "hidden" }}>
                {img && <Image src={img.src} alt={p.name} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 34, lineHeight: 1.1 }}>{p.name}</span>
                <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ck-muted)" }}>
                  {p.place}
                </span>
              </div>
              <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
                {p.type[L]}
              </span>
            </div>
          );
        })}
      </section>
    </>
  );
}
