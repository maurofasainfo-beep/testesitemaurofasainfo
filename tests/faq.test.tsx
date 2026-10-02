import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { FAQ } from "@/components/ui/faq-tabs";
import { faqConfig } from "@/config/faq";

it("renders configured categories and supports arrows, Home/End and one tab stop", () => {
  render(<FAQ {...faqConfig} />);
  const tabs = screen.getAllByRole("tab");
  expect(tabs.map(tab => tab.textContent)).toEqual(Object.values(faqConfig.categories));
  act(() => tabs[0].focus());
  fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
  expect(document.activeElement).toBe(tabs[1]);
  expect(tabs[1].getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(tabs[1].id);
  fireEvent.keyDown(tabs[1], { key: "End" }); expect(document.activeElement).toBe(tabs[2]);
  fireEvent.keyDown(tabs[2], { key: "ArrowRight" }); expect(document.activeElement).toBe(tabs[0]);
  fireEvent.keyDown(tabs[0], { key: "ArrowLeft" }); expect(document.activeElement).toBe(tabs[2]);
  fireEvent.keyDown(tabs[2], { key: "Home" }); expect(document.activeElement).toBe(tabs[0]);
  expect(tabs.filter(tab => tab.tabIndex === 0)).toHaveLength(1);
});

it("opens answers with Enter/Space and allows only one open answer", async () => {
  const user = userEvent.setup();
  render(<FAQ {...faqConfig} />);
  const questions = within(screen.getByRole("tabpanel")).getAllByRole("button");
  act(() => questions[0].focus()); await user.keyboard("{Enter}");
  expect(questions[0].getAttribute("aria-expanded")).toBe("true");
  const answer = document.getElementById(questions[0].getAttribute("aria-controls")!)!;
  expect(answer.getAttribute("aria-hidden")).toBe("false");
  act(() => questions[1].focus()); await user.keyboard(" ");
  expect(questions[0].getAttribute("aria-expanded")).toBe("false");
  expect(questions[1].getAttribute("aria-expanded")).toBe("true");
  expect(answer.hasAttribute("inert")).toBe(true);
  await user.keyboard("{Enter}");
  expect(questions[1].getAttribute("aria-expanded")).toBe("false");
});

it("shows only the latest category during rapid changes, without stale open answers", () => {
  render(<FAQ {...faqConfig} />);
  fireEvent.click(screen.getByRole("button", { name: faqConfig.faqData.sobre[0].question }));
  const tabs = screen.getAllByRole("tab");
  for (const index of [1, 2, 0, 2, 1]) fireEvent.click(tabs[index]);
  expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  expect(screen.getByRole("tabpanel").textContent).toContain(faqConfig.faqData.recursos[0].question);
  expect(screen.queryByRole("button", { name: faqConfig.faqData.sobre[0].question })).toBeNull();
  expect(within(screen.getByRole("tabpanel")).getAllByRole("button").every(button => button.getAttribute("aria-expanded") === "false")).toBe(true);
});

it("supports new categories and hides empty ones, including configuration changes", () => {
  const view = render(<FAQ categories={{ teste: "Minha categoria", vazio: "Em preparação" }} faqData={{ teste: [{ id: "exemplo", question: "Minha pergunta?", answer: "Minha resposta." }] }} />);
  expect(screen.getAllByRole("tab")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Minha pergunta?" })).toBeTruthy();
  view.rerender(<FAQ categories={{ nova: "Outra categoria" }} faqData={{ nova: [{ id: "nova", question: "Outra pergunta?", answer: "Outro texto." }] }} />);
  expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("button", { name: "Outra pergunta?" })).toBeTruthy();
  view.rerender(<FAQ categories={{ vazio: "Sem perguntas" }} faqData={{ vazio: [] }} />);
  expect(view.container.textContent).toBe("");
});

it("switches to static answers when reduced motion is enabled while open", () => {
  const listeners = new Set<() => void>();
  const media = { matches: false, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) };
  vi.mocked(window.matchMedia).mockReturnValue(media as unknown as MediaQueryList);
  render(<FAQ {...faqConfig} />);
  fireEvent.click(screen.getByRole("button", { name: faqConfig.faqData.sobre[0].question }));
  act(() => { media.matches = true; listeners.forEach(notify => notify()); });
  const button = screen.getByRole("button", { name: faqConfig.faqData.sobre[0].question });
  expect(button.getAttribute("aria-expanded")).toBe("true");
  const answer = document.getElementById(button.getAttribute("aria-controls")!)!;
  expect(answer.hidden).toBe(false); expect(answer.style.height).toBe("");
  fireEvent.click(button); expect(answer.hidden).toBe(true);
  expect(document.querySelector(".menu10-faq-answer-wrap")).toBeNull();
});

it("uses unique control IDs across instances and renders answers as text", () => {
  render(<><FAQ {...faqConfig} /><FAQ categories={{ teste: "Teste" }} faqData={{ teste: [{ id: "teste", question: "Texto seguro?", answer: "<img src=x onerror=alert(1)>" }] }} /></>);
  const ids = [...document.querySelectorAll("[id]")].map(el => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(document.querySelector("img")).toBeNull();
  expect(document.body.textContent).toContain("<img src=x onerror=alert(1)>");
  document.querySelectorAll("[aria-controls]").forEach(el => expect(document.getElementById(el.getAttribute("aria-controls")!)).not.toBeNull());
});
