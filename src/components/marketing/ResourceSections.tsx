"use client";

import { useRef, useState, type CSSProperties } from "react";
import { MarketingMotion, Reveal } from "./Motion";
import StackingCards, { StackingCardItem } from "@/components/ui/stacking-cards";
import { ReportDialog, type MediaItem } from "@/components/sections/MediaSelector";
import "./resource-stack.css";

const screens: MediaItem[] = [
  { id: "caixa", label: "Caixa", src: "/sistema/caixa-menu10.webp", width: 1920, height: 953, alt: "Tela do Caixa do Menu10" },
  { id: "retaguarda", label: "Retaguarda", src: "/sistema/retaguarda-menu10.webp", width: 1920, height: 1042, alt: "Tela da Retaguarda do Menu10" },
];
const groups = [
  ["Produtos", "Cadastre produtos, sabores e opcionais de escolha."],
  ["Dinheiro", "Estoque, financeiro e DRE no mesmo lugar."],
  ["Clientes", "Cadastro de clientes e motoboys e o controle da fidelidade."],
  // TODO(confirmar): validar o escopo do robô; não prometer atendimento automático.
  ["Notas e robô", "Acompanhe as notas fiscais dos pedidos e controle o robô do WhatsApp."],
];

export function Operations() {
  const [expanded, setExpanded] = useState<MediaItem | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return <MarketingMotion><section id="recursos" className="resource-stack-section" aria-labelledby="resources-title">
    <div className="container">
      <h2 id="resources-title">O balcão <em>e os bastidores.</em></h2>
      <StackingCards totalCards={2} scaleMultiplier={.06}>
        {screens.map((screen, index) => <StackingCardItem key={screen.id} index={index} id={screen.id} className={`resource-card resource-card--${screen.id}`} role="group" aria-labelledby={`${screen.id}-title`}>
          <div className="stacking-card-body">
            <Reveal className="resource-card-copy" data-stack-content>
              <p className="resource-card-label">{screen.label}</p>
              <h3 id={`${screen.id}-title`}>{index === 0 ? "O caixa acompanha a correria." : "Por trás do balcão, tudo no mesmo lugar."}</h3>
              {index === 0 ? <>
                <p>Lance pedidos locais e de delivery, inclusive de quem pede por WhatsApp. Feche só o delivery ou a loja inteira, ajuste o tempo de entrega, ative e desative produtos e consulte o estoque.</p>
                <p className="resource-card-highlight"><strong>Acabou o sabor? Desative uma vez e ele sai de todas as pizzas.</strong></p>
                <p className="resource-card-detail">Integração com a maquininha Stone e controle de balança.</p>
              </> : <div className="resource-card-groups">{groups.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div>}
            </Reveal>
            <div className="resource-card-media">
              <div className="resource-card-frame" style={{ aspectRatio: `${screen.width} / ${screen.height}`, "--screen-ratio": screen.width / screen.height } as CSSProperties}>
                <img src={screen.src} width={screen.width} height={screen.height} alt={screen.alt} loading="lazy" decoding="async" />
              </div>
              <button type="button" className="resource-card-expand" aria-label={`Ampliar tela ${index === 0 ? "do Caixa" : "da Retaguarda"}`} onClick={event => { trigger.current = event.currentTarget; setExpanded(screen); }}>Ampliar tela</button>
            </div>
          </div>
        </StackingCardItem>)}
      </StackingCards>
    </div>
    {expanded && <ReportDialog item={expanded} accessibleLabel={`${expanded.alt} ampliada`} regionLabel="Tela do sistema; no tamanho original, role para explorar os detalhes" onClose={() => { setExpanded(null); trigger.current?.focus({ preventScroll: true }); }} />}
  </section></MarketingMotion>;
}
