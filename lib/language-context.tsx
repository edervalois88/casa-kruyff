"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./site-data";
import type { COPY } from "./copy";
import { useSiteContent } from "./site-content-context";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof COPY)["es"];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const content = useSiteContent();
  const [lang, setLang] = useState<Lang>(content.settings.defaultLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: content.copy[lang] }),
    [lang, content.copy]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
