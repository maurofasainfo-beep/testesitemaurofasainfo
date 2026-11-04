"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export type MediaItem = { id: string; label: string; src: string; width: number; height: number; alt: string; caption?: string;
  preview?: string; previewWidth?: number; previewHeight?: number; previewAlt?: string; previewCrop?: boolean; visibleHeight?: number };
export function MediaSelector({ id, label, items, kind, intro, action }: {
  id: string; label: string; items: MediaItem[]; kind: "menus" | "reports"; intro: ReactNode; action: ReactNode;
}) {
  const [active, setActive] = useState(0), [focus, setFocus] = useState(0), [previous, setPrevious] = useState<number | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [expanded, setExpanded] = useState<MediaItem | null>(null);
  const expandTrigger = useRef<HTMLElement | null>(null);
  const activeRef = useRef(0), version = useRef(0), mounted = useRef(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]), incoming = useRef<HTMLImageElement>(null), outgoing = useRef<HTMLImageElement>(null);
  const loads = useRef(new Map<string, Promise<void>>()), touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; version.current++; }; }, []);
  const preload = (index: number) => {
    const src = items[index].src;
    let pending = loads.current.get(src);
    if (!pending) {
      const image = new Image(); image.decoding = "async"; image.src = src;
      pending = image.decode().catch(e => { loads.current.delete(src); throw e; });
      loads.current.set(src, pending);
    }
    return pending;
  };
  const select = async (index: number) => {
    const ownVersion = ++version.current;
    setFocus(index); setError("");
    if (index === activeRef.current) { setBusy(false); return; }
    setBusy(true);
    try {
      await preload(index);
      if (!mounted.current || ownVersion !== version.current) return;
      setPrevious(activeRef.current); activeRef.current = index; setActive(index); setBusy(false);
    } catch {
      if (mounted.current && ownVersion === version.current) { setBusy(false); setError("Não foi possível carregar esta imagem. Tente novamente."); }
    }
  };
  useLayoutEffect(() => {
    if (previous === null) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !incoming.current?.animate) { setPrevious(null); return; }
    let alive = true;
    const animations = [incoming.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "ease-out" })];
    if (outgoing.current) animations.push(outgoing.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: "ease-out" }));
    const instant = () => { if (media.matches) { animations.forEach(a => a.cancel()); setPrevious(null); } };
    media.addEventListener("change", instant);
    Promise.allSettled(animations.map(a => a.finished)).then(() => { if (alive) setPrevious(null); });
    return () => { alive = false; animations.forEach(a => a.cancel()); media.removeEventListener("change", instant); };
  }, [active, previous]);
  const key = (event: React.KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % items.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + items.length) % items.length;
    else return;
    event.preventDefault(); tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "auto" });
  };
  const item = items[active];
  const Frame = kind === "reports" ? "button" : "div";
  return <div className={`reform-selector reform-selector--${kind}`}>
    <div className="reform-selector-intro">{intro}</div>
    <div className="reform-tabs" role="tablist" aria-label={label}>
      {items.map((entry, index) => <button key={entry.id} type="button" role="tab" id={`${id}-${entry.id}`} aria-controls={`${id}-panel`}
        aria-selected={active === index} tabIndex={focus === index ? 0 : -1} ref={el => { tabs.current[index] = el; }}
        onFocus={() => void select(index)} onClick={() => void select(index)} onKeyDown={e => key(e, index)}
        onPointerEnter={() => { void preload(index).catch(() => {}); }}>{entry.label}</button>)}
    </div>
    <div className="reform-media-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${item.id}`} aria-busy={busy} tabIndex={0}>
      <figure>
        <Frame className="reform-media-frame" type={kind === "reports" ? "button" : undefined} aria-label={kind === "reports" ? `Ampliar relatório de ${item.label.toLowerCase()}` : undefined}
          onClick={event => { if (kind === "reports") { expandTrigger.current = event.currentTarget; setExpanded(item); } }}
          onTouchStart={e => { const p = e.touches[0]; touch.current = { x: p.clientX, y: p.clientY }; }}
          onTouchCancel={() => { touch.current = null; }} onTouchEnd={e => {
            const from = touch.current, to = e.changedTouches[0]; touch.current = null;
            if (!from || !to || kind !== "menus") return;
            const dx = to.clientX - from.x, dy = to.clientY - from.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) void select((activeRef.current + (dx < 0 ? 1 : -1) + items.length) % items.length);
          }}>
          <div className="reform-media-stack">{previous !== null && <img className="reform-media-old" ref={outgoing} src={items[previous].preview ?? items[previous].src}
            width={items[previous].previewWidth ?? items[previous].width} height={items[previous].previewHeight ?? items[previous].height}
            alt="" aria-hidden="true" decoding="async" loading="lazy" />}
          <img key={item.id} ref={incoming} className={`reform-media-current${item.previewCrop ? " is-focused" : ""}`}
            src={item.preview ?? item.src} width={item.previewWidth ?? item.width} height={item.previewHeight ?? item.height}
            alt={item.previewAlt ?? item.alt} decoding="async" loading="lazy" />
          </div>
          {kind === "reports" && <span className="reform-report-expand" aria-hidden="true">Ampliar tela</span>}
        </Frame>
        {item.caption && <figcaption>{item.caption}<span className="reform-report-hint">Telas reais do sistema, com os dados de um restaurante cliente.</span></figcaption>}
      </figure>
      <p className="reform-media-status" role="status" aria-live="polite">{error || (busy ? "Carregando imagem…" : "")}</p>
    </div>
    <div className="reform-selector-action">{action}</div>
    {expanded && <ReportDialog item={expanded} onClose={() => { setExpanded(null); expandTrigger.current?.focus({ preventScroll: true }); }} />}
  </div>;
}

export function ReportDialog({ item, onClose, accessibleLabel, regionLabel }: { item: MediaItem; onClose: () => void; accessibleLabel?: string; regionLabel?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [actualSize, setActualSize] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    return () => { document.body.style.overflow = overflow; };
  }, []);
  const close = () => dialog.current?.close();
  return <dialog className="reform-report-dialog" ref={dialog} aria-label={accessibleLabel ?? `Relatório de ${item.label.toLowerCase()} ampliado`}
    onClose={onClose} onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="reform-report-dialog-bar">
      <strong>{item.label}</strong>
      <button type="button" aria-pressed={actualSize} onClick={() => setActualSize(value => !value)}>{actualSize ? "Ajustar à tela" : "Tamanho original"}</button>
      <button type="button" onClick={close} autoFocus>Fechar</button>
    </div>
    <div className="reform-report-dialog-scroll" tabIndex={0} role="region" aria-label={regionLabel ?? "Imagem do relatório; no tamanho original, role para explorar os detalhes"}>
      {item.visibleHeight ? <div className="reform-report-visible-crop" style={{ width: actualSize ? item.width : "100%", aspectRatio: `${item.width} / ${item.visibleHeight}` }}>
        <img className={actualSize ? "is-original-size" : undefined} src={item.src} width={item.width} height={item.height} alt={item.alt} decoding="async" loading="lazy" />
      </div> : <img className={actualSize ? "is-original-size" : undefined} src={item.src} width={item.width} height={item.height} alt={item.alt} decoding="async" loading="lazy" />}
    </div>
    <p>Use “Tamanho original” para ler os detalhes e role pela imagem.</p>
  </dialog>;
}
