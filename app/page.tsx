"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { langIndex } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";
import Reveal from "@/components/Reveal";
import InstagramFeed from "@/components/InstagramFeed";
import RevealImage from "@/components/RevealImage";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { HERO_A, HERO_INTERIOR, IMG, COLLECTIONS, CONTACT_PHONE, CONTACT_TEL, whatsappLink } = useSiteData();
  const L = langIndex(lang);

  return (
    <>
      <section style={{ position: "relative", height: "100svh", minHeight: 460, background: "var(--ck-brown-deep)", overflow: "hidden" }}>
        <RevealImage src={HERO_A.src} alt="Caballo decorativo sobre una consola de piedra" fill preload sizes="100vw" className="ck-home-hero-image" style={{ objectFit: "cover" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg,rgba(20,17,16,.45) 0%,rgba(20,17,16,0) 22%,rgba(20,17,16,0) 52%,rgba(20,17,16,.62) 74%,rgba(20,17,16,.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "clamp(28px,6vh,88px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
            color: "var(--ck-ivory)",
            padding: "0 24px",
          }}
        >
          <span
            className="font-[family-name:var(--font-label)]"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,1.9vw,30px)", lineHeight: 1.2, textWrap: "balance" }}
          >
            {t.tagline}
          </span>
          <h1
            style={{
              margin: 0,
              maxWidth: "18ch",
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(34px,4.4vw,72px)",
              lineHeight: 1.04,
              textWrap: "balance",
            }}
          >
            {t.heroA}
          </h1>
          <Link
            href="/colecciones"
            className="font-[family-name:var(--font-label)]"
            style={{
              color: "var(--ck-ivory)",
              marginTop: 6,
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

      <section style={{ padding: "clamp(96px,13vw,190px) 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40, textAlign: "center" }}>
        <Image src="/brand/emblem.png" alt="" width={72} height={101} style={{ width: 72, height: "auto", opacity: 0.9 }} />
        <Reveal
          as="p"
          style={{ margin: 0, maxWidth: "34ch", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.22, textWrap: "balance" }}
        >
          {t.statement}
        </Reveal>
      </section>

      <section className="ck-collection-heading">
        <div>
          <h2>{t.collTitle}</h2>
          <Link href="/colecciones">{t.allPieces}</Link>
        </div>
      </section>

      {COLLECTIONS.map(([id, esName, enName], i) => {
        const img = IMG[id];
        return (
          <section key={id} style={{ position: "relative", height: "88svh", minHeight: 480, background: "var(--ck-brown-mid)", marginBottom: 6, overflow: "hidden" }}>
            <RevealImage src={img.src} alt={[esName, enName][L]} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: id === "acc" ? "56% center" : id === "arte" ? "52% center" : "center" }} />
            <div
              aria-hidden
              style={{ position: "absolute", inset: "auto 0 0 0", height: "65%", background: "linear-gradient(180deg,rgba(20,17,16,0),rgba(20,17,16,.68))" }}
            />
            <div style={{ position: "absolute", left: "clamp(24px,5vw,88px)", right: "clamp(24px,5vw,88px)", bottom: "clamp(40px,6vw,88px)", display: "flex", flexDirection: "column", gap: 14, color: "var(--ck-ivory)" }}>
              <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>
                0{i + 1}
              </span>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(40px,5.4vw,88px)", lineHeight: 1, maxWidth: "16ch", textWrap: "balance" }}>{[esName, enName][L]}</h2>
              <Link
                href={`/colecciones?cat=${id}`}
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
                {t.viewColl}
              </Link>
            </div>
          </section>
        );
      })}

      <section style={{ background: "var(--ck-brown-deep)", color: "var(--ck-ivory)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))" }}>
        <div style={{ position: "relative", minHeight: 640, overflow: "hidden" }}>
          <RevealImage src={HERO_INTERIOR.src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" style={{ objectFit: "cover" }} />
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
      <section className="ck-how-work">
        <div className="ck-section-intro">
          <span className="ck-section-label">{t.howWork}</span>
          <h2>{t.howTitle}</h2>
        </div>
        <div className="ck-work-steps">
          {t.steps.map(([title, body], i) => (
            <div key={title} className="ck-work-step">
              <span className="ck-section-label">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <a href={whatsappLink(t.waMsg)} target="_blank" rel="noreferrer" className="ck-action">{t.askInfo}</a>
      </section>

      <section className="ck-home-contact">
        <span className="ck-section-label">{t.navContact}</span>
        <h2>{t.contactHomeTitle}</h2>
        <p>{t.contactHomeBody}</p>
        <div className="ck-contact-actions">
          <a href={whatsappLink(t.waMsg)} target="_blank" rel="noreferrer" className="ck-action">{t.askWa}</a>
          <a href={CONTACT_TEL} className="ck-action ck-action-outline">{t.call} · {CONTACT_PHONE}</a>
        </div>
        <div className="ck-visit-details">
          <span>{t.location}</span>
          <span>{t.byAppt}</span>
        </div>
      </section>
      <InstagramFeed />
    </>
  );
}
