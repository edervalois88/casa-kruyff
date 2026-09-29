"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [veil, setVeil] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t0 = setTimeout(() => setVeil(2), 0);
      return () => clearTimeout(t0);
    }
    const t1 = setTimeout(() => setVeil(1), 60);
    const t2 = setTimeout(() => setVeil(2), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--ck-ivory)" }}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "var(--ck-ivory)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          pointerEvents: "none",
          transition: "opacity 1.1s cubic-bezier(.77,0,.175,1), visibility 1.1s",
          opacity: veil >= 2 ? 0 : 1,
          visibility: veil >= 2 ? "hidden" : "visible",
        }}
      >
        <Image
          src="/brand/emblem.png"
          alt=""
          width={96}
          height={134}
          style={{
            width: 96,
            height: "auto",
            transition: "transform 1.8s cubic-bezier(.16,1,.3,1), opacity 1.2s cubic-bezier(.25,.1,.1,1)",
            transform: `scale(${veil >= 1 ? 1 : 0.94})`,
            opacity: veil >= 1 ? 1 : 0,
          }}
        />
        <div
          style={{
            width: 120,
            height: 1,
            background: "var(--ck-gold)",
            transformOrigin: "left",
            transition: "transform 1.2s cubic-bezier(.77,0,.175,1) .3s",
            transform: `scaleX(${veil >= 1 ? 1 : 0})`,
          }}
        />
      </div>

      <Header overlayCapable={isHome} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
