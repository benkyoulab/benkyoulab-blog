"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function KanjiCalligraphy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strokes = gsap.utils.toArray<SVGPathElement>(".kanji-stroke");

    gsap.set(strokes, {
      stroke: "rgba(73, 79, 84, 0.9)",
      strokeWidth: 2.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "transparent",
      opacity: 0,
      strokeDasharray: (index, target) => target.getTotalLength(),
      strokeDashoffset: (index, target) => target.getTotalLength(),
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
        duration: 2.2,
        ease: "sine.inOut",
        stagger: { each: 0.16, from: "start" },
      }, 0.05)
      .to(strokes, {
        opacity: 0.5,
        duration: 1.1,
        ease: "power2.out",
      }, "+=5")
      .to(strokes, {
        opacity: 0,
        duration: 1.8,
        ease: "power2.inOut",
        stagger: 0.08,
      }, "+=0.2");
  }, { scope, revertOnUpdate: true });

  return (
    <div ref={scope} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden text-[#4c5258]">
      <svg viewBox="0 0 960 520" className="absolute -top-8 right-[-3rem] h-[32rem] w-[60rem] max-w-none rotate-[-9deg] opacity-90 sm:right-[-1rem]" fill="none">
        <defs>
          <filter id="ink-soft" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="0.15" />
          </filter>
        </defs>

        <g filter="url(#ink-soft)">
          <g transform="translate(42 20) scale(2.8)">
            <path className="kanji-stroke" d="M32.13,12.15c0.04,0.5,0.17,1.32-0.09,2.01c-1.91,5.09-8.41,14.09-16.91,20.51" />
            <path className="kanji-stroke" d="M30.25,20.52c1.12,0.48,2.12,0.31,3.27,0.13c4.78-0.74,12.56-2.58,14.14-2.77c1.77-0.21,2.69,1.77,1.95,2.81c-3.11,4.41-6.51,8.14-11.43,15.2" />
            <path className="kanji-stroke" d="M20.37,38.22c0.71,0.87,1.11,1.86,1.2,2.98c0.73,3.46,1.23,8.04,1.76,13.27c0.13,1.28,0.26,2.61,0.4,3.96" />
            <path className="kanji-stroke" d="M22.68,39.46c8.09-1.82,24.84-3.85,29.05-4.07c2.77-0.14,3.44,2.26,3.22,3.58c-0.7,4.25-1.57,7.44-2.77,11.5c-0.34,1.15-0.7,2.36-1.1,3.7" />
            <path className="kanji-stroke" d="M36.75,38.56c0.79,0.79,1.14,1.93,1.14,3.09c0,1.16-0.08,9.25-0.08,11.11" />
            <path className="kanji-stroke" d="M24.38,55.04c3.27-0.46,22.66-2.52,26.26-2.75" />
            <path className="kanji-stroke" d="M30.68,58.17c0.04,0.77,0.09,1.99-0.09,3.1C29.51,67.81,22.75,82.75,12.25,90" />
            <path className="kanji-stroke" d="M39.91,56.12c0.92,0.92,1.68,2.75,1.68,4.54c0,8.4-0.24,16.83-0.24,22.54c0,10.8,2.77,12.58,24.54,12.58c25.61,0,26.5-3.28,26.5-9.36" />
            <path className="kanji-stroke" d="M62.3,45.98c2.32,0.65,4.04,0.46,5.7,0.15c6.41-1.19,16.11-3.58,20.75-4.34c3.27-0.54,4.42,0.55,4.44,3.76c0.05,7.95-8.84,28.87-12.67,32.88c-3,3.14-3.59,1.4-6.4-1.05" />
            <path className="kanji-stroke" d="M77.26,22.75c0.74,1.38,0.78,2.97,0.52,5c-1.9,15.4-8.49,38.66-23.43,53.45" />
          </g>

          <g transform="translate(260 20) scale(2.8)">
            <path className="kanji-stroke" d="M17.5,19.84c1,0.66,3.5,0.95,4.69,0.79c5.81-0.76,13.69-2.51,18.27-3.79c2.42-0.67,4.29,0.78,3.24,3.39c-0.61,1.53-3.39,9.93-4.37,13.78" />
            <path className="kanji-stroke" d="M18.38,37.25c0.75,0.25,2.03,0.43,3.26,0.32c5.34-0.49,14.24-2.32,15.87-2.32c2,0,2.75-0.25,4,0" />
            <path className="kanji-stroke" d="M18.88,37.43c0.84,0.84,0.71,2.31,0.36,3.83C18.83,43,16.35,50.03,16,50.94c-1,2.56-0.53,3.75,2.75,3.06c3-0.62,12.25-2.3,16.46-2.69c2.04-0.19,3.29,1.56,3.04,4.19c-0.85,8.9-5.22,29.45-9,35.75c-3.75,6.25-6.36-0.31-7.19-2.17" />
            <path className="kanji-stroke" d="M67.75,12.75c0.38,1.75-0.25,4-1.25,5.25c-5.49,6.86-7.25,8.5-13.32,15.09C51.39,35.05,52,36.63,55,36c9.5-2,21.25-4.25,32.85-6.25" />
            <path className="kanji-stroke" d="M79.88,20.5c4.46,2.6,11.51,10.7,12.62,14.75" />
            <path className="kanji-stroke" d="M48.25,51.62c0.5,0.19,1.67,1.53,1.8,2.1c0.75,3.36,1.54,7.11,2.52,12.81c0.23,1.32,0.47,2.72,0.72,4.2" />
            <path className="kanji-stroke" d="M50.99,52.97c11.63-2.34,27.88-4.72,36.57-5.39c2.74-0.21,4.5,2.38,4.18,3.67c-0.91,3.67-2.48,7.26-3.53,11.24" />
            <path className="kanji-stroke" d="M53.62,69c6.93-1.31,21.4-3.19,32.15-4.76c1.29-0.19,2.53-0.37,3.7-0.55" />
            <path className="kanji-stroke" d="M66.97,37c1.28,1,2.07,2.5,2.07,4.26c0,3.99,0.05,32.54-0.08,45.24" />
            <path className="kanji-stroke" d="M45.98,91.04c1.02,1.21,2.87,1.16,3.88,0.97s37.61-8.34,40.65-9.26" />
            <path className="kanji-stroke" d="M87,75.5c3.53,3.18,9.12,13.06,10,18" />
          </g>

          <g transform="translate(120 200) scale(2.1)">
            <path className="kanji-stroke" d="M31.5,24.5c1.12,1.12,1.74,2.75,1.74,4.75c0,1.6-0.16,38.11-0.09,53.5c0.02,3.82,0.05,6.35,0.09,6.75" />
            <path className="kanji-stroke" d="M33.48,26c0.8-0.05,37.67-3.01,40.77-3.25c3.19-0.25,5,1.75,5,4.25c0,4-0.22,40.84-0.23,56c0,3.48,0,5.72,0,6" />
            <path className="kanji-stroke" d="M34.22,55.25c7.78-0.5,35.9-2.5,44.06-2.75" />
            <path className="kanji-stroke" d="M34.23,86.5c10.52-0.75,34.15-2.12,43.81-2.25" />
          </g>

          <g transform="translate(310 200) scale(2.1)">
            <path className="kanji-stroke" d="M20.5,33.5c1.93,0.62,4.91,1.07,8.1,0.75C42.43,32.88,66,30.75,79.64,30c3.2-0.18,7.22,0.25,9.23,0.5" />
            <path className="kanji-stroke" d="M52.1,11.12c1.25,1.25,2.05,3.23,2.05,4.99c0,0.84,0,57.16-0.02,76.76c-0.01,3.96-0.01,6.42-0.02,6.62" />
            <path className="kanji-stroke" d="M51.75,33.5c0,1-0.41,2.22-1.29,3.88C43.62,50.25,30.12,65.5,13.25,75.5" />
            <path className="kanji-stroke" d="M54.75,35.5c4.92,5.74,23.48,23.33,32.85,31.27c2.58,2.18,5.16,4.41,8.52,5.23" />
            <path className="kanji-stroke" d="M33.88,73.92c1.5,0.46,2.74,0.75,5.3,0.59c9.95-0.63,21.2-2.13,27.96-2.95c1.93-0.23,3.62-0.31,6-0.02" />
          </g>

          <g transform="translate(520 200) scale(1.9)">
            <path className="kanji-stroke" d="M26,15.25c2.82,1.41,7.29,5.8,8,8" />
            <path className="kanji-stroke" d="M12.37,32.97c1.25,0.28,2.88,0.66,4.36,0.53c7.02-0.59,17.78-1.75,25.95-3c1.52-0.23,3.57-0.38,5.16,0.03" />
            <path className="kanji-stroke" d="M18.73,45.76c0.38,0.18,2.71,0.2,3.1,0.18c3.97-0.21,9.79-1.19,14.46-2.31c1.67-0.4,2.71-0.38,3.86-0.08" />
            <path className="kanji-stroke" d="M18.73,58.89c0.89,0.23,1.89,0.36,3.35,0.15c3.89-0.54,10.71-1.51,14.85-2.29c0.7-0.13,1.82-0.26,2.61-0.1" />
            <path className="kanji-stroke" d="M17.14,71.9c0.63,0.62,1.12,1.65,1.23,2.57c0.63,5.03,1.51,10.28,2.23,15.59c0.14,1.03,0.27,2.02,0.41,2.93" />
            <path className="kanji-stroke" d="M19.37,73.6c5.67-0.94,15.47-2.73,20.36-3.48c1.49-0.22,2.39,1.05,2.18,2.08c-0.71,3.44-2.27,9.75-3.23,13.89" />
            <path className="kanji-stroke" d="M21.47,89.02c3.95-0.45,10.71-1.19,16.28-1.61c1.21-0.09,2.36-0.17,3.41-0.22" />
            <path className="kanji-stroke" d="M51.79,17.49c1.38,0.26,3.91,0.28,5.27,0.15C63.88,17,72.62,15.62,80,15.32c2.3-0.1,3.67,0.04,4.81,0.15" />
            <path className="kanji-stroke" d="M67.75,20.25c0.37,1.25,0.5,2.38,0.23,3.75c-0.75,3.78-6.03,23.83-7.96,31.58" />
            <path className="kanji-stroke" d="M52.18,36.96c1.82,0.66,4.17,0.95,5.84,0.66c8.48-1.5,16.13-3.06,22.74-4.1c2.49-0.39,4.05,1.27,3.71,2.93c-0.6,2.93-2.48,11.43-3.74,17.86" />
            <path className="kanji-stroke" d="M46.33,58.46c1.13,0.24,3.94,0.2,5.07,0.08c12.34-1.29,19.11-2.39,40.88-4.02c1.88-0.14,3.75-0.02,4.69,0.09" />
            <path className="kanji-stroke" d="M52.5,69.88c0.93,0.93,1.42,2.28,1.54,3.31c0.71,6.06,1.42,12.65,2.06,19.3c0.15,1.5,0.28,2.44,0.4,3.75" />
            <path className="kanji-stroke" d="M54.99,71.67c9.47-1.45,23.75-3.41,28.85-3.9c2.14-0.21,3.28,0.98,2.86,2.93c-0.84,3.88-3.08,12.57-4.39,17.58" />
            <path className="kanji-stroke" d="M57.2,91.49c5.94-0.55,14.67-1.24,23.54-1.76c1.3-0.08,2.63-0.13,3.97-0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
