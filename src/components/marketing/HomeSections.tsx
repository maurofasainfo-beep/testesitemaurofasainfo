"use client";

import { useEffect, useRef } from "react";
import { animate, m, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { MarketingMotion } from "./Motion";
import "@/app/marketing.css";

function Count({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null), controls = useRef<AnimationPlaybackControls | null>(null), played = useRef(false);
  const reduced = useReducedMotion();
  const final = `${value}${suffix}`;
  useEffect(() => {
    if (reduced) { controls.current?.stop(); if (ref.current) ref.current.textContent = final; }
    return () => { controls.current?.stop(); };
  }, [reduced, final]);
  return <m.div onViewportEnter={() => {
    if (played.current || reduced) return;
    played.current = true;
    controls.current = animate(0, value, { duration: .5, ease: "easeOut", onUpdate: current => {
      if (ref.current) ref.current.textContent = `${Math.round(current)}${suffix}`;
    }, onComplete: () => { if (ref.current) ref.current.textContent = final; } });
  }} viewport={{ once: true, margin: "-15% 0px" }}>
    <dt><span ref={ref} aria-hidden="true">{final}</span><span className="visualmente-oculto">{final}</span></dt><dd>{label}</dd>
  </m.div>;
}

export function Numbers() {
  return <MarketingMotion><section id="numeros" className="launch-section launch-numbers" aria-label="Menu10 em números"><div className="container">
    <dl><Count value={90} suffix="+" label="restaurantes usam o Menu10" /><Count value={70} suffix=" mil+" label="pedidos por mês passam pelo sistema" /><Count value={5} suffix=" anos" label="de operação" /></dl>
  </div></section></MarketingMotion>;
}

export const orderSteps = [
  ["O pedido entra", "Pelo cardápio digital, pelo caixa — inclusive quem pede por WhatsApp — ou pelas plataformas integradas, sem abrir cada uma."],
  ["A cozinha recebe", "O pedido aparece na tela da cozinha e na impressão, sem anotar à mão."],
  ["A entrega sai", "Taxa por km, bairro ou área. O pedido segue com a localização para o motoboy cadastrado, e o app do motoboy permite acompanhar."],
  ["O cliente volta", "Cashback, cupom e fidelidade: você define quantos pontos cada produto dá."],
  ["Você enxerga tudo", "Os relatórios mostram o que vende e quando."],
];
function OrderSteps() {
  const cards = useRef<(HTMLDivElement | null)[]>([]), reduced = useReducedMotion();
  return <div className="order-carousel" data-motion={reduced ? "static" : "animated"} role="region" aria-label="Caminho do pedido, cinco etapas" aria-describedby="order-keyboard-hint">
    <p id="order-keyboard-hint" className="visualmente-oculto">Use as setas esquerda e direita para percorrer as etapas. Home vai à primeira e End à última.</p>
    <div className="order-board">
      <svg className="order-thread" viewBox="0 0 1200 380" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <defs><mask id="order-thread-mask"><m.path d="M115 155 C210 100 270 245 355 215 S520 100 595 155 S750 270 835 215 S990 90 1085 155" stroke="white" strokeWidth="3" initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .5, ease: "easeOut" }} /></mask></defs>
        <path d="M115 155 C210 100 270 245 355 215 S520 100 595 155 S750 270 835 215 S990 90 1085 155" stroke="currentColor" strokeWidth="2" strokeDasharray="8 7" mask="url(#order-thread-mask)" />
      </svg>
      <ol>{orderSteps.map(([title, text], index) => <li key={title} className={`order-slot order-tone-${index % 3}`}>
        <m.div className="order-note launch-reveal" ref={el => { cards.current[index] = el; }} tabIndex={0} role="group" aria-labelledby={`order-step-${index}`}
          onKeyDown={event => {
            const next = event.key === "Home" ? 0 : event.key === "End" ? orderSteps.length - 1 : event.key === "ArrowRight" ? Math.min(index + 1, orderSteps.length - 1) : event.key === "ArrowLeft" ? Math.max(index - 1, 0) : null;
            if (next === null || event.target !== event.currentTarget) return;
            event.preventDefault(); cards.current[next]?.focus({ preventScroll: true });
            cards.current[next]?.scrollIntoView?.({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
          }}
          initial={reduced ? false : { opacity: 0, y: 24, rotate: index % 2 ? 5 : -5 }}
          whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 2 : -2 }} viewport={{ once: true, margin: "-15% 0px" }}
          whileHover={reduced ? undefined : { rotate: 0, y: -6, transition: { duration: .2, ease: "easeOut", delay: 0 } }}
          whileFocus={reduced ? undefined : { rotate: 0, y: -6, transition: { duration: .2, ease: "easeOut", delay: 0 } }}
          transition={reduced ? { duration: 0 } : { type: "spring", duration: .45, bounce: .12, delay: index * .05 }}>
          <svg className="order-pin" viewBox="0 0 24 32" fill="currentColor" aria-hidden="true"><path d="M7 2h10v3l-2 2v8l4 4v3h-6v8h-2v-8H5v-3l4-4V7L7 5z" /></svg>
          <div className="order-note-inner"><span className="order-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3 id={`order-step-${index}`}>{title}</h3><p>{text}</p></div>
        </m.div>
      </li>)}</ol>
    </div>
  </div>;
}
export function OrderJourney() {
  return <MarketingMotion><section id="caminho-do-pedido" className="launch-section order-journey" aria-labelledby="order-title"><div className="container">
    <h2 id="order-title">Do pedido <em>ao relatório.</em></h2><OrderSteps />
    <a className="launch-text-link order-report-link" href="#gestao">Ver os relatórios</a>
  </div></section></MarketingMotion>;
}

export function GettingStarted() {
  const reduced = useReducedMotion();
  return <MarketingMotion><section id="como-comecar" className="launch-section onboarding" aria-labelledby="start-title"><div className="container">
    <h2 id="start-title">Você não monta<br /><em>nada sozinho.</em></h2>
    <div className="onboarding-track">
      <m.span className="onboarding-line" aria-hidden="true" initial={reduced ? false : { scaleX: 0, scaleY: 0 }} whileInView={{ scaleX: 1, scaleY: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .45, ease: "easeOut" }} />
      <ol>{[
        ["Alinhamos com você", "Produtos, categorias, imagens e configurações. Se você já tem cardápio, a gente consegue copiar."],
        ["Ajustamos tudo", "A implementação leva de 1 a 2 semanas."],
        ["Treinamos a sua equipe", "Depois, marcamos o treinamento do sistema."],
      ].map(([title, text], index) => <li key={title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </div>
  </div></section></MarketingMotion>;
}
