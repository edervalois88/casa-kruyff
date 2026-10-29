import { after, before, mock, test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq, like } from "drizzle-orm";
import { createSeedContent } from "../cms-seed";
import { getContent, getPublicContent, saveContent, validateContent } from "./cms-store";
import { db, useTestDatabase, type CmsDatabase } from "./cms-db";
import * as schema from "./schema";
import { checkOrigin, rateLimit } from "./auth";
import { CmsError, readBounded } from "./cms-error";
import { blobStorage, cancelUpload, inspectAsset, storeUpload, mediaResponse, storeChunk } from "./assets";

let postgres: PGlite;
let writes = 0;
const status = (code: number) => (error: unknown) => error instanceof CmsError && error.status === code;
before(async () => {
  Object.assign(process.env, { NODE_ENV: "test" });
  postgres = new PGlite();
  const isolated = drizzle(postgres, { schema });
  await migrate(isolated, { migrationsFolder: "./drizzle" });
  useTestDatabase(isolated as unknown as CmsDatabase);
  mock.method(blobStorage, "put", async (pathname: string) => {
    writes++;
    return { url: `https://test-store.public.blob.vercel-storage.com/${pathname}`, downloadUrl: "", pathname, contentType: "model/gltf-binary", contentDisposition: "attachment" };
  });
  mock.method(blobStorage, "del", async () => {});
});
after(async () => { useTestDatabase(undefined); await postgres.close(); mock.restoreAll(); });

test("Postgres migration, seed-once persistence, optimistic conflicts and draft filtering", async () => {
  const seed = createSeedContent();
  const initial = await getContent(); assert.equal(initial.pieces.length, seed.pieces.length); assert.equal(initial.revision, 0);
  initial.pieces[0].name = "Persistent edit"; initial.pieces[0].published = false;
  const saved = await saveContent(initial); assert.equal(saved.revision, 1);
  assert.equal((await getContent()).pieces[0].name, "Persistent edit");
  await assert.rejects(saveContent(initial), status(409));
  const published = await getPublicContent(); assert.equal(published.pieces.length, seed.pieces.filter(piece => piece.published).length - 1); assert.equal(published.images[initial.pieces[0].id], undefined);
  assert.equal((await getContent()).pieces.length, seed.pieces.length);
  const snapshots = [await getContent(), await getContent()];
  const results = await Promise.allSettled(snapshots.map(snapshot => saveContent(snapshot)));
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(results.filter(result => result.status === "rejected").length, 1);
});

test("whole-document validation rejects schema loss, duplicate IDs, bad references and executable URLs", () => {
  const changes = [
    (c: ReturnType<typeof createSeedContent>) => { c.pieces[1].id = c.pieces[0].id; },
    (c: ReturnType<typeof createSeedContent>) => { c.pieces[0].cat = "missing"; },
    (c: ReturnType<typeof createSeedContent>) => { c.pieces[0].images = ["javascript:alert(1)"]; },
    (c: ReturnType<typeof createSeedContent>) => { c.pieces[0].images = []; },
    (c: ReturnType<typeof createSeedContent>) => { c.pieces[0].model = { glb: "https://attacker.test/model.glb" }; },
    (c: ReturnType<typeof createSeedContent>) => { delete (c.copy.es as Partial<typeof c.copy.es>).navContact; },
  ];
  for (const change of changes) { const content = createSeedContent(); change(content); assert.throws(() => validateContent(content), status(400)); }
  assert.doesNotThrow(() => validateContent(createSeedContent()));
});

test("CSRF, authorization, shared atomic rate limiting and bounded request streams", async () => {
  const request = new Request("http://localhost/api/admin/content");
  assert.throws(() => checkOrigin(request), status(403));
  assert.throws(() => checkOrigin(new Request(request.url, { headers: { Origin: "https://attacker.test" } })), status(403));
  assert.doesNotThrow(() => checkOrigin(new Request(request.url, { headers: { Origin: "http://localhost" } })));
  await Promise.all(Array.from({ length: 20 }, () => rateLimit(request, "test")));
  await assert.rejects(rateLimit(request, "test"), status(429));
  await db().update(schema.rateLimits).set({ expires: 1 }).where(like(schema.rateLimits.key, "test:%"));
  await assert.doesNotReject(rateLimit(request, "test"));
  await assert.rejects(readBounded(new Request(request.url, { method: "POST", body: "123456" }), 5), status(413));
});

test("rate limits isolate client IPs while retaining the shared global ceiling", async () => {
  const first = new Request("https://example.test/api/admin/login", { headers: { "x-real-ip": "192.0.2.1" } });
  const second = new Request(first.url, { headers: { "x-real-ip": "192.0.2.2" } });
  for (let index = 0; index < 20; index++) await rateLimit(first, "isolated");
  await assert.rejects(rateLimit(first, "isolated"), status(429));
  await assert.doesNotReject(rateLimit(second, "isolated"));
  await db().update(schema.rateLimits).set({ count: 1000 }).where(eq(schema.rateLimits.key, "isolated:global"));
  await assert.rejects(rateLimit(second, "isolated"), status(429));
});

function glb(json: object) {
  const string = JSON.stringify(json), body = Buffer.from(string.padEnd(Math.ceil(Buffer.byteLength(string) / 4) * 4));
  const bytes = Buffer.alloc(20 + body.length); bytes.write("glTF"); bytes.writeUInt32LE(2, 4); bytes.writeUInt32LE(bytes.length, 8); bytes.writeUInt32LE(body.length, 12); bytes.writeUInt32LE(0x4e4f534a, 16); body.copy(bytes, 20); return bytes;
}
const validGlb = () => glb({ asset: { version: "2.0" }, scenes: [{}] });
function uploadRequest(bytes: Buffer) { const form = new FormData(); form.set("file", new File([new Uint8Array(bytes)], "../../model.glb")); return new Request("http://localhost/api/admin/assets", { method: "POST", body: form }); }

test("GLB checks reject truncation and external resources; SVG never uploads", async () => {
  assert.equal(inspectAsset(validGlb()).kind, "glb");
  assert.throws(() => inspectAsset(validGlb().subarray(0, -1)), status(400));
  assert.throws(() => inspectAsset(glb({ asset: { version: "2.0" }, images: [{ uri: "https://attacker.test/image" }] })), status(400));
  const previous = writes;
  await assert.rejects(storeUpload(uploadRequest(Buffer.from("<svg onload='alert(1)'></svg>"))), status(400));
  assert.equal(writes, previous);
});

test("only validated media enters Blob; model references require the registry; legacy media redirects", async () => {
  const saved = await storeUpload(uploadRequest(validGlb())); assert.equal(saved.kind, "glb"); assert.match(saved.filename, /^[a-f0-9-]{36}\.glb$/);
  assert.match(saved.url, /^https:\/\/test-store.public.blob.vercel-storage.com\/cms\//);
  const document = await getContent(); document.pieces[0].model = { glb: saved.url }; await saveContent(document);
  const response = await mediaResponse(saved.filename); assert.equal(response.status, 307); assert.equal(response.headers.get("location"), saved.url);
  assert.equal((await mediaResponse("../cms.sqlite")).status, 404);
  const unregistered = await getContent(); unregistered.pieces[0].model = { glb: "https://test-store.public.blob.vercel-storage.com/cms/00000000-0000-0000-0000-000000000000.glb" };
  await assert.rejects(saveContent(unregistered), status(400));
});

test("forged image headers fail actual decoding before any public Blob write", async () => {
  const forged = Buffer.alloc(45); Buffer.from([137,80,78,71,13,10,26,10]).copy(forged); forged.write("IHDR", 12); forged.writeUInt32BE(1, 16); forged.writeUInt32BE(1, 20); forged.write("IEND", 37);
  const previous = writes; await assert.rejects(storeUpload(uploadRequest(forged)), status(400)); assert.equal(writes, previous);
});

test("a database registration failure removes the newly uploaded Blob", async context => {
  const deleted = mock.method(blobStorage, "del", async () => {});
  context.mock.method(db(), "insert", () => { throw new Error("simulated database failure"); });
  await assert.rejects(storeUpload(uploadRequest(validGlb())), status(503));
  assert.equal(deleted.mock.calls.length, 1);
  deleted.mock.restore();
});

function chunkRequest(bytes: Buffer, index: number, uploadId?: string) {
  const form = new FormData(); form.set("file", new File([new Uint8Array(bytes)], "model.glb")); form.set("index", String(index)); form.set("total", "2"); if (uploadId) form.set("uploadId", uploadId);
  return new Request("http://localhost/api/admin/assets/chunks", { method: "POST", body: form });
}
test("chunk relay remains private until final validation and rejects replay/out-of-order parts", async () => {
  const bytes = validGlb(), split = Math.floor(bytes.length / 2), previous = writes;
  const first = await storeChunk(chunkRequest(bytes.subarray(0, split), 0)); assert.equal(first.complete, false); assert.equal(writes, previous);
  assert.ok("uploadId" in first);
  const final = await storeChunk(chunkRequest(bytes.subarray(split), 1, first.uploadId)); assert.equal(final.complete, true); assert.equal(writes, previous + 1);
  assert.equal((await db().select().from(schema.uploads)).length, 0);
  await assert.rejects(storeChunk(chunkRequest(bytes.subarray(split), 1, first.uploadId)), status(409));
  const bad = await storeChunk(chunkRequest(Buffer.from("<svg"), 0)); assert.ok("uploadId" in bad);
  await assert.rejects(storeChunk(chunkRequest(Buffer.from(" onload='alert(1)'></svg>"), 1, bad.uploadId)), status(400));
  assert.equal(writes, previous + 1); assert.equal((await db().select().from(schema.uploads)).length, 0);
});

test("cancelling an upload removes only that upload and is idempotent", async () => {
  const first = await storeChunk(chunkRequest(Buffer.from("first"), 0)); assert.ok("uploadId" in first);
  const second = await storeChunk(chunkRequest(Buffer.from("second"), 0)); assert.ok("uploadId" in second);
  await cancelUpload(first.uploadId); await cancelUpload(first.uploadId);
  const pending = await db().select().from(schema.uploads);
  assert.equal(pending.some(upload => upload.id === first.uploadId), false);
  assert.equal(pending.some(upload => upload.id === second.uploadId), true);
  await assert.rejects(cancelUpload("../invalid"), status(400));
  await cancelUpload(second.uploadId);
});

test("catalog refresh previews without writing, persists once and respects later CMS deletions", async () => {
  const old = createSeedContent();
  delete old.catalogVersion;
  old.pieces = old.pieces.filter(piece => /^piece-\d+$/.test(piece.id));
  old.cats = old.cats.filter(cat => !["acc", "holiday"].includes(cat[0]));
  old.revision = 90;
  await db().update(schema.content).set({ document: old, revision: old.revision }).where(eq(schema.content.id, 1));
  const environment = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = "preview";
    const preview = await getContent();
    assert.equal(preview.pieces.length, 78);
    const [unchanged] = await db().select().from(schema.content).where(eq(schema.content.id, 1));
    assert.equal(unchanged.revision, 90);
    assert.equal(unchanged.document.catalogVersion, undefined);
    process.env.VERCEL_ENV = "production";
    const migrated = await getContent();
    assert.equal(migrated.revision, 91);
    assert.equal(migrated.catalogVersion, 2);
    assert.equal((await getContent()).revision, 91);
    migrated.pieces = migrated.pieces.filter(piece => piece.id !== "accessory-01");
    await saveContent(migrated);
    assert.equal((await getContent()).pieces.some(piece => piece.id === "accessory-01"), false);
  } finally {
    if (environment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = environment;
  }
});
