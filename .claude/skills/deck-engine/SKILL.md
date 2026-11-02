---
name: deck-engine
description: Cria e mantém o deck interativo em HTML (motor de slides próprio + GSAP, abre offline via file://). Use ao iniciar o projeto, adicionar/remover/reordenar slides, mexer na navegação, atalhos, HUD, índice, modo celular ou na estrutura de pastas do deck.
---

# deck-engine — o motor de slides

O deck é um **site estático**, sem build: `deck/index.html` + CSS + scripts clássicos.
Abre com duplo clique (file://), funciona offline no palco, e o mesmo HTML gera PDF e PPTX.

## Começar um projeto (só uma vez)

Na raiz do projeto:

```bash
node .claude/skills/deck-engine/scripts/scaffold.mjs   # copia o template sem sobrescrever nada
npm run setup                                           # npm install + Chromium do Playwright + vendor/
open deck/index.html                                    # macOS
```

O template já vem com 7 slides de exemplo (capa, números, terminal, fluxo, etapas clicáveis,
chat, encerramento). Eles servem de referência viva: copie o padrão, depois apague o que não usar.

## Estrutura

```
deck/
  index.html            todos os slides (<section class="slide">) + <script> de cada cena
  css/tokens.css        cores, fontes, escala  → skill deck-design-system
  css/deck.css          motor: palco 16:9, transições, HUD, overlays, flow, print (raramente mexer)
  css/scenes.css        estilo de cada slide (.s-<id>) e sua versão .is-flow
  js/deck.js            motor (navegação, ciclo de vida das cenas, export)
  js/recipes.js         receitas de animação → skill animated-scenes
  js/scenes/<id>.js     uma cena por slide animado
  vendor/               gsap.min.js e fontes (gerado por npm run vendor)
  assets/img/           imagens e logos
scripts/qa.mjs          → skill deck-qa
scripts/export.mjs      → skill deck-export
```

## Anatomia de um slide

```html
<section class="slide s-pipeline" data-id="pipeline" data-title="Pipeline de conteúdo">
  <p class="kicker">ROTINA DIÁRIA</p>
  <h2>Do rascunho à publicação</h2>
  ... conteúdo no ESTADO FINAL ...
  <p class="footnote">Interface ilustrativa. Fonte: ...</p>
  <aside class="notes">Notas do palestrante (vão para o PPTX).</aside>
</section>
```

- `data-id`: estável, em kebab-case. Vira link (`#pipeline`) e nome da cena (`js/scenes/pipeline.js`).
- `data-title`: aparece no índice (tecla O) e no PPTX.
- `data-transition="fade|zoom"`: opcional; padrão é empurrar (o atual recua e encolhe, o próximo entra pela direita).
- `data-group="nome"`: slides vizinhos com o mesmo grupo trocam sem deslizar (o anterior some em 0,2 s e a cena
  do novo continua do mesmo ponto). Use em sequências com o mesmo layout, como uma linha do tempo.
- **O HTML escrito é o estado final legível.** É o que aparece sem JS, no celular quando a cena não
  está ativa e no PDF. A cena só anima *até* esse estado. Ao sair do slide o motor restaura o HTML original.

## Adicionar um slide animado (checklist)

1. `<section>` em `index.html`, na posição certa.
2. Estilo em `css/scenes.css`, num bloco `.s-<id>`, só com tokens; e o bloco `.is-flow .s-<id>` (celular em pé).
3. `js/scenes/<id>.js` com `Deck.scene('<id>', (el, api) => { ... })` (veja animated-scenes).
4. `<script src="js/scenes/<id>.js">` no fim do `index.html`, **depois** de `deck.js`.
5. `npm run qa` e olhar os screenshots (skill deck-qa).

## Contrato da cena (resumo)

```js
Deck.scene('pipeline', function (el, api) {
  var R = api.recipes;                         // receitas prontas
  var tl = api.timeline({ repeat: -1 });       // SEMPRE crie timelines por api.timeline
  R.reveal(tl, el.querySelectorAll('.card'));
  tl.addLabel('final');                        // estado usado no PDF/PPTX/QA
  R.hold(tl, 3);                               // o que vem depois de 'final' é só o "respiro" do loop
  return { tl: tl };
});
```

- `api.timeline(opts)`: em modo export vira `repeat:0, paused`. Use sempre ela, não `gsap.timeline`.
- `api.onCleanup(fn)`: para listeners/intervals criados fora do GSAP.
- `api.takeover()`: elementos clicáveis chamam para assumir o controle (R devolve o automático).
- `api.exporting`, `api.reduced`: pule decorações infinitas (marquee) quando forem `true`.
- Tudo roda em `gsap.context`: ao sair, estilos são revertidos e o HTML restaurado. Não precisa limpar à mão.

## Teclado e recursos já prontos

`→ ← PageUp/PageDown Espaço` navegar · `Home End` · `O` índice · `?` opções · `F` tela cheia ·
`R` recomeçar a cena · `M` pausar/retomar tudo · `T` cronômetro · `B` tela preta · `Esc` fecha.
Swipe no touch. Links `#13` ou `#id`. `prefers-reduced-motion` vai direto ao estado final.
Abaixo de 760 px de largura (ou tela em pé) entra o **modo flow**: slides empilhados para rolar,
e a cena ativa é a que está visível.

`window.Deck`: `go(n)`, `next()`, `prev()`, `restart()`, `finalize()`, `index`, `count`, `flow`, `slides`, `ready`.
Evento `deck:change` no `document` a cada troca.

## Regras

- Não troque o motor por reveal.js/Slidev no meio do projeto; o QA e o export dependem deste contrato.
- Não use ES modules nem `fetch` de arquivos locais: quebram em file://.
- Não carregue nada de CDN. Tudo que o palco precisa fica em `deck/vendor/` (sem Wi-Fi no evento é comum).
- Palco fixo de 1920×1080 escalado; use px dos tokens. Nunca `vw`/`vh` dentro de slides (exceto no `.is-flow`).
- Depois de qualquer mudança no motor (`deck.js`/`deck.css`), rode `npm run qa:all`.
