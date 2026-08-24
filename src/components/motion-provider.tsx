"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

// ponytail: domAnimation (bukan domMax) — cukup utk fade/slide/layout pill;
// ganti ke domMax hanya kalau nanti butuh gesture drag.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
