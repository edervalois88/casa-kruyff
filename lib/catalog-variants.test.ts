import test from "node:test";
import assert from "node:assert/strict";
import { BASE_CATALOG_PIECES, CATALOG_PIECES } from "./catalog-products";
import { PRODUCT_SPLITS } from "./catalog-variants";
import { catalogPhotoLabel } from "./catalog-photo-label";
import { createSeedContent } from "./cms-seed";
import { applyCatalogRelease } from "./catalog-release";

test("each model has its own photographs and retains the original description", () => {
  for (const [parent, variants] of Object.entries(PRODUCT_SPLITS)) {
    const original = BASE_CATALOG_PIECES.find(p => p.id === parent)!;
    for (const variant of variants) {
      const piece = CATALOG_PIECES.find(p => p.id === variant.id)!;
      assert.equal(piece.description?.[1], `${original.description?.[1]}\n\nVariant: ${variant.en}.`);
      assert.ok(piece.nameEn?.endsWith(variant.en));
      assert.deepEqual(piece.images, variant.photos.map(n => `/images/catalog/${parent}-${String(n).padStart(2,"0")}.webp`));
    }
  }
  assert.ok(CATALOG_PIECES.find(p => p.id === "piece-24")?.images?.includes("/images/catalog/piece-24-04.webp"));
});

test("resin families remain one product each, including all color references", () => {
  assert.equal(CATALOG_PIECES.some(p => p.id === "bear-multicolor"), false);
  for (const id of ["piece-27", "piece-28", "piece-29"]) {
    assert.equal(CATALOG_PIECES.filter(p => p.id.startsWith(id)).length, 1);
    const images=CATALOG_PIECES.find(p => p.id === id)!.images!;
    assert.ok(images.length <= 20);
    assert.ok(images.some(src => src.includes("-color-black")));
    assert.ok(images.some(src => src.includes("-color-white")));
  }
  assert.ok(CATALOG_PIECES.find(p => p.id === "piece-27")!.images!.includes("/images/catalog/bear-multicolor-01.webp"));
});

test("artist attribution remains while the title prefix is removed", () => {
  const pieces=CATALOG_PIECES.filter(p => p.designer === "Bord de l’Eau");
  assert.ok(pieces.length > 0);
  for (const piece of pieces) assert.ok(!piece.nameEn?.startsWith("Bord de l’Eau"));
});

test("version two migrates existing content only once and labels generated images", () => {
  const old=createSeedContent();
  old.pieces=BASE_CATALOG_PIECES.map(p=>({...structuredClone(p),nameEn:p.nameEn??p.name,description:p.description??["", ""],images:p.images??[],published:true,availability:"on-request"}));
  old.catalogVersion=1;
  const next=applyCatalogRelease(old);
  assert.equal(next.pieces.length,78);
  assert.equal(applyCatalogRelease(next),next);
  assert.equal(catalogPhotoLabel("/images/catalog/piece-29-color-gold.webp","en"),"Color visualization — Gold finish");
  assert.equal(catalogPhotoLabel("/images/catalog/piece-29-olive.webp","en"),null);
});

