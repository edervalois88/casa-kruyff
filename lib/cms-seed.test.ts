import test from "node:test";
import assert from "node:assert/strict";
import { createSeedContent, withCopyDefaults } from "./cms-seed";
import { validateContent } from "./server/cms-store";

test("existing CMS documents gain new interior copy without replacing authored text", () => {
  const stored = createSeedContent();
  stored.revision = 7;
  stored.copy.en.interiorTitle = "An edited introduction";
  stored.copy.es.interiorPageTitle = "Un título editado";
  delete (stored.copy.en as Partial<typeof stored.copy.en>).interiorPageTitle;
  delete (stored.copy.en as Partial<typeof stored.copy.en>).interiorPageBody;

  const content = withCopyDefaults(stored);
  assert.equal(content.copy.en.interiorPageTitle, "Spaces that feel distinctly yours");
  assert.match(content.copy.en.interiorPageBody, /^We create thoughtfully composed interiors/);
  assert.equal(content.copy.en.interiorTitle, "An edited introduction");
  assert.equal(content.copy.es.interiorPageTitle, "Un título editado");
  assert.equal(content.revision, 7);
  assert.equal("interiorPageTitle" in stored.copy.en, false);
  assert.doesNotThrow(() => validateContent(content));
});

test("catalog image folders validate while traversal and executable image URLs remain rejected", () => {
  const content = createSeedContent();
  assert.doesNotThrow(() => validateContent(content));
  for (const src of ["/images/catalog/../../private.png", "/images/%2e%2e/private.png", "javascript:alert(1)"]) {
    const invalid = structuredClone(content);
    invalid.pieces[0].images = [src];
    assert.throws(() => validateContent(invalid));
  }
});
