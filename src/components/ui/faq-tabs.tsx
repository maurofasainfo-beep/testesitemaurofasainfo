"use client";

import { useId, useRef, useState, useSyncExternalStore, type HTMLAttributes, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQContent, FAQQuestion } from "@/config/faq";
import { MarketingMotion } from "@/components/marketing/Motion";
import "@/app/component-utilities.css";
import "./faq-tabs.css";

type FAQProps = Omit<HTMLAttributes<HTMLElement>, "title"> & Pick<FAQContent, "categories" | "faqData"> & {
  title?: string; subtitle?: string;
};
const query = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const motionSnapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => true;

export function FAQ({ title = "Perguntas frequentes", categories, faqData, className, ...props }: FAQProps) {
  const uid = `faq-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const keys = Object.keys(categories).filter(key => faqData[key]?.length);
  const [selectedCategory, setSelectedCategory] = useState(keys[0] ?? "");
  const selected = keys.includes(selectedCategory) ? selectedCategory : keys[0];
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverSnapshot);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigate = (event: KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = keys.length - 1;
    else if (event.key === "ArrowRight") next = (index + 1) % keys.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + keys.length) % keys.length;
    else return;
    event.preventDefault(); tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "auto" });
  };

  if (!selected) return null;
  return <MarketingMotion><section {...props} className={cn("menu10-faq relative min-w-0", className)} aria-labelledby={`${uid}-title`}>
    <div className="container">
      <header className="menu10-faq-header">
        <h2 id={`${uid}-title`}>{title}</h2>
      </header>
      <div className="menu10-faq-tabs" role="tablist" aria-label="Categorias de perguntas">
        {keys.map((key, index) => <button key={key} type="button" role="tab" ref={el => { tabs.current[index] = el; }}
          id={`${uid}-tab-${index}`} aria-controls={`${uid}-panel-${index}`} aria-selected={selected === key}
          tabIndex={selected === key ? 0 : -1} onClick={() => setSelectedCategory(key)}
          onFocus={() => setSelectedCategory(key)} onKeyDown={event => navigate(event, index)}>
          <span className="menu10-faq-tab-label">{categories[key]}</span>
        </button>)}
      </div>
      <div className="menu10-faq-panels">
        {keys.map((key, index) => <div key={key} id={`${uid}-panel-${index}`} role="tabpanel"
          aria-labelledby={`${uid}-tab-${index}`} hidden={selected !== key} tabIndex={0}>
          {selected === key && <FAQList key={key} questions={faqData[key]} reduced={reduced} />}
        </div>)}
      </div>
    </div>
  </section></MarketingMotion>;
}

function FAQList({ questions, reduced }: { questions: FAQQuestion[]; reduced: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const content = questions.map(faq => <FAQItem key={faq.id} {...faq} open={openId === faq.id} reduced={reduced}
    toggle={() => setOpenId(current => current === faq.id ? null : faq.id)} />);
  // Category changes are immediate; no exit queue can show a stale category.
  return reduced ? <div>{content}</div> : <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .2, ease: "easeOut" }}>{content}</motion.div>;
}

function FAQItem({ question, answer, open, reduced, toggle }: FAQQuestion & { open: boolean; reduced: boolean; toggle: () => void }) {
  const uid = useId();
  return <div className={cn("menu10-faq-item", open && "is-open")}>
    <h3><button type="button" id={`${uid}-question`} aria-expanded={open} aria-controls={`${uid}-answer`} onClick={toggle}>
      <span className="menu10-faq-question">{question}</span>
      <motion.span className="menu10-faq-plus" aria-hidden="true" initial={false}
        animate={{ rotate: open ? 45 : 0 }} transition={{ duration: reduced ? 0 : .2 }}>
        <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
      </motion.span>
    </button></h3>
    {reduced ? <div id={`${uid}-answer`} hidden={!open} aria-labelledby={`${uid}-question`}>
      <p className="menu10-faq-answer">{answer}</p>
    </div> : <motion.div id={`${uid}-answer`} aria-labelledby={`${uid}-question`} aria-hidden={!open} inert={!open}
      initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ height: { duration: .24, ease: "easeOut" }, opacity: { duration: .2 } }} className="menu10-faq-answer-wrap">
      <p className="menu10-faq-answer">{answer}</p>
    </motion.div>}
  </div>;
}
