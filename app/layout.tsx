import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { QuoteProvider } from "@/lib/quote-context";
import SiteChrome from "@/components/SiteChrome";

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
  title: "Casa Kruyff — Casa de diseño y curaduría de interiores",
  description:
    "Casa Kruyff reúne piezas excepcionales, talento internacional y una mirada estética atemporal para crear espacios con identidad. Lomas de Chapultepec, Ciudad de México.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${lato.variable} ${montserrat.variable}`}
    >
      <body>
        <LanguageProvider>
          <QuoteProvider>
            <SiteChrome>{children}</SiteChrome>
          </QuoteProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
