"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("ck-intro-seen") === "1"; sessionStorage.setItem("ck-intro-seen", "1"); } catch { /* Session storage may be unavailable. */ }
    const skip = seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setIntro(false), skip ? 0 : 700);
    return () => clearTimeout(timer);
  }, []);
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--ck-ivory)" }}>
    {isHome && intro && <div aria-hidden="true" className="ck-intro-veil">
      <Image src="/brand/emblem.png" alt="" width={64} height={90} />
    </div>}
    <Header overlayCapable={isHome} />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>;
}
