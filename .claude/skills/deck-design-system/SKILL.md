---
name: deck-design-system
description: Direção visual e regras de layout do deck — tokens de cor e tipografia, grid do palco 16:9, componentes (cards, terminal, fluxo, mockups, notas de rodapé), legibilidade em telão e a versão vertical para celular. Use ao estilizar qualquer slide, trocar a identidade visual ou revisar se um slide está bonito e legível.
---

# deck-design-system — aparência e legibilidade

Fonte única da identidade: `deck/css/tokens.css`. Estilo de cada slide: `deck/css/scenes.css`.
Nenhuma cor, fonte ou tamanho escrito à mão nos slides: sempre `var(--token)`.
Se a skill `frontend-design` estiver disponível, use-a para definir a direção antes de mexer nos tokens.

## Trocar a marca

1. Edite só `tokens.css`: `--bg`, `--surface`, `--line`, `--fg*`, `--accent`, `--accent-2`, `--accent-glow`.
2. Fontes: instale o pacote `@fontsource-variable/<fonte>` via npm, adicione a cópia em `scripts/vendor.mjs`,
   atualize o `@font-face` e `--font-sans` / `--font-mono`. Nunca link de Google Fonts (palco offline).
3. `npm run qa` e compare os screenshots antes/depois.

Regras de cor:
- Um acento principal e no máximo um secundário. Semânticas (`--ok`, `--err`, `--warn`) só para status, diff e terminal.
- Contraste mínimo 4.5:1 para texto (`--fg-muted` sobre `--surface` inclusive). Projetor lava cores: teste o contraste com folga.
- Tema escuro é o padrão de palco. Se o evento tiver sala muito clara, crie um tema claro trocando só os tokens.

## Palco e grid

- Palco fixo **1920×1080**; área segura `--safe-x: 120px`, `--safe-y: 90px`. Nada essencial fora dela.
- Estrutura padrão de slide: `kicker` (rótulo mono pequeno) → `h2` (uma frase com verbo) → conteúdo → `footnote`.
- No máximo **3 a 5 blocos** por slide. Se precisar de mais, é outro slide ou é um `stepper`.
- Alinhe tudo à esquerda da área segura; centralize só capa e encerramento.
- Espaços em múltiplos de 8 px; `--gap: 32px` entre cards.

## Tipografia

| token | uso |
|---|---|
| `--fs-hero` 140 | capa e encerramento |
| `--fs-h1` 84 | título do slide (`h2` no HTML) |
| `--fs-h3` 40 | título de card, lead |
| `--fs-body` 32 | texto corrido (mínimo para frases) |
| `--fs-small` 24 | rótulos, legendas de card |
| `--fs-caption` 20 | notas de rodapé — **menor tamanho permitido** |
| `--fs-code` 26 | terminal e código |

O QA reprova texto abaixo de 18 px no palco. Títulos com no máximo ~8 palavras; frase com no máximo 2 linhas.

## Componentes prontos (scenes.css)

`.kicker` · `.lead` · `.card` · `.footnote` · `.glow` (brilho decorativo) · `.marquee` ·
`.stat` / `.stat-value` · `.term-window` / `.term-line[data-t]` · `.flow` / `.flow-node` / `.flow-packet` ·
`.steps` / `.step` / `.panel` · `.phone` / `.bubble` · `kbd`.
Reaproveite antes de criar; componente novo vai para scenes.css com nome genérico.

Logos: SVG em `deck/assets/img/logos/`, em caixa quadrada de mesmo tamanho para alinhar.
Registre a origem e a licença de cada logo/imagem num `deck/assets/CREDITS.md`.

## Honestidade visual (padrão da referência)

Todo slide com interface simulada, número ou gráfico ilustrativo leva uma `.footnote` dizendo isso
("Interface ilustrativa", "Valores de exemplo", "Fonte: ..."). Datas e marcos com fonte primária.
Isso protege a credibilidade do palestrante e não custa nada no layout.

## Celular e tablet em pé (modo flow)

Abaixo de 760 px de largura, ou com a tela em pé, os slides viram uma página que se rola.
Para cada `.s-<id>`, escreva o bloco `.is-flow .s-<id>`:
- grades viram uma coluna (`grid-template-columns: 1fr`);
- decorações absolutas (linhas SVG do fluxo, pacote, glow grande) somem ou são reduzidas;
- alturas fixas viram `auto`;
- os tokens de fonte já escalam com `clamp()`; não escreva px fixos.
O QA reprova rolagem horizontal e texto abaixo de 12 px no celular.

## Revisão visual (faça a cada slide novo)

Olhe o screenshot de `qa/full-hd/NN.png` e responda:
1. Dá para entender a ideia em 3 segundos, do fundo da sala?
2. Existe um único ponto de atenção principal?
3. Algo está apertado contra a borda, desalinhado ou com espaço sobrando de um lado só?
4. As cores usadas são só tokens? O acento aparece em no máximo 2–3 lugares?
5. A versão `qa/celular/NN.png` está legível e sem cortes?
