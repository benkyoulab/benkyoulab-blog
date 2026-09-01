import { test } from "node:test";
import assert from "node:assert/strict";

import { getCacheInvalidationPaths } from "@/lib/cache-refresh";

test("article mutation invalidates the public article and listing pages", () => {
  const paths = getCacheInvalidationPaths({ slug: "new-post", categorySlug: "kanji" });

  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/kategori"));
  assert.ok(paths.includes("/artikel/new-post"));
  assert.ok(paths.includes("/kategori/kanji"));
});

test("category mutation invalidates all public category pages and the category index", () => {
  const paths = getCacheInvalidationPaths({ categorySlug: "kanji" });

  assert.ok(paths.includes("/kategori"));
  assert.ok(paths.includes("/kategori/kanji"));
  assert.ok(paths.includes("/kategori/tips-belajar"));
});
