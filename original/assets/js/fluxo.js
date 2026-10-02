// Campo de fluxo do fechamento: fios de luz lilás que correm por um campo de ruído
// suave sobre o roxo. Onde o mouse passa (ou o dedo desliza no celular), os fios
// giram em volta dele, num redemoinho. Adaptado do FlowField (kokonutui, MIT) para
// JavaScript puro e para a paleta roxa do Menu10.
(function () {
  "use strict";
  const secao = document.querySelector(".fechamento");
  const tela = secao && secao.querySelector(".fluxo");
  if (!tela) return;
  const ctx = tela.getContext("2d");
  if (!ctx) return;
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

  const FUNDO = "119, 0, 169";   // --roxo-faixa
  const RASTRO = 0.08;            // quanto do quadro anterior apaga a cada passo (rastro suave)
  const MATIZ = 262, FAIXA = 50;  // do violeta ao magenta
  const RAIO = 190;               // alcance do redemoinho em volta do mouse/dedo

  let largura = 0, altura = 0, dpr = 1, quadro = 0, tempo = 0, visivel = false;
  let particulas = [];
  const ponteiro = { x: 0, y: 0, forca: 0, alvo: 0 };

  // Ruído orgânico: uma soma de ondas que devolve um ângulo que muda devagar com o tempo.
  const angulo = (x, y, t) => {
    const s = 0.0025;
    return Math.sin(x * s + t * 0.0007) * Math.PI +
      Math.cos(y * s + t * 0.0005) * Math.PI +
      Math.sin((x + y) * s * 0.6 + t * 0.0009) * Math.PI * 0.6 +
      Math.cos((x - y) * s * 0.4 + t * 0.0006) * Math.PI * 0.4;
  };

  const nova = (p = {}) => {
    p.maxVida = 200 + Math.floor(Math.random() * 300);
    p.vida = Math.floor(Math.random() * p.maxVida);
    p.x = Math.random() * largura;
    p.y = Math.random() * altura;
    p.vel = 1.1 + Math.random() * 1.8;
    p.matiz = MATIZ + Math.random() * FAIXA;
    return p;
  };

  function montar() {
    const r = secao.getBoundingClientRect();
    largura = r.width; altura = r.height;
    if (!largura || !altura) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.round(largura * dpr);
    tela.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${FUNDO})`;
    ctx.fillRect(0, 0, largura, altura);
    const quantas = Math.round(Math.min(1100, largura * altura / 900));
    particulas = Array.from({ length: quantas }, () => nova());
    if (reduzido.matches) estatico();
  }

  function passo(desenhar) {
    tempo++;
    ponteiro.forca += (ponteiro.alvo - ponteiro.forca) * 0.08;
    if (desenhar) {
      ctx.fillStyle = `rgba(${FUNDO}, ${RASTRO})`;
      ctx.fillRect(0, 0, largura, altura);
    }
    for (const p of particulas) {
      const a = angulo(p.x, p.y, tempo);
      let vx = Math.cos(a) * p.vel, vy = Math.sin(a) * p.vel;

      // Redemoinho: perto do ponteiro, o fio gira em volta dele e é puxado de leve para o centro.
      if (ponteiro.forca > 0.01) {
        const dx = p.x - ponteiro.x, dy = p.y - ponteiro.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < RAIO) {
          const f = (1 - d / RAIO) ** 1.6 * ponteiro.forca;
          const giro = 2.6 + p.vel;
          const tx = -dy / d * giro, ty = dx / d * giro;           // tangente (gira)
          const px = -dx / d * 0.9, py = -dy / d * 0.9;            // puxão para dentro
          vx = vx * (1 - f) + (tx + px) * f;
          vy = vy * (1 - f) + (ty + py) * f;
        }
      }

      p.x += vx; p.y += vy; p.vida++;
      if (p.vida > p.maxVida) { nova(p); p.vida = 0; continue; }
      if (p.x < 0) p.x += largura; else if (p.x > largura) p.x -= largura;
      if (p.y < 0) p.y += altura; else if (p.y > altura) p.y -= altura;
      if (!desenhar) continue;

      const prog = p.vida / p.maxVida;
      const alfa = Math.min(prog * 8, 1) * Math.min((1 - prog) * 6, 1) * 0.85;
      const matiz = p.matiz + (a / (Math.PI * 2)) * 30;
      ctx.fillStyle = `hsla(${matiz.toFixed(0)}, 90%, 80%, ${alfa.toFixed(3)})`;
      ctx.fillRect(p.x - 1.1, p.y - 1.1, 2.2, 2.2);
    }
  }

  function animar() {
    quadro = 0;
    if (!visivel || reduzido.matches) return;
    passo(true);
    quadro = requestAnimationFrame(animar);
  }
  const iniciar = () => { if (!quadro && visivel && !reduzido.matches) quadro = requestAnimationFrame(animar); };
  const parar = () => { cancelAnimationFrame(quadro); quadro = 0; };

  // Movimento reduzido: um único desenho parado do campo, sem animação.
  function estatico() {
    ctx.fillStyle = `rgb(${FUNDO})`;
    ctx.fillRect(0, 0, largura, altura);
    for (let i = 0; i < 40; i++) passo(i > 25);
  }

  // Mouse e dedo: o redemoinho segue o ponteiro enquanto ele está sobre a faixa.
  const mover = (cx, cy) => {
    const r = secao.getBoundingClientRect();
    ponteiro.x = cx - r.left; ponteiro.y = cy - r.top; ponteiro.alvo = 1;
  };
  secao.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") mover(e.clientX, e.clientY); });
  secao.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") ponteiro.alvo = 0; });
  // No celular, eventos de toque passivos: o redemoinho acompanha o dedo sem travar a rolagem.
  secao.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) mover(t.clientX, t.clientY); }, { passive: true });
  secao.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) mover(t.clientX, t.clientY); }, { passive: true });
  secao.addEventListener("touchend", () => { ponteiro.alvo = 0; }, { passive: true });
  secao.addEventListener("touchcancel", () => { ponteiro.alvo = 0; }, { passive: true });

  // Só anima com a faixa à vista e a aba aberta.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; visivel ? iniciar() : parar(); }, { rootMargin: "100px 0px" }).observe(secao);
  } else { visivel = true; }
  document.addEventListener("visibilitychange", () => { document.hidden ? parar() : iniciar(); });
  reduzido.addEventListener("change", () => { if (reduzido.matches) { parar(); estatico(); } else iniciar(); });
  if ("ResizeObserver" in window) new ResizeObserver(montar).observe(secao);
  else { window.addEventListener("resize", montar); montar(); }
  iniciar();
})();
