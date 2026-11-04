export const whatsappMessages = {
  demo: "Olá! Vim pelo site do Menu10 e quero agendar uma demonstração para balcão e delivery.",
  pricing: "Olá! Vim pelo site do Menu10 e gostaria de consultar os valores e módulos para o meu negócio.",
  menu: "Olá! Vim pelo site do Menu10 e gostaria de ver os layouts do cardápio para o meu negócio.",
  reports: "Olá! Vim pelo site do Menu10 e gostaria de ver os relatórios em uma demonstração.",
} as const;

export type WhatsAppIntent = keyof typeof whatsappMessages;

export function whatsappHref(intent: WhatsAppIntent = "demo") {
  return `https://wa.me/5515996981803?text=${encodeURIComponent(whatsappMessages[intent])}`;
}
