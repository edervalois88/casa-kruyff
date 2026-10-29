import type { Lang } from "./site-data";

const englishLabels: Record<string, string> = {
  "No especificado": "Not specified",
  "No especificadas": "Not specified",
  "Artesanos de San José de Gracia": "San José de Gracia artisans",
  "Artesanos de Michoacán": "Michoacán artisans",
  "Artesanos de Metepec": "Metepec artisans",
  "Alfareros purépechas": "Purépecha potters",
  "Alfareros purépechas de Pambatán": "Purépecha potters of Pambatán",
  "Artesanos mexicanos": "Mexican artisans",
  "Artistas Wixárika": "Wixárika artists",
  "Artesanos": "Artisans",
  "Artesanos balineses": "Balinese artisans",
  "Artesanos locales": "Local artisans",
  "Artista mexicano": "Mexican artist",
  "Colección Crown": "Crown Collection",
  "Carlos Gunther Maier para House Armida": "Carlos Gunther Maier for House Armida",
  "Domo extra grande; medidas no especificadas": "Extra-large dome; dimensions not specified",
  "Hecho sobre pedido": "Made to order",
  "Greece — Kiosco / Kiosk": "Greece — Kiosk",
  "Residencia Virreyes": "Virreyes Residence",
  "Hotel boutique": "Boutique Hotel",
  "Departamento Polanco": "Polanco Apartment",
  "Club privado": "Private Club",
};

// Translate shared catalog labels without rewriting stored names or provenance.
export function catalogText(value: string, lang: Lang): string {
  if (lang !== "en") return value;
  return englishLabels[value] ?? value
    .replace(/Estado de México/g, "State of Mexico")
    .replace(/México/g, "Mexico");
}

export function catalogDimensions(value: string, lang: Lang): string {
  if (lang !== "en") return value;
  return catalogText(value, lang)
    .replace(/extra grande/gi, "Extra large")
    .replace(/\bchic[oa]\b/gi, "Small")
    .replace(/\bmedian[oa]\b/gi, "Medium")
    .replace(/\bgrande\b/gi, "Large")
    .replace(/\bde alto\b/g, "high")
    .replace(/ cm o /g, " cm or ");
}
