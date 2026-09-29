"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./site-data";
import { COPY } from "./copy";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof COPY)["es"];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "ck-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "es" || stored === "en") setLangState(stored);
      } catch {
        // ignore: storage unavailable
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore: storage unavailable
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: COPY[lang] }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
