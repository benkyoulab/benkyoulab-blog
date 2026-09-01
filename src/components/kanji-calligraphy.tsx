"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function KanjiCalligraphy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strokes = gsap.utils.toArray<SVGPathElement>(".calligraphy-stroke path");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(strokes, { strokeDashoffset: 0, opacity: 0.16 });
      return;
    }

    gsap.set(strokes, { strokeDashoffset: (index, target) => target.getTotalLength(), opacity: 0 });
    gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
      .to(strokes, { opacity: 0.16, duration: 0.2, stagger: 0.12 })
      .to(strokes, { strokeDashoffset: 0, duration: 1.25, ease: "power2.inOut", stagger: 0.18 })
      .to(strokes, { opacity: 0.04, duration: 1.8, delay: 1.5, ease: "power2.out" });
  }, { scope, revertOnUpdate: true });

  return (
    <div ref={scope} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-[#c83c2d] dark:text-[#f2a39b]">
      <svg viewBox="0 0 900 520" className="absolute -top-10 right-[-7rem] h-[34rem] w-[58rem] max-w-none rotate-[-8deg] opacity-90 sm:right-[-3rem]" fill="none">
        <g className="calligraphy-stroke" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9">
          <path d="M155 92C205 72 270 66 331 75C350 78 361 85 356 93C350 104 314 108 276 109C232 110 187 108 151 112" />
          <path d="M251 43C244 122 244 194 250 270C253 302 256 325 263 346" />
          <path d="M155 177C210 166 278 164 348 171C363 173 373 180 369 188C363 199 323 202 278 203C231 204 184 201 154 207" />
          <path d="M153 294C206 285 280 283 348 290C366 292 373 299 369 307C363 318 317 320 275 320C224 321 180 318 150 325" />
          <path d="M543 74C568 55 602 47 631 54C655 60 661 75 649 88C633 107 603 120 571 130" />
          <path d="M564 126C598 151 637 164 682 168C706 170 718 178 714 187C708 201 671 205 636 201C605 198 578 187 553 173" />
          <path d="M608 83C601 160 604 248 617 337C622 365 629 383 640 397" />
          <path d="M526 251C580 241 655 242 721 251C738 254 746 262 741 270C733 283 693 284 651 284C603 284 558 282 526 288" />
          <path d="M558 353C608 337 673 334 724 342C744 345 751 354 744 364C733 379 682 383 643 380C608 378 575 371 550 365" />
        </g>
      </svg>
      <span className="font-display absolute top-10 right-10 text-[clamp(5rem,15vw,11rem)] leading-none font-bold opacity-[0.06]">日本</span>
    </div>
  );
}
