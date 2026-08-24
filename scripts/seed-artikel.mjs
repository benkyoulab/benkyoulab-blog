// Seed artikel contoh. Jalankan: node --env-file=.env.local scripts/seed-artikel.mjs
// Aman dijalankan berulang — ON CONFLICT (slug) DO NOTHING.
// ponytail: konten starter manual di skrip — upgrade path: pindah ke MDX/file JSON kalau konten makin banyak.
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const [admin] = await sql`select id from users where role = 'admin' order by id limit 1`;
if (!admin) {
  console.error("❌ Tidak ada user admin — jalankan scripts/seed-admin.mjs dulu.");
  process.exit(1);
}

const kategori = Object.fromEntries(
  (await sql`select id, slug from categories`).map((c) => [c.slug, c.id])
);

const img = (seed) => `https://picsum.photos/seed/${seed}/800/450`;

const posts = [
  {
    slug: "kanji-dasar-untuk-pemula",
    categorySlug: "kanji",
    title: "7 Kanji Dasar yang Wajib Dikuasai Pemula",
    excerpt:
      "Mulai dari angka dan hari — tujuh kanji ini adalah fondasi untuk membaca kalimat Jepang sehari-hari.",
    thumbnail: img("benkyou-kanji"),
    daysAgo: 28,
    html: `<p>Belajar kanji sering bikin gentar, tapi tidak semua kanji sulit. Tujuh kanji berikut muncul di mana-mana: jadwal kereta, harga di konbini, sampai kalender.</p>
<h2>一 二 三 — Angka 1 sampai 3</h2>
<p>Kanji angka adalah pintu masuk terbaik karena bentuknya logis: satu garis (一), dua garis (二), tiga garis (三).</p>
<ul>
<li><strong>一</strong> (ichi) — satu</li>
<li><strong>二</strong> (ni) — dua</li>
<li><strong>三</strong> (san) — tiga</li>
</ul>
<h2>日 月 — Hari dan bulan</h2>
<p><strong>日</strong> (nichi) artinya matahari/hari, sedangkan <strong>月</strong> (getsu) artinya bulan. Gabungan keduanya, 日曜日, adalah hari Minggu.</p>
<blockquote>Kombinasi sederhana seperti inilah yang membuat kanji terasa seperti LEGO: satu batu bata, banyak susunan.</blockquote>
<h2>人 時 間 — Orang, waktu, dan jam</h2>
<p><strong>人</strong> (hito/jin) berarti orang — lihat 日本人 (orang Jepang). Sementara <strong>時間</strong> (jikan) berarti waktu, dan dipakai untuk menyatakan jam: 三時 (jam tiga).</p>
<p>Kuasai ketujuh kanji ini, lalu lanjut ke kanji lokasi seperti 上 dan 下. Konsisten lima kanji per hari lebih baik daripada lima puluh sekali sebulan.</p>`,
  },
  {
    slug: "cara-menghafal-kanji-metode-radikal",
    categorySlug: "kanji",
    title: "Cara Menghafal Kanji dengan Metode Radikal",
    excerpt:
      "Berhenti menghafal goresan satu per satu. Pecah kanji menjadi radikal, dan hafalan jadi jauh lebih ringan.",
    thumbnail: null,
    daysAgo: 23,
    html: `<p>Kanji 明 terlihat rumit sampai kamu sadar isinya cuma <strong>日</strong> (matahari) + <strong>月</strong> (bulan) = terang. Itulah ide metode radikal.</p>
<h2>Apa itu radikal?</h2>
<p>Radikal adalah komponen pembentuk kanji — semacam alfabet di dalam kanji. Kanji 部首 dasar ada sekitar 50–100 yang paling sering muncul.</p>
<h2>Tiga langkah praktis</h2>
<ol>
<li>Pelajari 50 radikal paling umum beserta artinya.</li>
<li>Saat bertemu kanji baru, cari radikal yang kamu kenal lalu buat cerita pendek.</li>
<li>Ulangi dengan spaced repetition (Anki/SRS), bukan membaca berulang di halaman yang sama.</li>
</ol>
<h2>Contoh cerita</h2>
<p><strong>休</strong> (yasumu, istirahat) = orang <strong>人</strong> bersandar pada pohon <strong>木</strong>. Satu gambar mental, satu kanji melekat.</p>
<blockquote>Aturan mainnya: kalau ceritanya aneh atau lucu, justru lebih mudah ingat. Serius.</blockquote>
<p>Dengan metode ini, menghafal 300 kanji pertama terasa seperti menumpuk balok, bukan menulis dikte.</p>`,
  },
  {
    slug: "partikel-wa-dan-ga",
    categorySlug: "tata-bahasa",
    title: "Memahami Partikel は dan が Sekali Paham",
    excerpt:
      "Dua partikel paling membingungkan pemula — dijelaskan dengan analogi sederhana dan contoh percakapan nyata.",
    thumbnail: img("benkyou-bahasa"),
    daysAgo: 19,
    html: `<p>"Kapan pakai は, kapan pakai が?" — pertanyaan abadi semua pemula. Kabar baiknya: ada cara berpikir yang membuat perbedaannya intuitif.</p>
<h2>は = spotlight topik</h2>
<p>Partikel <strong>は</strong> menandai apa yang sedang kita bicarakan. Fokusnya di bagian belakang kalimat:</p>
<p class="example">私は学生です。→ <em>Tentang saya</em>: saya mahasiswa.</p>
<h2>が = spotlight subjek baru</h2>
<p>Partikel <strong>が</strong> menandai informasi baru atau menjawab "siapa/apa":</p>
<p>誰が来ましたか。→ <strong>私が</strong>来ました。(<em>Siapa</em> datang? → SAYA yang datang.)</p>
<h2>Cara cepat memilih</h2>
<ul>
<li>Membahas sesuatu yang sudah dikenal → <strong>は</strong></li>
<li>Memperkenalkan hal baru / menjawab pertanyaan → <strong>が</strong></li>
<li>Kalimat penjelas netral tentang diri sendiri → <strong>は</strong> aman digunakan</li>
</ul>
<blockquote>Analogi: は itu judul slide presentasi, が itu bintang yang disorot lampu panggung.</blockquote>
<p>Jangan takut salah — penutur asli paham maksudmu kok. Perasaan untuk memilih partikel ini tumbuh dari banyak membaca dan mendengar.</p>`,
  },
  {
    slug: "pola-kalimat-desu-masu",
    categorySlug: "tata-bahasa",
    title: "Pola Kalimat です・ます untuk Pemula",
    excerpt:
      "Satu pola, seribu kalimat. Kuasai bentuk sopan です・ます dan kamu sudah bisa memperkenalkan diri dengan rapi.",
    thumbnail: null,
    daysAgo: 14,
    html: `<p>Bahasa Jepang punya tingkat kesopanan, dan <strong>bentuk です・ます</strong> adalah level yang aman dipakai ke siapa saja — guru, senpai, atau orang asing.</p>
<h2>Rumus dasarnya cuma dua</h2>
<ol>
<li>Kalimat benda: <strong>[X] は [Y] です</strong> — X adalah Y</li>
<li>Kalimat kerja: <strong>[Subjek] は [kata kerja-masu]</strong></li>
</ol>
<h2>Contoh berantai</h2>
<ul>
<li>私はインドネシア人です。— Saya orang Indonesia.</li>
<li>これは私の本です。— Ini buku saya.</li>
<li>毎朝六時に起きます。— Saya bangun jam enam tiap pagi.</li>
</ul>
<h2>Variasi negasi &amp; masa lalu</h2>
<p>です berubah: ではありません (negatif), でした (lampau). Kata kerja -masu berubah: -masen (negatif), -mashita (lampau).</p>
<pre><code>行きます (pergi) → 行きません (tidak pergi) → 行きました (pergi/telah pergi)</code></pre>
<blockquote>Tips: satu pola + daftar kata = latihan tanpa batas. Ganti kata, buang rasa ragu.</blockquote>
<p>Setelah nyaman dengan pola ini, kamu siap naik ke bentuk lampau kata sifat dan pola ～たい (ingin melakukan).</p>`,
  },
  {
    slug: "kosakata-sehari-hari-100-pertama",
    categorySlug: "kosakata",
    title: "100 Kosakata Pertama untuk Kehidupan Sehari-hari",
    excerpt:
      "Sambutan, angka, makanan, arah — kelompok kosakata berikut menutupi 80% interaksi dasar di Jepang.",
    thumbnail: null,
    daysAgo: 10,
    html: `<p>Nggak perlu 10.000 kata untuk bisa ngobrol ringan. Mulai dari yang benar-benar kepakai.</p>
<h2>Sapaan &amp; ungkapan wajib</h2>
<ul>
<li>おはようございます — selamat pagi</li>
<li>ありがとうございます — terima kasih</li>
<li>すみません — permisi / maaf</li>
<li>いただきます — ucapkan sebelum makan</li>
</ul>
<h2>Kelompok kata prioritas</h2>
<ol>
<li><strong>Angka &amp; waktu</strong> — 一、二、三… 今日、明日、毎日</li>
<li><strong>Makanan &amp; minuman</strong> — 水、お茶、ご飯、パン</li>
<li><strong>Kata tanya</strong> — 何（なに）、どこ、いつ、いくら</li>
<li><strong>Kata gerak harian</strong> — 行く、来る、食べる、飲む、買う</li>
</ol>
<h2>Cara melatihnya nempel</h2>
<p>Tempel label di barang rumah: 冰箱 → 冷蔵庫（れいぞうこ）. Setiap kali pegang benda itu, ucapkan kata Jepangnya.</p>
<blockquote>100 kata yang diucapkan tiap hari mengalahkan 1.000 kata yang cuma dibaca.</blockquote>`,
  },
  {
    slug: "kosakata-restoran-jepang",
    categorySlug: "kosakata",
    title: "Kosakata Wajib Saat Makan di Restoran Jepang",
    excerpt:
      "Dari masuk sampai bayar — panduan lengkap bertahan hidup di restoran, izakaya, dan konbini Jepang.",
    thumbnail: img("benkyou-resto"),
    daysAgo: 6,
    html: `<p>Perut lapar, menu bahasa Jepang, pelayan menunggu. Tenang — skenario restoran punya pola tetap, dan kosakatanya bisa dihitung jari.</p>
<h2>Saat masuk &amp; memesan</h2>
<ul>
<li>二人です (futari desu) — untuk dua orang</li>
<li>これをください — saya ambil yang ini (sambil tunjuk menu)</li>
<li>おすすめは何ですか — apa rekomendasinya?</li>
<li>お水をください — minta air putih (gratis di Jepang!)</li>
</ul>
<h2>Istilah di menu</h2>
<ol>
<li><strong>定食</strong> (teishoku) — set meal lengkap</li>
<li><strong>大盛り</strong> (ōmori) — porsi jumbo</li>
<li><strong>お替わり</strong> (okawari) — tambah porsi</li>
<li><strong>辛い</strong> (karai) — pedas; <strong>甘い</strong> (amai) — manis</li>
</ol>
<h2>Saat selesai &amp; bayar</h2>
<p>Ucapkan <strong>ごちそうさまでした</strong> saat keluar — sopan dan langsung disukai orang lokal. Bayar biasanya di kasir depan: お会計をお願いします (tolong tagihannya).</p>
<blockquote>Di konbini, cukup tunjuk dan bilang ふくろいりますか？ dijawab sendiri: 袋いらない、大丈夫です — tidak perlu plastik.</blockquote>`,
  },
  {
    slug: "jadwal-belajar-jlpt-n5-3-bulan",
    categorySlug: "tips-belajar",
    title: "Jadwal Belajar JLPT N5 dalam 3 Bulan",
    excerpt:
      "Rencana mingguan realistis: 60–90 menit per hari untuk lolos N5 tanpa harus meninggalkan pekerjaan kuliah.",
    thumbnail: img("benkyou-jlpt"),
    daysAgo: 3,
    html: `<p>JLPT N5 itu reachable banget dalam 3 bulan — asalkan belajarnya <em>konsisten</em>, bukan maraton akhir pekan doang.</p>
<h2>Target materi per bulan</h2>
<ol>
<li><strong>Bulan 1:</strong> Hiragana + katakana lancar, 300 kosakata inti, pola です・ます</li>
<li><strong>Bulan 2:</strong> 100 kanji N5, partikel (は・が・を・に・で), latihan membaca kalimat pendek</li>
<li><strong>Bulan 3:</strong> Simulasi soal, mendengar audio lambat (NHK Easy), review total</li>
</ol>
<h2>Pembagian harian 90 menit</h2>
<ul>
<li>25 menit kosakata (SRS/Anki)</li>
<li>25 menit grammar + contoh kalimat tulis sendiri</li>
<li>20 menit kanji (5 kanji baru + review)</li>
<li>20 menit listening pasif sambil jalan/naik kendaraan</li>
</ul>
<h2>Patokan minggu ke-6</h2>
<p>Kalau kamu sudah bisa membaca kalimat seperti 私は毎朝コーヒーを飲みます tanpa kamus — kamu on track. Kalau belum, kurangi kosakata baru, tambah review.</p>
<blockquote>Soal N5 punya pola yang bisa dilatih. Kerjakan 2 set soal tahun lalu sebelum ujian, pasti terasa bedanya.</blockquote>`,
  },
  {
    slug: "sumber-belajar-bahasa-jepang-gratis",
    categorySlug: "tips-belajar",
    title: "8 Sumber Belajar Bahasa Jepang Gratis Terbaik",
    excerpt:
      "Website, aplikasi, dan kanal YouTube gratis yang kualitasnya setara kursus berbayar — kurasi untuk pemula.",
    thumbnail: null,
    daysAgo: 0,
    html: `<p>Belajar bahasa Jepang tidak harus mahal. Delapan sumber berikut gratis dan terbukti membantu ribuan pemula.</p>
<h2>Grammar &amp; membaca</h2>
<ul>
<li><a href="https://guidetojapanese.org/learn/" rel="noopener noreferrer" target="_blank">Tae Kim's Guide to Japanese</a> — buku grammar gratis paling lengkap</li>
<li><a href="https://www3.nhk.or.jp/news/easy/" rel="noopener noreferrer" target="_blank">NHK News Web Easy</a> — berita dengan furigana untuk pemula</li>
</ul>
<h2>Kamus &amp; kanji</h2>
<ul>
<li><a href="https://jisho.org/" rel="noopener noreferrer" target="_blank">Jisho.org</a> — kamus terbaik, lengkap dengan radikal</li>
<li><a href="https://ankiweb.net/" rel="noopener noreferrer" target="_blank">Anki</a> — spaced repetition untuk kosakata &amp; kanji</li>
</ul>
<h2>Listening &amp; speaking</h2>
<ul>
<li>Kanal YouTube <strong>Comprehensible Japanese</strong> — input yang pas untuk pemula</li>
<li><strong>HelloTalk / Tandem</strong> — cari language partner asli Jepang</li>
</ul>
<h2>Cara pakai kombinasi ini</h2>
<ol>
<li>Grammar dari Tae Kim pelan-pelan (1 bab/minggu)</li>
<li>Kosakata harian lewat Anki</li>
<li>Mingguan: 1 artikel NHK Easy walau patah-patah</li>
</ol>
<blockquote>Yang bikin lancar bukan aplikasinya, tapi kebiasaanmu membukanya.</blockquote>`,
  },
  {
    slug: "persiapan-jlpt-n4-apa-yang-berubah",
    categorySlug: "tips-belajar",
    title: "Persiapan JLPT N4: Apa yang Berubah dari N5",
    excerpt: "Draf: perbandingan cakupan materi N5 vs N4 dan strategi transisinya.",
    thumbnail: null,
    status: "draft",
    daysAgo: 0,
    html: `<p>Lulus N5 lalu apa? N4 menuntut lonjakan kosakata hampir dua kali lipat dan grammar yang mulai kompleks.</p>
<h2>Peningkatan cakupan</h2>
<ul>
<li>Kosakata: ±800 → ±1.500 kata</li>
<li>Kanji: ±100 → ±300</li>
<li>Grammar: bentuk transitif/intransitif, kondisional ～たら・～ば</li>
</ul>
<p><em>(Masih draf — akan dilengkapi dengan tabel perbandingan dan strategi 4 bulan.)</em></p>`,
  },
];

let added = 0;
for (const p of posts) {
  const rows = await sql`
    insert into posts
      (author_id, category_id, title, slug, excerpt, content_html, content_text, thumbnail_url, status, published_at)
    values (
      ${admin.id},
      ${kategori[p.categorySlug] ?? null},
      ${p.title},
      ${p.slug},
      ${p.excerpt},
      ${p.html},
      ${""},
      ${p.thumbnail},
      ${p.status ?? "published"},
      ${p.status === "draft" ? null : sql`now() - (${p.daysAgo} * interval '1 day')`}
    )
    on conflict (slug) do nothing
    returning slug
  `;
  if (rows.length > 0) added++;
}

const [{ n }] = await sql`select count(*)::int as n from posts where status = 'published'`;
console.log(`✅ ${added} artikel baru ditambahkan, total ${n} published di DB.`);
await sql.end();
