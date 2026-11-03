// Cena: agentes — a equação LLM + Loop + Ferramentas = Agente se monta; cada parte explica o que faz
// e o que acontece sem ela, até a definição. Ao lado, um agente resolve um problema em voltas.
// Clicar numa parte da equação assume o controle. No celular, todas as explicações aparecem juntas.
Deck.scene('agentes', function (el, api) {
  var R = api.recipes;

  var intro = api.timeline();
  el.querySelectorAll('.eq > *').forEach(function (item, i) {
    var op = item.classList.contains('eq-op');
    intro.from(item, { autoAlpha: 0, y: op ? 0 : 30, scale: op ? 0.4 : 1, duration: op ? 0.3 : 0.5, ease: op ? 'back.out(2)' : 'power3.out' }, i * 0.18);
  });
  R.reveal(intro, el.querySelectorAll('.agent-stage, .agent-trace'), { y: 24, stagger: 0.15, at: '-=0.1' });
  intro.addLabel('final');

  // o agente trabalhando: roda, falha, pensa, corrige, roda de novo e para
  var trace = api.timeline({ repeat: -1, repeatDelay: 2, delay: intro.duration() });
  R.terminal(trace, el.querySelector('.agent-trace .term-body'), { cps: 24, gap: 0.35 });
  trace.addLabel('final');
  R.hold(trace, 3);
  trace.to(el.querySelectorAll('.agent-trace .term-line'), { autoAlpha: 0, duration: 0.4 });

  if (window.Deck && window.Deck.flow && !api.exporting) return { tl: trace };

  // a equação parte por parte, terminando na definição (estado final do PDF)
  var parts = api.timeline({ repeat: -1, repeatDelay: 1, delay: intro.duration() * 0.7 });
  R.stepPanels(parts, api, '.agent-panel', '.eq-part', {
    hold: 3.2,
    each: function (tl, p) {
      R.reveal(tl, p.querySelectorAll('p'), { y: 14, stagger: 0.25, duration: 0.4, at: '<0.1' });
    }
  });
  return { tl: trace };
});
