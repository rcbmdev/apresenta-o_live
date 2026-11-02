// Cena: terminal — comandos digitados, diff e testes
Deck.scene('terminal', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline({ repeat: -1, repeatDelay: 2 });
  R.reveal(tl, el.querySelector('.term-window'), { y: 30 });
  R.terminal(tl, el.querySelector('.term-body')); // linhas escritas no index.html
  tl.addLabel('final');
  R.hold(tl, 3);
  tl.to(el.querySelector('.term-body'), { autoAlpha: 0, duration: 0.4 });
  return { tl: tl };
});
