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

const editorialCategories = [
  ["Berita Jepang", "berita-jepang", "Kabar dan perkembangan terbaru dari Jepang."],
  ["JLPT & Tes", "jlpt-tes", "Informasi seputar JLPT, tes bahasa, dan persiapannya."],
  ["MEXT & Beasiswa", "mext-beasiswa", "Panduan pendidikan, beasiswa, dan peluang studi ke Jepang."],
  ["Budaya Jepang", "budaya-jepang", "Budaya, kebiasaan, dan kehidupan sehari-hari di Jepang."],
];

for (const [name, slug, description] of editorialCategories) {
  await sql`
    insert into categories (name, slug, description)
    values (${name}, ${slug}, ${description})
    on conflict (slug) do nothing
  `;
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
  {
    slug: "kalender-libur-jepang-dan-waktu-terbaik-berkunjung",
    categorySlug: "berita-jepang",
    title: "Kalender Libur Jepang dan Waktu Terbaik Berkunjung",
    excerpt: "Mengenal Golden Week, Obon, dan musim ramai agar rencana perjalanan ke Jepang lebih matang.",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 2,
    html: `<p>Jepang memiliki beberapa periode liburan panjang yang memengaruhi harga dan kepadatan transportasi. Memahami kalendernya membantu perjalanan terasa lebih nyaman.</p>
<h2>Periode yang perlu diperhatikan</h2>
<ul><li><strong>Golden Week</strong> biasanya berlangsung pada akhir April sampai awal Mei.</li><li><strong>Obon</strong> umumnya jatuh pada pertengahan Agustus.</li><li><strong>Tahun Baru</strong> menjadi masa pulang kampung bagi banyak keluarga Jepang.</li></ul>
<p>Di luar periode ramai, musim semi dan gugur tetap populer karena cuaca nyaman. Pesan penginapan dan tiket lebih awal jika bepergian saat libur nasional.</p>`,
  },
  {
    slug: "cara-mengikuti-pengumuman-jlpt-dan-jadwal-pendaftaran",
    categorySlug: "jlpt-tes",
    title: "Cara Mengikuti Pengumuman JLPT dan Jadwal Pendaftaran",
    excerpt: "Panduan ringkas mengecek jadwal, lokasi, dan pengumuman JLPT dari sumber resmi.",
    thumbnail: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 4,
    html: `<p>Jadwal JLPT dapat berbeda menurut negara dan kota penyelenggara. Karena itu, calon peserta sebaiknya menjadikan situs resmi penyelenggara lokal sebagai rujukan utama.</p>
<h2>Yang perlu dicek</h2>
<ol><li>Periode pendaftaran dan biaya ujian.</li><li>Lokasi tes serta dokumen identitas yang diminta.</li><li>Batas waktu pengambilan kartu ujian.</li><li>Jadwal pengumuman hasil.</li></ol>
<p>Siapkan pengingat kalender beberapa minggu sebelum pendaftaran dibuka. Hindari mengandalkan unggahan ulang yang tidak menyertakan tautan sumber.</p>`,
  },
  {
    slug: "mengenal-beasiswa-mext-jalur-dan-dokumen-awal",
    categorySlug: "mext-beasiswa",
    title: "Mengenal Beasiswa MEXT: Jalur dan Dokumen Awal",
    excerpt: "Gambaran awal jalur beasiswa MEXT dan dokumen yang biasanya perlu disiapkan calon pendaftar.",
    thumbnail: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 7,
    html: `<p>MEXT adalah beasiswa pemerintah Jepang untuk berbagai jenjang pendidikan. Persyaratan dan jadwal dapat berubah, jadi informasi terbaru harus selalu dikonfirmasi melalui Kedutaan Besar Jepang atau universitas tujuan.</p>
<h2>Persiapan dasar</h2>
<ul><li>Riwayat pendidikan dan transkrip nilai.</li><li>Rencana studi atau proposal penelitian.</li><li>Sertifikat bahasa bila diminta oleh jalur yang dipilih.</li><li>Surat rekomendasi dan dokumen identitas.</li></ul>
<p>Mulailah dengan membaca panduan tahun berjalan. Jangan membayar pihak yang menjanjikan kelulusan karena seleksi dilakukan melalui proses resmi.</p>`,
  },
  {
    slug: "mengapa-konbini-menjadi-bagian-penting-hidup-di-jepang",
    categorySlug: "budaya-jepang",
    title: "Mengapa Konbini Menjadi Bagian Penting Hidup di Jepang",
    excerpt: "Dari makanan cepat saji sampai layanan pembayaran, konbini hadir di banyak sudut kehidupan Jepang.",
    thumbnail: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 9,
    html: `<p>Konbini atau convenience store bukan sekadar tempat membeli minuman. Toko ini menawarkan makanan siap santap, mesin ATM, pembayaran tagihan, dan layanan pengiriman.</p>
<h2>Kebiasaan kecil yang perlu diketahui</h2>
<p>Pelayanan biasanya cepat dan praktis. Saat memanaskan makanan atau meminta kantong, dengarkan pertanyaan staf dan jawab singkat. Antrean tetap perlu dijaga, terutama pada jam sibuk.</p>
<p>Setiap jaringan memiliki produk musiman sendiri. Itulah sebabnya mengunjungi konbini sering menjadi cara sederhana untuk melihat tren makanan lokal.</p>`,
  },
  {
    slug: "transportasi-jepang-memahami-ic-card-dan-transfer-kereta",
    categorySlug: "berita-jepang",
    title: "Transportasi Jepang: Memahami IC Card dan Transfer Kereta",
    excerpt: "Hal dasar yang perlu diketahui sebelum naik kereta Jepang, dari IC card sampai membaca jalur transfer.",
    thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 12,
    html: `<p>Jaringan kereta Jepang terlihat rumit pada peta pertama kali, tetapi alurnya cukup konsisten. IC card memudahkan pembayaran di banyak area, meski cakupan dan aturan penggunaannya dapat berbeda.</p>
<h2>Tips berpindah jalur</h2>
<ol><li>Catat nama stasiun tujuan dan nomor jalur.</li><li>Ikuti papan petunjuk transfer, bukan hanya warna garis.</li><li>Sisihkan waktu tambahan untuk stasiun besar.</li></ol>
<p>Gunakan aplikasi navigasi sebagai bantuan, tetapi tetap perhatikan pengumuman dan papan digital ketika terjadi perubahan layanan.</p>`,
  },
  {
    slug: "musim-tsuyu-dan-cara-warga-jepang-menghadapinya",
    categorySlug: "budaya-jepang",
    title: "Musim Tsuyu dan Cara Warga Jepang Menghadapinya",
    excerpt: "Mengenal musim hujan Jepang, kebiasaan sehari-hari, dan kosakata yang sering muncul di pemberitaan.",
    thumbnail: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 15,
    html: `<p>Tsuyu adalah musim hujan yang biasanya datang sebelum musim panas di banyak wilayah Jepang. Intensitas dan waktunya tidak sama di setiap daerah.</p>
<p>Payung lipat, sepatu yang cepat kering, dan memantau prakiraan cuaca menjadi bagian dari rutinitas. Saat membaca berita cuaca, kamu akan sering menemukan kata <strong>梅雨</strong> (tsuyu) dan <strong>大雨</strong> (ōame), hujan lebat.</p>
<blockquote>Informasi cuaca lokal tetap menjadi rujukan utama saat merencanakan perjalanan.</blockquote>`,
  },
  {
    slug: "tips-membaca-berita-jepang-dengan-bantuan-furigana",
    categorySlug: "jlpt-tes",
    title: "Tips Membaca Berita Jepang dengan Bantuan Furigana",
    excerpt: "Strategi membaca berita Jepang secara bertahap tanpa harus menerjemahkan setiap kata.",
    thumbnail: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 18,
    html: `<p>Membaca berita Jepang tidak harus dimulai dari artikel panjang. Pilih berita singkat, tandai kata yang berulang, lalu cari inti peristiwa dari judul dan kalimat pertama.</p>
<h2>Urutan latihan</h2>
<ol><li>Baca judul tanpa membuka kamus.</li><li>Tebak topik dari kata benda yang dikenal.</li><li>Gunakan furigana dan kamus hanya untuk kata kunci.</li><li>Tulis ringkasan satu kalimat dalam bahasa Indonesia.</li></ol>
<p>Latihan rutin membantu mengenali pola bahasa berita seperti 発表 (pengumuman), 開催 (penyelenggaraan), dan 予定 (rencana).</p>`,
  },
  {
    slug: "aturan-sopan-santun-saat-berkunjung-ke-kuil-jepang",
    categorySlug: "budaya-jepang",
    title: "Aturan Sopan Santun Saat Berkunjung ke Kuil Jepang",
    excerpt: "Panduan singkat menjaga sikap saat berkunjung ke kuil dan tempat ibadah di Jepang.",
    thumbnail: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 21,
    html: `<p>Kuil dan tempat ibadah di Jepang adalah ruang spiritual sekaligus tujuan wisata. Pengunjung perlu menjaga suara, mengikuti tanda, dan tidak memotret area yang dilarang.</p>
<h2>Etika dasar</h2>
<ul><li>Berhenti sejenak dan membungkuk ringan di gerbang.</li><li>Bersihkan tangan di tempat yang disediakan.</li><li>Ikuti tata cara setempat tanpa mengganggu orang yang beribadah.</li></ul>
<p>Aturan dapat berbeda antar tempat. Papan informasi lokal selalu lebih penting daripada panduan umum di internet.</p>`,
  },
  {
    slug: "apa-yang-perlu-dicek-sebelum-studi-ke-jepang",
    categorySlug: "mext-beasiswa",
    title: "Apa yang Perlu Dicek Sebelum Studi ke Jepang",
    excerpt: "Checklist awal tentang kampus, biaya hidup, kalender akademik, dan dokumen sebelum berangkat.",
    thumbnail: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 24,
    html: `<p>Keputusan studi ke Jepang membutuhkan riset yang lebih luas daripada memilih kampus. Periksa bahasa pengantar, kalender akademik, biaya hidup, dan akses tempat tinggal.</p>
<h2>Checklist awal</h2>
<ul><li>Pastikan program sesuai latar belakang dan target karier.</li><li>Bandingkan biaya kuliah serta estimasi biaya hidup.</li><li>Cek asuransi, visa, dan jadwal keberangkatan.</li><li>Simpan dokumen penting dalam bentuk digital dan cetak.</li></ul>
<p>Informasi resmi universitas dan imigrasi harus menjadi dasar keputusan. Artikel blog dapat membantu orientasi, tetapi bukan pengganti pengumuman resmi.</p>`,
  },
  {
    slug: "membaca-papan-pengumuman-jepang-dengan-lebih-mudah",
    categorySlug: "berita-jepang",
    title: "Membaca Papan Pengumuman Jepang dengan Lebih Mudah",
    excerpt: "Kenali kosakata yang sering muncul di papan stasiun, toko, dan pengumuman layanan publik Jepang.",
    thumbnail: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80",
    daysAgo: 27,
    html: `<p>Papan pengumuman di Jepang sering memakai kalimat singkat dan kosakata formal. Mengenali beberapa kata kunci membuat informasi penting lebih mudah dipahami.</p>
<h2>Kata yang sering muncul</h2>
<ul><li><strong>お知らせ</strong> berarti pemberitahuan.</li><li><strong>休業</strong> berarti tutup sementara.</li><li><strong>運休</strong> berarti layanan kereta dihentikan.</li><li><strong>注意</strong> berarti perhatian atau waspada.</li></ul>
<p>Baca judul dan angka terlebih dahulu, kemudian cari tanggal, waktu, lokasi, serta tindakan yang diminta. Strategi ini berguna saat bepergian maupun membaca berita lokal.</p>`,
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
      ${p.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()},
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
