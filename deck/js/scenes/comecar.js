// Cena: comecar — instalar, abrir no projeto e rodar /init; o CLAUDE.md aparece ao lado
Deck.scene('comecar', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline({ repeat: -1, repeatDelay: 2 });
  R.reveal(tl, el.querySelector('.term-window'), { y: 30 });
  R.reveal(tl, el.querySelector('.start-alt'), { y: 20, at: '<0.2' });
  R.terminal(tl, el.querySelector('.term-body'), { cps: 34 });
  R.reveal(tl, el.querySelector('.start-file'), { y: 0, scale: 0.9, duration: 0.6 });
  tl.addLabel('final');
  R.hold(tl, 4);
  tl.to(el.querySelectorAll('.term-line, .start-file'), { autoAlpha: 0, duration: 0.4 });
  return { tl: tl };
});
