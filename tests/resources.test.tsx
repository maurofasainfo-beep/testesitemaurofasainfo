import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { PlatformStory } from "@/components/marketing/PlatformStory";
import { Numbers } from "@/components/marketing/HomeSections";
import { SupportMap } from "@/components/marketing/SupportMap";
import sitemap from "@/app/sitemap";
import { Navbar1 } from "@/components/ui/navbar-1";
import { faqConfig } from "@/config/faq";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
  vi.mocked(window.matchMedia).mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
});
afterEach(() => vi.unstubAllGlobals());

it("renders the real final statistics into server HTML without JavaScript", () => {
  const doc = new DOMParser().parseFromString(renderToString(<Numbers />), "text/html");
  expect([...doc.querySelectorAll("dt > span[aria-hidden]")].map(el => el.textContent)).toEqual(["90+", "70 mil+", "5 anos"]);
  expect(doc.querySelectorAll("dl > div")).toHaveLength(3);
});

it("opens either system screenshot by keyboard, restores focus and supports original size", async () => {
  const user = userEvent.setup(); render(<PlatformStory />);
  expect(screen.queryByRole("switch")).toBeNull();
  for (const label of ["Caixa", "Retaguarda"]) {
    const trigger = screen.getByRole("button", { name: `Ampliar tela ${label === "Caixa" ? "do Caixa" : "da Retaguarda"}` });
    act(() => trigger.focus()); await user.keyboard("{Enter}");
    const dialog = screen.getByRole("dialog", { name: new RegExp(`Tela (?:de demonstração|real) ${label === "Caixa" ? "do Caixa" : "da Retaguarda"} do Menu10.*ampliada`) });
    expect(within(dialog).getByRole("img").getAttribute("src")).toContain(label === "Caixa" ? "caixa-pedidos-menu10.webp" : "retaguarda-menu10.webp");
    fireEvent.click(within(dialog).getByRole("button", { name: "Tamanho original" }));
    expect(within(dialog).getByRole("img").classList.contains("is-original-size")).toBe(true);
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
  }
  expect(document.querySelector(".stacking-cards")).toBeNull();
});

it("points Resources at its home anchor and closes the mobile menu", () => {
  render(<><Navbar1 /><main><section id="recursos">Recursos</section></main></>);
  const desktop = screen.getByRole("navigation", { name: "Principal" });
  expect(within(desktop).getByRole("link", { name: "Recursos" }).getAttribute("href")).toBe("/#recursos");
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  const mobile = screen.getByRole("dialog");
  const target = within(mobile).getByRole("link", { name: "Recursos" });
  expect(target.getAttribute("href")).toBe("/#recursos"); fireEvent.click(target);
  expect(document.querySelector("dialog")!.open).toBe(false);
  expect(document.body.style.overflow).not.toBe("hidden");
  expect(document.activeElement).toBe(document.getElementById("recursos"));
});

it("provides the two subanchors in one section and removes the resource sitemap entry", () => {
  const doc = new DOMParser().parseFromString(renderToString(<PlatformStory />), "text/html");
  expect(doc.querySelectorAll("section")).toHaveLength(3);
  for (const id of ["caixa", "retaguarda"]) expect(doc.getElementById(id)).not.toBeNull();
  const images = [...doc.querySelectorAll(".platform-screen-media img")];
  expect(images.map(img => [img.width, img.height])).toEqual([[1180, 500], [1920, 1042]]);
  images.forEach(img => { expect(img.getAttribute("loading")).toBe("lazy"); expect(img.getAttribute("decoding")).toBe("async"); });
  expect(doc.querySelectorAll("h2")).toHaveLength(3);
  expect(doc.querySelectorAll(".platform-screen-copy h3")).toHaveLength(2);
  expect(doc.querySelector('a[href^="/recursos"]')).toBeNull();
  expect(sitemap().some(item => item.url.endsWith("/recursos"))).toBe(false);
});

it("shows real incoming platforms, order stages and the integration modules", () => {
  render(<PlatformStory />);
  expect([...document.querySelectorAll(".platform-source img")].map(el=>el.getAttribute("alt"))).toEqual(["iFood","99Food","aiqfome"]);
  expect(document.querySelectorAll(".platform-stages li")).toHaveLength(5);
  expect(screen.getByRole("link", { name: /Ver os relatórios/ }).getAttribute("href")).toBe("#gestao");
  for (const term of ["KDS", "Mercado Pago", "Correios", "Jadlog", "Melhor Envio", "Stone", "certificado digital", "A operação local continua funcionando"]) expect(document.body.textContent).toContain(term);
});

it("keeps directions available after map load and restores the fallback on an error", () => {
  render(<SupportMap />);
  const frame = screen.getByTitle("Mapa com a localização da Fasa Informática em Cerquilho");
  expect(frame.getAttribute("loading")).toBe("lazy");
  expect(frame.getAttribute("src")).toContain("&hl=pt-BR&output=embed");
  fireEvent.load(frame);
  expect(screen.getAllByRole("link", { name: "Ver no Google Maps" })).toHaveLength(1);
  fireEvent.error(frame); expect(document.querySelector("iframe")).toBeNull();
  expect(screen.getAllByRole("link", { name: "Ver no Google Maps" })).toHaveLength(2);
  expect(document.body.textContent).not.toContain("Carregando o mapa");
});

it("shows the fallback when a frame-src policy blocks Google Maps", () => {
  render(<SupportMap />);
  fireEvent(document, Object.assign(new Event("securitypolicyviolation"), { effectiveDirective: "frame-src", blockedURI: "https://www.google.com/maps" }));
  expect(document.querySelector("iframe")).toBeNull();
  expect(screen.getAllByRole("link", { name: "Ver no Google Maps" })).toHaveLength(2);
});

it("keeps answers within the supplied facts and three editable categories", () => {
  expect(Object.keys(faqConfig.categories)).toEqual(["sobre", "recursos", "contratacao"]);
  expect(faqConfig.faqData.recursos[0].answer).toBe("A operação local continua funcionando. Os pedidos online voltam a chegar quando a conexão volta.");
  const text = JSON.stringify(faqConfig);
  expect(text).toContain("certificado digital"); expect(text).toContain("1 a 2 semanas");
  expect(text).not.toMatch(/NFC-e|ficha técnica|comandas|Pix|responde na hora/);
});
