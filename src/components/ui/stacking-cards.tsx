// author: Khoa Phan <https://www.pldkhoa.dev>
// Adapted from the user-supplied Stacking Cards component (MIT).
"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type RefObject } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue, type UseScrollOptions } from "motion/react";
import { cn } from "@/lib/utils";

interface StackingCardsProps extends HTMLAttributes<HTMLDivElement> {
  scrollOptions?: UseScrollOptions;
  scaleMultiplier?: number;
  totalCards: number;
}
interface StackingCardItemProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  topPosition?: string;
}
const StackingCardsContext = createContext<{ progress: MotionValue<number>; scaleMultiplier: number; totalCards: number; enabled: boolean } | null>(null);
export const useStackingCardsContext = () => {
  const context = useContext(StackingCardsContext);
  if (!context) throw new Error("StackingCardItem must be used within StackingCards");
  return context;
};

// Subscribe to scrolling only when the cards fit and motion is permitted.
function ScrollProgress({ target, progress, top, end, options }: { target: RefObject<HTMLDivElement | null>; progress: MotionValue<number>; top: number; end: number; options?: UseScrollOptions }) {
  const { scrollYProgress } = useScroll({ offset: [`start ${top}px`, `end ${end}px`], ...options, target });
  useEffect(() => {
    progress.set(scrollYProgress.get());
    return scrollYProgress.on("change", value => progress.set(value));
  }, [progress, scrollYProgress]);
  return null;
}

export default function StackingCards({ children, className, scrollOptions, scaleMultiplier = .06, totalCards, style, ...props }: StackingCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null), progress = useMotionValue(0), reduced = useReducedMotion();
  const [layout, setLayout] = useState({ fits: false, top: 92, height: 640 });
  useEffect(() => {
    const root = targetRef.current;
    if (!root) return;
    const header = document.querySelector("header.topo");
    const measure = () => {
      const top = Math.ceil(header?.getBoundingClientRect().bottom ?? 76) + 16;
      const height = Math.min(window.innerHeight * .8, 640);
      const bodies = [...root.querySelectorAll<HTMLElement>(".stacking-card-body")];
      const fits = window.innerWidth >= 1024 && height + top + (totalCards - 1) * 12 + 16 <= window.innerHeight && bodies.every(body => {
        const css = getComputedStyle(body);
        const padding = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
        const copy = body.querySelector<HTMLElement>("[data-stack-content]");
        return !!copy && copy.scrollHeight + padding <= height;
      });
      setLayout(current => current.fits === fits && current.top === top && current.height === height ? current : { fits, top, height });
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(root);
    root.querySelectorAll("[data-stack-content]").forEach(node => observer?.observe(node));
    if (header) observer?.observe(header);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [totalCards]);
  const enabled = layout.fits && reduced === false;
  return <StackingCardsContext.Provider value={{ progress, scaleMultiplier, totalCards, enabled }}>
    <div ref={targetRef} className={cn("stacking-cards", className)} data-stacking={enabled ? "active" : "static"}
      style={{ "--stack-top": `${layout.top}px`, ...style } as CSSProperties} {...props}>
      {enabled && <ScrollProgress target={targetRef} progress={progress} top={layout.top} end={layout.top + (totalCards - 1) * 12 + layout.height} options={scrollOptions} />}
      {children}
    </div>
  </StackingCardsContext.Provider>;
}

export function StackingCardItem({ index, topPosition, className, children, style, ...props }: StackingCardItemProps) {
  const { progress, scaleMultiplier, totalCards, enabled } = useStackingCardsContext();
  const scaleTo = 1 - Math.max(0, totalCards - index - 1) * scaleMultiplier;
  const scale = useTransform(progress, [index / Math.max(1, totalCards), 1], [1, scaleTo]);
  return <div className={cn("stacking-card-item", className)} style={{ "--card-top": topPosition ?? `calc(var(--stack-top) + ${index * 12}px)`, zIndex: index + 1, ...style } as CSSProperties} {...props}
    onFocusCapture={event => {
      // A previously covered card must become visible when reached with Shift+Tab.
      if (enabled) event.currentTarget.scrollIntoView?.({ block: "start", behavior: "instant" });
      props.onFocusCapture?.(event);
    }}>
    <m.div className="stacking-card-surface" style={{ scale: enabled ? scale : 1 }}>{children}</m.div>
  </div>;
}
