---
name: deck-qa
description: Verifica o deck com Playwright — percorre todos os slides em vários tamanhos de tela, tira screenshots, reprova elementos fora do palco, texto pequeno, imagens quebradas, rolagem horizontal, erros de console e falhas de navegação/teclado. Use depois de criar ou alterar qualquer slide, cena, CSS ou o motor, e antes de dizer que um slide está pronto.
---

# deck-qa — nada está pronto sem screenshot

Um slide só está pronto quando `npm run qa` passa **e** você olhou o screenshot.
O script pega bugs mecânicos; só os seus olhos pegam slide feio, confuso ou desalinhado.

## Comandos

```bash
npm run qa                                  # full-hd, notebook, celular (padrão do dia a dia)
npm run qa -- --slide=5                     # só um slide (rápido, durante o trabalho)
npm run qa -- --slide=5 --live --settle=2500  # captura no meio da animação, sem pular para 'final'
npm run qa:all                              # 8 viewports: + hd, projetor 4:3, ultrawide, tablet em pé, celular deitado
npm run qa -- --viewports=projetor,celular  # escolher viewports
npm run qa -- --engine=webkit               # Safari (instale: npx playwright install webkit)
```

Saída em `qa/` (fora do git):
- `qa/report.md` — tabela de erros e avisos (leia primeiro)
- `qa/<viewport>/NN.png` — um screenshot por slide
- `qa/index.html` — folha de contato com tudo lado a lado
- Código de saída 1 se houver **erro** (avisos não reprovam)

## O que é verificado

Por slide e viewport, no estado `final` da cena:
- elemento visível saindo do palco 1920×1080 (ou da largura da tela no celular). Recortes intencionais
  por um ancestral com `overflow: hidden` são ignorados; decorações levam `data-qa-ignore`.
- texto menor que 18 px no palco / 12 px no celular (aviso)
- imagem quebrada, slide vazio, rolagem horizontal
- erros de console, exceções de página, arquivos que não carregaram

No primeiro viewport, interações:
- setas ← →, Home, End, tecla O (índice), links `#id`
- **depois de clicar num botão da cena, a seta → continua navegando** (bug de foco clássico)

## Ciclo de correção (como trabalhar)

1. Rode `npm run qa -- --slide=N` depois de cada slide novo.
2. Leia `qa/report.md`. Corrija erros pela causa (layout, token, conteúdo demais), nunca escondendo
   com `data-qa-ignore` algo que é conteúdo de verdade.
3. **Abra os PNGs com a ferramenta de leitura de imagem** (`qa/full-hd/NN.png` e `qa/celular/NN.png`)
   e faça a revisão visual da skill deck-design-system.
4. Repita até passar. Antes de entregar ou exportar: `npm run qa:all`.
5. Ao reportar ao usuário, diga quantos slides × viewports passaram e o que ainda é aviso.

## Quando o QA falha por motivo do próprio teste

- Animação muito longa antes de `final`: aumente `--settle` ou mova o label `final` para mais cedo.
- Elemento decorativo que sai do palco de propósito: `data-qa-ignore` no elemento.
- Novo controle que não é `<button>`: use `<button>` (acessível e testado), não `<div onclick>`.

Nunca enfraqueça uma verificação do `scripts/qa.mjs` só para passar. Se uma regra estiver errada,
explique ao usuário e ajuste a regra com ele.
