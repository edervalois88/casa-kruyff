import type { Lang } from "./site-data";
const colors: Record<string, [string, string]> = {
  red: ["Rojo", "Red"], pink: ["Rosa", "Pink"], yellow: ["Amarillo", "Yellow"],
  green: ["Verde", "Green"], "baby-blue": ["Azul claro", "Baby blue"],
  "cobalt-blue": ["Azul cobalto", "Cobalt blue"], black: ["Negro", "Black"], white: ["Blanco", "White"],
  purple: ["Morado", "Purple"], orange: ["Naranja", "Orange"], silver: ["Acabado plateado", "Silver finish"], gold: ["Acabado dorado", "Gold finish"],
};
export function catalogPhotoLabel(src: string, lang: Lang): string | null {
  const match = src.match(/piece-(?:27|28|29)-color-([a-z-]+)\.webp$/);
  if (match && colors[match[1]]) return `${lang === "en" ? "Color visualization" : "Visualización de color"} — ${colors[match[1]][lang === "en" ? 1 : 0]}`;
  if (/piece-(?:27|28)-colors-en\.webp$/.test(src)) return lang === "en" ? "Available colors" : "Colores disponibles";
  if (/piece-(?:28|29)-colors-photo\.webp$/.test(src)) return lang === "en" ? "Color reference photograph" : "Fotografía de referencia de colores";
  return null;
}
