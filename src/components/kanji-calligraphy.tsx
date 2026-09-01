"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function KanjiCalligraphy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strokes = gsap.utils.toArray<SVGPathElement>(".calligraphy-stroke path");

    gsap.set(strokes, {
      strokeDasharray: (index, target) => target.getTotalLength(),
      strokeDashoffset: (index, target) => target.getTotalLength(),
      opacity: 0,
    });

    gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
      .to(strokes, {
        opacity: 0.9,
        duration: 0.2,
        stagger: 0.12,
        ease: "power1.out",
      })
      .to(strokes, {
        strokeDashoffset: 0,
        duration: 1.7,
        ease: "power2.inOut",
        stagger: 0.18,
      }, 0.1)
      .to(strokes, {
        opacity: 0.08,
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.out",
      }, 1.5);
  }, { scope, revertOnUpdate: true });

  return (
    <div ref={scope} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-[#c83c2d] dark:text-[#f2a39b]">
      <svg viewBox="0 0 520 520" className="absolute -top-10 right-[-3rem] h-[30rem] w-[40rem] max-w-none rotate-[-8deg] opacity-90 sm:right-[-1.5rem]" fill="none">
        <g className="calligraphy-stroke" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12">
          <path d="M150 122C184 100 235 90 285 93C332 96 365 109 384 131" />
          <path d="M184 128V356" />
          <path d="M184 215C226 197 268 191 317 194C347 196 369 202 382 214" />
          <path d="M311 128V359" />
          <path d="M150 356C197 341 242 336 288 340C333 344 364 353 381 370" />
          <path d="M145 125V354" />
          <path d="M145 125H184" />
          <path d="M311 129H382" />
        </g>
      </svg>
      <span className="font-display absolute top-9 right-8 text-[clamp(5rem,14vw,11rem)] leading-none font-bold opacity-[0.06]">日</span>
    </div>
  );
}
