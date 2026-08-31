import { strict as assert } from "node:assert";
import { slugify, uniqueSlug } from "../src/lib/slug";
import { sanitizeHtml, htmlToText } from "../src/lib/sanitize";

async function main() {
  const slug = slugify("Cara Menghafal Kanji 漢字 dengan Mudah!");
  assert.equal(slug, "cara-menghafal-kanji-dengan-mudah");

  const exists = async (value: string) => value === "artikel-demo-2";
  const unique = await uniqueSlug("artikel-demo", exists);
  assert.equal(unique, "artikel-demo");

  const dirty = '<p>Halo <strong>bold</strong></p><script>alert(1)</script><img src="https://x.co/a.jpg" onerror="steal()"><a href="https://ok.co">link</a>';
  const clean = sanitizeHtml(dirty);
  assert.equal(clean.includes("<script"), false);
  assert.equal(clean.includes("onerror"), false);
  assert.equal(clean.includes("https://x.co/a.jpg"), true);

  const text = htmlToText('<p>Hello <strong>world</strong></p>');
  assert.equal(text.includes("Hello"), true);

  console.log("Production smoke tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
