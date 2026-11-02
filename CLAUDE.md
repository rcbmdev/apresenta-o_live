# Apresentação Live — deck interativo em HTML + GSAP

Este projeto produz apresentações interativas e animadas (estilo palestra de conferência) como um
site estático que roda offline, com verificação automática e exportação para PDF e PowerPoint.

Idioma: todo o conteúdo dos slides, comentários e mensagens ao usuário em **português do Brasil**.

## Skills deste projeto (`.claude/skills/`)

| quando | skill |
|---|---|
| tema novo, roteiro, ordem dos slides, notas | `deck-storyline` |
| criar o projeto, adicionar slides, navegação, motor | `deck-engine` |
| animar um slide (GSAP, receitas) | `animated-scenes` |
| cores, fontes, layout, legibilidade, celular | `deck-design-system` |
| verificar qualquer mudança | `deck-qa` |
| gerar PDF / PPTX / PNG, publicar | `deck-export` |

## Primeira vez

```bash
node .claude/skills/deck-engine/scripts/scaffold.mjs
npm run setup
open deck/index.html
```

## Ciclo de trabalho (sempre)

1. Roteiro em `deck/ROTEIRO.md` aprovado pelo usuário (deck-storyline).
2. Construir em lotes de 3–5 slides: HTML no estado final → CSS com tokens (+ versão `.is-flow`) → cena com receitas.
3. `npm run qa -- --slide=N`, ler `qa/report.md` **e abrir os screenshots** de `qa/full-hd/` e `qa/celular/`.
4. Corrigir até passar. Mostrar o lote ao usuário antes do próximo.
5. Antes de entregar: `npm run qa:all` e `npm run export`, conferindo o PDF.

## Regras do projeto

- Nada de CDN nem ES modules: o deck tem que abrir via file:// e sem internet.
- Cores, fontes e tamanhos só via tokens (`deck/css/tokens.css`).
- O HTML de cada slide é o estado final legível; a animação só chega até ele.
- Toda timeline criada com `api.timeline()` e com `addLabel('final')`.
- Interface simulada, número de exemplo ou gráfico ilustrativo → `.footnote` dizendo isso.
- Nunca dizer que um slide está pronto sem ter rodado o QA e olhado o screenshot.
