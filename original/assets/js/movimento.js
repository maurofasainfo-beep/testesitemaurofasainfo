// Movimento ao rolar (inspirado na home da Nuvemshop):
// - [data-surgir]: sobe e aparece quando entra na tela. Os que entram juntos vêm
//   em sequência, de cima para baixo e da esquerda para a direita. Depois de
//   aparecer, o atributo sai e o elemento volta a usar só o próprio estilo.
// - [data-paralaxe]: anda um pouco mais devagar (ou mais rápido) que a página.
(function () {
  "use strict";
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const alvos = document.querySelectorAll("[data-surgir]");
  const liberar = (el) => {
    el.removeAttribute("data-surgir");
    el.classList.remove("surgiu");
    el.style.removeProperty("--atraso");
  };
  if (reduzido || !("IntersectionObserver" in window)) {
    alvos.forEach(liberar);
  } else {
    const ver = new IntersectionObserver((entradas) => {
      entradas
        .filter((e) => e.isIntersecting)
        .map((e) => [e.target, e.boundingClientRect])
        .sort(([, a], [, b]) => (a.top - b.top) || (a.left - b.left))
        .forEach(([el], i) => {
          ver.unobserve(el);
          el.style.setProperty("--atraso", `${Math.min(i, 6) * 120}ms`);
          const fim = (e) => {
            if (e.target !== el || e.propertyName !== "transform") return;
            el.removeEventListener("transitionend", fim);
            liberar(el);
          };
          el.addEventListener("transitionend", fim);
          el.classList.add("surgiu");
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    alvos.forEach((el) => ver.observe(el));
  }

  // Paralaxe: desloca pelo quanto o centro do elemento está longe do centro da tela.
  const camadas = [...document.querySelectorAll("[data-paralaxe]")];
  // No celular a coluna é única e estreita: a paralaxe só aproximaria os blocos.
  if (reduzido || !camadas.length || matchMedia("(max-width: 700px)").matches) return;
  let pedido = 0;
  const mover = () => {
    pedido = 0;
    const meio = window.innerHeight / 2;
    camadas.forEach((el) => {
      const r = el.getBoundingClientRect();
      const atual = el._paralaxe || 0;               // tira o próprio deslocamento da medida
      const centro = r.top - atual + r.height / 2;
      if (centro < -window.innerHeight || centro > window.innerHeight * 2) return;
      el._paralaxe = -(centro - meio) * parseFloat(el.dataset.paralaxe);
      el.style.translate = `0 ${el._paralaxe.toFixed(1)}px`;
    });
  };
  window.addEventListener("scroll", () => { if (!pedido) pedido = requestAnimationFrame(mover); }, { passive: true });
  window.addEventListener("resize", mover);
  mover();
})();
