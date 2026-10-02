import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ParticleMenu } from "@/components/ParticleMenu";

let raf: Map<number, FrameRequestCallback>, id: number, now: number, draws: number, isMobile: boolean;
let intersection: IntersectionObserverCallback;
let reduced: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> };
beforeEach(() => {
  raf = new Map(); id = 0; now = 0; draws = 0; isMobile = false;
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
  reduced = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.mocked(window.matchMedia).mockImplementation(query => (query.includes("reduced") ? reduced : { get matches() { return isMobile; }, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { raf.set(++id, cb); return id; });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => raf.delete(key));
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { constructor(cb: IntersectionObserverCallback) { intersection = cb; } observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    let height = 650, top = 0, width = isMobile ? 390 : 600;
    if (this.classList.contains("abertura")) { height = 1400; top = -window.scrollY; }
    if (this.classList.contains("hero-pin")) height = 800;
    if (this.classList.contains("particle-track")) { height = 1120; top = 900 - window.scrollY; }
    if (this.classList.contains("particle-composition")) height = 620;
    return { x: 0, y: top, width, height, left: 0, top, right: width, bottom: top + height, toJSON() {} };
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ setTransform() {}, clearRect() {}, fillRect() { draws++; }, globalAlpha: 1, fillStyle: "" } as unknown as CanvasRenderingContext2D);
  const buffer = readFileSync("public/images/hero-particles.bin");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) }));
});
function frames(count = 90) {
  act(() => { for (let i = 0; i < count; i++) { now += 1000 / 60; const scheduled = [...raf.values()]; raf.clear(); scheduled.forEach(cb => cb(now)); } });
}
function scroll(y: number) { Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true }); fireEvent.scroll(window); frames(); }
async function mount() { await act(async () => { render(<section className="abertura"><div className="hero-pin"><ParticleMenu /></div></section>); }); frames(); }
const progress = () => Number(screen.getByRole("img").getAttribute("data-progress"));

describe("Scroll-driven menu particles", () => {
  it("starts with the original dotted logo and only morphs when scrolling", async () => {
    await mount();
    expect(progress()).toBe(0); expect(draws).toBeGreaterThan(2000); expect(raf.size).toBe(0);
    frames(600);
    expect(progress()).toBe(0); expect(screen.getByRole("img").getAttribute("data-phase")).toBe("logo");
    expect(document.querySelector(".hero-particle-field")?.parentElement?.className).toBe("hero-pin");
    expect(document.querySelector(".hero-logo")?.getAttribute("src")).toBe("/images/hero-logo.svg");
  });
  it("scrubs forward and backward with scroll and stops drawing when still", async () => {
    await mount(); scroll(300); expect(progress()).toBe(.5); expect(raf.size).toBe(0);
    scroll(600); expect(progress()).toBe(1); expect(screen.getByRole("img").getAttribute("data-phase")).toBe("settled");
    scroll(150); expect(progress()).toBe(.25);
    scroll(0); expect(progress()).toBe(0); expect(raf.size).toBe(0);
  });
  it.each([false, true])("softens a sudden scroll and reverses without finishing the old movement (mobile: %s)", async mobile => {
    isMobile = mobile; await mount();
    Object.defineProperty(window, "scrollY", { value: mobile ? 1316 : 600, configurable: true, writable: true });
    fireEvent.scroll(window); frames(6);
    // After 100ms a full jump is still forming, rather than almost finished.
    expect(progress()).toBeGreaterThan(.3); expect(progress()).toBeLessThan(.6);
    const beforeReverse = progress();
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
    fireEvent.scroll(window); frames(1);
    expect(progress()).toBeLessThan(beforeReverse);
    frames(); expect(progress()).toBe(0); expect(raf.size).toBe(0);
  });
  it("waits for the mobile artwork to reach the sticky area before forming", async () => {
    isMobile = true; await mount();
    scroll(600); expect(progress()).toBe(0);
    scroll(816 + 250); expect(progress()).toBe(.5);
    scroll(816 + 500); expect(progress()).toBe(1);
    scroll(816); expect(progress()).toBe(0);
  });
  it("keeps hover dust after formation and returns to the intact image", async () => {
    await mount(); scroll(600);
    fireEvent(screen.getByRole("img"), Object.assign(new Event("pointermove", { bubbles: true }), { pointerType: "mouse", clientX: 300, clientY: 250 }));
    frames(); expect(screen.getByRole("img").getAttribute("data-phase")).toBe("interactive");
    expect(raf.size).toBe(0);
    fireEvent.pointerLeave(screen.getByRole("img")); frames();
    expect(screen.getByRole("img").getAttribute("data-phase")).toBe("settled"); expect(raf.size).toBe(0);
  });
  it("pauses offscreen and resumes at the latest scroll position with one frame loop", async () => {
    await mount();
    act(() => intersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    scroll(300); expect(raf.size).toBe(0);
    act(() => intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    fireEvent.scroll(window); fireEvent.scroll(window); expect(raf.size).toBe(1);
    frames(); expect(progress()).toBe(.5); expect(raf.size).toBe(0);
  });
  it("recalculates progress when switching to a mobile layout", async () => {
    await mount(); scroll(600); expect(progress()).toBe(1);
    isMobile = true; fireEvent.resize(window); frames(); expect(progress()).toBe(0);
    scroll(1066); expect(progress()).toBe(.5);
  });
  it("shows a static image for reduced motion", async () => {
    reduced.matches = true; await mount(); scroll(300);
    expect(raf.size).toBe(0); expect(draws).toBe(0);
    expect(screen.getByRole("img").getAttribute("data-phase")).toBe("settled");
  });
  it("retains the image when the particle file cannot load", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Offline")); await mount();
    expect(raf.size).toBe(0); expect(screen.getByRole("img").getAttribute("data-phase")).toBe("settled");
    expect(document.querySelector(".particle-original")?.getAttribute("src")).toBe("/images/hero-menu.webp");
    fireEvent.resize(window); scroll(300);
    expect(screen.getByRole("img").getAttribute("data-phase")).toBe("settled");
    expect(raf.size).toBe(0);
  });
});
