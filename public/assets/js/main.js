(function () {
  "use strict";

  const E = window.EMPRESA || {};
  const alvo = encodeURIComponent(E.coordenadas || E.enderecoMapa || E.endereco || "");
  const linkWhats = (texto) => E.whatsapp && `https://wa.me/${E.whatsapp}?text=${encodeURIComponent(texto || "")}`;

  const links = {
    whatsapp: linkWhats(E.mensagemWhatsapp),
    maps: alvo && `https://www.google.com/maps/search/?api=1&query=${alvo}`,
    waze: alvo && (E.coordenadas
      ? `https://waze.com/ul?ll=${alvo}&navigate=yes`
      : `https://waze.com/ul?q=${alvo}&navigate=yes`),
    email: E.email && `mailto:${E.email}`,
    instagram: E.instagram,
  };

  // Preenche textos e links a partir do config.js (o HTML já traz os valores
  // atuais, então o site funciona mesmo sem JavaScript).
  document.querySelectorAll("[data-empresa]").forEach((el) => {
    const valor = E[el.dataset.empresa];
    if (valor) el.textContent = valor;
  });
  document.querySelectorAll("[data-link]").forEach((el) => {
    const href = links[el.dataset.link];
    if (href) el.href = href;
  });
  // Campos opcionais vazios somem do site
  document.querySelectorAll("[data-opcional]").forEach((el) => {
    if (!E[el.dataset.opcional]) el.hidden = true;
  });
  const mapa = document.getElementById("mapa");
  if (mapa && alvo) mapa.src = `https://maps.google.com/maps?q=${alvo}&z=16&output=embed`;

  document.getElementById("ano").textContent = new Date().getFullYear();

  // O negócio escolhido na vitrine acompanha o visitante (só depois que ele escolhe):
  // o WhatsApp já leva o negócio na mensagem e o fechamento fala "na sua pizzaria."
  const fechamentoNegocio = document.getElementById("fechamento-negocio");
  document.addEventListener("menu10:negocio", (e) => {
    const { negocio, frase } = e.detail || {};
    if (E.mensagemWhatsappNegocio && negocio) {
      const href = linkWhats(E.mensagemWhatsappNegocio.replace("{negocio}", negocio));
      if (href) document.querySelectorAll('[data-link="whatsapp"]').forEach((a) => { a.href = href; });
    }
    if (fechamentoNegocio && frase && fechamentoNegocio.textContent !== frase) {
      fechamentoNegocio.textContent = frase;
      fechamentoNegocio.classList.remove("trocando");
      void fechamentoNegocio.offsetWidth;
      fechamentoNegocio.classList.add("trocando");
    }
  });

  // Navigation is owned by the React Navbar1 component.

  // Sem × Com: quando o par aparece, a dor é riscada e a solução se revela (CSS .riscado).
  const pares = document.querySelectorAll(".par");
  if ("IntersectionObserver" in window) {
    const riscar = new IntersectionObserver((itens) => {
      itens.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.closest(".par").classList.add("riscado");
        riscar.unobserve(target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.6 });
    pares.forEach((par) => riscar.observe(par.querySelector(".par-sem")));
  } else pares.forEach((par) => par.classList.add("riscado"));

  // Faixa de clientes: repete as logos até cobrir a tela e duplica tudo,
  // para o translateX(-50%) recomeçar sem salto.
  const janela = document.querySelector(".marcas-janela");
  const trilho = document.querySelector(".marcas-trilho");
  const grupo = document.querySelector(".marcas-grupo");
  if (janela && trilho && grupo) {
    const originais = [...grupo.children];
    let ultimaLargura = 0;
    const preencher = () => {
      const largura = Math.ceil(janela.getBoundingClientRect().width);
      if (!largura || largura === ultimaLargura) return;
      ultimaLargura = largura;
      grupo.querySelectorAll("[data-copia]").forEach((el) => el.remove());
      trilho.querySelectorAll(".marcas-grupo[aria-hidden]").forEach((el) => el.remove());
      for (let i = 0; i < 12 && grupo.getBoundingClientRect().width < largura + 120; i++) {
        originais.forEach((item) => {
          const copia = item.cloneNode(true);
          copia.dataset.copia = "";
          copia.setAttribute("aria-hidden", "true");
          copia.querySelector("img").alt = "";
          grupo.append(copia);
        });
      }
      const segundo = grupo.cloneNode(true);
      segundo.setAttribute("aria-hidden", "true");
      segundo.removeAttribute("aria-label");
      segundo.querySelectorAll("img").forEach((img) => { img.alt = ""; });
      trilho.append(segundo);
      trilho.style.animationDuration = `${Math.round(grupo.getBoundingClientRect().width / 32)}s`;
    };
    if ("ResizeObserver" in window) new ResizeObserver(preencher).observe(janela);
    else { window.addEventListener("resize", preencher); preencher(); }
  }

  // Status do atendimento, calculado pelo expediente no horário de Brasília
  const status = document.getElementById("status-atendimento");
  // O pulso do "aberto agora" só corre com o cartão na tela.
  if (status && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => status.classList.toggle("na-tela", e.isIntersecting)).observe(status);
  }
  if (status && E.expediente) {
    const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const minutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
    const hora = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`; };
    const agora = () => {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
      }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
      return { dia, min: Number(p.hour) * 60 + Number(p.minute) };
    };
    const proximaAbertura = (dia, min) => {
      for (let i = 0; i < 8; i++) {
        const d = (dia + i) % 7;
        const faixa = E.expediente[d];
        if (!faixa || (i === 0 && min >= minutos(faixa[0]))) continue;
        const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[d];
        return `abre ${quando} às ${hora(faixa[0])}`;
      }
      return "";
    };
    const texto = document.getElementById("status-texto");
    // O WhatsApp flutuante usa o mesmo relógio: bolinha quando aberto e uma etiqueta curta.
    const flutuante = document.querySelector(".whats-flutuante");
    const dica = flutuante && flutuante.querySelector(".whats-dica");
    const avisar = (aberto, frase) => {
      if (!flutuante || !dica) return;
      flutuante.classList.toggle("aberto", aberto);
      dica.textContent = frase;
      flutuante.setAttribute("aria-label", `Pedir demonstração no WhatsApp (${frase.toLowerCase()})`);
    };
    const atualizar = () => {
      const { dia, min } = agora();
      const faixa = E.expediente[dia];
      const aberto = faixa && min >= minutos(faixa[0]) && min < minutos(faixa[1]);
      status.classList.toggle("fechado", !aberto);
      // A segunda parte nunca quebra no meio: "· abre amanhã às 8h" fica junta.
      const escrever = (inicio, fim) => {
        const parte = document.createElement("span");
        parte.className = "sem-quebra";
        parte.textContent = `· ${fim}`;
        texto.replaceChildren(`${inicio} `, parte);
      };
      if (aberto) {
        const resta = minutos(faixa[1]) - min;
        if (resta <= 30) { escrever("Aberto", `fecha em ${resta} min`); avisar(true, `Aberto · fecha em ${resta} min`); }
        else { escrever("Aberto agora", `até ${hora(faixa[1])}`); avisar(true, `Aberto agora · até ${hora(faixa[1])}`); }
      } else {
        const proxima = proximaAbertura(dia, min);
        escrever("Fechado agora", proxima);
        avisar(false, proxima ? `Fechado · ${proxima}` : "Fechado agora");
      }
      document.getElementById("status-detalhe").textContent = `${E.horario} · horário de Brasília`;
    };
    // Atualiza na virada de cada minuto, para "fecha em N min" ficar exato.
    const noProximoMinuto = () => setTimeout(() => { atualizar(); noProximoMinuto(); }, 60000 - (Date.now() % 60000) + 50);
    atualizar();
    noProximoMinuto();
  }

  // Copiar o número (para quem está no computador e usa o WhatsApp no celular).
  // Só aparece onde o navegador permite copiar.
  const copiar = document.querySelector(".copiar");
  if (copiar && E.telefone && navigator.clipboard && window.isSecureContext) {
    const rotulo = copiar.querySelector(".copiar-texto");
    const aviso = document.getElementById("copiar-aviso");
    let volta;
    copiar.hidden = false;
    copiar.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(E.telefone); } catch { return; }
      copiar.classList.remove("copiado");
      void copiar.offsetWidth;
      copiar.classList.add("copiado");
      rotulo.textContent = aviso.textContent = "Número copiado";
      clearTimeout(volta);
      volta = setTimeout(() => {
        copiar.classList.remove("copiado");
        rotulo.textContent = "Copiar número";
        aviso.textContent = "";
      }, 2400);
    });
  }
  // No celular (sem hover), a etiqueta do WhatsApp aparece sozinha uma vez por visita,
  // quando o visitante começa a descer a página.
  const flutuanteToque = document.querySelector(".whats-flutuante");
  if (flutuanteToque && matchMedia("(hover: none)").matches) {
    let ja = false;
    try { ja = sessionStorage.getItem("menu10-dica") === "1"; } catch { /* sem armazenamento: mostra mesmo assim */ }
    const mostrar = () => {
      if (ja || window.scrollY < window.innerHeight * 0.6) return;
      ja = true;
      window.removeEventListener("scroll", mostrar);
      try { sessionStorage.setItem("menu10-dica", "1"); } catch { /* ignora */ }
      flutuanteToque.classList.add("mostrar");
      setTimeout(() => flutuanteToque.classList.remove("mostrar"), 3600);
    };
    if (!ja) window.addEventListener("scroll", mostrar, { passive: true });
  }

  // Assinatura para quem abre o console.
  console.log("%cMenu10%c  cardápio digital e gestão para restaurantes · feito pela Fasa Informática, Cerquilho – SP",
    "color:#8000bb;font:700 14px Inter,system-ui,sans-serif", "color:#6e6474;font:12px Inter,system-ui,sans-serif");
})();
