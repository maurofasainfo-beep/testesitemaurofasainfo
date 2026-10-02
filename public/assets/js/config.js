/*
 * ============================================================
 *  DADOS DA EMPRESA — edite só este arquivo.
 *  Tudo no site (botões do WhatsApp, mapa, Google Maps, Waze,
 *  rodapé) é preenchido automaticamente a partir daqui.
 *  Campo vazio ("") some do site sozinho.
 * ============================================================
 */
window.EMPRESA = {
  nome: "Fasa Informática",

  // Endereço que aparece no site.
  endereco: "Av. João Pilon, 307 - 1º andar, Salas 07/08 - Cerquilho - SP",

  // Endereço usado no mapa, Google Maps e Waze (sem andar/sala, para achar o lugar certo).
  enderecoMapa: "Av. João Pilon, 307, Cerquilho - SP",

  // Opcional: coordenadas exatas "latitude,longitude" (deixa o pino no lugar certo).
  // Para pegar: abra o Google Maps, clique com o botão direito no local e clique nos números.
  // Exemplo: "-23.283300,-47.672200"   — deixe "" para usar só o endereço.
  coordenadas: "",

  // WhatsApp só com números: 55 + DDD + número.
  whatsapp: "5515996981803",
  mensagemWhatsapp: "Olá! Vim pelo site e quero uma demonstração do Menu10.",
  // Depois que o visitante escolhe um tipo de negócio na vitrine, a mensagem leva a escolha.
  // {negocio} vira o data-negocio da aba (ex.: "a minha marmitaria").
  mensagemWhatsappNegocio: "Olá! Vim pelo site e quero uma demonstração do Menu10 para {negocio}.",

  telefone: "(15) 99698-1803",
  horario: "Seg a Sex, 8h às 17h30 · Sáb, 8h às 12h",

  // Expediente usado no status "Atendimento agora" (horário de Brasília).
  // 0 = domingo, 1 = segunda … 6 = sábado. Dia sem entrada = fechado.
  expediente: {
    1: ["08:00", "17:30"],
    2: ["08:00", "17:30"],
    3: ["08:00", "17:30"],
    4: ["08:00", "17:30"],
    5: ["08:00", "17:30"],
    6: ["08:00", "12:00"],
  },

  // Opcionais — deixe "" para não aparecer no site.
  email: "",
  instagram: "",
};
