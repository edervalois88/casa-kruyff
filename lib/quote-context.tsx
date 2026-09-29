"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface QuoteContextValue {
  quote: string[];
  addPiece: (id: string) => void;
  removePiece: (id: string) => void;
  hasPiece: (id: string) => boolean;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

const STORAGE_KEY = "ck-quote";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quote, setQuote] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setQuote(JSON.parse(stored));
      } catch {
        // ignore: storage unavailable or corrupt
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch {
      // ignore: storage unavailable
    }
  }, [quote, loaded]);

  const value = useMemo<QuoteContextValue>(
    () => ({
      quote,
      addPiece: (id) => setQuote((q) => (q.includes(id) ? q : [...q, id])),
      removePiece: (id) => setQuote((q) => q.filter((x) => x !== id)),
      hasPiece: (id) => quote.includes(id),
    }),
    [quote]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
