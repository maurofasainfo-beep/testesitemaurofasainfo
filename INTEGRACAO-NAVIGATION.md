# Navegação Menu10

O componente fornecido foi adaptado em `src/components/ui/navbar-1.tsx`, com estilos locais em `navbar-1.css` e exemplo em `navbar-1.demo.tsx`. `src/config/navigation.ts` contém os links e seus rótulos. `@/components/ui` aponta para `src/components/ui`; a estrutura shadcn, TypeScript, Tailwind, Motion e Lucide já estava instalada. Nenhuma dependência ou provider adicional foi necessário.

A cápsula branca tem marca Menu10, cores e fonte existentes, links para Cardápios, Recursos, Relatórios, Perguntas e Suporte, e o CTA Pedir demonstração. Ela mantém suas dimensões durante a rolagem: 64 px de altura e até 1120 px de largura no desktop; 58 px de altura no celular/tablet. O breakpoint de 1000 px evita comprimir os cinco links e o CTA. O item da seção atual recebe destaque.

O menu móvel ocupa a tela usando um diálogo nativo e animações curtas do Motion. Há botão de fechar, Escape, contenção de foco, restauração do foco e bloqueio temporário de rolagem. Ao escolher uma seção, o diálogo fecha imediatamente antes da navegação. Mudanças para desktop e desmontagem também liberam a página. Uma reabertura invalida a saída anterior. `prefers-reduced-motion` elimina os deslocamentos e a espera ao fechar.

O CTA móvel recebe o mesmo endereço preenchido pelo `public/assets/js/config.js` no CTA desktop. O número e a configuração comercial não mudaram. A marca usa o símbolo original `#i-marca`; não foi criada imagem genérica.

Em `public/assets/js/main.js`, foi removido somente o bloco antigo de navegação (menu móvel, redução do cabeçalho, progresso, giro da marca e indicador). Esses comportamentos não disputam mais o DOM com o React. As funções de contatos, horário de atendimento, copiar número e logos continuam no script existente. `site-original.js` é regenerado pelo build.

Arquivos existentes alterados: `src/app/page.tsx`, `public/assets/js/main.js` e o bundle gerado `public/assets/js/site-original.js`. Novos: componente, CSS, demo, configuração, `tests/navbar.test.tsx` e este documento. Backup em `.backups/navbar-integration`.

Referência técnica para o modal: [elemento dialog na MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

O navegador integrado retornou uma lista vazia nesta sessão. A conferência visual em 1440×900 e 390×844 e a avaliação em dispositivos reais permanecem pendentes.

Validação: os 48 testes passaram, incluindo seis da navegação. Eles cobrem teclado e foco, Escape, navegação até seções, WhatsApp configurado, reabertura rápida, fechamento ao mudar para desktop, limpeza na desmontagem e execução das funções antigas sem os elementos da navegação anterior. Um prazo de segurança cancelável libera a página mesmo quando o navegador não entrega a conclusão da animação de saída. Eventos de fechamento antigos não encerram um menu já reaberto.

Build e TypeScript aprovados. A exportação e as 29 URLs locais passaram na verificação. A comparação com o backup confirmou a preservação da hero, rodapé, clientes e WhatsApp flutuante, assim como a remoção exclusiva do bloco antigo de navegação em `main.js`. A referência de preservação foi atualizada somente para as mudanças autorizadas no cabeçalho e nesse script. Não há comando de lint configurado.
