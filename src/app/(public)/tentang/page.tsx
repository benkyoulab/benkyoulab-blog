import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Tentang — Benkyou Lab",
  description:
    "Benkyou Lab adalah blog materi belajar bahasa Jepang: kanji, tata bahasa, kosakata, dan tips belajar.",
};

const NILAI = [
  {
    icon: "🧩",
    title: "Pecah jadi kecil",
    text: "Materi rumit disusun jadi langkah harian yang bisa diselesaikan 15–30 menit.",
  },
  {
    icon: "🇯🇵",
    title: "Konteks nyata",
    text: "Contoh diambil dari situasi sehari-hari: konbini, restoran, kereta, dan percakapan asli.",
  },
  {
    icon: "🌱",
    title: "Konsisten itu kunci",
    text: "Sedikit tapi tiap hari mengalahkan maraton sekali sebulan. Kami rancang untuk kebiasaan.",
  },
];

export default function Tentang() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 hidden select-none text-[10rem] leading-none font-bold text-red-50 md:block"
        >
          私たち
        </span>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <FadeIn>
            <p className="text-sm font-semibold text-red-600 uppercase">私たちについて</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Belajar Jepang tidak harus terasa seperti gunung
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Benkyou Lab (勉強ラボ) adalah laboratorium belajar — tempat materi bahasa Jepang
              dirancang ringkas, praktis, dan menyenangkan untuk pemula sampai menengah.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cara kami menulis</h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {NILAI.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                  <p className="text-3xl">{v.icon}</p>
                  <h3 className="mt-4 font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <FadeIn>
            <p className="text-xl leading-relaxed text-gray-700">
              「千裡の道も一歩から」
              <span className="mt-2 block text-base text-gray-500">
                Perjalanan seribu mil dimulai dari satu langkah.
              </span>
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-red-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
            >
              Mulai dari beranda
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
