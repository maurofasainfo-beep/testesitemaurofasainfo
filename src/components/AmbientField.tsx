"use client";

import { useEffect, useRef } from "react";

export function AmbientField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const surface = canvas.current;
    const parent = surface?.parentElement;
    const ctx = surface?.getContext("2d");
    if (!surface || !parent || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, phase = 0, visible = false;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(232,209,250,.3)";
      for (let i = 0; i < 260; i++) {
        const lane = i % 7;
        const t = i / 260 * Math.PI * 2 + phase * .065;
        const x = width * .5 + Math.cos(t) * (width * .42 + lane * 19);
        const y = height * .55 + Math.sin(t * 1.4 + lane * .13) * (height * .43 + lane * 6);
        ctx.fillRect(x, y, 1.6, 1.6);
      }
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const tick = (now: number) => {
      if (!visible || document.hidden || reduced.matches) { stop(); return; }
      frame = requestAnimationFrame(tick);
      if (last && now - last < 32) return;
      phase += last ? Math.min(now - last, 65) / 1000 : 0;
      last = now; draw();
    };
    const resume = () => { if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick); };
    const size = () => {
      const r = parent.getBoundingClientRect(); width = r.width; height = r.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      surface.width = width * dpr; surface.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    };
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) resume(); else stop(); }); observer.observe(parent);
    const resize = new ResizeObserver(size); resize.observe(parent);
    const visibility = () => { if (document.hidden) stop(); else resume(); };
    const preference = () => { if (reduced.matches) { stop(); draw(); } else resume(); };
    reduced.addEventListener("change", preference); document.addEventListener("visibilitychange", visibility);
    size();
    return () => { stop(); observer.disconnect(); resize.disconnect(); reduced.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <canvas className="ambient-field" ref={canvas} aria-hidden="true" />;
}
