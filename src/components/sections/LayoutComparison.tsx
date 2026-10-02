import { CompareReveal } from "@/components/ui/compare-reveal";

export function LayoutComparison() {
  return <section id="layouts" className="menu10-layouts" aria-labelledby="layouts-title"><div className="container menu10-layouts-grid">
    <div className="menu10-layouts-copy">
      <p className="menu10-layouts-eyebrow">Duas formas de apresentar seu cardápio</p>
      <h2 id="layouts-title">Seu cardápio.<br /><em>Do seu jeito.</em></h2>
      <p className="menu10-layouts-intro">Dê destaque às imagens ou deixe os produtos e preços à vista. Experimente os dois formatos no celular ao lado.</p>
      <dl className="menu10-layouts-details">
        <div><dt>Categorias em destaque</dt><dd>Imagens maiores para apresentar categorias, combos e promoções.</dd></div>
        <div><dt>Produtos à vista</dt><dd>Nome, foto e preço em uma lista, com ofertas e busca.</dd></div>
      </dl>
    </div>
    <div className="menu10-layouts-visual"><CompareReveal before={{ src: "/images/layouts/layout1.webp", width: 520, height: 1076, alt: "Layout 1 no iPhone: cardápio Ben’s Chickens com categorias em imagens" }}
      after={{ src: "/images/layouts/layout2.webp", width: 520, height: 1076, alt: "Layout 2 no iPhone: cardápio Ben’s Chickens com ofertas e produtos em lista com preços" }} /></div>
  </div></section>;
}
