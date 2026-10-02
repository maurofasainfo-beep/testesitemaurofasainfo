# Como editar as perguntas do Menu10

Abra **`src/config/faq.ts`**. Todo o conteúdo fica nesse arquivo; não é necessário editar o componente visual.

- `title`: título da seção.
- `subtitle`: frase curta acima do título.
- `categories`: chaves internas e nomes das categorias, na ordem de apresentação.
- `faqData`: perguntas de cada categoria, usando a mesma chave de `categories`.
- Cada pergunta tem `id` (único dentro da categoria), `question` e `answer`.

Para adicionar uma categoria, inclua uma entrada em `categories`, por exemplo:

```ts
pagamentos: "Pagamentos",
```

E a entrada correspondente em `faqData`:

```ts
pagamentos: [
  {
    id: "minha-pergunta",
    question: "Escreva a pergunta aqui",
    answer: "Escreva a resposta confirmada aqui.",
  },
],
```

Para adicionar uma pergunta a uma categoria existente, copie um bloco `{ id, question, answer }` dentro da lista correspondente. Mantenha as vírgulas entre os blocos. Use IDs curtos, sem espaços, com letras minúsculas e hífens. Categorias sem perguntas ficam ocultas. Para remover uma categoria, remova suas entradas nos dois lugares.

Os textos são texto simples, sem HTML. Para quebrar uma linha na resposta, use `\n`. Perguntas maiores quebram linha automaticamente. As seis respostas iniciais usam apenas informações fornecidas sobre o Menu10; revise-as conforme atualizar as condições comerciais.

Para conferir em desenvolvimento, execute `npm run dev`. Para atualizar a versão de produção local, execute `npm run build` e depois `npm start`. Na hospedagem, publique a nova pasta `out` pelo fluxo existente.

## Integração

O FAQ aparece depois dos relatórios e antes do suporte, com âncora `#faq`. O componente enviado foi adaptado em `src/components/ui/faq-tabs.tsx`, com estilos exclusivos em `faq-tabs.css`. A estrutura shadcn, Tailwind e TypeScript já existia. `@/components/ui` corresponde a `src/components/ui`, conforme o alias do projeto. Não é necessário executar um novo setup.

Foi adicionado `lucide-react` para o símbolo de abrir/fechar. As animações reutilizam `motion/react`, já instalado no projeto. Nenhum provider ou imagem é necessário. `faq-tabs.demo.tsx` demonstra o componente com a mesma configuração, sem criar uma rota pública extra.

Abas operam com clique, foco, setas esquerda/direita e Home/End. Perguntas operam com Enter/Espaço, com uma resposta aberta por vez. A seleção de categorias responde imediatamente, sem aguardar uma animação anterior. A preferência de movimento reduzido elimina as transições. No celular, as categorias usam uma faixa horizontal própria.

Referências: [padrão de acordeão da W3C](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) e [AnimatePresence do Motion](https://motion.dev/docs/react-animate-presence).

Arquivos existentes alterados: `src/app/page.tsx`, `tests/sections.test.tsx`, `package.json` e `package-lock.json`. Novos arquivos: configuração, componente, CSS, demonstração, `tests/faq.test.tsx` e este guia. Backup dos arquivos anteriores em `.backups/faq-integration`.

## Verificação desta entrega

TypeScript, build e os 42 testes passaram. A exportação tem 8 seções, sem erros de recursos locais ou IDs, e 29 URLs responderam corretamente no preview. Os 13 arquivos protegidos e o HTML da hero, header, rodapé, clientes e WhatsApp flutuante continuam iguais à referência. O projeto não possui script de lint.

Os testes do FAQ cobrem teclado, abertura e fechamento, trocas rápidas de categoria, edição da configuração, IDs únicos e mudança da preferência de movimento reduzido. O ambiente de testes emitiu avisos de `window.scrollTo` não implementado pelo jsdom; isso não impediu os testes de passarem.

O navegador integrado continuou indisponível nesta sessão. Screenshots e conferência visual em desktop/celular permanecem pendentes; as verificações acima são de código, DOM e HTTP.
