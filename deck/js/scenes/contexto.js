// Cena: contexto — as camadas entram da mais carregada (toda sessão) à mais pontual (integrações),
// enquanto um CLAUDE.md enxuto aparece linha a linha
Deck.scene('contexto', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  R.reveal(tl, el.querySelectorAll('.layer'), { x: -30, y: 0, stagger: 0.25 });
  R.reveal(tl, el.querySelector('.term-window'), { y: 30, at: 0.3 });
  R.terminal(tl, el.querySelector('.term-body'), { gap: 0.18 });
  R.reveal(tl, el.querySelector('.ctx-tip'), { y: 16, at: '+=0.2' });
  R.pulse(tl, el.querySelector('.ctx-tip code'));
  tl.addLabel('final');
  return { tl: tl };
});
