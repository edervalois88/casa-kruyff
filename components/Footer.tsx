"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t } = useLanguage();

  const navAll = [
    { href: "/colecciones", label: t.navCollections },
    { href: "/interiorismo", label: t.navInterior },
    { href: "/disenadores", label: t.navDesigners },
    { href: "/la-casa", label: t.navHouse },
    { href: "/journal", label: t.navJournal },
  ];

  return (
    <footer
      style={{
        background: "var(--ck-brown-deep)",
        color: "var(--ck-sand)",
        padding: "clamp(72px,8vw,120px) clamp(24px,5vw,88px) 40px",
        display: "flex",
        flexDirection: "column",
        gap: 72,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Image src="/brand/emblem-ivory.png" alt="Casa Kruyff" width={64} height={90} style={{ width: 64, height: "auto" }} />
          <span style={{ fontSize: 14, lineHeight: 1.7, maxWidth: "26ch" }}>{t.tagline}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--ck-gold-light)" }}>
            {t.visit}
          </span>
          <span style={{ fontSize: 14, lineHeight: 1.7 }}>{t.location}</span>
          <span style={{ fontSize: 14, lineHeight: 1.7 }}>{t.byAppt}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--ck-gold-light)" }}>
            Casa
          </span>
          {navAll.map((n) => (
            <Link key={n.href} href={n.href} style={{ color: "var(--ck-sand)", fontSize: 14 }}>
              {n.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--ck-gold-light)" }}>
            {t.follow}
          </span>
          <a href="https://www.instagram.com/casakruyff" target="_blank" rel="noreferrer" style={{ color: "var(--ck-sand)", fontSize: 14 }}>
            Instagram · @casakruyff
          </a>
        </div>
      </div>
      <div
        className="font-[family-name:var(--font-label)]"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 16,
          borderTop: "1px solid rgba(201,169,97,.3)",
          paddingTop: 28,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ck-ivory-dim)",
        }}
      >
        <span>© {new Date().getFullYear()} Casa Kruyff</span>
        <span>casakruyff.com</span>
      </div>
    </footer>
  );
}
