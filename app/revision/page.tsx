"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { AMBIENTES, REVISION_IMAGENES, type Ambiente } from "@/lib/revision-data";
import Reveal from "@/components/Reveal";
import RevisionImage from "@/components/RevisionImage";
import "./revision.css";

export default function RevisionPage() {
  const { t } = useLanguage();
  const titulo: Record<Ambiente, string> = {
    calido: t.ambienteCalido,
    dramatico: t.ambienteDramatico,
    contemporaneo: t.ambienteContemporaneo,
  };

  return (
    <>
      <section style={{ padding: "clamp(80px,10vw,160px) 24px clamp(48px,6vw,96px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, textAlign: "center" }}>
        <Image src="/brand/emblem.png" alt="" width={72} height={101} style={{ width: 72, height: "auto", opacity: 0.9 }} />
        <h1 style={{ margin: 0, maxWidth: "20ch", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(40px,5vw,76px)", lineHeight: 1.08 }}>
          {t.revisionTitle}
        </h1>
        <p style={{ margin: 0, maxWidth: "48ch", fontSize: 17, lineHeight: 1.7, color: "var(--ck-muted-2)" }}>{t.revisionNote}</p>
      </section>

      {AMBIENTES.map((ambiente) => (
        <section key={ambiente} style={{ padding: "0 clamp(24px,5vw,88px) clamp(80px,10vw,140px)", display: "flex", flexDirection: "column", gap: 32 }}>
          <Reveal
            as="h2"
            style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(32px,3.6vw,52px)", lineHeight: 1.1, borderBottom: "1px solid var(--ck-gold-light)", paddingBottom: 16 }}
          >
            {titulo[ambiente]}
          </Reveal>
          <div className="rv-grid">
            {REVISION_IMAGENES.filter((img) => img.ambiente === ambiente).map((img) => (
              <RevisionImage key={img.archivo} img={img} numero={img.archivo.replace(".jpg", "")} ambiente={titulo[ambiente]} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
