import original from "@/lib/original-page.json";
import { Fragment } from "react";
import { FAQ } from "@/components/ui/faq-tabs";
import { faqConfig } from "@/config/faq";
import { Navbar1 } from "@/components/ui/navbar-1";
import { ParticleMenu } from "@/components/ParticleMenu";
import { OriginalInteractions } from "@/components/OriginalInteractions";
import { Menus, Pricing, Reports, Support } from "@/components/sections/Sections";
import { Numbers, GettingStarted } from "@/components/marketing/HomeSections";
import { PlatformStory } from "@/components/marketing/PlatformStory";
import { ProductEvidence } from "@/components/marketing/ProductEvidence";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return <>
    <a className="pular" href="#conteudo">Pular para o conteúdo</a>
    <Navbar1 />
    <main id="conteudo">{original.sections.map(section => section.id === "inicio"
      ? <section key={section.id} id={section.id} className={section.className} aria-labelledby={section.labelledBy || undefined}>
          <div className="hero-pin">
            <div className="original-hero-content" dangerouslySetInnerHTML={{ __html: section.html }} />
            <ParticleMenu />
          </div>
        </section>
      : section.id === "cardapios" ? <Menus key="cardapios" />
      : section.id === "diferenciais" ? <Pricing key="diferenciais" />
      : section.id === "recursos" ? <PlatformStory key="recursos" />
      : section.id === "gestao" ? <Fragment key="gestao"><ProductEvidence /><Reports /></Fragment>
      : section.id === "suporte" ? <Fragment key="suporte"><GettingStarted /><FAQ id="faq" {...faqConfig} /><Support /></Fragment>
      : section.id === "clientes" ? <Fragment key="clientes"><section id={section.id} className={section.className} aria-labelledby={section.labelledBy || undefined} dangerouslySetInnerHTML={{ __html: section.html }} /><Numbers /></Fragment>
      : section.className === "fechamento" ? null
        : <section key={section.id || section.className} id={section.id || undefined} className={section.className} aria-labelledby={section.labelledBy || undefined} dangerouslySetInnerHTML={{ __html: section.html }} />
    )}</main>
    <SiteFooter />
    <OriginalInteractions />
    <noscript><style>{".launch-reveal{opacity:1!important;transform:none!important}"}</style></noscript>
  </>;
}
