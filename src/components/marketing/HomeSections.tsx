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
