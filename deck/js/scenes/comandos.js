// Cena: comandos — uma aba por vez (Sessão, Contexto, Controle, Retomar), com um comando em destaque em cada;
// clicar numa aba assume o controle. No celular e no PDF/PPTX, os quatro grupos aparecem juntos.
Deck.scene('comandos', function (el, api) {
  var R = api.recipes;

  if (api.exporting || (window.Deck && window.Deck.flow)) {
    if (api.exporting) el.classList.add('is-overview');
    api.onCleanup(function () { el.classList.remove('is-overview'); });
    var all = api.timeline();
    R.reveal(all, el.querySelectorAll('.panel'), { y: 20, stagger: 0.1 });
    all.addLabel('final');
    return { tl: all };
  }

  var tl = api.timeline({ repeat: -1 });
  R.stepPanels(tl, api, '.panel', '.step', {
    hold: 3,
    each: function (tl, p) {
      R.reveal(tl, p.querySelectorAll('li'), { y: 16, stagger: 0.08, duration: 0.4, at: '<' });
      R.pulse(tl, p.querySelector('.is-key'), { repeat: 1 });
    }
  });
  return { tl: tl };
});
