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
  { title: "Entra", text: "Pelo cardápio digital, pelo caixa ou pelas plataformas integradas, sem abrir cada uma." },
  { title: "Produz", text: "O pedido aparece no KDS, a tela da cozinha, e na impressão." },
  { title: "Entrega", text: "O motoboy cadastrado recebe a localização; o app permite acompanhar." },
  { title: "Reaproxima", text: "Cashback, cupom e pontos seguem as regras que você define." },
  { title: "Mostra", text: "Os relatórios mostram o que vende e quando." },
];

type ProductScreen = MediaItem & { heading: string; body: string; aside: string; preview: string; previewWidth: number; previewHeight: number; previewAlt: string; focusLabel: string };
const screens: ProductScreen[] = [
  {
    id: "caixa", label: "Caixa", heading: "Balcão e delivery na mesma fila.",
    body: "Situação, previsão e origem dos pedidos ficam na mesma tela. Lance pedidos locais e de delivery, inclusive de quem pede por WhatsApp.",
    aside: "Acabou um sabor? Desative uma vez e ele sai de todas as pizzas. No caixa, você também ajusta o tempo de entrega, consulta estoque e fecha só o delivery ou a loja inteira.",
    src: "/sistema/caixa-pedidos-menu10.webp", width: 1368, height: 728,
    alt: "Tela de demonstração do Caixa do Menu10 com pedidos locais e de delivery em uma lista",
    preview: "/sistema/caixa-pedidos-detalhe.webp", previewWidth: 1180, previewHeight: 500,
    previewAlt: "Recorte do Caixa do Menu10 com situação, previsão e origem dos pedidos",
    focusLabel: "Situação, previsão e origem na lista de pedidos",
  },
  {
    id: "retaguarda", label: "Retaguarda", heading: "O dia fecha com o resultado à vista.",
    body: "O DRE coloca receitas, despesas e resultado do período na mesma leitura. A Retaguarda também reúne produtos, sabores, opcionais, estoque, financeiro e fidelidade.",
    aside: "Cadastre clientes e motoboys, acompanhe as notas fiscais dos pedidos e controle o robô do WhatsApp. Para as notas fiscais, é preciso certificado digital.",
    src: "/images/evidence/painel-dre.webp", width: 1014, height: 652,
    alt: "DRE do Menu10 mostrando receitas, despesas e resultado do período",
    preview: "/images/evidence/painel-dre-recorte.webp", previewWidth: 962, previewHeight: 340,
    previewAlt: "Tela do DRE do Menu10 com as linhas de receitas, despesas e resultado do período",
    focusLabel: "Receitas, despesas e resultado do período",
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
        <header className="platform-flow-intro">
          <h2 id="flow-heading">O pedido entra.<br /><em>O resto acompanha.</em></h2>
          <p>Cardápio digital, balcão e plataformas integradas chegam à mesma operação. A equipe acompanha o pedido até o relatório.</p>
        </header>
        <div className="platform-flow-scene" role="group" aria-label="As entradas de pedidos convergem para o Menu10">
          <div className="platform-flow-origins">
            <span>Cardápio digital</span><span>Caixa</span>
            <div className="platform-flow-platforms" aria-label="iFood, 99Food e aiqfome">
              {platforms.map((platform, index) => <m.img key={platform.name} src={platform.src} width="160" height="160" alt={platform.name} loading="lazy" decoding="async"
                initial={reduced ? false : { opacity: .5, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: reduced ? 0 : .35, delay: reduced ? 0 : index * .08, ease: "easeOut" }} />)}
            </div>
          </div>
          <m.span className="platform-flow-connection" aria-hidden="true" initial={reduced ? false : { scaleX: 0, scaleY: 0 }}
            whileInView={{ scaleX: 1, scaleY: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .65, ease: [.16, 1, .3, 1] }} />
          <div className="platform-flow-arrival"><img src="/images/integracoes/menu10.webp" width="192" height="211" alt="" loading="lazy" decoding="async" /><div><strong>Menu10</strong><span>Pedidos em um só lugar</span></div></div>
        </div>
        <ol className="platform-stages">{stages.map((stage, index) => <li key={stage.title}>
          <span className="platform-stage-count" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{stage.title}</h3><p>{stage.text}</p>
          {index === stages.length - 1 && <a href="#gestao">Ver relatórios</a>}
        </li>)}</ol>
      </div>
    </section>

    <section id="recursos" className="platform-system" aria-labelledby="system-heading">
      <div className="container">
        <h2 id="system-heading">Veja por dentro.</h2>
        <p className="platform-system-note">Telas do sistema com dados de demonstração.</p>
        {screens.map((screen, index) => <article key={screen.id} id={screen.id} className={`platform-screen platform-screen--${screen.id}`} aria-labelledby={`${screen.id}-heading`}>
          <header className="platform-screen-heading"><h3 id={`${screen.id}-heading`}>{screen.heading}</h3><p>{screen.body}</p></header>
          <m.button type="button" className="platform-screen-media" aria-label={`Ampliar tela ${index === 0 ? "do Caixa" : "da Retaguarda"}`}
            onClick={event => open(screen, event.currentTarget)}
            initial={reduced ? false : { opacity: .94, clipPath: "inset(0 12% 0 0)" }} whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: reduced ? 0 : .6, ease: [.16, 1, .3, 1] }}>
            <span className="platform-screen-media-viewport"><img src={screen.preview} width={screen.previewWidth} height={screen.previewHeight} alt={screen.previewAlt} loading="lazy" decoding="async" /></span>
            <span className="platform-screen-media-meta"><span>{screen.focusLabel}</span><span>Ampliar tela</span></span>
          </m.button>
          <p className="platform-screen-aside">{screen.aside}</p>
        </article>)}
      </div>
    </section>

    <section id="integracoes" className="platform-continuity" aria-labelledby="continuity-heading"><div className="container">
      <div className="platform-continuity-lead">
        <h2 id="continuity-heading">A internet caiu.<br /><em>O balcão continua.</em></h2>
        {/* TODO(confirmar): manter a formulação neutra sobre a operação sem internet até validar os detalhes técnicos. */}
        <p>A operação local continua funcionando. Os pedidos online voltam a chegar quando a conexão volta.</p>
      </div>
      <dl className="platform-continuity-paths">
        <div><dt>Na entrega</dt><dd>Taxa por km, bairro ou área. O app do motoboy permite acompanhar.</dd></div>
        <div><dt>Na próxima visita</dt><dd>Cashback, cupom e pontos seguem as regras que você define.</dd></div>
        <div><dt>Na loja online</dt><dd>QR code de mesa e integrações com Mercado Pago, Correios, Jadlog e Melhor Envio no e-commerce.</dd></div>
      </dl>
    </div></section>
    {expanded && <ReportDialog item={expanded} accessibleLabel={`${expanded.alt} ampliada`} regionLabel="Tela do sistema; no tamanho original, role para explorar os detalhes" onClose={close} />}
  </MarketingMotion>;
}
