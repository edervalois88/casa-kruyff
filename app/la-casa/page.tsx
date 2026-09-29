"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { HERO_CASA } from "@/lib/site-data";
import Reveal from "@/components/Reveal";

export default function LaCasaPage() {
  const { t } = useLanguage();

  return (
    <>
      <section style={{ padding: "clamp(80px,10vw,160px) 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40, textAlign: "center" }}>
        <Image src="/brand/emblem.png" alt="" width={88} height={123} style={{ width: 88, height: "auto" }} />
        <h1 style={{ margin: 0, maxWidth: "20ch", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(40px,5vw,76px)", lineHeight: 1.08 }}>
          {t.casaLead}
        </h1>
        <p style={{ margin: 0, maxWidth: "56ch", fontSize: 18, lineHeight: 1.75, color: "var(--ck-muted-2)" }}>{t.casaBody}</p>
      </section>

      <section style={{ position: "relative", height: "72vh", minHeight: 480, background: "var(--ck-brown-mid)", overflow: "hidden" }}>
        <Image src={HERO_CASA.src} alt="Showroom · Lomas de Chapultepec" fill sizes="100vw" style={{ objectFit: "cover" }} />
      </section>

      <section style={{ padding: "clamp(80px,10vw,160px) clamp(24px,5vw,88px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(40px,5vw,80px)" }}>
        {t.pillars.map(([k, v]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
              {k}
            </span>
            <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(26px,2.4vw,34px)", lineHeight: 1.25 }}>{v}</p>
          </div>
        ))}
      </section>

      <section style={{ background: "var(--ck-brown-deep)", color: "var(--ck-ivory)", padding: "clamp(80px,10vw,160px) clamp(24px,5vw,88px)", display: "flex", flexDirection: "column", gap: 56 }}>
        <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#C9A961" }}>
          {t.values}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "48px clamp(32px,4vw,64px)" }}>
          {t.valuesList.map(([k, v], i) => (
            <Reveal key={k} delay={i * 60} style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(201,169,97,.4)", paddingTop: 22 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 34, lineHeight: 1 }}>{k}</span>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--ck-sand)" }}>{v}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
