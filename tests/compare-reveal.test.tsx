import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CompareReveal } from "@/components/ui/compare-reveal";

const sources = { before: <span>Primeiro</span>, after: <span>Segundo</span> };
it("supports keyboard steps, endpoints and tap alternatives", () => {
  render(<CompareReveal {...sources} reducedMotion />);
  const slider = screen.getByRole("slider");
  fireEvent.keyDown(slider, { key: "ArrowRight" }); expect(slider.getAttribute("aria-valuenow")).toBe("52");
  fireEvent.keyDown(slider, { key: "ArrowLeft", shiftKey: true }); expect(slider.getAttribute("aria-valuenow")).toBe("42");
  fireEvent.keyDown(slider, { key: "End" }); expect(slider.getAttribute("aria-valuenow")).toBe("100");
  fireEvent.keyDown(slider, { key: "Home" }); expect(slider.getAttribute("aria-valuenow")).toBe("0");
  fireEvent.click(screen.getByRole("button", { name: "Comparar" })); expect(slider.getAttribute("aria-valuenow")).toBe("50");
  fireEvent.click(screen.getByRole("button", { name: "Ver layout 1" })); expect(slider.getAttribute("aria-valuenow")).toBe("100");
  fireEvent.doubleClick(screen.getByRole("group", { name: "Comparação: Layout 1 e Layout 2" })); expect(slider.getAttribute("aria-valuenow")).toBe("50");
  expect(screen.getByRole("button", { name: "Comparar" }).getAttribute("aria-pressed")).toBe("true");
});
it("respects controlled values and immediately paints reduced motion updates", () => {
  const change = vi.fn();
  const view = render(<CompareReveal {...sources} position={30} onPositionChange={change} reducedMotion />);
  fireEvent.keyDown(screen.getByRole("slider"), { key: "End" });
  expect(change).toHaveBeenCalledWith(100); expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("30");
  view.rerender(<CompareReveal {...sources} position={80} reducedMotion />);
  expect(document.querySelector<HTMLElement>(".menu10-compare-divider")!.style.left).toBe("80%");
  expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toContain("80% Layout 1");
});
