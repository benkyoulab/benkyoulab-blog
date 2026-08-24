import postgres from "postgres";
import { slugify, uniqueSlug } from "../src/lib/slug";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const exists = async (s: string) => {
    const r = await sql`select 1 from posts where slug = ${s}`;
    return r.length > 0;
  };

  // 1. slugify buang karakter non-latin
  const s = slugify("Cara Menghafal Kanji 漢字 dengan Mudah!");
  console.log("slugify:", s);
  if (s !== "cara-menghafal-kanji-dengan-mudah") {
    console.error("GAGAL: slugify salah");
    process.exit(1);
  }

  // 2. uniqueSlug: pertama polos, kedua dapat -2 (simulasi insert nyata)
  const base = "test-slug-check";
  const a = await uniqueSlug(base, exists);
  await sql`insert into posts (author_id, title, slug, content_html) values (1, 't', ${a}, '<p>x</p>')`;
  const b = await uniqueSlug(base, exists);
  if (a !== base || b !== `${base}-2`) {
    console.error(`GAGAL: dapat "${a}", "${b}"`);
    process.exit(1);
  }
  console.log("uniqueSlug:", a, "→", b);

  // cleanup
  await sql`delete from posts where slug like ${base + "%"}`;
  await sql.end();
  console.log("OK: slug logic benar");
}

main();
