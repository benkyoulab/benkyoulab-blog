"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function KanjiCalligraphy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const kanji = gsap.utils.toArray<SVGTextElement>(".calligraphy-kanji");

    gsap.set(kanji, {
      fill: "rgba(25, 27, 30, 0.08)",
      stroke: "#1d2125",
      strokeWidth: 1.4,
      strokeDasharray: (index, target) => target.getComputedTextLength(),
      strokeDashoffset: (index, target) => target.getComputedTextLength(),
      opacity: 0,
      paintOrder: "stroke fill",
      transformOrigin: "center center",
      filter: "blur(0.2px)",
    });

    gsap.timeline({ repeat: -1, repeatDelay: 0.3 })
      .to(kanji, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      })
      .to(kanji, {
        strokeDashoffset: 0,
        duration: 2.1,
        ease: "power2.inOut",
        stagger: 0.18,
      }, 0.06)
      .to(kanji, {
        opacity: 0.35,
        duration: 1.3,
        ease: "power2.out",
        stagger: 0.18,
      }, "+=5")
      .to(kanji, {
        opacity: 0,
        duration: 1.8,
        ease: "power2.inOut",
        stagger: 0.18,
      }, "+=0.25");
  }, { scope, revertOnUpdate: true });

  return (
    <div ref={scope} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-[#1d2125]">
      <svg viewBox="0 0 900 520" className="absolute -top-6 right-[-3rem] h-[32rem] w-[60rem] max-w-none rotate-[-10deg] opacity-90 sm:right-[-1rem]" fill="none">
        <defs>
          <filter id="brush-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter="url(#brush-noise)">
          <text
            className="calligraphy-kanji"
            x="430"
            y="248"
            textAnchor="middle"
            fontSize="202"
            fontWeight="700"
            fontFamily='"Noto Serif JP", "Hiragino Mincho Pro", "Yu Mincho", serif'
            letterSpacing="-8"
            style={{ fontVariantLigatures: "common-ligatures" }}
          >
            勉強
          </text>
          <text
            className="calligraphy-kanji"
            x="470"
            y="382"
            textAnchor="middle"
            fontSize="118"
            fontWeight="600"
            fontFamily='"Noto Serif JP", "Hiragino Mincho Pro", "Yu Mincho", serif'
            letterSpacing="-5"
            style={{ fontVariantLigatures: "common-ligatures" }}
          >
            日本語
          </text>
        </g>
      </svg>
    </div>
  );
}
