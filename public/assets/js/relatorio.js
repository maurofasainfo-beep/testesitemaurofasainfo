// Relatórios: abas entre as telas reais do sistema (Vendas e Avaliações) e um clique
// para ver a tela ampliada. No celular, a tela ampliada rola para os lados.
(function () {
  "use strict";
  const painel = document.querySelector(".painel");
  if (!painel) return;

  // Abas (padrão WAI-ARIA: setas trocam de aba, só a aba ativa entra no Tab)
  const abas = [...painel.querySelectorAll('[role="tab"]')];
  const indicador = painel.querySelector(".abas-indicador");
  // A pílula roxa acompanha a aba escolhida.
  const moverIndicador = () => {
    const ativa = abas.find((a) => a.getAttribute("aria-selected") === "true");
    if (!indicador || !ativa || !ativa.offsetWidth) return;
    indicador.style.setProperty("--x", `${ativa.offsetLeft}px`);
    indicador.style.setProperty("--w", `${ativa.offsetWidth}px`);
  };
  const escolher = (aba, focar) => {
    abas.forEach((a) => {
      const ativa = a === aba;
      a.setAttribute("aria-selected", String(ativa));
      a.tabIndex = ativa ? 0 : -1;
      document.getElementById(a.getAttribute("aria-controls")).hidden = !ativa;
    });
    if (focar) aba.focus();
    moverIndicador();
  };
  if (indicador) {
    // Primeira posição sem deslizar; depois, só muda quando a aba ou o tamanho mudam.
    indicador.style.transition = "none";
    moverIndicador();
    requestAnimationFrame(() => { indicador.style.transition = ""; });
    if ("ResizeObserver" in window) new ResizeObserver(moverIndicador).observe(indicador.parentElement);
    if (document.fonts) document.fonts.ready.then(moverIndicador);
  }
  abas.forEach((aba, i) => {
    aba.addEventListener("click", () => escolher(aba));
    aba.addEventListener("keydown", (e) => {
      const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!passo) return;
      e.preventDefault();
      escolher(abas[(i + passo + abas.length) % abas.length], true);
    });
  });

  // Tela ampliada
  const zoom = document.querySelector(".zoom");
  if (!zoom || typeof zoom.showModal !== "function") return;
  const imagem = zoom.querySelector("img");
  let origem = null;
  let ciclo = 0, saida = null;
  painel.querySelectorAll(".tela-ampliar").forEach((botao) => {
    botao.addEventListener("click", () => {
      ciclo++;
      if (saida) saida.cancel();
      saida = null;
      zoom.classList.remove("fechando");
      const img = botao.querySelector("img");
      imagem.src = img.currentSrc || img.src;
      imagem.alt = img.alt;
      origem = botao;
      zoom.showModal();
      zoom.querySelector(".zoom-rolagem").scrollTo(0, 0);
    });
  });
  // Fecha com uma saída curta (CSS .fechando); Esc também passa por aqui.
  const fechar = () => {
    if (!zoom.open || saida) return;
    const minha = ++ciclo;
    const terminar = () => {
      if (minha !== ciclo) return;
      zoom.close();
      if (saida) saida.cancel();
      saida = null;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || typeof zoom.animate !== "function") {
      terminar();
      return;
    }
    saida = zoom.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(8px)" }], { duration: 150, easing: "ease-out", fill: "forwards" });
    saida.finished.then(terminar, () => {});
  };
  zoom.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); fechar(); } });
  zoom.addEventListener("cancel", (e) => { e.preventDefault(); fechar(); });
  zoom.querySelector(".zoom-fechar").addEventListener("click", fechar);
  // Clicar fora da imagem (no fundo escurecido) também fecha.
  zoom.addEventListener("click", (e) => { if (e.target === zoom) fechar(); });
  zoom.addEventListener("close", () => { if (origem) origem.focus(); });
})();
