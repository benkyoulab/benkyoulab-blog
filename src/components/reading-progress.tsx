"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Progress bar baca artikel — makin dibaca makin penuh, dengan easing spring halus.
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-red-500 to-red-700"
    />
  );
}
