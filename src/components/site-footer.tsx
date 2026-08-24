export default function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-gray-100 bg-gray-50">
      {/* aksen kanji dekoratif samar, ciri brand BenkyouLab */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 right-2 select-none text-[9rem] leading-none font-bold text-red-50"
      >
        学
      </span>
      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <p className="text-lg font-bold tracking-tight">
          Benkyou<span className="text-red-600">Lab</span>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          日本語を学ぼう、未来を築く — belajar bahasa Jepang untuk membangun masa depan.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          <a href="/" className="hover:text-red-600">
            Beranda
          </a>
          <a href="/kategori" className="hover:text-red-600">
            Kategori
          </a>
          <a href="/admin" className="hover:text-red-600">
            Login penulis
          </a>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Benkyou Lab
        </p>
      </div>
    </footer>
  );
}
