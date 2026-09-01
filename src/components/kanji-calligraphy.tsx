"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function KanjiCalligraphy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strokes = gsap.utils.toArray<SVGPathElement>(".brush-stroke");

    gsap.set(strokes, {
      stroke: "rgba(86, 90, 94, 0.82)",
      strokeWidth: 7.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "transparent",
      opacity: 0,
      strokeDasharray: (index, target) => target.getTotalLength(),
      strokeDashoffset: (index, target) => target.getTotalLength(),
      filter: "url(#ink-pen)",
    });

    gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
      .to(strokes, {
        opacity: 1,
        duration: 0.18,
        stagger: 0.05,
        ease: "power1.out",
      })
      .to(strokes, {
        strokeDashoffset: 0,
        duration: 2.1,
        ease: "sine.inOut",
        stagger: { each: 0.2, from: "start" },
      }, 0.04)
      .to(strokes, {
        opacity: 0.48,
        duration: 1.2,
        ease: "power2.out",
      }, "+=5")
      .to(strokes, {
        opacity: 0,
        duration: 1.9,
        ease: "power2.inOut",
        stagger: 0.08,
      }, "+=0.2");
  }, { scope, revertOnUpdate: true });

  return (
    <div ref={scope} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-[#5d6368]">
      <svg viewBox="0 0 900 520" className="absolute -top-8 right-[-3rem] h-[32rem] w-[60rem] max-w-none rotate-[-9deg] opacity-90 sm:right-[-1rem]" fill="none">
        <defs>
          <filter id="ink-pen" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="14" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="ink-soft" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="8" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#ink-soft)">
          <g transform="translate(0 4)">
            <path className="brush-stroke" d="M150 175C177 142 220 128 262 134" />
            <path className="brush-stroke" d="M214 134V332" />
            <path className="brush-stroke" d="M214 199C247 186 296 182 344 204" />
            <path className="brush-stroke" d="M214 278C255 259 303 256 360 280" />
            <path className="brush-stroke" d="M164 326C219 302 278 295 345 307" />
            <path className="brush-stroke" d="M314 132V332" />
            <path className="brush-stroke" d="M316 188C354 166 418 163 470 188" />
            <path className="brush-stroke" d="M314 260C369 239 430 242 492 270" />
            <path className="brush-stroke" d="M319 314C369 306 431 307 496 323" />
            <path className="brush-stroke" d="M500 148C546 115 603 116 643 142" />
            <path className="brush-stroke" d="M550 161V322" />
            <path className="brush-stroke" d="M542 219C583 196 635 198 682 220" />
            <path className="brush-stroke" d="M548 285C591 271 646 274 700 291" />
          </g>

          <g transform="translate(82 123)">
            <path className="brush-stroke" d="M118 137C160 98 206 90 252 98" />
            <path className="brush-stroke" d="M184 96V292" />
            <path className="brush-stroke" d="M167 172C209 154 258 151 303 173" />
            <path className="brush-stroke" d="M168 231C213 210 261 208 304 228" />
            <path className="brush-stroke" d="M121 267C177 247 242 242 312 261" />
            <path className="brush-stroke" d="M346 82V292" />
            <path className="brush-stroke" d="M342 126C391 106 440 109 480 129" />
            <path className="brush-stroke" d="M345 188C390 171 440 171 487 191" />
            <path className="brush-stroke" d="M342 247C392 227 451 230 511 252" />
            <path className="brush-stroke" d="M522 103C561 74 611 75 648 100" />
            <path className="brush-stroke" d="M566 122V279" />
            <path className="brush-stroke" d="M555 185C596 168 632 174 672 196" />
            <path className="brush-stroke" d="M557 247C598 230 644 233 690 253" />
          </g>
        </g>
      </svg>
    </div>
  );
}
