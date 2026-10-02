"use client";

import { useEffect, useRef } from "react";
import hero from "@/lib/hero-image.json";
import logo from "@/lib/hero-logo.json";
import { dustPosition, frameBlend, readSamples, scrollProgress, type Sample } from "@/lib/particles";

export function ParticleMenu() {
  const stage = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const root = stage.current, surface = canvas.current;
    if (!root || !surface) return;
    const field = surface.parentElement!;
    const ctx = surface.getContext("2d", { alpha: true });
    if (!ctx) { root.dataset.phase = "settled"; return; }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), mobile = matchMedia("(max-width: 700px)");
    const controller = new AbortController();
    let data: ArrayBuffer | null = null, points: Sample[] = [];
    let frame = 0, last = 0, width = 0, height = 0, start = 0, distance = 1;
    let progress = 0, target = 0, visible = true, disposed = false, failed = false;
    const pointer = { x: -1000, y: -1000, intensity: 0, target: 0 };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const staticImage = () => {
      stop(); root.dataset.phase = "settled";
      surface.dataset.ready = "true";
      root.style.setProperty("--pointer-radius", "0px"); ctx.clearRect(0, 0, width, height);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const stageRect = root.getBoundingClientRect(), fieldRect = field.getBoundingClientRect();
      const offsetX = stageRect.left - fieldRect.left, offsetY = stageRect.top - fieldRect.top;
      const imageHeight = Math.min(stageRect.height * .84, stageRect.width * .86 * hero.height / hero.width);
      const imageWidth = imageHeight * hero.width / hero.height;
      const left = offsetX + (stageRect.width - imageWidth) / 2, top = offsetY + (stageRect.height - imageHeight) / 2;
      const scale = mobile.matches ? Math.min((width - 56) / 175, 1.7) : Math.min((width * .46 - 42) / 175, height * .74 / 193, 2.5);
      const logoLeft = width * (mobile.matches ? .5 : .735) - logo.width * scale / 2;
      const logoTop = (mobile.matches ? Math.min(height, Math.max(860, window.innerHeight)) * .77 : height * .52) - logo.height * scale / 2;
      root.style.setProperty("--menu-width", `${imageWidth}px`); root.style.setProperty("--menu-height", `${imageHeight}px`);
      // Ease into the real image so the final particles do not disappear abruptly.
      const reveal = Math.max(0, Math.min(1, (progress - .76) / .24));
      const imageOpacity = reveal * reveal * (3 - 2 * reveal);
      root.style.setProperty("--image-opacity", String(imageOpacity)); root.dataset.progress = progress.toFixed(4);
      const interactive = progress === 1 && pointer.intensity > .002;
      root.dataset.phase = interactive ? "interactive" : progress === 1 ? "settled" : progress === 0 ? "logo" : "forming";
      surface.dataset.ready = "true";
      const radius = 72 * pointer.intensity;
      root.style.setProperty("--pointer-x", `${pointer.x + offsetX - left}px`); root.style.setProperty("--pointer-y", `${pointer.y + offsetY - top}px`);
      root.style.setProperty("--pointer-radius", interactive ? `${radius}px` : "0px");
      if (progress === 1 && !interactive) return;
      const count = points.length || (mobile.matches ? 4200 : 6500);
      for (let i = 0; i < count; i++) {
        const p = points[i];
        const mark = logo.points[i];
        const origin = mark ? { x: logoLeft + mark[0] * scale, y: logoTop + mark[1] * scale } : dustPosition(i, width, height);
        const tx = p ? left + p.x / hero.sampleWidth * imageWidth : origin.x, ty = p ? top + p.y / hero.sampleHeight * imageHeight : origin.y;
        if (interactive) {
          if (!p) continue;
          const dx = tx - pointer.x - offsetX, dy = ty - pointer.y - offsetY, length = Math.hypot(dx, dy);
          if (length > radius || radius < .1) continue;
          const edge = Math.min(1, (radius - length) / (radius * .28)), force = (1 - length / radius) ** 2 * 27 * pointer.intensity;
          ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha * edge;
          const size = Math.max(1.3, imageWidth / hero.sampleWidth * 2.3);
          ctx.fillRect(tx + dx / Math.max(length, 1) * force - size / 2, ty + dy / Math.max(length, 1) * force - size / 2, size, size);
          continue;
        }
        // Scroll position is the only formation clock. Waiting never advances it.
        const delay = p ? p.y / hero.sampleHeight * .09 : 0;
        const t = Math.max(0, Math.min(1, (progress - delay) / (1 - delay))), local = t * t * (3 - 2 * t);
        const arc = Math.sin(local * Math.PI) * (mark ? 36 : 72);
        const x = origin.x + (tx - origin.x) * local + (p?.sin || 0) * arc;
        const y = origin.y + (ty - origin.y) * local + (p?.cos || 0) * arc * .5;
        const initialSize = mark ? scale * 1.5 : i % 7 === 0 ? 2.4 : 1.35;
        const size = initialSize + (Math.max(1.25, imageWidth / hero.sampleWidth * 2.3) - initialSize) * local;
        const rgb = p?.rgb || [128, 0, 187];
        const color = Math.max(0, (local - .12) / .88);
        ctx.fillStyle = color === 0 ? "rgb(128,0,187)" : `rgb(${Math.round(128 + (rgb[0] - 128) * color)},${Math.round(rgb[1] * color)},${Math.round(187 + (rgb[2] - 187) * color)})`;
        const initialAlpha = mark ? .8 : .36 + (i % 6) * .09;
        ctx.globalAlpha = (initialAlpha + ((p?.alpha || 1) - initialAlpha) * local) * (1 - imageOpacity);
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced.matches) { last = 0; return; }
      const delta = last ? now - last : 16.67;
      last = now;
      // Absorb wheel/touch jumps without changing the scroll-controlled destination.
      progress += ((points.length ? target : 0) - progress) * frameBlend(Math.min(delta, 64), mobile.matches ? 180 : 160);
      if (Math.abs(target - progress) < .0005) progress = target;
      pointer.intensity += (pointer.target - pointer.intensity) * frameBlend(Math.min(delta, 64), 100);
      if (Math.abs(pointer.target - pointer.intensity) < .002) pointer.intensity = pointer.target;
      draw();
      if ((points.length && progress !== target) || pointer.intensity !== pointer.target) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const requestDraw = () => {
      if (!frame && visible && !document.hidden && !reduced.matches && !disposed && !failed) frame = requestAnimationFrame(tick);
    };
    const scroll = () => { target = scrollProgress(window.scrollY, start, distance); if (target < 1) pointer.target = 0; requestDraw(); };
    const size = () => {
      const r = field.getBoundingClientRect(); width = r.width; height = r.height;
      const dpr = Math.min(devicePixelRatio || 1, mobile.matches ? 1.5 : 1.75);
      surface.width = Math.round(width * dpr); surface.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const section = root.closest(".abertura"), track = mobile.matches ? root.closest(".particle-track") : section;
      const pin = mobile.matches ? root.parentElement : section?.querySelector(".hero-pin");
      if (track && pin) {
        const rect = track.getBoundingClientRect(), pinnedTop = mobile.matches ? parseFloat(getComputedStyle(pin).top) || 84 : 0;
        start = rect.top + window.scrollY - pinnedTop; distance = Math.max(1, rect.height - pin.getBoundingClientRect().height);
      }
      if (data) points = readSamples(data, mobile.matches ? 4200 : 6500);
      target = scrollProgress(window.scrollY, start, distance); progress = data ? target : 0;
      if (reduced.matches || failed) staticImage(); else requestDraw();
    };
    const resize = new ResizeObserver(size); resize.observe(root); resize.observe(field);
    const section = root.closest(".abertura"); if (section) resize.observe(section);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); else scroll(); }, { threshold: .01 }); observer.observe(field);
    const visibility = () => { if (document.hidden) stop(); else { size(); scroll(); } };
    const preference = () => { pointer.target = pointer.intensity = 0; size(); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced.matches || target < 1 || progress < 1) return;
      const r = root.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.target = 1; requestDraw();
    };
    const leave = () => { pointer.target = 0; requestDraw(); };
    root.addEventListener("pointermove", move, { passive: true }); root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", preference); mobile.addEventListener("change", size);
    size();
    void (async () => {
      try {
        const response = await fetch("/images/hero-particles.bin", { signal: controller.signal });
        if (!response.ok) throw new Error("Particle asset unavailable");
        const buffer = await response.arrayBuffer(), img = root.querySelector<HTMLImageElement>(".particle-original");
        if (img && !img.complete) await img.decode();
        if (disposed) return;
        data = buffer; size();
      } catch { if (!disposed) { failed = true; staticImage(); } }
    })();
    return () => {
      disposed = true; controller.abort(); stop(); resize.disconnect(); observer.disconnect();
      root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", size); document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference); mobile.removeEventListener("change", size);
    };
  }, []);
  return <>
    <canvas className="hero-particle-field" ref={canvas} aria-hidden="true" />
    <img className="hero-logo" src="/images/hero-logo.svg" width="175" height="193" alt="" aria-hidden="true" fetchPriority="high" />
    <div className="particle-track"><div className="particle-composition">
    <div className="particle-stage" ref={stage} data-phase="logo" role="img" aria-label="Logo pontilhada do Menu10 que se transforma no cardápio ao rolar a página">
      <img className="particle-original" src="/images/hero-menu.webp" width={hero.width} height={hero.height} alt="" fetchPriority="high" decoding="async" />
      <span className="composition-index" aria-hidden="true">01 — MENU10</span>
    </div>
    <div className="composition-caption"><span>Da sua marca ao seu cardápio. Role para ver.</span></div>
  </div></div></>;
}
