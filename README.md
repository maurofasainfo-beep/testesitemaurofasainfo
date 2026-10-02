# Menu10 — versão original restaurada

As cinco seções abaixo da home foram reformadas conforme o novo escopo. Veja [REFORMA-SECOES.md](REFORMA-SECOES.md) para mudanças, capturas que faltam, verificações e decisões de layout. Hero, header, faixa de clientes, rodapé e seus estilos continuam preservados; `node scripts/check-preserved.mjs` compara esses elementos com o estado anterior à reforma.

Projeto em Next.js com exportação estática. O conteúdo original desta pasta é preservado em `original/` e nos arquivos de referência; a rota atual usa componentes próprios para as cinco seções reformadas.

Preservados os pedidos anteriores: logo formada por partículas que se transforma em cardápio, logos reais com nomes e cores originais, navegação com tamanho constante durante a rolagem e créditos centralizados. O encerramento separado foi incorporado ao suporte na reforma atual.

## Executar

```sh
npm ci
npm run dev
```

Prévia de produção em http://127.0.0.1:3010:

```sh
npm run build
npm start
```

## Verificar

```sh
npm test
npm run typecheck
npm run check:export
```

O último comando requer a compilação. Os testes cobrem a fidelidade dos textos e das seções, o ciclo das partículas e interrupções nas trocas de cardápio e no fechamento de relatórios. Não substituem a conferência visual no navegador e em dispositivos reais.

## Originais e arquivos editáveis

- `original/`: cópia intacta do HTML, CSS, scripts e imagens anteriores.
- `.backups/original-before-restoration.zip`: backup anterior à restauração.
- `src/app/original.css`: CSS original, sem alterações.
- `src/app/restoration.css`: ajustes limitados aos pedidos acima.
- `src/lib/original-page.json`: marcação original usada pela página.
- `src/components/ParticleMenu.tsx`: animação do cardápio.
- `source-assets/menu10.png`: arte fornecida para a home; `node scripts/prepare-hero.mjs` regenera o WebP e os pontos com suas cores reais, removendo apenas margens transparentes.
- `public/assets/js/`: interações originais, com correções para cliques rápidos e carregamento malsucedido de imagens.

`npm run restore:original` regenera a marcação a partir de `original/index.html`, aplica as seis logos e recompõe o arquivo de interações. Depois de editar os scripts individuais, execute esse comando antes de compilar. A pasta `out/` é a versão estática para hospedagem; `netlify.toml` configura sua publicação.

A home começa com a logo já formada pelos 2.027 pontos exatos da animação original e com poeira roxa distribuída pela abertura inteira. O SVG da logo aparece antes do JavaScript e do carregamento dos pontos do cardápio. `node scripts/prepare-logo.mjs` extrai as coordenadas do original preservado e regenera esse SVG.

A rolagem transforma os pontos da logo e do fundo no cardápio, em ambos os sentidos. No desktop, a abertura permanece visível durante esse trecho; no celular, somente a composição fica presa abaixo do cabeçalho quando chega à tela. O canvas cobre a home inteira, enquanto o véu original mantém os textos legíveis. As partículas param de desenhar quando não há movimento. A preferência por movimento reduzido mostra a imagem estática e elimina o trecho adicional de rolagem.
