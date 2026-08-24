import sanitizeHtmlLib from "sanitize-html";

// Whitelist tag/attr sesuai output Tiptap (StarterKit v3 + Link + Image).
// ponytail: pakai sanitize-html (bukan dompurify) karena jsdom bikin Turbopack
// di Windows panic saat bikin junction — upgrade path: kembali ke DOMPurify bila pindah CI/linux.
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "s", "code", "pre",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote",
  "a", "img",
];

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https"],
  });
}

export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
