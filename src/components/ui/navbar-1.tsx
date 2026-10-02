"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/config/navigation";
import "@/app/component-utilities.css";
import "./navbar-1.css";

const WHATSAPP = "https://wa.me/5515996981803";
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const motionSnapshot = () => window.matchMedia(reducedQuery).matches;
const serverSnapshot = () => true;

export function Navbar1({ currentPage = "home" }: { currentPage?: "home" | "resources" }) {
  const homeHref = currentPage === "resources" ? "/#inicio" : "#inicio";
  const hrefFor = (href: string) => currentPage === "resources" && href.startsWith("#") ? `/${href}` : href;
  const currentFor = (href: string): "page" | "location" | undefined => currentPage === "resources" ? (href === "/recursos" ? "page" : undefined) : active === href.replace(/^\/#/, "#") ? "location" : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");
  const [whatsApp, setWhatsApp] = useState(WHATSAPP);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverSnapshot);
  const uid = `menu10-nav-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null), desktopCTA = useRef<HTMLAnchorElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const openRef = useRef(false);
  const restoreFocus = useRef(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedStyles = useRef<{ overflow: string; paddingRight: string } | null>(null);

  const finishClose = useCallback(() => {
    if (openRef.current) return; // A rapid reopen invalidates the preceding exit.
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    const wasOpen = Boolean(dialog.current?.open || lockedStyles.current);
    if (dialog.current?.open) dialog.current.close();
    if (lockedStyles.current) {
      document.body.style.overflow = lockedStyles.current.overflow;
      document.body.style.paddingRight = lockedStyles.current.paddingRight;
      lockedStyles.current = null;
    }
    if (wasOpen && restoreFocus.current) trigger.current?.focus({ preventScroll: true });
  }, []);

  const close = useCallback((immediate = false, returnFocus = true) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openRef.current = false; restoreFocus.current = returnFocus; setIsOpen(false);
    if (immediate) finishClose();
    // Releasing the page must not depend on a browser animation-finish event.
    else closeTimer.current = setTimeout(finishClose, 300);
  }, [finishClose]);

  const open = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    // main.js fills the desktop link from the existing company config.
    setWhatsApp(desktopCTA.current?.href || WHATSAPP);
    openRef.current = true; restoreFocus.current = true; setIsOpen(true);
  };

  useLayoutEffect(() => {
    if (!isOpen || !dialog.current) return;
    if (!lockedStyles.current) {
      lockedStyles.current = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
      const viewport = document.documentElement.clientWidth;
      const scrollbar = viewport ? Math.max(0, window.innerWidth - viewport) : 0;
      if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight || "0") + scrollbar}px`;
      document.body.style.overflow = "hidden";
    }
    if (!dialog.current.open) dialog.current.showModal();
    closeButton.current?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1000px)");
    const resize = () => {
      if (desktop.matches && dialog.current?.open) { close(true, false); brand.current?.focus({ preventScroll: true }); }
    };
    desktop.addEventListener("change", resize);
    return () => { desktop.removeEventListener("change", resize); openRef.current = false; restoreFocus.current = false; finishClose(); };
  }, [close, finishClose]);

  useEffect(() => {
    if (reduced && !isOpen) finishClose();
  }, [reduced, isOpen, finishClose]);

  useEffect(() => {
    // One scheduled read per frame; header dimensions never depend on scroll.
    const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * .45;
      const current = sections.find(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= line && bounds.bottom > line;
      });
      setActive(current ? `#${current.id}` : "");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href")?.replace(/^\/#/, "#");
    close(true, false); // Release the modal before native anchor navigation.
    if (href?.startsWith("#")) {
      setActive(href);
      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        const previous = target.getAttribute("tabindex");
        target.tabIndex = -1; target.focus({ preventScroll: true });
        if (previous === null) target.removeAttribute("tabindex"); else target.setAttribute("tabindex", previous);
      }
    }
  };

  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return <header className="topo menu10-navbar">
    <div className="menu10-navbar-shell">
      <a ref={brand} className="menu10-navbar-brand" href={homeHref} aria-label="Menu10, início">
        <motion.svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true" initial={false}
          whileHover={reduced ? undefined : { rotate: 8 }} transition={{ duration: .2 }}><use href="#i-marca" /></motion.svg>
        <span>MENU10</span>
      </a>
      <nav className="menu10-navbar-desktop" aria-label="Principal">
        {navigationItems.map(item => <motion.a key={item.href} href={hrefFor(item.href)} aria-current={currentFor(item.href)}
          whileHover={reduced ? undefined : { y: -1 }} transition={{ duration: .16 }}>{item.label}</motion.a>)}
      </nav>
      <motion.a ref={desktopCTA} href={WHATSAPP} data-link="whatsapp" target="_blank" rel="noopener"
        className="menu10-navbar-cta menu10-navbar-desktop-cta" whileHover={reduced ? undefined : { scale: 1.025 }}
        whileTap={reduced ? undefined : { scale: .98 }} transition={{ duration: .16 }}>Pedir demonstração</motion.a>
      <motion.button ref={trigger} type="button" className="menu10-navbar-trigger" onClick={open}
        aria-label="Abrir menu" aria-expanded={isOpen} aria-controls={uid} aria-haspopup="dialog"
        whileTap={reduced ? undefined : { scale: .94 }}><Menu size={24} aria-hidden="true" /></motion.button>
    </div>
    <dialog ref={dialog} id={uid} className="menu10-navbar-dialog" aria-label="Menu de navegação" onKeyDown={containFocus}
      onCancel={event => { event.preventDefault(); close(reduced); }}
      onClose={() => { if (!dialog.current?.open && openRef.current) close(true); }}>
      <AnimatePresence initial={false} onExitComplete={finishClose}>
        {isOpen && <motion.div key="mobile-menu" className="menu10-navbar-mobile" initial={reduced ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : 20 }}
          transition={{ duration: reduced ? 0 : .22, ease: [.22, 1, .36, 1] }}>
          <div className="menu10-navbar-mobile-top">
            <a className="menu10-navbar-brand" href={homeHref} onClick={navigate} aria-label="Menu10, início">
              <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-marca" /></svg><span>MENU10</span>
            </a>
            <motion.button ref={closeButton} type="button" className="menu10-navbar-close" aria-label="Fechar menu"
              onClick={() => close(reduced)} whileTap={reduced ? undefined : { scale: .94 }}><X size={24} aria-hidden="true" /></motion.button>
          </div>
          <nav className="menu10-navbar-mobile-links" aria-label="Principal no celular">
            {navigationItems.map(item => <a key={item.href} href={hrefFor(item.href)} onClick={navigate}
              aria-current={currentFor(item.href)}>{item.label}</a>)}
          </nav>
          <a href={whatsApp} data-link="whatsapp" className="menu10-navbar-cta" target="_blank" rel="noopener" onClick={() => close(true)}>Pedir demonstração</a>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  </header>;
}
