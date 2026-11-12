import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createSeedContent } from "./cms-seed";
import { BASE_CATALOG_PIECES } from "./catalog-products";
import { applyCatalogRelease } from "./catalog-release";
import { validateContent } from "./server/cms-store";
import { SUPERHERO_PORTRAITS, ROVITHI_PLATES } from "./superhero-plates";

test("release 23 replaces only the two supplied photographs and adds an independent portrait", () => {
  const old = createSeedContent(); old.catalogVersion = 22;
  old.pieces = old.pieces.filter(piece => piece.id !== "superhero-classical-portrait");
  for (const id of ["superhero-batman", "superhero-wonder-woman"]) {
    const piece = old.pieces.find(piece => piece.id === id)!;
    piece.images = ["/images/previous.webp"];
    piece.availability = "sold";
  }
  const original = structuredClone(old.pieces.find(piece => piece.id === "piece-18"));
  const next = applyCatalogRelease(old);
  assert.deepEqual(next.pieces.find(piece => piece.id === "piece-18"), original);
  for (const id of ["superhero-batman", "superhero-wonder-woman"]) {
    const piece = next.pieces.find(piece => piece.id === id)!;
    assert.deepEqual(piece.images, [`/images/catalog/${id}-studio-v2.webp`]);
    assert.equal(piece.availability, "sold");
  }
  const added = next.pieces.find(piece => piece.id === "superhero-classical-portrait")!;
  assert.equal(added.nameEn, "Super Hero Collection");
  assert.equal(added.designer, "");
  assert.equal(added.dim, "No especificadas");
  assert.equal(added.published, true);
  assert.deepEqual(added.images, ["/images/catalog/superhero-portrait-studio-v2.webp"]);
  assert.equal(applyCatalogRelease(next), next);
  assert.doesNotThrow(() => validateContent(next));
});

test("release 22 removes character names from public portrait copy while retaining confirmed facts and media", () => {
  const old = createSeedContent(); old.catalogVersion = 21;
  const portrait = old.pieces.find(piece => piece.id === "superhero-hulk")!;
  portrait.description = ["Batman", "Batman"];
  portrait.images = ["/images/custom.webp"];
  const next = applyCatalogRelease(old);
  for (const source of SUPERHERO_PORTRAITS) {
    const piece = next.pieces.find(piece => piece.id === source.id)!;
    assert.doesNotMatch([piece.name, piece.nameEn, ...piece.description].join(" "), /batman|wonder woman|hulk|superman/i);
    assert.equal(piece.designer, source.designer);
    assert.equal(piece.dim, source.dim);
  }
  assert.deepEqual(next.pieces.find(piece => piece.id === portrait.id)!.images, portrait.images);
  assert.equal(applyCatalogRelease(next), next);
});

test("release 21 changes only the four Super Hero Collection titles", () => {
  const old = createSeedContent(); old.catalogVersion = 20;
  const superman = old.pieces.find(piece => piece.id === "piece-18")!;
  superman.name = "Super Hero Collection — Superman abuelo";
  superman.nameEn = "Super Hero Collection — Elder Superman";
  const target = old.pieces.find(piece => piece.id === "superhero-hulk")!;
  target.name = "Super Hero Collection — Batman";
  target.nameEn = target.name;
  target.images = ["/images/custom.webp"];
  const next = applyCatalogRelease(old);
  const updated = next.pieces.find(piece => piece.id === target.id)!;
  assert.deepEqual(updated, { ...target, name: "Super Hero Collection", nameEn: "Super Hero Collection" });
  assert.deepEqual(next.pieces.find(piece => piece.id === "piece-18"), { ...old.pieces.find(piece => piece.id === "piece-18"), name: "Super Hero Collection", nameEn: "Super Hero Collection" });
  for (const id of ["superhero-wonder-woman", "superhero-hulk"]) {
    assert.equal(next.pieces.find(piece => piece.id === id)!.nameEn, "Super Hero Collection");
  }
  assert.equal(applyCatalogRelease(next), next);
});

test("release 20 publishes supplied art without assigning the unknown artists or Superman dimensions to other portraits", () => {
  const old = createSeedContent(); old.catalogVersion = 19;
  const newIds = new Set([...SUPERHERO_PORTRAITS, ...ROVITHI_PLATES].map(piece => piece.id));
  old.pieces = old.pieces.filter(piece => !newIds.has(piece.id) || piece.id === "piece-18");
  const original = old.pieces.find(piece => piece.id === "piece-18")!;
  original.published = false; original.images = []; original.availability = "sold";
  const next = applyCatalogRelease(old);
  const superman = next.pieces.find(piece => piece.id === "piece-18")!;
  assert.equal(superman.designer, "Carlos Gunter");
  assert.equal(superman.dim, "101.6 × 152.4 cm");
  assert.equal(superman.published, true);
  assert.equal(superman.availability, "sold");
  for (const source of SUPERHERO_PORTRAITS.slice(1, 4)) {
    const piece = next.pieces.find(piece => piece.id === source.id)!;
    assert.equal(piece.designer, "");
    assert.equal(piece.origin, "San Miguel de Allende, México");
    assert.equal(piece.dim, "Print only: 75 × 53.5 cm; framed art: 82 × 61 cm");
  }
  const commissioned = next.pieces.find(piece => piece.id === "rovithi-made-to-order-plate")!;
  assert.equal(commissioned.nameEn, "Made to Order Plate");
  assert.match(commissioned.description[1], /custom plate/);
  assert.equal(next.pieces.filter(piece => newIds.has(piece.id)).length, 9);
  assert.doesNotThrow(() => validateContent(next));
  assert.equal(applyCatalogRelease(next), next);
});

function previousCatalog() {
  const old = createSeedContent();
  delete old.catalogVersion;
  old.pieces = BASE_CATALOG_PIECES.filter(piece => /^piece-\d+$/.test(piece.id)).map(piece => ({ ...structuredClone(piece), nameEn: piece.nameEn ?? piece.name, description: piece.description ?? ["", ""], images: piece.images ?? [], published: Boolean(piece.images?.length), availability: "on-request" }));
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
  assert.equal(next.pieces.length, 94);
  assert.equal(next.pieces[0].name, "An authored name");
  assert.equal(next.pieces[0].availability, "sold");
  assert.equal(next.heroes.home.src, "/images/custom.webp");
  assert.deepEqual(next.pieces.find(p => p.id === "piece-23")!.images, ["/images/catalog/piece-23-01.webp"]);
  assert.deepEqual(next.pieces.find(p => p.id === "headdress-floral")!.images, ["/images/catalog/piece-23-02.webp"]);
  assert.equal(next.pieces.filter(p => p.cat === "acc").length, 20);
  assert.equal(next.pieces.filter(p => p.cat === "holiday").length, 4);
  assert.equal(next.pieces.filter(p => p.designer === "Caroline Rovithi").length, 11);
  assert.equal(next.pieces.find(p => p.id === "piece-29")!.published, true);
  assert.equal(next.pieces.find(p => p.id === "piece-31")!.published, true);
  assert.doesNotThrow(() => validateContent(next));
});

test("release marker preserves later deletions and custom photographs without repeating imports", () => {
  const old = previousCatalog();
  const bear = old.pieces.find(p => p.id === "piece-27")!;
  bear.images = ["/images/custom.webp"]; bear.published = false;
  const next = applyCatalogRelease(old);
  assert.ok(next.pieces.find(p => p.id === "piece-27")!.images.includes("/images/custom.webp"));
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

test("version 8 withdraws the turtle without deleting its data or recreating a removed entry", () => {
  const old = createSeedContent();
  old.catalogVersion = 7;
  const turtle = old.pieces.find(piece => piece.id === "decorative-turtle")!;
  turtle.published = true;
  const next = applyCatalogRelease(old);
  assert.deepEqual(next.pieces.find(piece => piece.id === turtle.id), { ...turtle, published: false });
  assert.equal(old.pieces.find(piece => piece.id === turtle.id)!.published, true);
  assert.equal(applyCatalogRelease(next), next);
  old.pieces = old.pieces.filter(piece => piece.id !== turtle.id);
  assert.equal(applyCatalogRelease(old).pieces.some(piece => piece.id === turtle.id), false);
});


test("version 9 updates confirmed ORRA bags without changing media or unrelated entries", () => {
  const old = createSeedContent();
  old.catalogVersion = 8;
  const bag = old.pieces.find(piece => piece.id === "accessory-01")!;
  bag.name = "Old bag";
  bag.dim = "No especificadas";
  bag.images = ["/images/custom-bag.webp"];
  bag.published = false;
  bag.availability = "sold";
  const unrelated = old.pieces.find(piece => piece.id === "accessory-03")!;
  const next = applyCatalogRelease(old);
  const updated = next.pieces.find(piece => piece.id === bag.id)!;
  assert.equal(updated.nameEn, "Anastilosis Bag");
  assert.match(updated.dim, /H 21/);
  assert.deepEqual(updated.images, bag.images);
  assert.equal(updated.published, false);
  assert.equal(updated.availability, "sold");
  assert.deepEqual(next.pieces.find(piece => piece.id === unrelated.id), unrelated);
  assert.equal(next.pieces.filter(piece => piece.designer === "ORRA").length, 16);
  for (const id of ["accessory-05", "accessory-19"]) {
    assert.match(next.pieces.find(piece => piece.id === id)!.dim, /^H 39/);
  }
  updated.dim = "Custom measurement";
  assert.equal(applyCatalogRelease(next), next);
});

test("version 10 separates the multicolor bear and leads with the orange lollipop", () => {
  const old = createSeedContent();
  old.catalogVersion = 9;
  old.pieces = old.pieces.filter(piece => piece.id !== "bear-multicolor");
  const bear = old.pieces.find(piece => piece.id === "piece-27")!;
  bear.images.push("/images/catalog/bear-multicolor-01.webp");
  const next = applyCatalogRelease(old);
  const standalone = next.pieces.find(piece => piece.id === "bear-multicolor")!;
  assert.equal(standalone.published, true);
  assert.equal(standalone.dim, "No especificadas");
  assert.equal(standalone.nameEn, "Multicolored Gummy Bear");
  assert.ok(!next.pieces.find(piece => piece.id === bear.id)!.images.includes(standalone.images[0]));
  assert.equal(next.pieces.find(piece => piece.id === "piece-29")!.images[0], "/images/catalog/piece-29-color-orange.webp");
  assert.equal(next.pieces.filter(piece => piece.id === standalone.id).length, 1);
  assert.deepEqual(next.pieces.find(piece => piece.id === "cynthia-padilla-frida")!.images, [
    "/images/catalog/cynthia-padilla-frida-01.webp",
    "/images/catalog/cynthia-padilla-frida-detail-left.webp",
    "/images/catalog/cynthia-padilla-frida-detail-right.webp",
  ]);
  assert.equal(applyCatalogRelease(next), next);
});

test("holiday release imports only studio images and moves Sandra necklaces to the end", () => {
  const old = createSeedContent(); old.catalogVersion = 10;
  old.pieces = old.pieces.filter(piece => piece.cat !== "holiday");
  const next = applyCatalogRelease(old);
  const holiday = next.pieces.filter(piece => piece.cat === "holiday");
  assert.equal(holiday.length, 4);
  assert.ok(holiday.every(piece => piece.published && piece.images.length >= 1 && piece.images[0].includes("/holiday-")));
  assert.deepEqual(next.pieces.slice(-2).map(piece => piece.id), ["accessory-14", "accessory-15"]);
  for (const piece of next.pieces.slice(-2)) {
    assert.equal(piece.designer, "Sandra Roldán");
    assert.equal(piece.origin, "Antioquia, Colombia");
    assert.match(piece.description[1], /knot-based weaving/);
  }
  assert.equal(applyCatalogRelease(next), next);
});

test("release 12 updates four identified ORRA bags without replacing photographs", () => {
  const old = createSeedContent(); old.catalogVersion = 11;
  const ids = ["accessory-04", "accessory-07", "accessory-09", "accessory-18"];
  for (const id of ids) old.pieces.find(p => p.id === id)!.dim = "No especificadas";
  const next = applyCatalogRelease(old);
  for (const id of ids) {
    const piece = next.pieces.find(p => p.id === id)!;
    assert.equal(piece.designer, "ORRA");
    assert.ok(piece.dim.startsWith("H "));
    assert.deepEqual(piece.images, old.pieces.find(p => p.id === id)!.images);
  }
  assert.match(next.pieces.find(p => p.id === "accessory-18")!.dim, /^H 39/);
  assert.deepEqual(next.pieces.slice(-2).map(p => p.id), ["accessory-14", "accessory-15"]);
  assert.equal(applyCatalogRelease(next), next);
});

test("release 13 identifies leather bags and places multicolor after the other bears", () => {
  const old = createSeedContent(); old.catalogVersion = 12;
  const next = applyCatalogRelease(old);
  const i = next.pieces.findIndex(piece => piece.id === "piece-27");
  assert.equal(next.pieces[i+1].id, "bear-multicolor");
  assert.equal(next.pieces.find(p => p.id === "accessory-06")!.nameEn, "Marigold Leather Bag");
  const black = next.pieces.find(p => p.id === "accessory-03")!;
  assert.equal(black.mat[1], "Smooth black leather; cotton lining");
  assert.equal(black.dim, "H 21 × W 35 × D 14 cm; handle drop 16 cm; strap drop 145 cm");
  assert.equal(applyCatalogRelease(next), next);
});

test("release 14 groups nutcracker colors and applies confirmed materials", () => {
  const old = createSeedContent(); old.catalogVersion = 13;
  const base = old.pieces.find(p => p.id === "holiday-nutcracker-gold")!;
  for (const id of ["holiday-nutcracker-red", "holiday-nutcracker-ivory", "holiday-nutcracker-metallic-red"]) old.pieces.push({ ...structuredClone(base), id });
  const next = applyCatalogRelease(old);
  assert.equal(next.pieces.filter(p => p.cat === "holiday").length, 4);
  assert.equal(next.pieces.find(p => p.id === "holiday-nutcracker-gold")!.images.length, 3);
  assert.equal(next.pieces.find(p => p.id === "holiday-nutcracker-antique-gold")!.images.length, 3);
  for (const piece of next.pieces.filter(p => p.cat === "holiday" && p.id !== "holiday-rocking-horse")) assert.equal(piece.mat[1], "Fiberglass");
  const horse = next.pieces.find(p => p.id === "holiday-rocking-horse")!;
  assert.equal(horse.mat[1], "Hand-carved mango wood");
  assert.match(horse.description[1], /not a toy/);
  assert.equal(applyCatalogRelease(next), next);
});

test("release 19 consolidates crowned gold into the trio gallery without duplicates", () => {
  const old = createSeedContent(); old.catalogVersion = 18;
  const trio = old.pieces.find(p => p.id === "holiday-white-nutcracker-trio")!;
  trio.images = [trio.images[0]];
  old.pieces.push({ ...structuredClone(trio), id: "holiday-crowned-gold" });
  const next = applyCatalogRelease(old);
  assert.equal(next.pieces.some(p => p.id === "holiday-crowned-gold"), false);
  const photos = next.pieces.find(p => p.id === trio.id)!.images;
  assert.equal(photos.length, 4);
  assert.equal(new Set(photos).size, 4);
  assert.ok(photos.includes("/images/catalog/holiday-gold-ivory-pair-01.webp"));
  assert.equal(applyCatalogRelease(next), next);
});
