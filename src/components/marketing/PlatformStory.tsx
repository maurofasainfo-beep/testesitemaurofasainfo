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

const screens: (MediaItem & { heading: string; body: string; details: string[]; preview: string; previewWidth: number; previewHeight: number; previewAlt: string })[] = [
  {
    id: "caixa", label: "Caixa", heading: "Pedidos locais e delivery no mesmo caixa.",
    body: "Lance pedidos locais e de delivery, inclusive de quem pede por WhatsApp. Feche só o delivery ou a loja inteira e ajuste o tempo de entrega.",
    details: ["Desative um sabor uma vez; ele sai de todas as pizzas.", "Consulte estoque, ative produtos e tire relatórios.", "Integração com a maquininha Stone e controle de balança."],
    src: "/sistema/caixa-pedidos-menu10.webp", width: 1368, height: 728, alt: "Tela de demonstração do Caixa do Menu10, com pedidos em diferentes situações",
    preview: "/sistema/caixa-pedidos-detalhe.webp", previewWidth: 1180, previewHeight: 500, previewAlt: "Recorte da tela do Caixa do Menu10 mostrando pedidos de demonstração",
  },
  {
    id: "retaguarda", label: "Retaguarda", heading: "Estoque, financeiro e DRE lado a lado.",
    body: "Produtos, sabores, opcionais, estoque, financeiro, DRE e fidelidade no mesmo sistema.",
    details: ["Cadastre clientes e motoboys.", "Acompanhe as notas fiscais dos pedidos; é preciso certificado digital.", "Controle o robô do WhatsApp."],
    src: "/sistema/retaguarda-menu10.webp", width: 1920, height: 1042, alt: "Tela real da Retaguarda do Menu10, com indicadores da operação",
    preview: "/sistema/retaguarda-menu10.webp", previewWidth: 1920, previewHeight: 1042, previewAlt: "Tela da Retaguarda do Menu10 com indicadores da operação",
  },
];

export function PlatformStory() {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState<MediaItem | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const open = (item: MediaItem, button: HTMLButtonElement) => { trigger.current = button; setExpanded(item); };
  const close = () => { setExpanded(null); trigger.current?.focus({ preventScroll: true }); };
  return <MarketingMotion>
    <section id="caminho-do-pedido" className="platform-flow" aria-labelledby="flow-heading">
      <div className="container">
        <div className="platform-flow-intro">
          <h2 id="flow-heading">Três plataformas.<br /><em>Uma operação só.</em></h2>
          <p>O pedido das plataformas integradas cai direto no Menu10, sem precisar abrir cada uma. Do caixa à entrega, a informação segue com a operação.</p>
        </div>
        <div className="platform-flow-map" aria-label="Pedidos das plataformas integradas chegam ao Menu10">
          <div className="platform-sources">{platforms.map(platform => <div key={platform.name} className="platform-source"><img src={platform.src} width="160" height="160" alt={platform.name} loading="lazy" decoding="async" /></div>)}</div>
          <m.div className="platform-connector" aria-hidden="true" initial={false} whileInView={reduced ? {} : { scaleX: 1, opacity: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: .45, ease: "easeOut" }} />
          <div className="platform-center"><img src="/images/integracoes/menu10.webp" className="platform-center-mark" width="192" height="211" alt="" loading="lazy" decoding="async" /><strong>Menu10</strong><span>Pedidos em um só lugar</span></div>
          <div className="platform-destinations"><span>Caixa</span><span>Cozinha</span><span>Entrega</span></div>
        </div>
        <ol className="platform-stages" tabIndex={0} aria-label="Etapas do pedido; no celular, use as setas para percorrer">{stages.map((stage, index) => <li key={stage.title}>
          <span className="platform-stage-count" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span>
          <h3>{stage.title}</h3><p>{stage.text}</p>
        </li>)}</ol>
        <a className="platform-inline-link" href="#gestao">Ver os relatórios <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section id="recursos" className="platform-system" aria-labelledby="system-heading">
      <div className="container platform-system-heading"><h2 id="system-heading">Do balcão aos bastidores.<br /><em>Veja por dentro.</em></h2><p>Capturas reais da interface, com dados de demonstração. Amplie para observar os detalhes.</p></div>
      {screens.map((screen, index) => <article key={screen.id} id={screen.id} className={`platform-screen platform-screen--${screen.id}`} aria-labelledby={`${screen.id}-heading`}>
        <div className="container platform-screen-grid">
          <div className="platform-screen-copy">
            <span className="platform-screen-index">{index === 0 ? "Caixa" : "Retaguarda"}</span>
            <h3 id={`${screen.id}-heading`}>{screen.heading}</h3>
            <p>{screen.body}</p>
            <ul>{screen.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
            <button type="button" onClick={event => open(screen, event.currentTarget)} aria-label={`Ampliar tela ${index === 0 ? "do Caixa" : "da Retaguarda"}`}>Ampliar tela real <span aria-hidden="true">↗</span></button>
          </div>
          <m.div className="platform-screen-media" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .45, ease: "easeOut" }}><img src={screen.preview} width={screen.previewWidth} height={screen.previewHeight} alt={screen.previewAlt} loading="lazy" decoding="async" /></m.div>
        </div>
      </article>)}
    </section>

    <section id="integracoes" className="platform-integrations" aria-labelledby="integrations-heading"><div className="container platform-integrations-grid">
      <h2 id="integrations-heading">iFood, WhatsApp, pagamento e frete. Cada um no seu lugar.</h2>
      <div className="platform-integration-list">
        <div><h3>Pedidos e entrega</h3><p>iFood, 99Food e aiqfome entram no mesmo fluxo. Taxa por km, bairro ou área; app do motoboy com acompanhamento.</p></div>
        <div><h3>Cliente e recorrência</h3><p>O WhatsApp oficial envia o pedido ao cliente e ao motoboy com a localização. Cashback, cupom e pontos seguem suas regras.</p></div>
        <div><h3>Loja e e-commerce</h3><p>QR code de mesa, Mercado Pago, Correios, Jadlog e Melhor Envio no e-commerce.</p></div>
      </div>
      {/* TODO(confirmar): manter a formulação neutra sobre a operação sem internet até validar os detalhes técnicos. */}
      <p className="platform-offline"><strong>Quando a internet cai</strong><span>A operação local continua funcionando. Os pedidos online voltam a chegar quando a conexão volta.</span></p>
    </div></section>
    {expanded && <ReportDialog item={expanded} accessibleLabel={`${expanded.alt} ampliada`} regionLabel="Tela do sistema; no tamanho original, role para explorar os detalhes" onClose={close} />}
  </MarketingMotion>;
}
