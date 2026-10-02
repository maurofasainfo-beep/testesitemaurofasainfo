"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "./compare-reveal.css";

// Adapted from the user-provided Motiq Compare Reveal (MIT).
export type CompareRevealSource = React.ReactNode | { src: string; alt?: string; width?: number; height?: number };
export interface CompareRevealProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  before: CompareRevealSource; after: CompareRevealSource;
  defaultPosition?: number; position?: number; onPositionChange?: (value: number) => void;
  labels?: [string, string]; snapOnDoubleClick?: number;
  reducedMotion?: boolean; stiffness?: number; damping?: number;
}
const clamp = (value: number) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 50));
const subscribe = (notify: () => void) => {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const snapshot = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function renderSide(source: CompareRevealSource) {
  if (typeof source === "object" && source !== null && !React.isValidElement(source) && "src" in source) {
    return <img src={source.src} alt={source.alt ?? ""} width={source.width} height={source.height} loading="lazy" decoding="async" draggable={false} />;
  }
  return source;
}

export function CompareReveal({ before, after, defaultPosition = 50, position, onPositionChange,
  labels = ["Layout 1", "Layout 2"], snapOnDoubleClick = 50, reducedMotion, stiffness = 140, damping = 18,
  className, ...props }: CompareRevealProps) {
  const [internal, setInternal] = React.useState(clamp(defaultPosition));
  const value = clamp(position ?? internal);
  const systemReduced = React.useSyncExternalStore(subscribe, snapshot, () => true);
  const still = reducedMotion === true || systemReduced;
  const root = React.useRef<HTMLDivElement>(null), top = React.useRef<HTMLDivElement>(null), divider = React.useRef<HTMLDivElement>(null);
  const slider = React.useRef<HTMLButtonElement>(null);
  const pointer = React.useRef<number | null>(null);
  const simulation = React.useRef({ x: value, velocity: 0 });
  const uid = React.useId();

  React.useLayoutEffect(() => {
    let frame = 0, last = performance.now(), visible = true;
    const paint = () => {
      const x = clamp(simulation.current.x);
      if (top.current) top.current.style.clipPath = `inset(0 ${100 - x}% 0 0)`;
      if (divider.current) divider.current.style.left = `${x}%`;
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const settle = () => { stop(); simulation.current = { x: value, velocity: 0 }; paint(); };
    const tick = (now: number) => {
      const dt = Math.min(.016, Math.max(.001, (now - last) / 1000)); last = now;
      const s = simulation.current;
      s.velocity += ((value - s.x) * stiffness - s.velocity * damping) * dt;
      s.x = clamp(s.x + s.velocity * dt); paint();
      if (Math.abs(value - s.x) < .02 && Math.abs(s.velocity) < .02) settle();
      else frame = requestAnimationFrame(tick);
    };
    const start = () => {
      stop();
      if (still || !visible || document.visibilityState === "hidden") { settle(); return; }
      last = performance.now(); frame = requestAnimationFrame(tick);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; start();
    });
    if (root.current) observer?.observe(root.current);
    document.addEventListener("visibilitychange", start); paint(); start();
    return () => { stop(); observer?.disconnect(); document.removeEventListener("visibilitychange", start); };
  }, [value, still, stiffness, damping]);

  const commit = (next: number) => {
    const target = clamp(next);
    if (position === undefined) setInternal(target);
    onPositionChange?.(target);
  };
  const fromPointer = (clientX: number) => {
    const rect = root.current!.getBoundingClientRect();
    commit((clientX - rect.left) / Math.max(1, rect.width) * 100);
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pointer.current = null;
  };
  return <div className="menu10-compare-control">
    <div className="menu10-compare-labels" aria-hidden="true"><span>{labels[0]}</span><span>{labels[1]}</span></div>
    <div {...props} ref={root} role="group" aria-label={props["aria-label"] ?? `Comparação: ${labels[0]} e ${labels[1]}`}
      className={cn("menu10-compare", className)} data-motion={still ? "static" : "animated"}
      onPointerDown={event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointer.current = event.pointerId; event.currentTarget.setPointerCapture?.(event.pointerId);
        slider.current?.focus({ preventScroll: true }); fromPointer(event.clientX);
      }} onPointerMove={event => { if (pointer.current === event.pointerId) fromPointer(event.clientX); }}
      onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { pointer.current = null; }}
      onDoubleClick={() => commit(snapOnDoubleClick)}>
      <div className="menu10-compare-layer">{renderSide(after)}</div>
      <div ref={top} className="menu10-compare-layer" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>{renderSide(before)}</div>
      <div ref={divider} className="menu10-compare-divider" style={{ left: `${value}%` }}>
        <button ref={slider} type="button" role="slider" aria-label="Comparar layouts do cardápio" aria-describedby={uid}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={`${Math.round(value)}% ${labels[0]}, ${Math.round(100-value)}% ${labels[1]}`}
          aria-orientation="horizontal" onKeyDown={event => {
            const step = event.shiftKey ? 10 : 2;
            const next = event.key === "Home" ? 0 : event.key === "End" ? 100 : ["ArrowRight", "ArrowUp"].includes(event.key) ? value + step : ["ArrowLeft", "ArrowDown"].includes(event.key) ? value - step : null;
            if (next === null) return; event.preventDefault(); commit(next);
          }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M6 1 1 7 6 13M12 1 17 7 12 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
    <p id={uid} className="menu10-compare-hint">Arraste a divisória ou use as setas do teclado.</p>
    <div className="menu10-compare-actions" role="group" aria-label="Visualização da comparação">
      <button type="button" aria-label={`Ver ${labels[0].toLowerCase()}`} aria-pressed={value === 100} onClick={() => commit(100)}>{labels[0]}</button>
      <button type="button" aria-pressed={value > 0 && value < 100} onClick={() => commit(50)}>Comparar</button>
      <button type="button" aria-label={`Ver ${labels[1].toLowerCase()}`} aria-pressed={value === 0} onClick={() => commit(0)}>{labels[1]}</button>
    </div>
  </div>;
}
export default CompareReveal;
