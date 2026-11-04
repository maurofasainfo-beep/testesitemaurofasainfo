import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Navbar1 } from "@/components/ui/navbar-1";
import { navigationItems } from "@/config/navigation";
import { whatsappHref } from "@/config/whatsapp";

beforeEach(() => {
  vi.mocked(window.matchMedia).mockImplementation(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);
});
afterEach(() => { vi.unstubAllGlobals(); document.body.style.overflow = ""; document.body.style.paddingRight = ""; });
const reduce = () => vi.mocked(window.matchMedia).mockImplementation(q => ({ matches: q.includes("reduced-motion"), addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);

it("renders real section links and preserves the configured WhatsApp in the mobile menu", () => {
  reduce(); render(<Navbar1 />);
  const nav = screen.getByRole("navigation", { name: "Principal" });
  expect(within(nav).getAllByRole("link").map(a => a.getAttribute("href"))).toEqual(navigationItems.map(item => item.href));
  const cta = screen.getByRole("link", { name: "Pedir demonstração" });
  expect(cta.getAttribute("href")).toBe(whatsappHref());
  cta.setAttribute("href", "https://wa.me/5515996981803?text=configurada");
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  const modal = screen.getByRole("dialog");
  expect(within(modal).getByRole("link", { name: "Pedir demonstração" }).getAttribute("href")).toBe(cta.getAttribute("href"));
});

it("locks scrolling, contains keyboard focus, closes with Escape and restores focus/styles", () => {
  reduce(); document.body.style.overflow = "auto"; document.body.style.paddingRight = "7px";
  render(<Navbar1 />);
  const trigger = screen.getByRole("button", { name: "Abrir menu" });
  act(() => trigger.focus()); fireEvent.click(trigger);
  const modal = screen.getByRole("dialog") as HTMLDialogElement;
  expect(modal.open).toBe(true); expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(document.body.style.overflow).toBe("hidden");
  expect(document.activeElement).toBe(within(modal).getByRole("button", { name: "Fechar menu" }));
  const first = within(modal).getByRole("link", { name: "Menu10, início" });
  const last = within(modal).getByRole("link", { name: "Pedir demonstração" });
  act(() => first.focus()); fireEvent.keyDown(modal, { key: "Tab", shiftKey: true }); expect(document.activeElement).toBe(last);
  fireEvent.keyDown(modal, { key: "Tab" }); expect(document.activeElement).toBe(first);
  fireEvent(modal, new Event("cancel", { cancelable: true }));
  expect(modal.open).toBe(false); expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe("auto"); expect(document.body.style.paddingRight).toBe("7px");
});

it("releases the modal immediately when a section is selected and focuses the destination", () => {
  render(<><Navbar1 /><main><section id="faq">Perguntas</section></main></>);
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  const modal = screen.getByRole("dialog") as HTMLDialogElement;
  fireEvent.click(within(modal).getByRole("link", { name: "Perguntas" }));
  expect(modal.open).toBe(false); expect(document.body.style.overflow).toBe("");
  expect(document.activeElement).toBe(document.getElementById("faq"));
});

it("does not let an old exit close a rapidly reopened menu", async () => {
  render(<Navbar1 />);
  const trigger = screen.getByRole("button", { name: "Abrir menu" });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "Fechar menu" }));
  fireEvent.click(trigger);
  // Native close events may be delivered after the dialog has already reopened.
  fireEvent(document.querySelector("dialog")!, new Event("close"));
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 350)); });
  expect((screen.getByRole("dialog") as HTMLDialogElement).open).toBe(true);
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "Fechar menu" }));
  await waitFor(() => expect(document.querySelector("dialog")!.open).toBe(false));
  expect(document.body.style.overflow).toBe("");
});

it("closes on desktop resize and restores scrolling on unmount", () => {
  const changes = new Set<() => void>();
  const desktop = { matches: false, addEventListener: (_: string, fn: () => void) => changes.add(fn), removeEventListener: (_: string, fn: () => void) => changes.delete(fn) };
  vi.mocked(window.matchMedia).mockImplementation(q => q.includes("min-width") ? desktop as unknown as MediaQueryList : { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  const view = render(<Navbar1 />);
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  act(() => { desktop.matches = true; changes.forEach(notify => notify()); });
  expect(document.querySelector("dialog")!.open).toBe(false); expect(document.body.style.overflow).toBe("");
  expect(document.activeElement).toBe(document.querySelector(".menu10-navbar-shell .menu10-navbar-brand"));
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  view.unmount(); expect(document.body.style.overflow).toBe(""); expect(changes.size).toBe(0);
});

it("keeps company links and client marquee initialization working without legacy nav elements", () => {
  vi.useFakeTimers();
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const resize = vi.fn();
  vi.stubGlobal("ResizeObserver", class { observe = resize; disconnect() {} });
  render(<><Navbar1 /><span id="ano" /><div className="marcas-janela"><div className="marcas-trilho"><ul className="marcas-grupo"><li>Cliente</li></ul></div></div></>);
  try {
    window.eval(readFileSync("public/assets/js/config.js", "utf8"));
    expect(() => window.eval(readFileSync("public/assets/js/main.js", "utf8"))).not.toThrow();
    expect(screen.getByRole("link", { name: "Pedir demonstração" }).getAttribute("href")).toContain("?text=");
    expect(document.getElementById("ano")!.textContent).toBe(String(new Date().getFullYear()));
    expect(resize).toHaveBeenCalledOnce();
  } finally { vi.useRealTimers(); log.mockRestore(); }
});
