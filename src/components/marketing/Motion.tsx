"use client";

import { LazyMotion, domAnimation, m, MotionConfig, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export function MarketingMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user"><LazyMotion features={domAnimation}>{children}</LazyMotion></MotionConfig>;
}

export function Reveal({ children, ...props }: HTMLMotionProps<"div">) {
  const reduced = useReducedMotion();
  return <m.div {...props} className={`launch-reveal ${props.className || ""}`} initial={reduced ? false : { opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }}
    transition={{ duration: reduced ? 0 : .3, ease: "easeOut" }}>{children}</m.div>;
}
