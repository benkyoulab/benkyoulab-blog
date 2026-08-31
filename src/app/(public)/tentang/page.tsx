import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Tentang — Benkyou Lab",
  description:
    "Benkyou Lab adalah blog berbahasa Indonesia tentang kabar Jepang, JLPT, MEXT, budaya, dan bahasa.",
};

const NILAI = [
  {
    icon: "🧩",
    title: "Jernih dan kontekstual",
    text: "Informasi tentang Jepang disusun ringkas agar mudah dipahami dan tetap punya konteks.",
  },
  {
    icon: "🇯🇵",
    title: "Dekat dengan pembaca",
    text: "Kami membahas berita, ujian, beasiswa, budaya, dan bahasa yang relevan untuk pembaca Indonesia.",
  },
  {
    icon: "🌱",
    title: "Belajar tetap punya tempat",
    text: "Rubrik bahasa membantu pembaca memahami Jepang lebih dalam, tanpa terasa seperti kelas online.",
  },
];

export default function Tentang() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 hidden select-none text-[10rem] leading-none font-bold text-red-50 md:block dark:text-red-500/5"
        >
          私たち
        </span>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <FadeIn>
            <p className="text-sm font-semibold text-red-600 uppercase">私たちについて</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Jepang lebih dekat dari yang kita kira
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Benkyou Lab (勉強ラボ) adalah blog tentang Jepang dari sudut pandang pembaca Indonesia:
              mengikuti kabar terkini, memahami konteks, dan menemukan hal-hal baru untuk dibaca.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-14 dark:border-gray-800 dark:bg-gray-900/40">
        <div className="mx-auto max-w-5xl px-4">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cara kami bercerita</h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {NILAI.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                  <p className="text-3xl">{v.icon}</p>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{v.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <FadeIn>
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              「千裡の道も一歩から」
              <span className="mt-2 block text-base text-gray-500">
                Perjalanan seribu mil dimulai dari satu langkah.
              </span>
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-red-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
            >
              Baca edisi terbaru
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
