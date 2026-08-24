import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
      {/* aksen kanji samar di pojok bawah kanan */}
      <span
        aria-hidden
        className="pointer-events-none fixed right-1 bottom-1 z-0 hidden select-none text-8xl leading-none font-bold text-red-50/60 lg:block dark:text-red-500/5"
      >
        勉
      </span>
   </div>
  );
}
