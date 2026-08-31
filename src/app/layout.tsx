import type { Metadata } from "next";
import { DM_Sans, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MotionProvider from "@/components/motion-provider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const notoSerifJp = Noto_Serif_JP({ subsets: ["latin"], variable: "--font-noto-serif-jp", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Benkyou Lab — Kabar dan Cerita dari Jepang",
    template: "%s — Benkyou Lab",
  },
  description:
    "Blog berbahasa Indonesia tentang kabar Jepang, JLPT, MEXT, beasiswa, budaya, dan bahasa sehari-hari.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${notoSerifJp.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7f5f0] text-[#20211f] dark:bg-[#171816] dark:text-[#f4f1e9]">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
