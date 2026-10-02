# Home e página de recursos — 02/10/2026

Implementação nativa no Next.js App Router existente, com exportação estática. Nenhuma dependência adicionada. As novas animações usam `motion/react`, `MotionConfig reducedMotion="user"` e `LazyMotion`/`domAnimation` nos novos blocos.

## Conteúdo e navegação

- Home: hero → logos → números → Cardápios → Sem comissão → Caminho do pedido → Balcão e bastidores → Relatórios → Como você começa → FAQ → Suporte → rodapé.
- `/recursos`: h1 próprio, subnavegação Caixa/Retaguarda, exemplo ilustrativo do sabor compartilhado, funções do caixa, quatro grupos da retaguarda e fechamento com demonstração/retorno à home.
- Recursos no header aponta para `/recursos`, com `aria-current="page"` nessa página. Os links das seções passam a `/#id` quando usados em Recursos. O CSS e as dimensões do header permanecem iguais.
- A navegação usa links nativos, sem reescrever o histórico ou prender a rolagem. O servidor de prévia reconhece o arquivo `recursos.html` mesmo com o diretório RSC exportado ao lado.
- FAQ: três categorias, oito perguntas com os fatos fornecidos, numeração e acordeão sem bordas. Uma resposta aberta por vez; configuração em `src/config/faq.ts`.
- Saiu da home a comparação “Como muda o seu dia”. Seu componente antigo permanece no repositório, mas não é renderizado. O texto anterior do preço e as respostas antigas do FAQ foram substituídos.

## Arquivos novos

- `src/app/recursos/page.tsx`: rota, metadados, canonical e Open Graph.
- `src/app/marketing.css`: estilos limitados aos novos blocos e à nova página.
- `src/components/marketing/Motion.tsx`: configuração de movimento e entrada de conteúdo.
- `src/components/marketing/HomeSections.tsx`: números, caminho do pedido, apresentação dos recursos e implementação.
- `src/components/marketing/ResourceSections.tsx`: exemplo do caixa e retaguarda.
- `src/components/SiteFooter.tsx`: reaproveitamento exato do rodapé existente.
- `src/config/site.ts`, `.env.example`: domínio público configurável.
- `src/app/sitemap.ts`: sitemap nativo com home e Recursos; antes não existia sitemap.
- `tests/resources.test.tsx`, `scripts/check-resources.mjs`: interação, conteúdo, links e preservação.

## Arquivos alterados

`src/app/page.tsx`, `src/components/sections/Sections.tsx`, `src/app/sections.css`, `src/config/navigation.ts`, `src/components/ui/navbar-1.tsx`, `src/config/faq.ts`, `src/components/ui/faq-tabs.tsx`, `src/components/ui/faq-tabs.css`, `scripts/preview.mjs` e `tests/sections.test.tsx`.

## Decisões para revisão

- Canonical e sitemap usam provisoriamente o endereço público fornecido: `https://tourmaline-kulfi-9e9fcd.netlify.app`. Configurar `SITE_URL` com o domínio definitivo antes do build para publicação. O domínio foi perguntado durante o trabalho e ainda não foi informado.
- O CTA opcional de “Como você começa” foi omitido, para concentrar a demonstração no Suporte. O bloco de apresentação de recursos tem os dois links de navegação pedidos no complemento, sem um terceiro CTA comercial.
- Os três produtos do exemplo são pizzas Calabresa pequena, média e grande, identificadas como exemplo ilustrativo, sem preços ou dados fictícios de venda.
- Os valores finais dos números já estão no HTML; leitores de tela recebem os valores finais, sem anúncios a cada quadro da contagem.
- O suporte, os horários, os contatos e seus scripts continuam existentes. Não foram acrescentados blocos vazios de equipe.

## A confirmar e imagens necessárias

- `TODO(confirmar)` no FAQ: comportamento sem internet e tipos de notas fiscais; publicado apenas o texto neutro aprovado.
- `TODO(confirmar)` na retaguarda: escopo do robô; sem promessas de responder, atender ou tirar dúvidas. O único comportamento específico permitido está registrado no comentário: envio do pedido ao cliente e ao motoboy, com localização.
- Ficha técnica não foi incluída.
- **Equipe:** faltam de uma a três fotos reais apresentando o sistema. Fornecer em `public/equipe/`; converter para WebP/AVIF e integrar após inspecionar as imagens. Não há fotos correspondentes em `public/` ou `source-assets/`.
- **Retaguarda:** faltam capturas reais dos quatro grupos. Há TODO para adicionar o painel de imagens quando forem fornecidas.

## Verificação e limites

- Build e TypeScript passaram. Todos os **59 testes**, em 11 arquivos, passaram, incluindo teclado no interruptor, menu, abas e acordeão, conteúdo final no HTML e movimento reduzido do FAQ. O projeto não possui comando lint.
- `node scripts/check-resources.mjs --http=http://127.0.0.1:3010`: 15 arquivos protegidos e 6 regiões idênticos; links internos válidos, h1 único, canonical, sitemap e HTTP da nova rota sem erros.
- `node scripts/check-export.mjs --http=http://127.0.0.1:3010`: 41 URLs locais sem erros. JavaScript referenciado na home: aproximadamente 267 KB gzip, ante 249 KB no estado anterior; o código novo usa `LazyMotion` e nenhuma biblioteca nova.
- Hero, logos, Cardápios, Relatórios, rodapé e WhatsApp flutuante mantiveram o HTML anterior. Os arquivos de animação da hero, estilos do header e componentes de Cardápios/Relatórios permanecem idênticos ao snapshot.
- O navegador integrado não está disponível. **Não foram obtidos screenshots em 1440×900/390×844**, nem medições de CLS, overflow ou altura real. Abertura HTTP e checagem de destinos não substituem navegação visual, botão Voltar e posição das âncoras em navegador real.
- As fontes de inspiração do 21st.dev foram consultadas apenas como referência; alguns links de timeline/contadores não retornaram uma prévia utilizável. Não houve CLI, download de componentes ou cópia de código. Implementação própria com os tokens existentes.

Prévia: `http://127.0.0.1:3010` e `http://127.0.0.1:3010/recursos`. Backup e snapshot: `.backups/resources-reform-20261002/`.
