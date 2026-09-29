"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { HERO_A, HERO_INTERIOR, IMG, ROOMS, langIndex } from "@/lib/site-data";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const L = langIndex(lang);

  return (
    <>
      <section style={{ position: "relative", height: "100vh", minHeight: 640, background: "var(--ck-brown-deep)", overflow: "hidden" }}>
        <Image src={HERO_A.src} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg,rgba(20,17,16,.5) 0%,rgba(20,17,16,.1) 25%,rgba(20,17,16,.35) 45%,rgba(20,17,16,.7) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "18vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            textAlign: "center",
            color: "var(--ck-ivory)",
            padding: "0 24px",
          }}
        >
          <span
            className="font-[family-name:var(--font-label)]"
            style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", maxWidth: "40ch" }}
          >
            {t.tagline}
          </span>
          <h1
            style={{
              margin: 0,
              maxWidth: "16ch",
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(44px,6.4vw,96px)",
              lineHeight: 1.02,
            }}
          >
            {t.heroA}
          </h1>
          <Link
            href="/colecciones"
            className="font-[family-name:var(--font-label)]"
            style={{
              color: "var(--ck-ivory)",
              marginTop: 8,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              borderBottom: "1px solid #C9A961",
              paddingBottom: 6,
            }}
          >
            {t.explore}
          </Link>
        </div>
      </section>

      <section style={{ padding: "clamp(96px,14vw,200px) 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40, textAlign: "center" }}>
        <Image src="/brand/emblem.png" alt="" width={72} height={101} style={{ width: 72, height: "auto", opacity: 0.9 }} />
        <Reveal
          as="p"
          style={{ margin: 0, maxWidth: "24ch", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(30px,3.6vw,52px)", lineHeight: 1.18 }}
        >
          {t.statement}
        </Reveal>
      </section>

      {ROOMS.map(([id, esName, enName], i) => {
        const img = IMG[id];
        return (
          <section key={id} style={{ position: "relative", height: "88vh", minHeight: 560, background: "var(--ck-brown-mid)", marginBottom: 6, overflow: "hidden" }}>
            <Image src={img.src} alt={[esName, enName][L]} fill sizes="100vw" style={{ objectFit: "cover" }} />
            <div
              aria-hidden
              style={{ position: "absolute", inset: "auto 0 0 0", height: "65%", background: "linear-gradient(180deg,rgba(20,17,16,0),rgba(20,17,16,.68))" }}
            />
            <div style={{ position: "absolute", left: "clamp(24px,5vw,80px)", bottom: "clamp(40px,6vw,80px)", display: "flex", flexDirection: "column", gap: 14, color: "var(--ck-ivory)" }}>
              <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>
                0{i + 1}
              </span>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(44px,5.5vw,88px)", lineHeight: 1 }}>{[esName, enName][L]}</h2>
              <Link
                href="/colecciones"
                className="font-[family-name:var(--font-label)]"
                style={{
                  pointerEvents: "auto",
                  color: "var(--ck-ivory)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid #C9A961",
                  paddingBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                {t.viewRoom}
              </Link>
            </div>
          </section>
        );
      })}

      <section style={{ background: "var(--ck-brown-deep)", color: "var(--ck-ivory)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <div style={{ position: "relative", minHeight: 640 }}>
          <Image src={HERO_INTERIOR.src} alt="" fill sizes="50vw" style={{ objectFit: "cover" }} />
        </div>
        <div style={{ padding: "clamp(56px,8vw,128px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ck-gold-light)" }}>
            {t.navInterior}
          </span>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(40px,4.4vw,68px)", lineHeight: 1.05, maxWidth: "14ch" }}>
            {t.interiorTitle}
          </h2>
          <p style={{ margin: 0, maxWidth: "44ch", fontSize: 17, lineHeight: 1.7, color: "var(--ck-sand)" }}>{t.interiorBody}</p>
          <Link
            href="/interiorismo"
            className="font-[family-name:var(--font-label)]"
            style={{
              color: "var(--ck-ivory)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              borderBottom: "1px solid #C9A961",
              paddingBottom: 6,
              alignSelf: "flex-start",
            }}
          >
            {t.viewProjects}
          </Link>
        </div>
      </section>
    </>
  );
}
