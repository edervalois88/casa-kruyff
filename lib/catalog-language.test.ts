import test from "node:test";
import assert from "node:assert/strict";
import { catalogText, catalogDimensions } from "./catalog-language";
import { PIECES } from "./site-data";

test("English catalog metadata has no untranslated shared Spanish labels", () => {
  for (const piece of PIECES) {
    for (const text of [catalogText(piece.designer, "en"), catalogText(piece.origin, "en"), catalogDimensions(piece.dim, "en")]) {
      assert.doesNotMatch(text, /No especificad|Artesanos|Artistas|Alfareros|Hecho sobre pedido|\b(chica|chico|mediana|mediano|grande|de alto)\b/, piece.id);
    }
  }
});

test("Spanish values and proper artist names remain intact", () => {
  for (const text of ["Caroline Rovithi", "Bord de l’Eau", "Galatiss Art Gallery", "Casa Grande Studio"]) assert.equal(catalogText(text, "en"), text);
  assert.equal(catalogText("Artesanos mexicanos", "es"), "Artesanos mexicanos");
  assert.equal(catalogDimensions("24 cm de alto", "es"), "24 cm de alto");
  assert.equal(catalogDimensions("Chico: 35 × 35 × 160 cm; mediano: 35 × 35 × 170 cm", "en"), "Small: 35 × 35 × 160 cm; Medium: 35 × 35 × 170 cm");
});
