# Comparação dos layouts

Seção `#layouts`, logo após os cardápios, implementada com a adaptação do Compare Reveal fornecido. `src/components/ui/compare-reveal.tsx` e seu CSS reutilizam `cn`, os tokens roxos e a fonte atuais. TypeScript, Tailwind e a estrutura shadcn já estão configurados; nenhuma dependência foi adicionada. A pasta `@/components/ui` corresponde a `src/components/ui`.

Os dois PNGs têm 1920×953 px. Ambos receberam exatamente o mesmo recorte: x=742, y=8, largura=436, altura=940. Isso remove o excesso de fundo laranja e mantém a moldura, o cabeçalho e o banner alinhados. Os WebPs em `public/images/layouts` têm aproximadamente 131 e 92 KiB. As cópias originais ficam em `source-assets/layouts`.

Para regenerar: `node scripts/prepare-layout-comparison.mjs`. Para atualizar as cópias a partir de Downloads: adicione `--refresh`. Se as dimensões mudarem, o script exige revisar o recorte.

O enquadramento é vertical, centralizado e sem `object-cover`. As imagens têm dimensões declaradas, carregamento lazy e decodificação assíncrona. Os rótulos ficam fora da imagem para não cobrir o cabeçalho. A divisória aceita arraste, clique na imagem, setas (2%), Shift+setas (10%), Home/End e duplo clique para centralizar. Os botões permitem ver cada layout completo ou voltar à comparação.

Adaptações intencionais do exemplo: sem tokens globais Motiq, sem imagens externas e sem demonstração automática. A mola roda apenas durante deslocamentos, para ao estabilizar e é interrompida fora da tela ou em aba oculta. Movimento reduzido aplica as posições imediatamente. As legendas identificam Layout 1 e Layout 2, sem indicar que um é superior ao outro.

Arquivos existentes alterados: `src/app/page.tsx` e a expectativa de ordem em `tests/sections.test.tsx`. Novos: componente, CSS, demo, `src/components/sections/LayoutComparison.tsx`, script de imagens, PNGs/WebPs, testes e este documento. A comparação Sem/Com existente permanece independente.

A conferência visual por navegador e screenshots permanece pendente; foram inspecionadas as imagens de origem diretamente.

Atualiza??o dos mockups: o banner promocional e a barra de status s?o diferentes nas duas capturas de origem; isso foi preservado, sem alterar o conte?do do cliente. Backup da vers?o anterior em `.backups/layouts-iphone`.

Refinamento visual: duas descri??es em cards brancos discretos, sem numera??o. O seletor abaixo do aparelho usa tr?s segmentos (Layout 1, Comparar, Layout 2), com estado selecionado roxo e aria-pressed sincronizado ao arraste. No celular, o texto continua antes do aparelho e os cards se empilham.
