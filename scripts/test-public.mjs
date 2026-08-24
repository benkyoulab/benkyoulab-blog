// E2E Fase 5 + preview Task 4.4. Jalankan: node --env-file=.env.local scripts/test-public.mjs
// ponytail: skrip sekali-pakai untuk verifikasi — hapus setelah fase stabil.
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const BASE = "http://localhost:3000";
const stamp = Date.now();
const pubSlug = `e2e-pub-${stamp}`;
const draftSlug = `e2e-draft-${stamp}`;

const [cat] = await sql`select id, slug, name from categories order by id limit 1`;
await sql`
  insert into posts (author_id, category_id, title, slug, excerpt, content_html, thumbnail_url, status, published_at)
  values
    (1, ${cat.id}, 'E2E Artikel Publik', ${pubSlug}, 'Cuplikan e2e', '<p>Konten uji <strong>e2e</strong> fase 5</p>', 'https://example.com/t.jpg', 'published', now()),
    (1, ${cat.id}, 'E2E Artikel Draft', ${draftSlug}, null, '<p>rahasia draft</p>', null, 'draft', null)
`;

let fails = 0;
const ok = (cond, label) => {
  console.log(cond ? `✅ ${label}` : `❌ ${label}`);
  if (!cond) fails++;
};

// 1. beranda memuat artikel published (cache key ?page=1 belum terisi ISR)
const home = await fetch(`${BASE}/?page=1`).then((r) => r.text());
ok(home.includes("E2E Artikel Publik"), "beranda menampilkan artikel published");

// 2. detail published
const det = await fetch(`${BASE}/artikel/${pubSlug}`);
const detBody = await det.text();
ok(det.status === 200, "detail /artikel/[slug] -> 200");
ok(detBody.includes("Konten uji"), "konten html dirender");
ok(detBody.includes(cat.name), "chip kategori tampil");

// 3. halaman kategori
const kat = await fetch(`${BASE}/kategori/${cat.slug}`).then((r) => r.text());
ok(kat.includes("E2E Artikel Publik"), "/kategori/[slug] memuat artikel");
const katIdx = await fetch(`${BASE}/kategori`).then((r) => r.text());
ok(katIdx.includes(cat.name), "/kategori indeks memuat kategori");

// 4. draft tersembunyi dari publik
const incognito = await fetch(`${BASE}/artikel/${draftSlug}`);
ok(incognito.status === 404, "draft -> 404 tanpa sesi (incognito)");

// 5. draft TERLIHAT lewat sesi login (preview Task 4.4)
const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
const { csrfToken } = await csrfRes.json();
const cookie1 = csrfRes.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
  method: "POST",
  redirect: "manual",
  headers: { "content-type": "application/x-www-form-urlencoded", cookie: cookie1 },
  body: new URLSearchParams({
    csrfToken,
    email: "admin@benkyoulab.online",
    password: process.env.E2E_ADMIN_PASSWORD ?? "",
  }),
});
const sessionCookie = loginRes.headers
  .getSetCookie()
  .map((c) => c.split(";")[0])
  .filter((c) => c.startsWith("authjs.session-token"))
  .join("; ");
ok(Boolean(sessionCookie), "login mendapat session token");
const previewRes = await fetch(`${BASE}/artikel/${draftSlug}`, {
  headers: { cookie: sessionCookie },
});
const prevBody = await previewRes.text();
ok(previewRes.status === 200 && prevBody.includes("DRAFT"), "draft -> 200 + badge DRAFT dengan sesi");

// 6. cleanup
await sql`delete from posts where slug in (${pubSlug}, ${draftSlug})`;
await sql.end();
console.log(fails === 0 ? "\nSEMUA TES LULUS" : `\n${fails} TES GAGAL`);
process.exit(fails === 0 ? 0 : 1);
