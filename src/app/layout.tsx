import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MotionProvider from "@/components/motion-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Benkyou Lab — Belajar Bahasa Jepang",
    template: "%s — Benkyou Lab",
  },
  description:
    "Materi belajar bahasa Jepang: kanji, tata bahasa, kosakata, dan tips latihan. 日本語を学ぼう。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
