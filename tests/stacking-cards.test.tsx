import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Operations } from "@/components/marketing/ResourceSections";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("enables the desktop stack only while both card texts and header offsets fit", () => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  const realStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation(element => element.classList.contains("stacking-card-body") ? { paddingTop: "32px", paddingBottom: "32px" } as CSSStyleDeclaration : realStyle(element));
  let textHeight = 450;
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) { return this.hasAttribute("data-stack-content") ? textHeight : 0; });
  const scrollIntoView = vi.fn(); HTMLElement.prototype.scrollIntoView = scrollIntoView;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
  render(<Operations />);
  const stack = document.querySelector(".stacking-cards")!;
  expect(stack.getAttribute("data-stacking")).toBe("active");
  act(() => screen.getByRole("button", { name: "Ampliar tela do Caixa" }).focus());
  expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
  textHeight = 600; fireEvent.resize(window);
  expect(stack.getAttribute("data-stacking")).toBe("static");
  textHeight = 450; fireEvent.resize(window);
  expect(stack.getAttribute("data-stacking")).toBe("active");
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 844 });
  fireEvent.resize(window);
  expect(stack.getAttribute("data-stacking")).toBe("static");
  expect(screen.getAllByRole("button", { name: /Ampliar tela/ })).toHaveLength(2);
});
