export interface FAQQuestion {
  /** Identificador único dentro da categoria. Use letras minúsculas e hífens. */
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  title: string;
  subtitle: string;
  categories: Record<string, string>;
  faqData: Record<string, FAQQuestion[]>;
}

/**
 * EDITE O FAQ AQUI.
 * 1. categories: chave interna e nome visível de cada categoria, na ordem desejada.
 * 2. faqData: use a mesma chave e adicione perguntas com id, question e answer.
 * Categorias sem perguntas não aparecem. Os textos aceitam quebras de linha, sem HTML.
 * Após editar, execute npm run build para atualizar a versão de produção.
 */
// TODO(confirmar): validar comportamento sem internet; manter o texto neutro aprovado.
// TODO(confirmar): tipos de nota; usar apenas "notas fiscais" até a confirmação.
export const faqConfig = {
  "title": "Perguntas frequentes",
  "subtitle": "Antes de escolher o Menu10",
  "categories": {
    "sobre": "Sobre o Menu10",
    "recursos": "Recursos",
    "contratacao": "Contratação"
  },
  "faqData": {
    "sobre": [
      {
        "id": "delivery-e-balcao",
        "question": "O Menu10 serve só para delivery?",
        "answer": "Não. Você também lança pedidos locais pelo caixa."
      },
      {
        "id": "integracoes",
        "question": "Como funciona com o iFood e outras plataformas?",
        "answer": "Os pedidos das plataformas integradas caem direto no Menu10, sem precisar abrir cada uma."
      },
      {
        "id": "cardapio",
        "question": "Preciso refazer o meu cardápio?",
        "answer": "Não. A nossa equipe monta com você e consegue copiar o cardápio que você já tem."
      }
    ],
    "recursos": [
      {
        "id": "sem-internet",
        "question": "E se a internet cair?",
        "answer": "A operação local continua funcionando. Os pedidos online voltam a chegar quando a conexão volta."
      },
      {
        "id": "notas-fiscais",
        "question": "Como funciona a nota fiscal?",
        "answer": "O Menu10 controla as notas fiscais dos pedidos. Para começar, é preciso ter certificado digital."
      }
    ],
    "contratacao": [
      {
        "id": "comissao",
        "question": "Tem comissão sobre as vendas?",
        "answer": "Não. Você paga uma mensalidade."
      },
      {
        "id": "mensalidade",
        "question": "Quanto custa?",
        "answer": "A partir de R$ 200/mês. O valor depende do número de computadores e dos módulos, e é definido em consulta com a Fasa Informática."
      },
      {
        "id": "implementacao",
        "question": "Quanto tempo leva para começar?",
        "answer": "A implementação leva de 1 a 2 semanas; depois marcamos o treinamento do sistema."
      }
    ]
  }
} satisfies FAQContent;
