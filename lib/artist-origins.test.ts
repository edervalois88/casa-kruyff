import test from "node:test";
import assert from "node:assert/strict";
import { createSeedContent } from "./cms-seed";
import { applyCatalogRelease } from "./catalog-release";
import { catalogText } from "./catalog-language";

test("confirmed countries appear in the directory and matching product attribution", () => {
  const seed=createSeedContent();
  const expected: Record<string,string>={"Galatiss Art Gallery":"Grecia","Caroline Rovithi":"Grecia","Bord de l’Eau":"Grecia","Carlos Gunther Maier · House Armida":"México","Sandra Roldán":"Colombia"};
  for (const [name,origin] of Object.entries(expected)) assert.equal(seed.designers.find(d=>d.name===name)?.origin,origin);
  assert.equal(seed.pieces.find(p=>p.designer==="Carlos Gunther Maier para House Armida")?.origin,"México");
  assert.equal(catalogText("Grecia","en"),"Greece");
});

test("country migration never repeats model splits or restores a deleted product", () => {
  const old=createSeedContent();old.catalogVersion=2;
  old.pieces=old.pieces.filter(p=>p.id!=="piece-09-coyote");
  old.designers=old.designers.filter(d=>d.name!=="Sandra Roldán");
  old.designers.find(d=>d.name==="Caroline Rovithi")!.origin="No especificado";
  old.pieces.find(p=>p.id==="piece-32")!.origin="No especificado";
  const before=old.pieces.map(p=>({id:p.id,name:p.name,description:p.description}));
  const next=applyCatalogRelease(old);
  assert.deepEqual(next.pieces.map(p=>({id:p.id,name:p.name,description:p.description})),before);
  assert.equal(next.pieces.find(p=>p.id==="piece-32")!.origin,"Grecia");
  assert.equal(next.designers.find(d=>d.name==="Sandra Roldán")!.origin,"Colombia");
  assert.equal(applyCatalogRelease(next),next);
});
