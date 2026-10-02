// Vitrine de cardápios: cada hexágono flutuante troca o celular e a frase do título.
// Veio da demonstração do novo visual, usando os celulares já recortados do site
// (fundo transparente de verdade, sem máscaras SVG).
(function () {
  "use strict";
  const cardapios = {
    pizzaria: { img: "cardapio-pizzaria.webp", altura: 1302, frase: "na sua pizzaria.", negocio: "a minha pizzaria",
      alt: "Exemplo de cardápio digital de pizzaria no celular, com banner, categorias e bebidas" },
    japones: { img: "cardapio-sushi.webp", altura: 1287, frase: "no seu restaurante japonês.", negocio: "o meu restaurante japonês",
      alt: "Exemplo de cardápio digital de restaurante japonês no celular, com combinados, temakis e pokes" },
    pastelaria: { img: "cardapio-pastelaria.webp", altura: 1181, frase: "na sua pastelaria.", negocio: "a minha pastelaria",
      alt: "Exemplo de cardápio digital de pastelaria no celular, com pastéis, combos e porções" },
    acai: { img: "cardapio-acai.webp", altura: 1300, frase: "na sua loja de açaí.", negocio: "a minha loja de açaí",
      alt: "Exemplo de cardápio digital de açaiteria no celular, com açaís, copos especiais e lanches" },
    marmitaria: { img: "cardapio-marmitaria.webp", altura: 1286, frase: "na sua marmitaria.", negocio: "a minha marmitaria",
      alt: "Exemplo de cardápio digital de marmitaria no celular, com pratos do dia, executivos e saladas" },
  };
  const hexes = [...document.querySelectorAll(".hex")];
  const nuvem = document.querySelector(".hexagonos");
  const celular = document.getElementById("celular");
  const tela = document.getElementById("celular-tela");
  const frase = document.getElementById("negocio");
  const vitrine = document.getElementById("cardapios");
  if (!hexes.length || !celular || !tela) return;
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  let atual = "pizzaria", sequencia = 0, animacoes = [];

  const parar = () => {
    animacoes.forEach((a) => a.cancel());
    animacoes = [];
    celular.querySelectorAll(".entrando").forEach((el) => el.remove());
  };

  // Pontinhos roxos que saltam do hexágono tocado.
  const faiscas = (botao) => {
    if (reduzido.matches) return;
    const n = nuvem.getBoundingClientRect(), h = botao.getBoundingClientRect();
    const x = h.left + h.width / 2 - n.left, y = h.top + h.height / 2 - n.top;
    for (let i = 0; i < 8; i++) {
      const ponto = document.createElement("span");
      const ang = i * Math.PI / 4;
      ponto.className = "faisca";
      ponto.style.left = `${x}px`;
      ponto.style.top = `${y}px`;
      ponto.style.setProperty("--dx", `${Math.cos(ang) * 49}px`);
      ponto.style.setProperty("--dy", `${Math.sin(ang) * 49}px`);
      ponto.addEventListener("animationend", () => ponto.remove(), { once: true });
      nuvem.append(ponto);
    }
  };

  async function escolher(chave) {
    const c = cardapios[chave];
    if (!c) return;
    const minha = ++sequencia; // um clique antigo nunca termina depois do mais recente
    parar();
    hexes.forEach((h) => h.setAttribute("aria-pressed", String(h.dataset.cardapio === chave)));
    // O WhatsApp da página passa a levar o negócio escolhido (main.js escuta).
    document.dispatchEvent(new CustomEvent("menu10:negocio", { detail: { negocio: c.negocio, frase: c.frase } }));
    if (chave === atual) {
      if (!reduzido.matches) tela.animate([{ transform: "scale(1)" }, { transform: "scale(1.035)" }, { transform: "scale(1)" }], { duration: 480, easing: "ease-in-out" });
      return;
    }

    const nova = new Image();
    nova.src = `assets/img/${c.img}`;
    nova.alt = c.alt;
    nova.width = 640;
    nova.height = c.altura;
    nova.className = "celular-tela entrando";
    try { await nova.decode(); } catch (_) { /* o navegador ainda mostra a imagem */ }
    if (minha !== sequencia) return;

    frase.textContent = c.frase;
    frase.classList.remove("trocando");
    void frase.offsetWidth;
    frase.classList.add("trocando");
    celular.append(nova);

    if (!reduzido.matches && typeof nova.animate === "function") {
      const op = { duration: 720, easing: "cubic-bezier(.19, 1, .22, 1)", fill: "forwards" };
      animacoes = [
        nova.animate([
          { opacity: 0, transform: "translate3d(0, 40px, 0) scale(.93) rotate(-2deg)", filter: "blur(14px) drop-shadow(0 34px 38px rgba(70, 0, 110, .16))" },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)", filter: "blur(0) drop-shadow(0 34px 38px rgba(70, 0, 110, .16))" },
        ], op),
        tela.animate([
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0) drop-shadow(0 34px 38px rgba(70, 0, 110, .16))" },
          { opacity: 0, transform: "translate3d(0, -22px, 0) scale(1.045)", filter: "blur(12px) drop-shadow(0 34px 38px rgba(70, 0, 110, 0))" },
        ], { ...op, duration: 590 }),
      ];
      await Promise.allSettled(animacoes.map((a) => a.finished));
      if (minha !== sequencia) return;
    }
    tela.src = nova.src;
    tela.alt = nova.alt;
    tela.height = c.altura;
    atual = chave;
    parar();
  }

  hexes.forEach((botao, i) => {
    botao.addEventListener("click", () => { faiscas(botao); escolher(botao.dataset.cardapio); });
    botao.addEventListener("keydown", (e) => {
      const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!passo) return;
      e.preventDefault();
      const prox = hexes[(i + passo + hexes.length) % hexes.length];
      prox.focus();
      faiscas(prox);
      escolher(prox.dataset.cardapio);
    });
  });

  // A seção sobe suavemente quando chega na tela.
  if ("IntersectionObserver" in window && !reduzido.matches) {
    const ver = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      vitrine.classList.add("revelada");
      ver.disconnect();
    }, { threshold: .15 });
    ver.observe(vitrine);
  }

  // Os outros cardápios carregam quando o navegador fica livre, para a troca não esperar a rede.
  const aquecer = () => Object.values(cardapios).forEach((c) => { const i = new Image(); i.src = `assets/img/${c.img}`; });
  if ("requestIdleCallback" in window) requestIdleCallback(aquecer, { timeout: 2500 });
  else window.addEventListener("load", aquecer, { once: true });
})();
