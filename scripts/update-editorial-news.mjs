// Update seluruh artikel demo menjadi konten editorial Jepang.
// Jalankan: node --env-file=.env.local scripts/update-editorial-news.mjs
// Mempertahankan slug agar URL artikel yang sudah dibagikan tetap hidup.
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const categories = Object.fromEntries((await sql`select id, slug from categories`).map((row) => [row.slug, row.id]));

const images = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80",
];

const source = (label, url) => `<p><strong>Sumber resmi:</strong> <a href="${url}" rel="noopener noreferrer" target="_blank">${label}</a></p>`;
const article = (title, excerpt, categorySlug, sourceLabel, sourceUrl, body, imageIndex) => ({
  title,
  excerpt,
  categorySlug,
  thumbnailUrl: images[imageIndex % images.length],
  html: `<p>${body}</p><h2>Yang perlu diperhatikan</h2><p>Informasi Jepang dapat berubah menurut wilayah, periode, dan kebijakan terbaru. Periksa tanggal pembaruan dan baca pengumuman dari lembaga terkait sebelum mengambil keputusan.</p>${source(sourceLabel, sourceUrl)}`,
});

const updates = {
  "kanji-dasar-untuk-pemula": article(
    "Cara Membaca Papan Informasi Jepang di Ruang Publik",
    "Panduan mengenali kata kunci pada papan stasiun, fasilitas umum, dan pengumuman singkat di Jepang.",
    "berita-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/plan/useful-apps/",
    "Papan informasi Jepang sering menggabungkan kanji, angka, warna, dan simbol. Mulai dari judul, waktu, lokasi, lalu cari kata seperti 注意 (perhatian), 変更 (perubahan), dan 入口 (pintu masuk).", 0,
  ),
  "cara-menghafal-kanji-metode-radikal": article(
    "Kosakata Jepang yang Sering Muncul dalam Pengumuman Publik",
    "Kenali kosakata seperti 変更, 中止, dan お知らせ untuk memahami kabar layanan sehari-hari.",
    "berita-jepang", "Japan Foundation", "https://www.jpf.go.jp/e/project/japanese/education/resource/",
    "Berita layanan publik biasanya memakai kalimat ringkas dan bentuk formal. Mengenali pola kosakata membantu pembaca memahami inti informasi tanpa menerjemahkan setiap karakter.", 1,
  ),
  "partikel-wa-dan-ga": article(
    "Bahasa Sopan dalam Layanan Publik Jepang",
    "Mengapa pengumuman dan pelayanan di Jepang banyak menggunakan bentuk bahasa yang formal dan tidak langsung.",
    "budaya-jepang", "Japan Foundation", "https://www.jpf.go.jp/e/project/japanese/education/resource/",
    "Bahasa layanan publik dirancang agar jelas sekaligus sopan. Ungkapan seperti ご案内, お願いします, dan ご注意ください sering ditemui di stasiun, kantor, dan toko.", 2,
  ),
  "pola-kalimat-desu-masu": article(
    "Memahami Istilah Resmi dalam Informasi Jepang",
    "Panduan singkat membaca istilah formal yang muncul dalam pengumuman pemerintah dan institusi Jepang.",
    "berita-jepang", "JapanGov", "https://www.japan.go.jp/",
    "Istilah seperti 申請 (pengajuan), 対象 (sasaran), 期間 (periode), dan 必要書類 (dokumen yang diperlukan) membantu pembaca menemukan tindakan dan tenggat dalam sebuah pengumuman.", 3,
  ),
  "kosakata-sehari-hari-100-pertama": article(
    "Kosakata yang Membantu Mengikuti Kabar Jepang",
    "Daftar kata kunci untuk membaca judul berita Jepang tentang kebijakan, layanan, dan kehidupan sehari-hari.",
    "berita-jepang", "NHK News Web Easy", "https://www3.nhk.or.jp/news/easy/",
    "Saat membaca kabar Jepang, tandai kata yang berulang lebih dulu. 発表 berarti pengumuman, 予定 berarti rencana, dan 影響 berarti dampak. Tiga kata ini sering membantu memahami konteks awal.", 4,
  ),
  "kosakata-restoran-jepang": article(
    "Etika Makan yang Perlu Diketahui Saat di Jepang",
    "Hal-hal kecil di restoran Jepang yang membantu pengunjung menghormati ruang dan kebiasaan setempat.",
    "budaya-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/",
    "Perhatikan antrean, ikuti petunjuk tempat duduk, dan gunakan suara yang wajar. Aturan dapat berbeda antara restoran, izakaya, dan area wisata, sehingga papan setempat tetap menjadi rujukan utama.", 0,
  ),
  "jadwal-belajar-jlpt-n5-3-bulan": article(
    "JLPT: Mengenal Level Ujian dan Informasi Resminya",
    "Gambaran singkat level N5 sampai N1 dan cara menemukan pengumuman JLPT dari penyelenggara resmi.",
    "jlpt-tes", "JLPT Official Website", "https://www.jlpt.jp/e/",
    "JLPT memiliki lima level kemampuan. Jadwal, pendaftaran, dan hasil ujian dapat berbeda menurut negara atau kota. Selalu cek situs resmi penyelenggara lokal sebelum membeli tiket atau menyusun jadwal.", 1,
  ),
  "sumber-belajar-bahasa-jepang-gratis": article(
    "Sumber Resmi untuk Mengikuti Informasi Jepang",
    "Daftar pintu masuk untuk mencari informasi resmi tentang bahasa, studi, perjalanan, dan berita Jepang.",
    "berita-jepang", "Portal resmi JapanGov", "https://www.japan.go.jp/",
    "Gunakan situs lembaga yang menerbitkan informasi sebagai sumber utama. Situs resmi biasanya mencantumkan tanggal publikasi, kontak, dokumen pendukung, dan perubahan kebijakan.", 2,
  ),
  "persiapan-jlpt-n4-apa-yang-berubah": article(
    "Cara Memeriksa Perubahan Jadwal dan Syarat JLPT",
    "Checklist praktis sebelum mendaftar JLPT agar tidak bergantung pada informasi lama di media sosial.",
    "jlpt-tes", "JLPT Official Website", "https://www.jlpt.jp/e/application/",
    "Periksa periode pendaftaran, lokasi tes, biaya, dokumen, dan jadwal pengumuman. Simpan halaman resmi dan cek kembali mendekati tanggal pendaftaran karena detail dapat berubah.", 3,
  ),
  "kalender-libur-jepang-dan-waktu-terbaik-berkunjung": article(
    "Kalender Libur Jepang: Apa yang Perlu Dipersiapkan Wisatawan",
    "Mengenal periode liburan yang biasanya membuat transportasi dan akomodasi lebih ramai.",
    "berita-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/plan/",
    "Golden Week, Obon, dan libur Tahun Baru adalah periode yang perlu diperhitungkan saat merencanakan perjalanan. Kepadatan dan dampak perjalanan bisa berbeda antar kota.", 0,
  ),
  "cara-mengikuti-pengumuman-jlpt-dan-jadwal-pendaftaran": article(
    "Jadwal JLPT dan Cara Menemukan Pengumuman yang Valid",
    "Langkah memeriksa jadwal pendaftaran dan hasil JLPT dari kanal resmi.",
    "jlpt-tes", "JLPT Official Website", "https://www.jlpt.jp/e/",
    "Jangan hanya mengandalkan poster atau unggahan ulang. Cocokkan nama penyelenggara, periode ujian, wilayah, dan tautan pendaftaran dengan informasi di situs resmi JLPT.", 1,
  ),
  "mengenal-beasiswa-mext-jalur-dan-dokumen-awal": article(
    "Beasiswa MEXT: Mulai dari Sumber Resmi dan Persyaratan",
    "Panduan orientasi untuk memahami jalur beasiswa pemerintah Jepang tanpa terjebak informasi yang sudah kedaluwarsa.",
    "mext-beasiswa", "MEXT", "https://www.mext.go.jp/en/",
    "Jalur MEXT dapat memiliki persyaratan dan jadwal berbeda. Mulailah dari pengumuman Kedutaan Besar Jepang atau universitas tujuan, lalu cocokkan dokumen, jenjang, dan tenggat pada tahun berjalan.", 2,
  ),
  "mengapa-konbini-menjadi-bagian-penting-hidup-di-jepang": article(
    "Konbini Jepang: Lebih dari Sekadar Toko Serba Ada",
    "Layanan yang membuat convenience store menjadi bagian penting dari kehidupan sehari-hari di Jepang.",
    "budaya-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/",
    "Konbini menawarkan makanan siap santap, pembayaran, ATM, dan layanan pengiriman. Produk, jam layanan, dan aturan dapat berbeda menurut jaringan serta lokasi.", 3,
  ),
  "transportasi-jepang-memahami-ic-card-dan-transfer-kereta": article(
    "Transportasi Jepang dan Cara Membaca Perubahan Layanan",
    "Tips memahami papan stasiun, transfer, dan pengumuman ketika jadwal kereta berubah.",
    "berita-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/plan/",
    "Di stasiun besar, ikuti nama jalur dan tujuan akhir, bukan hanya warna garis. Saat terjadi gangguan, periksa papan digital dan pengumuman operator karena rute alternatif dapat berubah.", 4,
  ),
  "musim-tsuyu-dan-cara-warga-jepang-menghadapinya": article(
    "Musim Hujan Jepang dan Pentingnya Memantau Cuaca Lokal",
    "Apa yang perlu dipahami tentang tsuyu, hujan lebat, dan informasi cuaca sebelum bepergian.",
    "berita-jepang", "Japan Meteorological Agency", "https://www.jma.go.jp/jma/indexe.html",
    "Waktu dan intensitas musim hujan berbeda menurut wilayah. Gunakan prakiraan dan peringatan cuaca resmi, terutama ketika merencanakan perjalanan ke daerah pegunungan atau pesisir.", 0,
  ),
  "tips-membaca-berita-jepang-dengan-bantuan-furigana": article(
    "Cara Membaca Berita Jepang Secara Bertahap",
    "Strategi memilih artikel pendek, memahami judul, dan mencari kata kunci sebelum membuka kamus.",
    "jlpt-tes", "NHK News Web Easy", "https://www3.nhk.or.jp/news/easy/",
    "Baca judul dan kalimat pertama untuk menemukan siapa, apa, dan kapan. Setelah itu, cari kata kunci yang berulang dan bandingkan dengan sumber resmi jika berita berkaitan dengan kebijakan.", 1,
  ),
  "aturan-sopan-santun-saat-berkunjung-ke-kuil-jepang": article(
    "Mengunjungi Kuil Jepang dengan Menghormati Aturan Setempat",
    "Panduan dasar menjaga sikap, mengikuti tanda, dan menghormati orang yang sedang beribadah.",
    "budaya-jepang", "Japan National Tourism Organization", "https://www.japan.travel/en/",
    "Kuil dan tempat ibadah adalah ruang spiritual sekaligus tujuan wisata. Perhatikan larangan memotret, batas area, kebersihan, dan volume suara. Aturan lokal selalu menjadi rujukan paling tepat.", 2,
  ),
  "apa-yang-perlu-dicek-sebelum-studi-ke-jepang": article(
    "Studi ke Jepang: Empat Sumber yang Perlu Dicek",
    "Checklist awal untuk memeriksa program studi, beasiswa, visa, dan biaya hidup dari sumber yang tepat.",
    "mext-beasiswa", "Study in Japan / JASSO", "https://www.studyinjapan.go.jp/en/",
    "Bandingkan informasi universitas, JASSO, MEXT, dan imigrasi. Periksa bahasa pengantar, kalender akademik, biaya, tempat tinggal, serta dokumen visa sebelum membuat keputusan.", 3,
  ),
  "membaca-papan-pengumuman-jepang-dengan-lebih-mudah": article(
    "Memahami Pengumuman Layanan dan Perubahan di Jepang",
    "Cara menyaring tanggal, lokasi, dan tindakan yang diminta dari pengumuman singkat berbahasa Jepang.",
    "berita-jepang", "JapanGov", "https://www.japan.go.jp/",
    "Baca bagian yang menyebut periode,対象 (sasaran), dan tindakan yang harus dilakukan. Jika pengumuman menyangkut keselamatan, transportasi, atau layanan publik, prioritaskan kanal resmi lembaga terkait.", 4,
  ),
};

let updated = 0;
for (const [slug, data] of Object.entries(updates)) {
  const categoryId = categories[data.categorySlug];
  if (!categoryId) throw new Error(`Kategori tidak ditemukan: ${data.categorySlug}`);
  const contentText = data.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const rows = await sql`
    update posts
    set title = ${data.title}, excerpt = ${data.excerpt}, content_html = ${data.html}, content_text = ${contentText}, thumbnail_url = ${data.thumbnailUrl}, category_id = ${categoryId}, updated_at = now()
    where slug = ${slug}
    returning id
  `;
  if (rows.length) updated++;
}

console.log(`✅ ${updated} dari ${Object.keys(updates).length} artikel diperbarui.`);
await sql.end();
