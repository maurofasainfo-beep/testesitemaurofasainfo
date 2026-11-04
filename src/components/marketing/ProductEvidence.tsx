"use client";

import { useRef, useState } from "react";
import { MarketingMotion, Reveal } from "./Motion";
import { ReportDialog, type MediaItem } from "@/components/sections/MediaSelector";

const panels: (MediaItem & { preview: string; previewWidth: number; previewHeight: number })[] = [
  { id: "dre", label: "Financeiro", src: "/images/evidence/painel-dre.webp", preview: "/images/evidence/painel-dre-recorte.webp", previewWidth: 962, previewHeight: 340, width: 1014, height: 652, alt: "DRE financeiro do Menu10 com receitas, despesas e resultado do período" },
  { id: "recompra", label: "Recompra", src: "/images/evidence/painel-recompra.webp", preview: "/images/evidence/painel-recompra-recorte.webp", previewWidth: 800, previewHeight: 525, width: 1600, height: 829, alt: "Painel de recompra e recuperação de clientes do Menu10" },
];
export function ProductEvidence() {
  const [expanded, setExpanded] = useState<MediaItem | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return <MarketingMotion><section id="resultado" className="product-evidence" aria-labelledby="evidence-title"><div className="container">
    <div className="evidence-intro"><h2 id="evidence-title">O movimento da loja.<br /><em>O resultado do negócio.</em></h2><p>Estoque, financeiro e DRE no mesmo lugar. Cashback, cupom e pontos com as regras que você define.</p></div>
    <div className="evidence-panels">{panels.map((panel, index) => <Reveal key={panel.id} className="evidence-panel">
      <h3>{index === 0 ? "Entenda o resultado." : "Acompanhe quem volta."}</h3>
      <button type="button" onClick={event => { trigger.current = event.currentTarget; setExpanded(panel); }} aria-label={`Ampliar ${panel.label.toLowerCase()}`}>
        <img src={panel.preview} width={panel.previewWidth} height={panel.previewHeight} alt={index === 0 ? "Recorte do DRE do Menu10 com despesas e resultado do período" : "Recorte do painel do Menu10 com indicadores de recompra e frequência de compra"} loading="lazy" decoding="async" /><span>Ampliar tela</span>
      </button>
    </Reveal>)}</div>
    {expanded && <ReportDialog item={expanded} onClose={() => { setExpanded(null); trigger.current?.focus({ preventScroll: true }); }} />}
  </div></section></MarketingMotion>;
}
