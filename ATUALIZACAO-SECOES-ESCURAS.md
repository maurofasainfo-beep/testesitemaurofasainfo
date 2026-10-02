# Atualização das seções — 2 de outubro de 2026

Implementada no projeto `C:\Users\User\Downloads\Logoprasite\menu10-site-atualizado`. Este documento substitui as orientações anteriores sobre a página separada de Recursos. Nenhuma dependência foi adicionada.

## Resultado

- `/recursos` deixou de ser uma página. O link do header aponta para `/#recursos`; o servidor de prévia e o Netlify têm redirecionamento 301 de `/recursos` e `/recursos/` para essa âncora.
- Caixa e Retaguarda voltaram à home, em duas colunas no desktop e empilhadas no mobile. A demonstração do sabor mantém teclado, estados acessíveis e movimento reduzido. Os quatro grupos da retaguarda mantêm os textos.
- Caminho do pedido: cinco notas inclinadas com alfinetes, painel interno, linha curva tracejada e fundo escuro com linhas discretas. A partir de 1024px, ficam lado a lado; abaixo disso, há carrossel contido com scroll-snap. Setas, Home e End percorrem os cartões. Os cinco passos permanecem com o mesmo conteúdo.
- Como você começa passou a roxo; FAQ e rodapé passaram a quase-preto. Conteúdos, estrutura e comportamento dessas áreas foram preservados. Suporte permanece branco e ganhou o mapa.
- O mapa carrega sob demanda e possui endereço/link de segurança atrás do iframe. Há também acesso ao Google Maps permanentemente visível abaixo dele.

## Arquivos

Novos:

- `src/app/rhythm.css`: cores e ajustes responsivos das seções autorizadas.
- `src/components/sections/SupportMap.tsx`: mapa e alternativas de acesso ao endereço.
- `tests/dark-contrast.test.ts`: contraste das combinações usadas nas áreas escuras.
- Este relatório.

Alterados:

- `src/app/layout.tsx`: importação dos estilos.
- `src/app/page.tsx`: seção de operação na home.
- `src/app/marketing.css`: retirada dos estilos da página de recursos e da apresentação anterior do caminho do pedido.
- `src/app/sitemap.ts`: remoção da entrada de Recursos.
- `src/components/marketing/HomeSections.tsx`: nova apresentação do caminho do pedido.
- `src/components/marketing/ResourceSections.tsx`: Caixa e Retaguarda compactos.
- `src/components/sections/Sections.tsx`: suporte em duas colunas com mapa.
- `src/components/ui/navbar-1.tsx` e `src/config/navigation.ts`: destino e reconhecimento da âncora de Recursos.
- `netlify.toml` e `scripts/preview.mjs`: redirecionamentos.
- `scripts/check-resources.mjs`, `tests/resources.test.tsx` e `tests/sections.test.tsx`: verificações adaptadas à nova organização.

Removido: `src/app/recursos/page.tsx`, incluindo metadados, subnavegação e fecho da página. Foram retirados os links “Ver o Caixa”, “Ver a Retaguarda” e “Voltar para o início”.

Os arquivos de `out/` foram regenerados pelo build. O backup anterior a esta alteração está em `.backups/section-rhythm-20261002/`.

## Cores

Os tokens existentes continuam iguais. Tokens novos:

| Token | Valor |
| --- | --- |
| `--fundo-escuro` | `#0e0a14` |
| `--roxo-no-escuro` | `#d6a6f2` |
| `--texto-no-escuro` | branco a 78% |
| `--borda-no-escuro` | branco a 14% |

O símbolo do rodapé já é SVG e o nome MENU10 é texto. Foi possível deixar o nome branco e manter o símbolo roxo, sem filtros nem nova imagem.

## Validação realizada

- `npm run build`: aprovado, incluindo TypeScript e exportação estática. `/recursos` não aparece nas rotas geradas.
- `npm test`: 63 testes aprovados em 12 arquivos. Incluem teclado do interruptor, FAQ/abas, navegação entre os cartões, estado de movimento reduzido, fallback do mapa e contraste AA das combinações escuras.
- `node scripts/check-export.mjs`: sem erros; 38 recursos locais encontrados.
- `node scripts/check-resources.mjs --http=http://127.0.0.1:3010`: sem erros; home e sitemap disponíveis, redirecionamentos 301 confirmados localmente.
- Comparação com backup: 15 arquivos protegidos idênticos; markup de hero, logos, Cardápios, Relatórios, Como você começa, rodapé e WhatsApp flutuante idêntico. No header, a única diferença de markup é o destino do link Recursos. As cores autorizadas mudam por CSS.
- Não existe script de lint no projeto.

Limites: o navegador integrado não disponibilizou uma instância nesta sessão. Não foram obtidos screenshots em 1440×900 ou 390×844, nem medidos altura renderizada, overflow, CLS ou fluidez. Os testes de teclado e mapa são automatizados em jsdom; não substituem validação em navegador real. O jsdom também informa que `window.scrollTo` não é implementado. As dimensões responsivas foram revisadas no código, mas ainda precisam da conferência visual solicitada.

Não há CSP configurada nos arquivos de hospedagem do projeto. O carregamento real do Google Maps e eventuais políticas externas da hospedagem não foram verificados. O redirecionamento do Netlify foi configurado, mas não houve publicação nesta tarefa.

## Decisões e pendências para revisão

- O iframe só fica visível após `load`. Falhas que disparam `error` ou bloqueios de CSP recuperam o fallback. Como o Google está em outra origem, não é possível detectar toda página de erro interna após `load`; por isso o endereço e o link abaixo do mapa ficam sempre acessíveis.
- O espaço da hero foi mantido. A inspeção encontrou uma distância de formação de aproximadamente 945px em 1440×900 e 823px em 390×844, além da área visível da animação. O código calcula o progresso usando essa altura. Não foi encontrado um espaçador independente entre hero e logos; isso não equivale a uma medição visual de sobra.
- Os TODO(confirmar) relativos ao robô, tipos de notas fiscais e funcionamento sem internet permanecem. Ficha técnica não foi incluída.
- A imagem de referência foi fornecida e utilizada. Não é necessária uma nova versão clara do logo. Capturas da retaguarda continuam opcionais para uma futura apresentação com imagens; a seção atual usa a tipografia solicitada.
- A conferência visual em desktop/mobile, especialmente altura das notas, área de respiro e carregamento real do mapa, permanece pendente pelos limites do navegador desta sessão.
