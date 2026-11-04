import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Menus, Pricing, Comparison, Reports, Support } from "@/components/sections/Sections";
import Home from "@/app/page";
import media from "@/lib/section-media.json";

const flush = async () => { await act(async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); }); };
beforeEach(() => { vi.clearAllMocks(); });

describe("Reports and motion preferences", () => {
  it("restores the original sales and reviews screens and operates with the keyboard", async () => {
    render(<Reports />);
    const tabs = screen.getAllByRole("tab"); expect(tabs).toHaveLength(media.reports.length);
    act(() => tabs[0].focus()); fireEvent.keyDown(tabs[0], {key:"ArrowRight"}); await flush();
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(tabs[1].id);
    expect(document.querySelector<HTMLImageElement>(".reform-media-current")!.src).toContain("relatorio-avaliacoes.webp");
    expect(tabs.map(tab => tab.textContent)).toEqual(["Vendas", "Avaliações"]);
    media.reports.forEach(item => expect(readFileSync(`public${item.src}`)).toEqual(readFileSync(`original${item.src}`)));
  });
  it("opens either original screen, restores focus and safely closes then reopens", async () => {
    render(<Reports />);
    const trigger = screen.getByRole("button", { name: "Ampliar relatório de vendas" });
    act(() => trigger.focus()); fireEvent.click(trigger);
    let dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img").getAttribute("src")).toContain("relatorio-vendas.webp");
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(within(dialog).getByRole("button", { name: "Tamanho original" }));
    expect(within(dialog).getByRole("img").classList.contains("is-original-size")).toBe(true);
    fireEvent.click(within(dialog).getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).toBeNull(); expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
    fireEvent.click(screen.getByRole("tab", { name: "Avaliações" })); await flush();
    fireEvent.click(screen.getByRole("button", { name: "Ampliar relatório de avaliações" }));
    dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img").getAttribute("src")).toContain("relatorio-avaliacoes.webp");
    expect(within(dialog).getByRole("img").classList.contains("is-original-size")).toBe(false);
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull(); expect(document.body.style.overflow).toBe("");
  });
  it("switches instantly and does not animate the comparison in reduced motion", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()} as unknown as MediaQueryList);
    const animate = vi.spyOn(Element.prototype,"animate");
    let observe!: IntersectionObserverCallback;
    vi.stubGlobal("IntersectionObserver", class { constructor(cb: IntersectionObserverCallback) { observe=cb; } observe(){} unobserve(){} disconnect(){} });
    render(<><Reports /><Comparison /></>);
    fireEvent.click(screen.getAllByRole("tab")[1]); await flush();
    act(() => observe([{isIntersecting:true,target:document.querySelector(".reform-pair")} as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(animate).not.toHaveBeenCalled(); expect(document.querySelector(".reform-media-old")).toBeNull();
    expect(document.querySelectorAll(".reform-pair")).toHaveLength(4);
    vi.unstubAllGlobals();
  });
});

describe("Reform boundaries and content", () => {
  it("keeps the five sections in order and removes the redundant closing, map and decorative icons", () => {
    const doc = new DOMParser().parseFromString(renderToString(<Home />), "text/html");
    expect([...doc.querySelectorAll("main > section")].map(el=>el.id)).toEqual(["inicio","clientes","numeros","cardapios","diferenciais","caminho-do-pedido","recursos","integracoes","resultado","gestao","como-comecar","faq","suporte"]);
    expect(doc.querySelector(".fechamento,.hex,.comparar,.painel-mais,.zoom")).toBeNull();
    expect(doc.querySelectorAll('iframe[title="Mapa com a localização da Fasa Informática em Cerquilho"]')).toHaveLength(1);
    expect(doc.querySelectorAll(".reform-section use")).toHaveLength(2);
    expect([...doc.querySelectorAll(".reform-section use")].map(el=>el.getAttribute("href"))).toEqual(["#i-whats","#i-pino"]);
    doc.querySelectorAll(".reform-section").forEach(section=>expect(section.querySelectorAll('[data-link="whatsapp"]')).toHaveLength(section.id==="recursos"?0:1));
    doc.querySelectorAll(".reform-section img").forEach(img=>{
      expect(img.getAttribute("loading")).toBe("lazy");expect(img.getAttribute("decoding")).toBe("async");expect(img.hasAttribute("width")&&img.hasAttribute("height")).toBe(true);
    });
  });
  it("keeps the exact price qualification, contact details and status hooks", () => {
    render(<><Pricing /><Support /></>);
    expect(document.body.textContent).toContain("A partir de R$ 200/mês. O valor depende do número de computadores e dos módulos que você usa.");
    expect(document.body.textContent).toContain("(15) 99698-1803");
    expect(document.body.textContent).toContain("Av. João Pilon, 307 - 1º andar, Salas 07/08 - Cerquilho - SP");
    for(const id of ["status-atendimento","status-texto","status-detalhe","copiar-aviso"]) expect(document.getElementById(id)).not.toBeNull();
    expect(within(document.querySelector<HTMLElement>(".support-content")!).getAllByRole("link").map(a=>a.textContent)).toEqual(["Pedir demonstração no WhatsApp","Ver no Google Maps","Ver no Waze"]);
  });
  it("uses existing AA text colors without changing global tokens", () => {
    const luminance=(hex:string)=>{const rgb=hex.match(/\w\w/g)!.map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
    const ratio=(a:string,b:string)=>{const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05);};
    for(const bg of ["ffffff","faf6fd"]) for(const text of ["6e6474","2a1a3a","8000bb"]) expect(ratio(bg,text)).toBeGreaterThanOrEqual(4.5);
    expect(readFileSync("src/app/sections.css","utf8")).not.toMatch(/:root|--roxo\s*:|--fonte\s*:|--tinta\s*:/);
  });
});
