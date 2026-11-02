# Catálogo de receitas — `deck/js/recipes.js`

Todas recebem a timeline `tl` primeiro (exceto `marquee`) e devolvem a `tl`.
`opts.at` é a posição na timeline (padrão GSAP: `'<'`, `'-=0.3'`, `'+=1'`, número, label).

## reveal(tl, targets, { y=40, scale, duration=0.7, stagger=0.12, ease, at })
Entrada em cascata: fade + sobe. A base de quase tudo.
```js
R.reveal(tl, el.querySelectorAll('.card'), { stagger: 0.1 });
```

## splitChars(tl, el, { stagger=0.025, rotate=6, duration=0.6, at })
Título entra letra a letra (palavras não quebram no meio). Mantém `aria-label` com o texto.
Use em 1 título por slide, de preferência só capa e fechamento.

## type(tl, el, text, { cps=38, at })
Digita `text` no elemento. Classe `.is-typing` mostra cursor (definida em scenes.css).

## terminal(tl, container, [lines], { cps=32, gap=0.12, pause=0.25 })
Lê as linhas do HTML:
```html
<div class="term-body">
  <div class="term-line" data-t="cmd">pytest -q</div>
  <div class="term-line" data-t="ok">18 passed</div>
</div>
```
`data-t`: `cmd` (digitado, prompt `$` via CSS) · `prompt` (digitado, prompt `>` de um agente) · `out` · `dim` · `add` (+ verde) · `del` (− vermelho) · `ok`.
Comandos são digitados; o resto aparece linha a linha.

## countUp(tl, el, to, { from=0, prefix, suffix, decimals, duration=1.6, at })
Contador com formato pt-BR (`1.000.000`, `98,5`). Escreva o valor final no HTML.
```html
<span class="stat-value" data-count="8000" data-prefix="+">+8.000</span>
```

## rollDigits(tl, el, value, { from, duration=1.2, at })
Odômetro: cada dígito rola numa coluna 0–9. Ótimo para linha do tempo (anos) e versões.
`from` define o valor de partida: `rollDigits(tl, el, '2023', { from: '2022' })` rola só o último dígito.
Precisa do CSS `.roll`, `.roll-win`, `.roll-col` (já em scenes.css).

## flow(tl, container, nodesSelector, { hold=0.5, travel=0.6 })
Destaca cada nó (`.is-on`), dá um pulso e move um `.flow-packet` até o próximo.
No fim o pacote some e todos os nós ganham `.is-done`. `container` precisa de `position: relative`.
Funciona com qualquer layout (linha, grade, colunas): o pacote vai de centro a centro.
Para ramificações, chame `flow` duas vezes com listas diferentes na mesma timeline.

## drawPath(tl, paths, { duration=1, stagger=0.15, ease, at })
Desenha `<path>`, `<line>`, `<polyline>` SVG pelo traço (sem DrawSVGPlugin).
O elemento precisa de `stroke` e `fill: none`.

## alongPath(tl, el, path, { duration=2, ease='none', at })
Move um elemento sobre um `<path>`. `el` e `path` precisam estar no mesmo sistema de coordenadas
(ex.: um `<circle>` dentro do mesmo `<svg>`, ou um div posicionado sobre um svg de mesmo tamanho sem viewBox escalado).

## marquee(el, { duration=30, reverse })
Faixa infinita. Estrutura: `.marquee > .marquee-track > span`. Duplica o conteúdo sozinha.
Não entra na timeline. Chame só `if (!api.exporting)`.

## chat(tl, container, [msgs], { typing=true, typingTime=0.9, read=0.6 })
Bolhas escritas no HTML (`.bubble.bubble-them` / `.bubble.bubble-me`). Antes de cada "them",
aparece o indicador "digitando".

## stepper(tl, api, stepsSelector, { onSelect(i) })
Liga botões a labels `step0`, `step1`, … que **você** coloca na timeline. Roda sozinho em loop;
clicar num passo chama `api.takeover()` e toca só aquele trecho. Marca `.is-current` / `.is-past`
e `aria-pressed`. Exemplo completo em `deck/js/scenes/workflow.js`.
```js
panels.forEach(function (p, i) {
  tl.addLabel('step' + i);
  tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1 });
  R.hold(tl, 2);
});
tl.addLabel('final');
R.stepper(tl, api, '.step');
```

## stepPanels(tl, api, panels, steps, { hold=2.2, each(tl, painel, i) })
Atalho para o padrão "abas/etapas + painéis": um painel por vez, labels `step0…`, `final` depois do
último e `stepper` ligado aos botões. `each` acrescenta animação dentro de cada painel.
```js
var tl = api.timeline({ repeat: -1 });
R.stepPanels(tl, api, '.panel', '.step', { hold: 3, each: function (tl, p) { R.reveal(tl, p.querySelectorAll('li')); } });
```

## pulse(tl, el, { duration=0.9, repeat=1, at })
Anel de destaque usando `--accent-glow`.

## hold(tl, seconds=1.5)
Pausa explícita. Use antes de qualquer saída e depois de cada informação nova.

---

## Padrões compostos (exemplos de cenas inteiras)

**Linha do tempo com ano rolando** (como "2022 → 2026"):
um slide por marco, cada um com `rollDigits` no ano + `reveal` dos cards do ano.
Mantenha o mesmo layout entre os slides para o odômetro parecer contínuo.

**Arquitetura em camadas** (acessos → núcleo → integrações → entregas):
`reveal` por coluna (`stagger` por camada), `drawPath` nas conexões, depois `flow` em loop
mostrando um pedido atravessando as camadas.

**Rotinas em log** (relógio + eventos):
`countUp` num relógio fictício (`00:00` → `09:00` com `decimals` não serve: anime minutos e formate
num `onUpdate` próprio) + `terminal` com linhas `dim`/`ok` para cada evento.

**Aprovação humana** (PR → WhatsApp → merge → deploy):
`chat` no celular, `stepper` com as etapas ao lado, e um botão "Aprovar" que chama
`api.takeover()` e toca o trecho `step2 → final`.
