import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { QuoteProvider } from "@/lib/quote-context";
import SiteChrome from "@/components/SiteChrome";
import { connection } from "next/server";
import { getPublicContent } from "@/lib/server/cms-store";
import { SiteContentProvider } from "@/lib/site-content-context";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Casa Kruyff — A house of design and interior curation",
  description:
    "Curated objects for timeless interiors. Exclusive pieces, international design and interior curation in The Woodlands, Texas.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  await connection();
  const content = await getPublicContent();
  return (
    <html
      lang={content.settings.defaultLanguage}
      className={`${cormorant.variable} ${lato.variable} ${montserrat.variable}`}
    >
      <body>
        <SiteContentProvider initial={content}>
        <LanguageProvider>
          <QuoteProvider>
            <SiteChrome>{children}</SiteChrome>
          </QuoteProvider>
        </LanguageProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
