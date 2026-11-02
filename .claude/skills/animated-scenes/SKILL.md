---
name: animated-scenes
description: Escreve as animações GSAP de cada slide (cenas em loop, terminais digitando, contadores, odômetros, fluxos com pacote percorrendo etapas, chats, etapas clicáveis, linhas SVG se desenhando). Use sempre que for criar ou ajustar a animação de um slide do deck.
---

# animated-scenes — cenas animadas com GSAP

Cada slide animado tem um arquivo `deck/js/scenes/<data-id>.js`. Comece **sempre** pelas
receitas de `deck/js/recipes.js` (catálogo completo em `references/recipes.md`); escreva GSAP
cru só para o que nenhuma receita cobre, e se o padrão se repetir em dois slides, vire receita.

## Antes de animar: o que a animação explica?

Animação boa num deck mostra **causa e ordem**: o que acontece primeiro, o que depende do quê,
para onde a informação vai. Se a animação não ensina nada, ela distrai. Para cada cena, escreva em
uma frase o que o público entende ao final (ex.: "o alerta entra, o agente investiga e só avisa depois
de conferir"). A timeline segue essa frase.

Escolha do padrão pelo conteúdo:

| conteúdo | receita |
|---|---|
| título de capa / encerramento | `splitChars` + `reveal` |
| números, métricas, crescimento | `countUp`, `rollDigits` (anos, versões) |
| código, CLI, agente trabalhando | `terminal` (linhas `data-t` no HTML) |
| pipeline, arquitetura, etapas automáticas | `flow` (+ `drawPath` nas conexões) |
| processo que o palestrante explica passo a passo | `stepper` (clicável, com loop automático) |
| conversa, aprovação, notificação | `chat` |
| faixa de marca / créditos | `marquee` |
| destacar um elemento enquanto fala | `pulse` |
| movimento por uma curva (dados viajando) | `drawPath` + `alongPath` |

## Esqueleto de cena

```js
// Cena: <id> — <a frase do que o público entende>
Deck.scene('<id>', function (el, api) {
  var R = api.recipes, gsap = api.gsap;

  // 1. entrada (roda uma vez)
  var intro = api.timeline();
  R.reveal(intro, el.querySelectorAll('.card'), { stagger: 0.1 });
  intro.addLabel('final');

  // 2. demonstração em loop enquanto o slide está aberto
  var loop = api.timeline({ repeat: -1, repeatDelay: 1, delay: intro.duration() });
  R.flow(loop, el.querySelector('.flow'), '.flow-node');
  loop.addLabel('final');      // ← estado que vai para PDF/PPTX/QA
  R.hold(loop, 2);             // respiro depois do 'final', só no ao vivo
  return { tl: loop };
});
```

## Regras que evitam os bugs clássicos

1. **Crie timelines só com `api.timeline()`**, nunca `gsap.timeline()` solto: o motor precisa delas para pausar (M), recomeçar (R) e exportar.
2. **Toda timeline tem `addLabel('final')`** no ponto em que tudo está visível e correto. Fade-outs e "limpar para o próximo loop" vêm **depois** do label.
3. **HTML = estado final.** Escreva o conteúdo real no `index.html` (linhas do terminal, bolhas do chat, números finais). A cena esconde e revela; não gere o conteúdo por JS. Assim o slide fica legível sem JS, no celular e no PDF.
4. **Animações infinitas fora da timeline** (marquee, partículas) só rodam se `!api.exporting`.
5. **Listeners** criados à mão → remova em `api.onCleanup(fn)`. Elementos clicáveis chamam `api.takeover()` antes de mexer na timeline.
6. **Anime só `transform` e `opacity`** (`x`, `y`, `scale`, `rotate`, `autoAlpha`). Evite animar `width/height/top/left`, `filter: blur` grande e `box-shadow` em muitos elementos: travam no notebook do evento.
7. **Use `autoAlpha`**, não `opacity`, para esconder (também tira o elemento da leitura e do clique).
8. **Ritmo de palco:** entradas de 0.4–0.8 s, `stagger` 0.08–0.15, pelo menos 1.5 s de `hold` antes de qualquer saída, loop inteiro ≤ 12 s. Ninguém lê texto que entra e sai rápido.
9. **Easing:** `power3.out` para entradas, `power2.inOut` para deslocamentos, `none` para digitação e marquee, `back.out(1.6)` com moderação (no máximo um elemento "elástico" por slide).
10. **Coordenadas:** o palco é escalado com `transform`. Para posições use `offsetLeft/offsetTop` (como `flow` faz), nunca `getBoundingClientRect` direto, senão o pacote erra o alvo em telas que não são 1920×1080.
11. Sem plugins pagos: as receitas usam só o core. Se quiser SplitText, DrawSVG, MotionPath ou Flip (gratuitos), habilite em `scripts/vendor.mjs` e inclua o `<script>` antes de `recipes.js`.
12. Respeite `api.reduced`: o motor já pula para `final`. Não force animação nesse caso.

## Fluxo de trabalho

1. Escreva o HTML final do slide e o CSS (veja deck-design-system).
2. Escreva a cena com receitas. Rode `npm run qa -- --slide=N` para ver o estado final.
3. Para ver o meio da animação: `npm run qa -- --slide=N --live --settle=2500` (screenshot no meio do loop).
4. Abra no navegador e assista ao loop inteiro pelo menos uma vez, testando R, M e um clique (se houver).
5. Ajuste o ritmo; só então passe para o próximo slide.
