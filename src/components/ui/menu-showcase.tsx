"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import pairs from "@/lib/menu-pairs.json";
import { CompareReveal } from "./compare-reveal";
import "./connoisseur-stack-interactor.css";
import "./menu-showcase.css";

export function MenuShowcase({ action }: { action: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0), [focused, setFocused] = useState(0);
  const [position, setPosition] = useState(50);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const activeRef = useRef(0), version = useRef(0), alive = useRef(true);
  const loads = useRef(new Map<string, Promise<void>>());
  const tabs = useRef<(HTMLButtonElement | null)[]>([]), visual = useRef<HTMLDivElement>(null);
  const uid = `showcase-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => { alive.current = true; return () => { alive.current = false; version.current++; }; }, []);
  const preload = (index: number) => Promise.all(pairs[index].layouts.map(item => {
    let pending = loads.current.get(item.src);
    if (!pending) {
      const image = new Image(); image.decoding = "async"; image.src = item.src;
      pending = image.decode().catch(error => { loads.current.delete(item.src); throw error; });
      loads.current.set(item.src, pending);
    }
    return pending;
  }));
  const select = async (index: number) => {
    const own = ++version.current;
    setFocused(index); setError("");
    if (index === activeRef.current) { setBusy(false); return; }
    setBusy(true);
    try {
      await preload(index);
      if (!alive.current || version.current !== own) return;
      activeRef.current = index; setActive(index); setBusy(false);
    } catch {
      if (alive.current && version.current === own) { setBusy(false); setError("Não foi possível carregar os dois layouts. Tente novamente."); }
    }
  };

  useLayoutEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches || !visual.current?.animate) return;
    const animation = visual.current.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    const stop = () => { if (query.matches) animation.cancel(); };
    query.addEventListener("change", stop);
    return () => { animation.cancel(); query.removeEventListener("change", stop); };
  }, [active]);

  const key = (event: KeyboardEvent, index: number) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? pairs.length-1
      : ["ArrowRight", "ArrowDown"].includes(event.key) ? (index+1)%pairs.length
      : ["ArrowLeft", "ArrowUp"].includes(event.key) ? (index-1+pairs.length)%pairs.length : null;
    if (next === null) return;
    event.preventDefault(); tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "auto" });
  };
  const item = pairs[active];
  return <div className="menu-showcase">
    <div className="menu-showcase-intro">
      <h2 id="reform-menu-title">Seu cardápio.<br /><em>Do seu jeito.</em></h2>
      <p>Escolha o tipo de negócio. Depois, deslize no celular para comparar as duas formas de mostrar o mesmo cardápio.</p>
    </div>
    <div className="connoisseur-tabs" role="tablist" aria-label="Tipos de negócio">
      {pairs.map((entry, index) => <button key={entry.id} type="button" role="tab" id={`${uid}-tab-${entry.id}`}
        aria-controls={`${uid}-panel`} aria-selected={index === active} tabIndex={index === focused ? 0 : -1}
        ref={el => { tabs.current[index] = el; }} onFocus={() => void select(index)} onClick={() => void select(index)}
        onKeyDown={event => key(event, index)} onPointerEnter={event => {
          if (event.pointerType === "mouse") void select(index);
          else void preload(index).catch(() => {});
        }}>
        <motion.span className="connoisseur-name" initial={false} animate={{ x: index === active ? 8 : 0 }} transition={{ duration: reducedMotion ? 0 : .22, ease: [.22, 1, .36, 1] }}>{entry.label}</motion.span>
      </button>)}
    </div>
    <div className="menu-showcase-visual" id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${item.id}`} aria-busy={busy} tabIndex={0}>
      <span id="layouts" className="menu-showcase-anchor" aria-hidden="true" />
      <div ref={visual}><CompareReveal before={item.layouts[0]} after={item.layouts[1]} position={position} onPositionChange={setPosition} /></div>
      <p className="menu-showcase-status" role="status">{error || (busy ? "Carregando os dois layouts…" : "")}</p>
    </div>
    <p className="menu-showcase-details"><span><strong>Layout 1</strong> Categorias em imagens</span><span><strong>Layout 2</strong> Produtos em lista</span></p>
    <div className="menu-showcase-action">{action}</div>
  </div>;
}
