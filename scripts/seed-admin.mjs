// Seed admin pertama. Jalankan: node --env-file=.env.local scripts/seed-admin.mjs
// ponytail: kredensial hardcoded utk bootstrap — ganti password setelah login pertama,
// upgrade path: pindah ke arg CLI/env kalau sudah ada >1 admin.
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const email = "admin@benkyoulab.online";
const password = "BenkyouLab2026!";
const hash = await bcrypt.hash(password, 10);

await sql`
  INSERT INTO users (name, email, password_hash, role)
  VALUES ('Admin', ${email}, ${hash}, 'admin')
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'
`;

const [row] = await sql`select id, name, email, role from users where email = ${email}`;
console.log("✅ admin siap:", JSON.stringify(row));
await sql.end();
