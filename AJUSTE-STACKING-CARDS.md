# Caixa e Retaguarda — Stacking Cards

## Implementação

Foi substituída somente a seção `#recursos`. O título é “O balcão e os bastidores.”, seguido pelos cartões Caixa e Retaguarda, com os textos fornecidos. As âncoras `#caixa` e `#retaguarda` permanecem nos cartões. O header não foi editado.

O componente fornecido foi adaptado em `src/components/ui/stacking-cards.tsx`, mantendo o crédito a Khoa Phan e a indicação MIT. Usa contexto, `useScroll` e `useTransform` de `motion/react`, já instalado; nenhuma dependência nova. O projeto já tem Next/React, TypeScript, Tailwind e configuração shadcn, com `@/components/ui` apontando para `src/components/ui`.

No desktop, o primeiro cartão reduz até 94% conforme o segundo sobe. O topo considera a posição inferior do header mais 16px, com 12px adicionais no segundo cartão. A altura ativa é `min(80svh, 640px)`. Não há espaçador adicional ao final. A medição desliga o sticky se o texto não couber na altura disponível. Ao navegar de volta pelo teclado, o cartão antes encoberto volta à área visível.

Em telas abaixo de 1024px e com movimento reduzido, os cartões seguem o fluxo normal, sem empilhamento fixo nem escala. No celular, a Retaguarda usa os quatro itens em uma coluna, com a imagem abaixo. Essa escolha evita prender um cartão com conteúdo maior que a área visível.

## Imagens

| Origem | Dimensões | Arquivo público | Tamanho |
| --- | --- | --- | --- |
| `caixamenu10.png` | 1920 × 953 | `public/sistema/caixa-menu10.webp` | 29.410 bytes |
| `retaguardamenu10.png` | 1920 × 1042 | `public/sistema/retaguarda-menu10.webp` | 63.070 bytes |

Conversão WebP sem perda, sem recorte ou redimensionamento. A comparação dos pixels decodificados confirmou igualdade com os PNGs. Ambas reservam a proporção real e usam `object-fit: contain`, dimensões explícitas, lazy loading, async decoding e os alt texts solicitados.

Há os nomes “Mauro a” e “Mauro” nas capturas. O usuário confirmou nesta conversa que são dados de demonstração. Não foram identificados telefone ou endereço de cliente nas duas imagens.

As capturas têm áreas vazias do próprio sistema e textos pequenos. Elas foram mantidas inteiras. Para ler os detalhes, “Ampliar tela” abre o mesmo diálogo dos Relatórios, com ajuste à tela, tamanho original, fechamento por Escape e devolução do foco ao botão. Não foram adicionados rótulos ou recursos comerciais além dos solicitados.

## Arquivos

Novos:

- `src/components/ui/stacking-cards.tsx`
- `src/components/marketing/resource-stack.css` (estilos restritos à nova seção)
- `public/sistema/caixa-menu10.webp`
- `public/sistema/retaguarda-menu10.webp`
- `tests/stacking-cards.test.tsx`
- `scripts/check-stacking.mjs`
- Este relatório.

Alterados:

- `src/components/marketing/ResourceSections.tsx`: substituição da demo e do conteúdo anterior pelos cartões.
- `src/components/sections/MediaSelector.tsx`: exportação do diálogo existente e rótulos acessíveis opcionais para reutilização. Os valores padrão dos Relatórios foram mantidos.
- `tests/resources.test.tsx`: teclado da ampliação, imagens, âncoras e modo estático.
- `tests/dark-contrast.test.ts`: contraste do texto branco a 80% sobre roxo.

Nenhum arquivo anterior foi excluído. Foram removidos da seção o interruptor de sabor, as linhas de produtos fictícios e a grade anterior de Retaguarda. Não havia abas ou acordeão nessa versão da seção. O comentário TODO(confirmar) do robô foi mantido.

Backup da seção, do diálogo, dos testes e do HTML anterior: `.backups/stacking-cards-20261002/`.

## Verificação e limites

- Build com TypeScript e exportação estática aprovado.
- 64 testes aprovados em 13 arquivos; o teste adicional cobre ativação desktop, desativação por conteúdo alto, mudança para mobile e foco no cartão encoberto.
- Contraste AA das cores de texto testado, incluindo branco a 80% no roxo. Alvos dos botões de ampliação têm no mínimo 44px.
- `check-stacking.mjs`: 13 seções/regiões fora de Recursos com markup idêntico ao backup, incluindo header, hero, logos, Cardápios, Relatórios, FAQ, suporte e footer. Nenhum estilo global foi alterado nesta tarefa.
- `check-export.mjs`: 40 recursos locais encontrados, sem erro.
- Não existe script de lint no projeto.

O navegador integrado não disponibilizou uma instância. Portanto, screenshots em 1440×900 e 390×844, início/meio/fim do efeito, medição visual de overflow e navegação real por URL com âncora permanecem sem validação em navegador. Os testes de interação usam jsdom e não comprovam fluidez ou geometria renderizada. Os IDs, proporções, regras de espaçamento e cálculos de encaixe foram conferidos em código/testes.

Pontos para revisão visual: tamanho dos textos nas capturas completas e ritmo do empilhamento. Nenhuma nova imagem é necessária para concluir a integração; as capturas recebidas foram utilizadas integralmente.
