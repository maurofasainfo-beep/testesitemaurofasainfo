import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import gsap from "gsap";
import { Component } from "@/components/ui/connoisseur-stack-interactor";

const flush = async () => { await act(async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); }); };
afterEach(() => vi.unstubAllGlobals());

it("reveals the entire phone once and removes its temporary mask on completion", async () => {
  const timeline = vi.spyOn(gsap, "timeline");
  render(<Component />);
  fireEvent.click(screen.getByRole("tab", { name: "Hamburgueria" })); await flush();
  const transition = timeline.mock.results.at(-1)!.value as gsap.core.Timeline;
  expect(transition.repeat()).toBe(0);
  const image = document.querySelector<HTMLImageElement>(".connoisseur-current")!;
  expect(image.style.clipPath).toContain("#menu-stack-");
  expect(document.querySelectorAll("img")).toHaveLength(2);
  act(() => { transition.progress(1); });
  expect(image.style.clipPath).toBe("");
  expect(document.querySelectorAll("img")).toHaveLength(1);
  expect(image.src).toContain("hamburgueria.webp");
});

it("cancels the previous reveal during rapid switches and on unmount", async () => {
  const timeline = vi.spyOn(gsap, "timeline");
  const view = render(<Component />);
  fireEvent.click(screen.getByRole("tab", { name: "Sushi" })); await flush();
  const first = timeline.mock.results.at(-1)!.value as gsap.core.Timeline;
  fireEvent.click(screen.getByRole("tab", { name: "Pizzaria" })); await flush();
  expect(first.parent).toBeNull();
  const last = timeline.mock.results.at(-1)!.value as gsap.core.Timeline;
  expect(document.querySelector<HTMLImageElement>(".connoisseur-current")!.src).toContain("pizzaria.webp");
  view.unmount();
  expect(last.parent).toBeNull();
});

it("makes reduced-motion changes immediate, including during an active reveal", async () => {
  const listeners = new Set<() => void>();
  const query = { matches: false, addEventListener: (_: string, cb: () => void) => listeners.add(cb), removeEventListener: (_: string, cb: () => void) => listeners.delete(cb) };
  vi.mocked(window.matchMedia).mockReturnValue(query as unknown as MediaQueryList);
  const timeline = vi.spyOn(gsap, "timeline");
  render(<Component />);
  fireEvent.click(screen.getByRole("tab", { name: "Sushi" })); await flush();
  const transition = timeline.mock.results.at(-1)!.value as gsap.core.Timeline;
  act(() => { query.matches = true; listeners.forEach(notify => notify()); });
  expect(transition.parent).toBeNull();
  expect(document.querySelector<HTMLImageElement>(".connoisseur-current")!.style.clipPath).toBe("");
  expect(document.querySelector(".connoisseur-previous")).toBeNull();
  const count = timeline.mock.calls.length;
  fireEvent.click(screen.getByRole("tab", { name: "Marmitaria" })); await flush();
  expect(timeline.mock.calls.length).toBe(count);
  expect(document.querySelector<HTMLImageElement>(".connoisseur-current")!.src).toContain("marmitaria.webp");
});

it("keeps masks, keyboard tabs and transitions independent between instances", async () => {
  render(<><Component /><Component /></>);
  const ids = [...document.querySelectorAll("[id]")].map(el => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  const roots = document.querySelectorAll<HTMLElement>(".connoisseur-stack");
  fireEvent.click(within(roots[0]).getByRole("tab", { name: "Sushi" })); await flush();
  expect(within(roots[1]).getByRole("tab", { name: "Pizzaria" }).getAttribute("aria-selected")).toBe("true");
  expect(roots[1].querySelector<HTMLImageElement>("img")!.style.clipPath).toBe("");
});

it("selects on mouse hover and ignores vertical touch gestures", async () => {
  class PointerEventMock extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerType = init.pointerType ?? ""; }
  }
  vi.stubGlobal("PointerEvent", PointerEventMock);
  render(<Component />);
  fireEvent.pointerEnter(screen.getByRole("tab", { name: "Sushi" }), { pointerType: "mouse" }); await flush();
  expect(screen.getByRole("tab", { name: "Sushi" }).getAttribute("aria-selected")).toBe("true");
  const frame = document.querySelector(".connoisseur-phone")!;
  fireEvent.touchStart(frame, { touches: [{ clientX: 200, clientY: 100 }] });
  fireEvent.touchEnd(frame, { changedTouches: [{ clientX: 190, clientY: 250 }] }); await flush();
  expect(screen.getByRole("tab", { name: "Sushi" }).getAttribute("aria-selected")).toBe("true");
});
