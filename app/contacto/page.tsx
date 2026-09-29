"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useQuote } from "@/lib/quote-context";
import { HERO_CONTACTO, PIECES } from "@/lib/site-data";

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: 0,
  borderBottom: "1px solid rgba(54,40,31,.26)",
  padding: "10px 0",
  fontSize: 17,
  color: "var(--ck-ink)",
  outline: "none",
  borderRadius: 0,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--ck-muted)",
};

export default function ContactoPage() {
  const { t } = useLanguage();
  const { quote, removePiece } = useQuote();
  const [sent, setSent] = useState(false);

  const quoteItems = quote
    .map((id) => PIECES.find((p) => p.id === id))
    .filter((p): p is (typeof PIECES)[number] => Boolean(p));

  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", minHeight: "calc(100vh - 75px)" }}>
      <div style={{ position: "relative", minHeight: 520, background: "var(--ck-brown-mid)" }}>
        <Image src={HERO_CONTACTO.src} alt="Interior del showroom" fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
      </div>
      <div style={{ padding: "clamp(48px,6vw,104px) clamp(24px,5vw,88px)", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span className="font-[family-name:var(--font-label)]" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ck-gold-soft)" }}>
            {t.appointment}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(44px,5vw,76px)", lineHeight: 1 }}>{t.contactTitle}</h1>
          <p style={{ margin: 0, maxWidth: "44ch", fontSize: 16, lineHeight: 1.7, color: "var(--ck-muted-2)" }}>{t.contactBody}</p>
        </div>

        {quoteItems.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", background: "var(--ck-sand-light)", padding: "24px 28px" }}>
            <span className="font-[family-name:var(--font-label)]" style={{ ...labelStyle, paddingBottom: 10, color: "var(--ck-muted-2)" }}>
              {t.quoteList}
            </span>
            {quoteItems.map((q) => (
              <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "12px 0", borderTop: "1px solid rgba(54,40,31,.14)" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 24 }}>
                  {q.name} <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ck-muted-2)" }}>· {q.designer}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removePiece(q.id)}
                  className="font-[family-name:var(--font-label)]"
                  style={{ background: "none", border: 0, margin: 0, font: "inherit", cursor: "pointer", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ck-muted-2)" }}
                >
                  {t.remove}
                </button>
              </div>
            ))}
          </div>
        )}

        {!sent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="font-[family-name:var(--font-label)]" style={labelStyle}>
                  {t.fName}
                </span>
                <input required className="ck-field" style={fieldStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="font-[family-name:var(--font-label)]" style={labelStyle}>
                  {t.fEmail}
                </span>
                <input type="email" required className="ck-field" style={fieldStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="font-[family-name:var(--font-label)]" style={labelStyle}>
                  {t.fPhone}
                </span>
                <input type="tel" className="ck-field" style={fieldStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="font-[family-name:var(--font-label)]" style={labelStyle}>
                  {t.fProfile}
                </span>
                <select className="ck-field" style={fieldStyle}>
                  {t.profiles.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span className="font-[family-name:var(--font-label)]" style={labelStyle}>
                {t.fMsg}
              </span>
              <textarea rows={3} className="ck-field" style={{ ...fieldStyle, resize: "vertical" }} />
            </label>
            <button
              type="submit"
              className="font-[family-name:var(--font-label)]"
              style={{
                cursor: "pointer",
                alignSelf: "flex-start",
                background: "var(--ck-brown-deep)",
                color: "var(--ck-ivory)",
                border: 0,
                padding: "18px 36px",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              {t.send}
            </button>
          </form>
        ) : (
          <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 32, lineHeight: 1.3, borderTop: "1px solid var(--ck-gold)", paddingTop: 28 }}>
            {t.thanks}
          </p>
        )}
      </div>
    </section>
  );
}
