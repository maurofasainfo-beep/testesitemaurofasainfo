# Apresentação dos cardápios — Connoisseur

Integração localizada em `C:\Users\User\Downloads\Logoprasite\menu10-site-atualizado`.

## Componente e decisões

- `src/components/ui/connoisseur-stack-interactor.tsx`: adaptação do componente enviado, com as cinco imagens reais. Lista numerada, máscaras SVG reveladas pelo GSAP e seleção animada com Motion/Framer Motion (`motion/react`).
- O celular aparece completo. As máscaras em faixas e blocos cobrem toda a proporção, sem recortar a captura em formato de hambúrguer. A imagem inicial é estática; cada nova seleção tem uma revelação de aproximadamente 380–512 ms e depois permanece disponível para leitura. Não há repetição automática.
- As imagens preservam as cores originais, as marcas, os preços e as barras do navegador que já estavam nas capturas. Nenhum conteúdo comercial foi acrescentado às imagens.
- Desktop: lista à esquerda e celular de 250 px à direita. Mobile: segmentos em faixa horizontal com scroll-snap, celular de 206 px centralizado. Um único CTA mantém o WhatsApp existente.
- Seleção por mouse, clique, foco, setas, Home/End e swipe horizontal. Movimentos verticais continuam destinados à rolagem. Falhas de carregamento preservam a imagem atual e permitem nova tentativa.
- Imagens carregadas sob demanda e decodificadas antes da troca. Respostas antigas são ignoradas. Máscaras têm IDs únicos e as animações são canceladas ao trocar novamente ou desmontar o componente.
- `prefers-reduced-motion` elimina a transição, inclusive se a preferência mudar durante uma animação.

## Estrutura e configuração

O projeto já usava Next.js, React e TypeScript. Tailwind foi configurado via `@tailwindcss/postcss`; não é necessário criar outro projeto ou rodar um novo `init`.

`components.json` aponta `@/components/ui` para `src/components/ui`, pois o alias `@/*` já corresponde a `src/*`. Essa pasta centraliza componentes reutilizáveis e permite ao shadcn resolver os imports do exemplo sem duplicar uma pasta `components` na raiz. `src/lib/utils.ts` fornece `cn` com `clsx` e `tailwind-merge`.

Os estilos utilitários ficam em `src/app/component-utilities.css`; os estilos exclusivos da apresentação ficam ao lado do componente. O Tailwind não importa Preflight e escaneia apenas `src/components/ui`, para preservar o reset, as classes e os tokens existentes. As cores semânticas novas apontam para os tokens atuais. Nenhum provider é necessário para este componente.

Dependências adicionadas: `gsap`, `clsx`, `tailwind-merge`, `tailwindcss` e `@tailwindcss/postcss`. Motion já estava instalado. Não são necessários ícones novos.

Referências técnicas: [instalação manual do shadcn](https://ui.shadcn.com/docs/installation/manual), [Preflight do Tailwind](https://tailwindcss.com/docs/preflight), [limpeza de animações GSAP](https://gsap.com/docs/v3/GSAP/gsap.context()/).

## Imagens e reprodução

As cinco imagens novas de `Downloads/animacaoiniciosite` foram copiadas para `source-assets/sections` e convertidas para WebP, removendo apenas as margens transparentes. Todas têm 520 × 1076 px; a moldura inteira foi preservada.

`node scripts/prepare-menu-stack.mjs` regenera somente os cardápios a partir das cópias internas. `node scripts/prepare-menu-stack.mjs --refresh` atualiza essas cópias a partir da pasta externa, quando houver novas imagens. Builds normais não dependem de Downloads. Os recortes de relatórios não foram modificados.

## Arquivos envolvidos

- Novos: componente, seu CSS e `demo.tsx` em `src/components/ui`; `src/lib/utils.ts`; `src/app/component-utilities.css`; `components.json`; `postcss.config.mjs`; `scripts/prepare-menu-stack.mjs`; `tests/connoisseur.test.tsx`; este documento.
- Atualizados: integração de `Menus` em `src/components/sections/Sections.tsx`; cinco PNGs internos e cinco WebPs públicos; `tests/sections.test.tsx`; `package.json` e `package-lock.json`. O manifesto de imagens é regenerado mantendo as dimensões e caminhos existentes.
- Removido da seção renderizada: seletor anterior de cardápios. O `MediaSelector` continua atendendo à seção de relatórios.
- Backup anterior à integração: `.backups/connoisseur-integration`.

## Verificação

Comandos: `npm run typecheck`, `npm test`, `npm run build`, `npm run check:export` e `node scripts/check-preserved.mjs`.

Resultados: TypeScript e build aprovados; 36 testes cobertos e aprovados, incluindo a reexecução dos 5 testes específicos do componente. Exportação com 7 seções, 28 recursos locais e nenhum erro de recursos, IDs ou dimensões. Os hashes dos 13 arquivos protegidos e o HTML da hero, header, rodapé, clientes e WhatsApp flutuante continuam idênticos ao backup. Não existe comando de lint configurado neste projeto.

A ferramenta de navegador retornou uma lista vazia nesta sessão. Capturas de tela em 1440×900 e 390×844, avaliação visual do SVG em Safari/Chrome e medições reais de CLS/FPS permanecem pendentes. Testes de DOM não substituem essa verificação visual.
