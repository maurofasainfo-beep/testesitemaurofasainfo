import { readFileSync } from "node:fs";
import { describe, expect, it, vi, afterEach } from "vitest";
import original from "@/lib/original-page.json";

const source = readFileSync("original/index.html", "utf8");
const parse = (html: string) => new DOMParser().parseFromString(html, "text/html");
const baseline = parse(source);
const normalize = (html: string) => html.replaceAll("assets/img/", "/assets/img/");
const load = (name: string) => window.eval(readFileSync(`public/assets/js/${name}.js`, "utf8"));
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

describe("Restoration scope", () => {
  it("preserves section order, classes, original headings and paragraphs", () => {
    const sections = [...baseline.querySelectorAll("main > section")];
    expect(original.sections).toHaveLength(sections.length);
    original.sections.forEach((section, i) => {
      expect(section.id).toBe(sections[i].id);
      expect(section.className).toBe(sections[i].className);
      const copy = (root: ParentNode) => [...root.querySelectorAll("h1,h2,h3,p:not(.dica)")].filter(el => !el.classList.contains("marcas-titulo")).map(el => el.textContent);
      expect(copy(parse(section.html))).toEqual(copy(sections[i]));
      if (!["inicio", "clientes"].includes(section.id) && section.className !== "fechamento") {
        expect(section.html).toBe(normalize(sections[i].innerHTML));
      }
    });
  });
  it("keeps the original navigation, footer and stylesheet intact", () => {
    expect(original.header).toBe(normalize(baseline.querySelector("header")!.innerHTML));
    expect(original.footer).toBe(normalize(baseline.querySelector("footer")!.innerHTML));
    expect(readFileSync("src/app/original.css", "utf8")).toBe(readFileSync("original/assets/css/style.css", "utf8"));
  });
  it("identifies six real clients without recoloring their logos", () => {
    const brands = parse(original.sections.find(s => s.id === "clientes")!.html);
    const logos = [...brands.querySelectorAll(".cliente-identificado")];
    expect(brands.querySelector(".marcas-titulo")).toBeNull();
    expect(logos).toHaveLength(6);
    logos.forEach(logo => {
      const img = logo.querySelector("img")!;
      expect(img.alt.trim().length).toBeGreaterThan(0);
      expect(logo.querySelector("figcaption")).toBeNull();
      expect(readFileSync(`public${img.getAttribute("src")}`).length).toBeGreaterThan(1000);
    });
    expect(readFileSync("src/app/restoration.css", "utf8")).not.toMatch(/grayscale|brightness\(/);
  });
});

describe("Original interactions with interruption fixes", () => {
  it("returns to Pizza during a pending Japanese transition without stale title or image", async () => {
    document.body.innerHTML = original.sections.find(s => s.id === "cardapios")!.html;
    const finishes: (() => void)[] = [];
    vi.spyOn(Element.prototype, "animate").mockImplementation(() => ({
      finished: new Promise<void>(resolve => finishes.push(resolve)), cancel: vi.fn(),
    }) as unknown as Animation);
    load("vitrine");
    document.querySelector<HTMLButtonElement>('[data-cardapio="japones"]')!.click();
    await flush();
    document.querySelector<HTMLButtonElement>('[data-cardapio="pizzaria"]')!.click();
    finishes.forEach(resolve => resolve());
    await flush();
    expect(document.getElementById("negocio")!.textContent).toBe("na sua pizzaria.");
    expect(document.querySelector<HTMLImageElement>("#celular-tela")!.src).toContain("cardapio-pizzaria.webp");
    expect(document.querySelectorAll(".entrando")).toHaveLength(0);
    expect(document.querySelector('[aria-pressed="true"]')!.getAttribute("data-cardapio")).toBe("pizzaria");
  });
  it("keeps the current screen when a replacement image cannot load", async () => {
    document.body.innerHTML = original.sections.find(s => s.id === "cardapios")!.html;
    vi.spyOn(HTMLImageElement.prototype, "decode").mockRejectedValue(new Error("offline"));
    load("vitrine");
    document.querySelector<HTMLButtonElement>('[data-cardapio="japones"]')!.click();
    await flush();
    expect(document.getElementById("negocio")!.textContent).toBe("na sua pizzaria.");
    expect(document.querySelector<HTMLImageElement>("#celular-tela")!.src).toContain("cardapio-pizzaria.webp");
    expect(document.querySelector('[aria-pressed="true"]')!.getAttribute("data-cardapio")).toBe("pizzaria");
  });
  it("does not let an interrupted close dismiss a newly reopened report", async () => {
    document.body.innerHTML = original.sections.map(s => s.html).join("");
    let finish!: () => void;
    vi.spyOn(Element.prototype, "animate").mockImplementation(() => ({
      finished: new Promise<void>(resolve => { finish = resolve; }), cancel: vi.fn(),
    }) as unknown as Animation);
    load("relatorio");
    const triggers = document.querySelectorAll<HTMLButtonElement>(".tela-ampliar");
    triggers[0].click();
    document.querySelector<HTMLButtonElement>(".zoom-fechar")!.click();
    triggers[1].click();
    finish();
    await flush();
    expect(document.querySelector<HTMLDialogElement>(".zoom")!.open).toBe(true);
    expect(document.querySelector<HTMLImageElement>(".zoom img")!.src).toBe(triggers[1].querySelector("img")!.src);
  });
});
