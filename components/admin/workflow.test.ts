import assert from "node:assert/strict";
import { test } from "node:test";
import { createSeedContent } from "../../lib/cms-seed";
import { changedSections, filterPieces } from "./workflow";

test("catalog search ignores accents and combines collection, publication and model filters", () => {
  const seed = createSeedContent();
  const first = { ...seed.pieces[0], id: "first", name: "Lámpara", designer: "José", cat: "lighting", published: false, model: undefined };
  const second = { ...first, id: "second", published: true, model: { glb: "/lamp.glb" } };
  const third = { ...first, id: "third", cat: "objects" };
  const pieces = [first, second, third];
  assert.deepEqual(filterPieces(pieces, { query: " JOSE ", collection: "lighting", status: "draft", model: "pending" }).map(p => p.id), ["first"]);
  assert.deepEqual(filterPieces(pieces, { query: "lampara", collection: "", status: "published", model: "ready" }).map(p => p.id), ["second"]);
  assert.equal(filterPieces(pieces, { query: "missing", collection: "", status: "", model: "" }).length, 0);
  assert.equal(filterPieces([], { query: "", collection: "", status: "", model: "" }).length, 0);
});

test("publication review identifies all edited areas and ignores server revision metadata", () => {
  const saved = createSeedContent();
  const current = structuredClone(saved);
  current.revision++; current.updatedAt = "2026-10-24T12:00:00.000Z";
  assert.deepEqual(changedSections(current, saved), []);
  current.pieces[0].name = "Changed piece";
  current.heroes.home.credit = "Updated credit";
  current.settings.phone = "+1234567890";
  assert.deepEqual(changedSections(current, saved), ["Catálogo y modelos 3D/RA", "Imágenes", "Contacto y preferencias"]);
  assert.notEqual(current.pieces[0].name, saved.pieces[0].name);
});
