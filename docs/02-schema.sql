-- ============================================================
-- Benkyou Lab Blog — Skema Database (PostgreSQL / Supabase)
-- Cara pakai:
--   Opsi A : npx drizzle-kit push   (dari skema Drizzle, cara normal)
--   Opsi B : tempel seluruh file ini ke Supabase SQL Editor (dashboard → SQL Editor)
-- File ini adalah sumber kebenaran struktur data.
-- ============================================================

-- ENUM types -------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'writer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- USERS ------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          user_role     NOT NULL DEFAULT 'writer',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- CATEGORIES ---------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(300),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO categories (name, slug, description) VALUES
  ('Kosakata',      'kosakata',      'Perbendaharaan kata dan cara menghafalnya'),
  ('Kanji',         'kanji',         'Cara baca, arti, dan tips menghafal kanji'),
  ('Tata Bahasa',   'tata-bahasa',   'Pola kalimat dan grammar N5-N3'),
  ('Tips Belajar',  'tips-belajar',  'Strategi, jadwal, dan pengalaman belajar'),
  ('Berita Jepang', 'berita-jepang', 'Kabar dan perkembangan terbaru dari Jepang'),
  ('JLPT & Tes',    'jlpt-tes',      'Informasi seputar JLPT, tes bahasa, dan persiapannya'),
  ('MEXT & Beasiswa','mext-beasiswa', 'Panduan pendidikan, beasiswa, dan peluang studi ke Jepang'),
  ('Budaya Jepang', 'budaya-jepang', 'Budaya, kebiasaan, dan kehidupan sehari-hari di Jepang')
ON CONFLICT (slug) DO NOTHING;

-- POSTS --------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  author_id     INTEGER      NOT NULL REFERENCES users(id),
  category_id   INTEGER      REFERENCES categories(id) ON DELETE SET NULL,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(250) NOT NULL UNIQUE,
  excerpt       VARCHAR(320),
  content_html  TEXT         NOT NULL,           -- hasil render editor, tersanitasi
  content_text  TEXT         NOT NULL DEFAULT '',-- plain text utk pencarian/cadangan excerpt
  thumbnail_url TEXT,                            -- URL eksternal, https://...
  status        post_status  NOT NULL DEFAULT 'draft',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT chk_thumbnail_https CHECK (thumbnail_url IS NULL OR thumbnail_url LIKE 'https://%')
);

CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category         ON posts (category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author           ON posts (author_id);

-- Updated_at otomatis ------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at      ON users;
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trg_posts_updated_at      ON posts;

CREATE TRIGGER trg_users_updated_at      BEFORE UPDATE ON users      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated_at      BEFORE UPDATE ON posts      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Catatan desain
-- - ON DELETE SET NULL untuk kategori: hapus kategori tidak menghapus post,
--   post jadi "tanpa kategori" (ditampilkan tanpa chip di UI).
-- - content_html disimpan sudah tersanitasi (server-side) supaya render
--   aman tanpa sanitasi ulang per-request.
-- - thumbnail_url TEXT (bukan VARCHAR) karena URL eksternal bisa panjang.
-- ============================================================
