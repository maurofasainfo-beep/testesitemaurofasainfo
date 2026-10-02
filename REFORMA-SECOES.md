# Reforma das seções abaixo da home

## Atualização: restauração dos relatórios originais (02/10/2026)

A pedido do usuário, a seção de relatórios voltou a mostrar as duas capturas completas originais: **Vendas** (1600 × 959) e **Avaliações** (1487 × 948). Esta atualização substitui a descrição dos recortes por horário abaixo. Os arquivos WebP em `public/assets/img/` são idênticos aos de `original/assets/img/`.

As abas preservam teclado, carregamento sob demanda e crossfade de 250 ms (instantâneo com movimento reduzido). A prévia tem espaço reservado e mostra a imagem inteira; “Ampliar tela” abre um diálogo nativo, com opção “Tamanho original” e rolagem interna para ler os detalhes, inclusive no celular. Fechar ou pressionar Esc devolve o foco ao botão que abriu a captura. Não há temporizador de fechamento.

O texto “CLIQUE PARA DAR ZOOM” faz parte da captura original de vendas e foi preservado. Para removê-lo sem alterar a captura artificialmente, é necessária uma nova imagem do painel. Os números das imagens são dados do restaurante apresentado, não indicadores de desempenho do Menu10. Não foram adicionadas telas de faturamento, Raio-X ou comissão sem uma captura correspondente.

Backup anterior em `.backups/reports-restored-20261002/`. A conferência visual em navegador continua pendente; os testes automatizados não substituem essa conferência.

## Escopo entregue

1. **Cardápios:** cinco abas textuais (Pizzaria, Hamburgueria, Marmitaria, Sushi e Pastelaria), imagens fornecidas com moldura, primeiro item ativo, sem autoplay. Teclado com setas, Home e End; foco seleciona; hover pré-carrega; swipe horizontal troca no celular. Apenas a primeira imagem é renderizada inicialmente, com lazy loading por estar abaixo da primeira dobra. Troca por crossfade de 250 ms, com proteção contra carregamentos fora de ordem.
2. **Preço:** mensagem única “Cada pedido é seu. Sem comissão.”, mensalidade a partir de R$ 200 e qualificação fornecida, com um CTA.
3. **Comparação:** quatro pares com texto de alto contraste, sem riscos, checks ou cartão roxo. Fade de 180 ms por par ao entrar na área visível. Foi escolhida a alternativa simples permitida no pedido para não prolongar a página com uma sequência presa à rolagem. No movimento reduzido os pares permanecem estáticos. Os textos retirados estão em comentários TODO no componente.
4. **Relatórios:** dois recortes reais de vendas por horário, dias úteis e fim de semana. As imagens ficam no tamanho nativo (773 × 248), sem ampliação. No celular, o quadro ocupa a largura disponível e o gráfico tem rolagem horizontal intencional, acessível também por teclado, para preservar a leitura das legendas. Esta adaptação merece revisão visual: uma captura com apresentação mais estreita permitirá remover essa rolagem interna.
5. **Suporte:** bloco único com demonstração, número, copiar número, status atual e endereço. Google Maps e Waze são links de texto. A lógica existente de atendimento em America/Sao_Paulo e os dados de contato foram preservados.

## Removido da página publicada

- Hexágonos, órbitas e segmento Açaí da vitrine.
- Quatro blocos de diferenciais com ícones repetidos.
- Checks, texto riscado, seta central e comparação em cartões.
- Painel inteiro com zoom e chips sem captura associada.
- Mapa embutido, estado “Carregando o mapa…” e bloco roxo separado de encerramento.
- Carregamento dos scripts antigos de vitrine e zoom. Os arquivos originais continuam preservados.

## Capturas necessárias

Não foram renderizados seletores para estas telas:

- **Faturamento e ticket médio:** falta captura correspondente.
- **Mapa de calor por bairro:** o texto “CLIQUE PARA DAR ZOOM” está embutido na imagem atual. É necessária uma nova captura limpa, sem essa sobreposição.
- **Raio-X do negócio:** falta captura correspondente.
- **Comissão da equipe:** falta captura correspondente.

Para melhorar o mobile, também é desejável uma captura de vendas por horário em uma apresentação estreita e legível, sem reduzir o gráfico amplo atual. Não houve reconstrução de dados, remoção artificial de texto do mapa nem criação de relatórios inexistentes.

## Arquivos

- `src/app/page.tsx`: substituição das cinco seções.
- `src/app/sections.css`: estilos isolados por classes `reform-*`.
- `src/components/sections/Sections.tsx`: cardápios, preço, relatórios e suporte.
- `src/components/sections/MediaSelector.tsx`: seleção acessível, carregamento e crossfade.
- `src/components/sections/Comparison.tsx`: pares antes/depois e reveal curto.
- `scripts/prepare-sections.mjs`, `src/lib/section-media.json`, `source-assets/sections/`, `public/images/sections/`: originais fornecidos, conversão WebP e recortes.
- `scripts/restore-original.mjs`, `public/assets/js/site-original.js`: composição do arquivo de interações carregado.
- `scripts/check-export.mjs`: inclui as imagens sob demanda na verificação de arquivos e HTTP.
- `scripts/check-preserved.mjs`: compara 13 arquivos protegidos e cinco regiões renderizadas com o estado anterior.
- `tests/sections.test.tsx`: testes da reforma; demais testes existentes mantidos.
- `README.md` e este relatório: documentação atualizada.

## Validação e limites

Resultado desta execução: build e TypeScript aprovados; 31 testes passaram (10 novos para a reforma), com repetição dos 10 testes da reforma após os ajustes; 29 URLs verificadas por HTTP sem erros. A comparação de 13 arquivos protegidos e cinco regiões renderizadas não encontrou alterações. O script da página foi executado em DOM simulado, sem erros, confirmando o status de atendimento, o link do WhatsApp e a abertura/fechamento do menu. Esta última verificação não equivale a um navegador real.

Executar `npm test`, `npm run typecheck`, `npm run build`, `npm run check:export -- --http=http://127.0.0.1:3010` e `node scripts/check-preserved.mjs`.

O projeto não tem um comando lint configurado. Não foi adicionada uma ferramenta só para esta reforma.

A conferência automatizada cobre marcação protegida, arquivos da hero, teclado, ARIA, cancelamento de transições, swipe, falhas de carregamento, movimento reduzido, contraste dos tokens usados e integridade dos recursos. Comparação de comportamento visual antes/depois, screenshots em 1440 × 900 e 390 × 844, altura real das seções, ausência de overflow e CLS no navegador permanecem pendentes: o navegador integrado não está disponível nesta sessão. Não há afirmação de validação visual ou de medição de CLS.

O estado anterior está em `.backups/sections-reform/`. A pasta `original/` não foi alterada.
