"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import media from "@/lib/section-media.json";
import "@/app/component-utilities.css";
import "./connoisseur-stack-interactor.css";

export interface MenuItem {
  num: string;
  name: string;
  clipId: string;
  image: string;
  width: number;
  height: number;
  alt: string;
}

const defaultItems: MenuItem[] = media.menus.map((item, index) => ({
  num: String(index + 1).padStart(2, "0"), name: item.label, clipId: item.id,
  image: item.src, width: item.width, height: item.height, alt: item.alt,
}));
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getMotionPreference = () => window.matchMedia(motionQuery).matches;
const serverMotionPreference = () => true;

/** Adaptation of the supplied Connoisseur interactor.
 * GSAP reveals the SVG mask; Motion moves the text. Each owns separate elements.
 * The phone remains whole and readable after a single reveal, with no idle loop.
 */
export function Component({ items = defaultItems, className, intro, action }: {
  items?: MenuItem[]; className?: string; intro?: ReactNode; action?: ReactNode;
}) {
  const uid = `menu-stack-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduced = useSyncExternalStore(subscribeMotion, getMotionPreference, serverMotionPreference);
  const [active, setActive] = useState(0), [focus, setFocus] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null), image = useRef<HTMLImageElement>(null);
  const clip = useRef<SVGClipPathElement>(null), tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0), generation = useRef(0), mounted = useRef(true);
  const loads = useRef(new Map<string, Promise<void>>());
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[active];
  const clipId = `${uid}-${item?.clipId ?? "empty"}`;
  const columns = active % 3 === 0 ? 1 : active % 3 === 1 ? 2 : 3;
  const rows = columns === 1 ? 7 : columns === 2 ? 3 : 4;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; generation.current++; };
  }, []);

  const preload = (index: number) => {
    const src = items[index].image;
    let pending = loads.current.get(src);
    if (!pending) {
      const next = new Image(); next.decoding = "async"; next.src = src;
      pending = next.decode().catch(error => { loads.current.delete(src); throw error; });
      loads.current.set(src, pending);
    }
    return pending;
  };
  const select = async (index: number) => {
    const ownGeneration = ++generation.current;
    setFocus(index); setError("");
    if (index === activeRef.current) { setBusy(false); return; }
    setBusy(true);
    try {
      await preload(index);
      if (!mounted.current || ownGeneration !== generation.current) return;
      setPrevious(activeRef.current); activeRef.current = index;
      setActive(index); setBusy(false);
    } catch {
      if (mounted.current && ownGeneration === generation.current) {
        setBusy(false); setError("Não foi possível carregar esta imagem. Tente novamente.");
      }
    }
  };

  useLayoutEffect(() => {
    const target = image.current;
    if (!target || !clip.current || previous === null) return;
    if (reduced) { target.style.clipPath = ""; setPrevious(null); return; }
    const context = gsap.context(() => {
      target.style.clipPath = `url(#${clipId})`;
      const timeline = gsap.timeline({ onComplete: () => {
        target.style.clipPath = "";
        setPrevious(null);
      } });
      [...clip.current!.children].forEach((tile, index) => {
        const x = (index % columns) / columns, y = Math.floor(index / columns) / rows;
        const width = 1 / columns + .001, height = 1 / rows + .001;
        timeline.fromTo(tile,
          { attr: { x: x + width / 2, y: y + height / 2, width: 0, height: 0 } },
          { attr: { x, y, width, height }, duration: .38, ease: "expo.out" },
          index * .012);
      });
    }, root);
    return () => { context.revert(); target.style.clipPath = ""; };
    // `previous` is a transition snapshot; clearing it must not restart the reveal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced, clipId, columns, rows]);

  const key = (event: KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % items.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + items.length) % items.length;
    else return;
    event.preventDefault(); tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "auto" });
  };

  if (!item) return null;
  return <div ref={root} className={cn("connoisseur-stack relative isolate min-w-0", className)}>
    <div className="connoisseur-intro">{intro ?? <h2>Seu cardápio, com a cara do seu negócio</h2>}</div>
    <div className="connoisseur-tabs" role="tablist" aria-label="Tipos de negócio">
      {items.map((entry, index) => <button key={entry.clipId} type="button" role="tab"
        ref={element => { tabs.current[index] = element; }}
        id={`${uid}-tab-${index}`} aria-controls={`${uid}-panel`} aria-label={entry.name}
        aria-selected={active === index} tabIndex={focus === index ? 0 : -1}
        onFocus={() => void select(index)} onClick={() => void select(index)} onKeyDown={event => key(event, index)}
        onPointerEnter={event => {
          if (event.pointerType === "mouse") void select(index);
          else void preload(index).catch(() => {});
        }}>
        <span className="connoisseur-number" aria-hidden="true">{entry.num}</span>
        <motion.span className="connoisseur-name" initial={false}
          animate={{ x: active === index ? 8 : 0 }} transition={{ duration: reduced ? 0 : .22, ease: [.22, 1, .36, 1] }}>
          {entry.name}
        </motion.span>
      </button>)}
    </div>
    <div className="connoisseur-panel" id={`${uid}-panel`} role="tabpanel"
      aria-labelledby={`${uid}-tab-${active}`} aria-busy={busy} tabIndex={0}>
      <div className="connoisseur-phone reform-media-frame" onTouchStart={event => {
        const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY };
      }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={event => {
        const from = touch.current, to = event.changedTouches[0]; touch.current = null;
        if (!from || !to) return;
        const dx = to.clientX - from.x, dy = to.clientY - from.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          const next = (activeRef.current + (dx < 0 ? 1 : -1) + items.length) % items.length;
          void select(next);
          tabs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "auto" });
        }
      }}>
        <svg className="connoisseur-mask" width="0" height="0" aria-hidden="true" focusable="false">
          <defs><clipPath id={clipId} ref={clip} clipPathUnits="objectBoundingBox">
            {Array.from({ length: rows * columns }, (_, index) => <rect key={`${columns}-${index}`} className="path"
              x={(index % columns) / columns} y={Math.floor(index / columns) / rows}
              width={1 / columns + .001} height={1 / rows + .001} />)}
          </clipPath></defs>
        </svg>
        {previous !== null && <img className="connoisseur-previous" src={items[previous].image}
          width={items[previous].width} height={items[previous].height} alt="" aria-hidden="true" decoding="async" loading="lazy" />}
        <img ref={image} className="connoisseur-current reform-media-current" src={item.image}
          width={item.width} height={item.height} alt={item.alt} decoding="async" loading="lazy" />
      </div>
      <p className="connoisseur-status" role="status" aria-live="polite">{error || (busy ? "Carregando imagem…" : "")}</p>
    </div>
    {action && <div className="connoisseur-action">{action}</div>}
  </div>;
}

export { Component as ConnoisseurStackInteractor };
