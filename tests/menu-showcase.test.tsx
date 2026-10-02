import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Menus } from "@/components/sections/Sections";
const flush = async () => { await act(async () => { for (let i=0;i<12;i++) await Promise.resolve(); }); };
const sources = () => [...document.querySelectorAll("img")].map(img => img.getAttribute("src"));

it("starts with only the Pizza pair, one phone comparator and one CTA", () => {
  const decode=vi.spyOn(HTMLImageElement.prototype,"decode");
  render(<Menus />);
  expect(sources().sort()).toEqual(["/images/menu-pairs/pizzaria-1.webp","/images/menu-pairs/pizzaria-2.webp"]);
  expect(screen.getAllByRole("slider")).toHaveLength(1);
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(screen.getAllByRole("tab")).toHaveLength(5);
  expect(decode).not.toHaveBeenCalled();
});

it("keeps the layout position while selecting another segment using keyboard", async () => {
  render(<Menus />);
  fireEvent.click(screen.getByRole("button",{name:"Ver layout 2"}));
  const tabs=screen.getAllByRole("tab");
  act(()=>tabs[0].focus());fireEvent.keyDown(tabs[0],{key:"ArrowRight"});await flush();
  expect(document.activeElement).toBe(tabs[1]);expect(tabs[1].getAttribute("aria-selected")).toBe("true");
  expect(sources().every(src=>src?.includes("hamburgueria"))).toBe(true);
  expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("0");
  fireEvent.keyDown(tabs[1],{key:"End"});await flush();
  expect(document.activeElement).toBe(tabs[4]);expect(sources().every(src=>src?.includes("pastel"))).toBe(true);
  fireEvent.keyDown(tabs[4],{key:"Home"});await flush();
  expect(document.activeElement).toBe(tabs[0]);
  expect(tabs.filter(tab=>tab.tabIndex===0)).toHaveLength(1);
});

it("waits for both images and ignores a stale pair after another choice", async () => {
  const pending=new Map<string,()=>void>();
  vi.spyOn(HTMLImageElement.prototype,"decode").mockImplementation(function(this:HTMLImageElement){return new Promise<void>(resolve=>pending.set(this.src,resolve));});
  render(<Menus />);
  fireEvent.click(screen.getByRole("tab",{name:"Sushi"}));
  pending.forEach((resolve,src)=>{if(src.includes("sushi-1"))resolve();});await flush();
  expect(sources().every(src=>src?.includes("pizzaria"))).toBe(true);
  fireEvent.click(screen.getByRole("tab",{name:"Marmitaria"}));
  pending.forEach((resolve,src)=>{if(src.includes("marmitaria"))resolve();});await flush();
  expect(sources().every(src=>src?.includes("marmitaria"))).toBe(true);
  pending.forEach(resolve=>resolve());await flush();
  expect(sources().every(src=>src?.includes("marmitaria"))).toBe(true);
  expect(screen.getByRole("tabpanel").getAttribute("aria-busy")).toBe("false");
});

it("preserves the current pair if one image fails and supports retry",async()=>{
  vi.spyOn(HTMLImageElement.prototype,"decode").mockRejectedValueOnce(new Error("offline")).mockResolvedValue();
  render(<Menus />);fireEvent.click(screen.getByRole("tab",{name:"Pastelaria"}));await flush();
  expect(screen.getByRole("status").textContent).toContain("Não foi possível");
  expect(sources().every(src=>src?.includes("pizzaria"))).toBe(true);
  fireEvent.click(screen.getByRole("tab",{name:"Pastelaria"}));await flush();
  expect(sources().every(src=>src?.includes("pastel"))).toBe(true);
});

it("selects the matching pair on mouse hover and preserves the layout choice", async () => {
  render(<Menus />);
  fireEvent.click(screen.getByRole("button", { name: "Ver layout 2" }));
  const event = new MouseEvent("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: "mouse" });
  fireEvent(screen.getByRole("tab", { name: "Sushi" }), event);
  await flush();
  expect(sources().every(src => src?.includes("sushi"))).toBe(true);
  expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("0");
});

it("preloads on non-mouse entry without switching and respects reduced motion",async()=>{
  vi.mocked(window.matchMedia).mockReturnValue({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()} as unknown as MediaQueryList);
  const decode=vi.spyOn(HTMLImageElement.prototype,"decode").mockResolvedValue();
  const animate=vi.spyOn(Element.prototype,"animate");
  render(<Menus />);fireEvent.pointerEnter(screen.getByRole("tab",{name:"Sushi"}));await flush();
  expect(decode).toHaveBeenCalledTimes(2);expect(sources().every(src=>src?.includes("pizzaria"))).toBe(true);
  fireEvent.click(screen.getByRole("tab",{name:"Sushi"}));await flush();
  expect(sources().every(src=>src?.includes("sushi"))).toBe(true);expect(animate).not.toHaveBeenCalled();
});
