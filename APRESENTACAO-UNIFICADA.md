# Cardápios e layouts unificados

O seletor de exemplos voltou ao estilo original do Connoisseur: lista numerada com nomes grandes no desktop, destaque roxo e deslocamento curto do item ativo. No celular, os mesmos itens ficam em faixa horizontal. Passar o mouse seleciona o segmento, assim como clique, toque e teclado. Os dois layouts e a posição do comparador continuam preservados na troca. O celular permanece à esquerda no desktop.

A seção `#cardapios` agora reúne os cinco segmentos e os dois layouts de cada um. O iPhone fica à esquerda e o conteúdo à direita no desktop. No celular: título, segmentos em faixa horizontal, comparador, detalhes e CTA. Há apenas um CTA “Quero o meu assim”, com o mesmo WhatsApp.

O seletor Layout 1 / Comparar / Layout 2 e a posição da divisória são preservados ao trocar de segmento. Arrastar o celular controla a comparação; a escolha de segmento é feita nas abas por clique, toque ou teclado, evitando dois gestos concorrentes no mesmo aparelho.

As dez imagens atuais vêm de `Downloads/animacaoiniciosite`, com os pares `pizzaria.png`/`pizzarialayout2.png`, `hamburgueria.png`/`hamburguerialayout2.png`, `marmitaria.png`/`marmitarialayout2.png`, `sushi.png`/`sushilayout2.png` e `pastel.png`/`pastellayout2.png`.

Todas têm molduras de 662×1370 px. Só as margens transparentes são removidas; os WebPs são exportados em 520×1076 px. Os conteúdos e as cores originais permanecem. O primeiro par é o de pizzaria. Os outros pares carregam sob demanda ou ao passar o mouse. A troca só ocorre depois de ambas as imagens serem decodificadas; falha em uma mantém o par anterior. Trocas rápidas invalidam carregamentos antigos.

Arquivos principais: `src/components/ui/menu-showcase.tsx`, `menu-showcase.css`, `src/lib/menu-pairs.json` e `scripts/prepare-menu-pairs.mjs`. A seção usa o comparador existente. `Sections.tsx` e `page.tsx` integram o bloco único. A antiga seção de layouts não é mais renderizada; `#layouts` continua como âncora dentro da apresentação para links antigos.

Para atualizar as imagens: `node scripts/prepare-menu-pairs.mjs --refresh`, seguido de `npm run build`. Sem `--refresh`, o script usa as cópias em `source-assets/menu-pairs`. A rotina de build não depende de Downloads.

Os componentes antigos permanecem disponíveis como exemplos, sem renderizar um segundo celular na página. Backup da integração anterior em `.backups/unified-menus`. As instruções anteriores de seções separadas são substituídas por este documento.

Validação: TypeScript, build e 50 testes passaram. A exportação contém 8 seções; 39 URLs locais foram verificadas sem erros. A comparação de preservação confirmou hero, cabeçalho, rodapé, clientes e WhatsApp flutuante. Os dez recortes foram inspecionados em uma montagem para confirmar escala e alinhamento das molduras. Os banners e as barras de status diferem em algumas capturas originais e foram preservados.

O navegador integrado continua sem instâncias disponíveis. A verificação visual da página em desktop/celular e screenshots permanece pendente; inspeção dos arquivos de imagem não substitui esse teste.
