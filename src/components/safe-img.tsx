"use client";

import { useState } from "react";

// Gambar dari URL eksternal bisa mati — jatuh ke placeholder saat error.
export default function SafeImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 text-4xl dark:from-red-500/10 dark:to-gray-800 ${className ?? ""}`}
      >
        🎌
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
  );
}
