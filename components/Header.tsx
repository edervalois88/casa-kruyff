"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useQuote } from "@/lib/quote-context";

interface NavItem {
  href: string;
  label: string;
}

const resetButton: React.CSSProperties = {
  background: "none",
  border: 0,
  padding: 0,
  margin: 0,
  font: "inherit",
  cursor: "pointer",
};

export default function Header({ overlayCapable = false }: { overlayCapable?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const { quote } = useQuote();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => setNarrow(window.innerWidth < 1180);
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const navLeft: NavItem[] = [
    { href: "/colecciones", label: t.navCollections },
    { href: "/interiorismo", label: t.navInterior },
    { href: "/disenadores", label: t.navDesigners },
  ];
  const navRight: NavItem[] = [
    { href: "/la-casa", label: t.navHouse },
    { href: "/journal", label: t.navJournal },
  ];
  const menuItems: NavItem[] = [...navLeft, ...navRight, { href: "/contacto", label: t.appointment }];

  const overlay = overlayCapable && !scrolled;
  const ivoryText = overlay;
  const wordmarkSrc = ivoryText ? "/brand/wordmark-ivory.png" : "/brand/wordmark.png";

  const navLabelClass =
    "font-[family-name:var(--font-label)] text-[11px] font-medium tracking-[0.18em] uppercase whitespace-nowrap cursor-pointer transition-colors";

  const isActive = (href: string) => pathname === href || (href === "/colecciones" && pathname.startsWith("/piezas"));

  return (
    <>
      <header
        style={{
          position: overlayCapable ? (overlay ? "fixed" : "sticky") : "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: overlay ? "transparent" : "var(--ck-ivory)",
          borderBottom: overlay ? "none" : "1px solid rgba(54,40,31,.14)",
          padding: overlay ? "28px clamp(20px,4vw,64px)" : "24px clamp(20px,4vw,64px)",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
          alignItems: "center",
          gap: 24,
          color: ivoryText ? "var(--ck-ivory)" : "var(--ck-ink)",
          transition: "background .4s ease, border-color .4s ease",
        }}
      >
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 20, pointerEvents: overlay ? "auto" : undefined }}>
          {narrow ? (
            <button type="button" onClick={() => setMenuOpen(true)} className={navLabelClass} style={{ ...resetButton, color: "inherit" }}>
              {t.menu}
            </button>
          ) : (
            navLeft.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={navLabelClass}
                style={{ color: ivoryText ? "var(--ck-ivory)" : isActive(n.href) ? "var(--ck-gold-soft)" : "var(--ck-ink)" }}
              >
                {n.label}
              </Link>
            ))
          )}
        </nav>

        <Link href="/" style={{ display: "flex", justifyContent: "center" }}>
          <Image src={wordmarkSrc} alt="Casa Kruyff" height={26} width={220} style={{ height: 26, width: "auto" }} priority />
        </Link>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", gap: 20 }}>
          {!narrow &&
            navRight.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={navLabelClass}
                style={{ color: ivoryText ? "var(--ck-ivory)" : isActive(n.href) ? "var(--ck-gold-soft)" : "var(--ck-ink)" }}
              >
                {n.label}
              </Link>
            ))}
          {!narrow && (
            <div className="font-[family-name:var(--font-label)]" style={{ display: "flex", gap: 8, fontSize: 11, letterSpacing: "0.18em" }}>
              <button type="button" onClick={() => setLang("es")} style={{ ...resetButton, color: "inherit", opacity: lang === "es" ? 1 : 0.5 }}>
                ES
              </button>
              <span style={{ opacity: 0.4 }}>/</span>
              <button type="button" onClick={() => setLang("en")} style={{ ...resetButton, color: "inherit", opacity: lang === "en" ? 1 : 0.5 }}>
                EN
              </button>
            </div>
          )}
          <Link
            href="/contacto"
            className={navLabelClass}
            style={{
              color: "inherit",
              borderBottom: `1px solid ${ivoryText ? "#C9A961" : "var(--ck-gold)"}`,
              paddingBottom: 3,
            }}
          >
            {t.quote} ({quote.length})
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "var(--ck-brown-deep)",
            color: "var(--ck-ivory)",
            display: "flex",
            flexDirection: "column",
            padding: "28px clamp(20px,4vw,64px) 48px",
            gap: 48,
            overflow: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
            <button type="button" onClick={() => setMenuOpen(false)} className={navLabelClass} style={{ ...resetButton, color: "var(--ck-ivory)" }}>
              {t.close}
            </button>
            <Image src="/brand/wordmark-ivory.png" alt="Casa Kruyff" height={22} width={190} style={{ height: 22, width: "auto" }} />
            <div className="font-[family-name:var(--font-label)]" style={{ display: "flex", gap: 8, fontSize: 11, letterSpacing: "0.18em" }}>
              <button type="button" onClick={() => setLang("es")} style={{ ...resetButton, color: "var(--ck-ivory)", opacity: lang === "es" ? 1 : 0.5 }}>
                ES
              </button>
              <span style={{ opacity: 0.5 }}>/</span>
              <button type="button" onClick={() => setLang("en")} style={{ ...resetButton, color: "var(--ck-ivory)", opacity: lang === "en" ? 1 : 0.5 }}>
                EN
              </button>
            </div>
          </div>
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
            {menuItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="ck-hover-gold"
                style={{
                  color: "var(--ck-ivory)",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "clamp(32px,5vw,60px)",
                  lineHeight: 1.12,
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ck-ivory-dim)" }}>
            {t.location} · {t.byAppt}
          </span>
        </div>
      )}
    </>
  );
}
