import type { ReactNode } from "react";
import media from "@/lib/section-media.json";
import { MediaSelector } from "./MediaSelector";
import { Comparison } from "./Comparison";
import { MenuShowcase } from "@/components/ui/menu-showcase";
import { SupportMap } from "@/components/marketing/SupportMap";
import "@/app/sections.css";

function WhatsApp({ children, className = "botao botao-roxo" }: { children: ReactNode; className?: string }) {
  return <a href="https://wa.me/5515996981803" data-link="whatsapp" target="_blank" rel="noopener" className={className}>{children}</a>;
}
export function Menus() {
  return <section id="cardapios" className="reform-section reform-menus" aria-labelledby="reform-menu-title"><div className="container">
    <MenuShowcase action={<WhatsApp className="link-roxo">Quero o meu assim</WhatsApp>} />
  </div></section>;
}
export function Pricing() {
  return <section id="diferenciais" className="reform-section reform-pricing" aria-labelledby="reform-price-title"><div className="container">
    <h2 id="reform-price-title">Cada pedido é seu.<br /><em>Sem comissão.</em></h2>
    <p>Você paga uma mensalidade, não uma porcentagem das suas vendas. A partir de R$ 200/mês. O valor depende do número de computadores e dos módulos que você usa.</p>
    <WhatsApp>Consultar valores no WhatsApp</WhatsApp>
  </div></section>;
}
export { Comparison };
export function Reports() {
  return <section id="gestao" className="reform-section reform-reports" aria-labelledby="reform-report-title"><div className="container">
    <MediaSelector id="report" kind="reports" items={media.reports} label="Telas do relatório" intro={<h2 id="reform-report-title">No fim do dia, você sabe <em>exatamente como foi.</em></h2>}
      action={<WhatsApp>Quero ver os meus números</WhatsApp>} />
  </div></section>;
}
export function Support() {
  // TODO: adicionar de 1 a 3 fotos reais da equipe quando fornecidas em public/equipe; não renderizar espaço vazio.
  return <section id="suporte" className="reform-section reform-support" aria-labelledby="reform-support-title"><div className="container support-columns"><div className="support-content">
    <h2 id="reform-support-title">Suporte de perto,<br /><em>aqui em Cerquilho.</em></h2>
    <p className="reform-support-copy">O Menu10 é desenvolvido pela <span data-empresa="nome">Fasa Informática</span>. Você fala com a nossa equipe pelo WhatsApp e, quando precisar, a gente atende presencialmente.</p>
    <div className="status" id="status-atendimento"><span className="status-luz" aria-hidden="true" /><div>
      <p className="status-texto" id="status-texto">Seg a Sex, 8h às 17h30 · Sáb, 8h às 12h</p>
      <p className="status-detalhe" id="status-detalhe">Horário de Brasília</p>
    </div></div>
    <div className="reform-support-action"><WhatsApp><svg className="icone" aria-hidden="true"><use href="#i-whats" /></svg>Pedir demonstração no WhatsApp</WhatsApp>
      <div className="reform-phone"><span data-empresa="telefone">(15) 99698-1803</span><button className="copiar" type="button" hidden><span className="copiar-texto">Copiar número</span></button></div>
      <span className="visualmente-oculto" id="copiar-aviso" aria-live="polite" />
    </div>
    <div className="reform-location"><p data-empresa="endereco">Av. João Pilon, 307 - 1º andar, Salas 07/08 - Cerquilho - SP</p>
      <div className="reform-map-links"><a href="https://www.google.com/maps/search/?api=1&query=Av.%20Jo%C3%A3o%20Pilon%2C%20307%2C%20Cerquilho%20-%20SP" data-link="maps" target="_blank" rel="noopener"><svg className="icone" aria-hidden="true"><use href="#i-pino" /></svg>Ver no Google Maps</a>
      <a href="https://waze.com/ul?q=Av.%20Jo%C3%A3o%20Pilon%2C%20307%2C%20Cerquilho%20-%20SP&navigate=yes" data-link="waze" target="_blank" rel="noopener">Ver no Waze</a></div>
    </div>
  </div><SupportMap /></div></section>;
}
