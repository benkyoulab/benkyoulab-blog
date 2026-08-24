import { sanitizeHtml, htmlToText } from "../src/lib/sanitize";

const dirty =
  '<p>Halo <strong>bold</strong></p><script>alert(1)</script><img src="https://x.co/a.jpg" onerror="steal()"><a href="https://ok.co">link</a>';
const clean = sanitizeHtml(dirty);
console.log("SANITIZED:", clean);

if (clean.includes("<script") || clean.includes("onerror")) {
  console.error("GAGAL: tag berbahaya lolos");
  process.exit(1);
}
if (!clean.includes('<img src="https://x.co/a.jpg"')) {
  console.error("GAGAL: img valid hilang");
  process.exit(1);
}
console.log("htmlToText:", htmlToText(clean));
console.log("OK: sanitizer aman");
