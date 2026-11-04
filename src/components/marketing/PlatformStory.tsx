"use client";

import { useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { MarketingMotion } from "./Motion";
import { ReportDialog, type MediaItem } from "@/components/sections/MediaSelector";
import "@/app/platform-story.css";

const platforms = [
  { name: "iFood", src: "/images/integracoes/ifood.webp" },
  { name: "99Food", src: "/images/integracoes/99food.webp" },
  { name: "aiqfome", src: "/images/integracoes/aiqfome.webp" },
];

const stages = [
  { title: "Entra", text: "Pelo cardápio digital, pelo caixa ou pelas plataformas integradas." },
  { title: "Produz", text: "O pedido aparece no KDS, a tela da cozinha, e na impressão." },
  { title: "Entrega", text: "O motoboy cadastrado recebe o pedido com a localização; o app permite acompanhar." },
  { title: "Reaproxima", text: "Cashback, cupom e pontos seguem as regras que você define." },
  { title: "Mostra", text: "Os relatórios mostram o que vende e quando." },
];

const screens: (MediaItem & { heading: string; body: string; details: string[]; preview: string; previewWidth: number; previewHeight: number; previewAlt: string; focusLabel: string })[] = [
  {
    id: "caixa", label: "Caixa", heading: "Pedidos locais e delivery no mesmo caixa.",
    body: "Lance pedidos locais e de delivery, inclusive de quem pede por WhatsApp. Feche só o delivery ou a loja inteira e ajuste o tempo de entrega.",
    details: ["Desative um sabor uma vez; ele sai de todas as pizzas.", "Consulte estoque, ative produtos e tire relatórios.", "Integração com a maquininha Stone e controle de balança."],
    src: "/sistema/caixa-pedidos-menu10.webp", width: 1368, height: 728, alt: "Tela de demonstração do Caixa do Menu10, com pedidos em diferentes situações",
    preview: "/sistema/caixa-pedidos-detalhe.webp", previewWidth: 1180, previewHeight: 500, previewAlt: "Recorte da tela do Caixa do Menu10 mostrando pedidos de demonstração",
    focusLabel: "Situação e previsão de cada pedido",
  },
  {
    id: "retaguarda", label: "Retaguarda", heading: "Estoque, financeiro e DRE lado a lado.",
    body: "Produtos, sabores, opcionais, estoque, financeiro, DRE e fidelidade no mesmo sistema.",
    details: ["Cadastre clientes e motoboys.", "Acompanhe as notas fiscais dos pedidos; é preciso certificado digital.", "Controle o robô do WhatsApp."],
    src: "/sistema/retaguarda-menu10.webp", width: 1920, height: 1042, alt: "Tela real da Retaguarda do Menu10, com indicadores da operação",
    preview: "/sistema/retaguarda-menu10.webp", previewWidth: 1920, previewHeight: 1042, previewAlt: "Tela da Retaguarda do Menu10 com indicadores da operação",
    focusLabel: "Produção, retirada e delivery na mesma visão",
  },
];

export function PlatformStory() {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState<MediaItem | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const stageRail = useRef<HTMLOListElement | null>(null);
  const open = (item: MediaItem, button: HTMLButtonElement) => { trigger.current = button; setExpanded(item); };
  const close = () => { setExpanded(null); trigger.current?.focus({ preventScroll: true }); };
  const moveStage = (index: number) => {
    const rail = stageRail.current;
    const item = rail?.children.item(index);
    if (!rail || !item) return;
    const left = item.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
    rail.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    setStageIndex(index);
  };
  const syncStage = () => {
    const rail = stageRail.current;
    if (!rail) return;
    const left = rail.getBoundingClientRect().left;
    const positions = [...rail.children].map(item => Math.abs(item.getBoundingClientRect().left - left));
    setStageIndex(positions.indexOf(Math.min(...positions)));
  };
  return <MarketingMotion>
    <section id="caminho-do-pedido" className="platform-flow" aria-labelledby="flow-heading">
      <div className="container">
        <div className="platform-flow-intro">
          <h2 id="flow-heading">Três plataformas.<br /><em>Uma operação só.</em></h2>
          <p>O pedido das plataformas integradas cai direto no Menu10, sem precisar abrir cada uma. Do caixa à entrega, a informação segue com a operação.</p>
        </div>
        <div className="platform-flow-map" aria-label="Pedidos das plataformas integradas chegam ao Menu10">
          <div className="platform-sources">{platforms.map((platform, index) => <m.div key={platform.name} className="platform-source" initial={reduced ? false : { opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .36, delay: reduced ? 0 : index * .09, ease: "easeOut" }}><img src={platform.src} width="160" height="160" alt={platform.name} loading="lazy" decoding="async" /></m.div>)}</div>
          <m.div className="platform-connector" aria-hidden="true" initial={false} whileInView={reduced ? {} : { scaleX: 1, opacity: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: .45, ease: "easeOut" }} />
          <m.div className="platform-center" initial={reduced ? false : { opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .38, delay: reduced ? 0 : .3, ease: "easeOut" }}><img src="/images/integracoes/menu10.webp" className="platform-center-mark" width="192" height="211" alt="" loading="lazy" decoding="async" /><strong>Menu10</strong><span>Pedidos em um só lugar</span></m.div>
          <div className="platform-destinations">{["Caixa", "Cozinha", "Entrega"].map((destination, index) => <m.span key={destination} initial={reduced ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .3, delay: reduced ? 0 : .47 + index * .07, ease: "easeOut" }}>{destination}</m.span>)}</div>
        </div>
        <div className="platform-stage-controls" aria-label="Navegação pelas etapas do pedido">
          <span aria-live="polite">Etapa {stageIndex + 1} de {stages.length}</span>
          <div><button type="button" onClick={() => moveStage(stageIndex - 1)} disabled={stageIndex === 0}>Anterior</button>
          <button type="button" onClick={() => moveStage(stageIndex + 1)} disabled={stageIndex === stages.length - 1}>Próxima</button></div>
        </div>
        <ol ref={stageRail} className="platform-stages" tabIndex={0} onScroll={syncStage} aria-label="Etapas do pedido; deslize ou use os botões para percorrer">{stages.map((stage, index) => <li key={stage.title}>
          <span className="platform-stage-count" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span>
          <h3>{stage.title}</h3><p>{stage.text}</p>
        </li>)}</ol>
        <a className="platform-inline-link" href="#gestao">Ver os relatórios <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section id="recursos" className="platform-system" aria-labelledby="system-heading">
      <div className="container platform-system-heading"><h2 id="system-heading">Do balcão aos bastidores.<br /><em>Veja por dentro.</em></h2><p>Telas reais, com dados de demonstração.</p></div>
      {screens.map((screen, index) => <article key={screen.id} id={screen.id} className={`platform-screen platform-screen--${screen.id}`} aria-labelledby={`${screen.id}-heading`}>
        <div className="container platform-screen-grid">
          <div className="platform-screen-copy">
            <span className="platform-screen-index">{index === 0 ? "Caixa" : "Retaguarda"}</span>
            <h3 id={`${screen.id}-heading`}>{screen.heading}</h3>
            <p>{screen.body}</p>
            <ul>{screen.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
          </div>
          <m.button type="button" className="platform-screen-media" aria-label={`Ampliar tela ${index === 0 ? "do Caixa" : "da Retaguarda"}`}
            onClick={event => open(screen, event.currentTarget)} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .45, ease: "easeOut" }}>
            <span className="platform-screen-media-viewport"><img src={screen.preview} width={screen.previewWidth} height={screen.previewHeight} alt={screen.previewAlt} loading="lazy" decoding="async" /></span>
            <span className="platform-screen-media-meta"><span>{screen.focusLabel}</span><span>Ampliar tela</span></span>
          </m.button>
        </div>
      </article>)}
    </section>

    <section id="integracoes" className="platform-integrations" aria-labelledby="integrations-heading"><div className="container platform-integrations-grid">
      <h2 id="integrations-heading">A venda segue além do pedido.</h2>
      <div className="platform-integration-list">
        <div><h3>Entrega configurável</h3><p>Defina a taxa por km, bairro ou área. O app do motoboy permite acompanhar a entrega.</p></div>
        <div><h3>Cliente que volta</h3><p>O WhatsApp oficial envia o pedido ao cliente e ao motoboy, com a localização. Cashback, cupom e pontos seguem suas regras.</p></div>
        <div><h3>Loja online</h3><p>QR code de mesa e integrações com Mercado Pago, Correios, Jadlog e Melhor Envio no e-commerce.</p></div>
      </div>
      {/* TODO(confirmar): manter a formulação neutra sobre a operação sem internet até validar os detalhes técnicos. */}
      <p className="platform-offline"><strong>Quando a internet cai</strong><span>A operação local continua funcionando. Os pedidos online voltam a chegar quando a conexão volta.</span></p>
    </div></section>
    {expanded && <ReportDialog item={expanded} accessibleLabel={`${expanded.alt} ampliada`} regionLabel="Tela do sistema; no tamanho original, role para explorar os detalhes" onClose={close} />}
  </MarketingMotion>;
}
