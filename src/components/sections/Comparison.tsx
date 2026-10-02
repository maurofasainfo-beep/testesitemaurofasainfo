"use client";
import { useEffect, useRef } from "react";
const pairs = [
  { before: "Pedido anotado no papel, na correria", start: "Pedido cai ", keyword: "sozinho", end: " na tela da cozinha" },
  { before: "WhatsApp lotado, cliente esperando resposta", start: "O robô do WhatsApp responde ", keyword: "na hora", end: "" },
  { before: "Cliente que pediu uma vez e sumiu", start: "Cashback e cupom trazem o cliente ", keyword: "de volta", end: "" },
  { before: "Só no fim do mês você descobre como foi", start: "Relatório mostra o que vende, ", keyword: "todo dia", end: "" },
];
// TODO Seção 2 (preço): "Comissão do aplicativo em todo pedido" / "Pedido direto no seu cardápio, sem comissão".
// TODO futura seção de Caixa: "Nota fiscal digitada depois, uma por uma" / "A NFC-e sai direto do pedido".
export function Comparison() {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!list.current || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches || !entry.target.animate) return;
        const animation = entry.target.animate([{ opacity: .25, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
        animations.add(animation); animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      });
    }, { threshold: .3, rootMargin: "0px 0px -15% 0px" });
    list.current.querySelectorAll("li").forEach(row => observer.observe(row));
    const instant = () => { if (preference.matches) { animations.forEach(a => a.cancel()); animations.clear(); } };
    preference.addEventListener("change", instant);
    return () => { observer.disconnect(); instant(); animations.forEach(a => a.cancel()); preference.removeEventListener("change", instant); };
  }, []);
  return <section id="recursos" className="reform-section reform-comparison" aria-labelledby="reform-comparison-title">
    <div className="container"><h2 id="reform-comparison-title">Como muda o seu dia</h2>
      <ol ref={list} className="reform-pairs">{pairs.map((pair, i) => <li key={pair.before} className="reform-pair">
        <span className="reform-pair-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        <p className="reform-before"><span className="reform-pair-label">Antes</span>{pair.before}</p>
        <p className="reform-after"><span className="reform-pair-label">Depois</span>{pair.start}<em>{pair.keyword}</em>{pair.end}</p>
      </li>)}</ol>
    </div>
  </section>;
}
