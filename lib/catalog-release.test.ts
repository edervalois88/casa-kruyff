import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createSeedContent } from "./cms-seed";
import { applyCatalogRelease } from "./catalog-release";
import { validateContent } from "./server/cms-store";

function previousCatalog() {
  const old = createSeedContent();
  delete old.catalogVersion;
  old.pieces = old.pieces.filter(piece => /^piece-\d+$/.test(piece.id));
  old.cats = old.cats.filter(cat => !["acc", "holiday"].includes(cat[0]));
  old.designers = old.designers.filter(designer => designer.name !== "Caroline Rovithi");
  old.pieces.find(piece => piece.id === "piece-23")!.images.push("/images/catalog/piece-23-02.webp");
  for (const id of ["piece-29", "piece-31"]) {
    const piece = old.pieces.find(piece => piece.id === id)!;
    piece.images = []; piece.published = false;
  }
  return old;
}

test("release separates headdresses, publishes missing photographs and keeps authored content", () => {
  const old = previousCatalog();
  old.pieces[0].name = "An authored name";
  old.pieces[0].availability = "sold";
  old.heroes.home.src = "/images/custom.webp";
  const next = applyCatalogRelease(old);
  assert.equal(old.pieces.length, 40);
  assert.equal(next.pieces.length, 69);
  assert.equal(next.pieces[0].name, "An authored name");
  assert.equal(next.pieces[0].availability, "sold");
  assert.equal(next.heroes.home.src, "/images/custom.webp");
  assert.deepEqual(next.pieces.find(p => p.id === "piece-23")!.images, ["/images/catalog/piece-23-01.webp"]);
  assert.deepEqual(next.pieces.find(p => p.id === "headdress-floral")!.images, ["/images/catalog/piece-23-02.webp"]);
  assert.equal(next.pieces.filter(p => p.cat === "acc").length, 19);
  assert.equal(next.pieces.filter(p => p.cat === "holiday").length, 0);
  assert.equal(next.pieces.filter(p => p.designer === "Caroline Rovithi").length, 7);
  assert.equal(next.pieces.find(p => p.id === "piece-29")!.published, true);
  assert.equal(next.pieces.find(p => p.id === "piece-31")!.published, true);
  assert.doesNotThrow(() => validateContent(next));
});

test("release marker preserves later deletions and custom photographs without repeating imports", () => {
  const old = previousCatalog();
  const bear = old.pieces.find(p => p.id === "piece-27")!;
  bear.images = ["/images/custom.webp"]; bear.published = false;
  const next = applyCatalogRelease(old);
  assert.equal(next.pieces.find(p => p.id === "piece-27")!.images[0], "/images/custom.webp");
  assert.equal(next.pieces.find(p => p.id === "piece-27")!.published, false);
  next.pieces = next.pieces.filter(p => p.id !== "accessory-01");
  assert.equal(applyCatalogRelease(next), next);
  assert.equal(next.pieces.some(p => p.id === "accessory-01"), false);
});

test("every seeded published photograph exists and products have unique identities", () => {
  const seed = createSeedContent();
  assert.equal(new Set(seed.pieces.map(p => p.id)).size, seed.pieces.length);
  for (const piece of seed.pieces.filter(p => p.published)) {
    assert.ok(piece.images.length, piece.id);
    for (const src of piece.images) assert.ok(existsSync(`public${src}`), `${piece.id}: ${src}`);
  }
});
