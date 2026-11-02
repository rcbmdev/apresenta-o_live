// Cena: encerramento
Deck.scene('fim', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  tl.from(el.querySelector('.glow'), { autoAlpha: 0, scale: 0.6, duration: 1.4, ease: 'power2.out' }, 0);
  R.reveal(tl, el.querySelector('.kicker'), { at: 0 });
  R.splitChars(tl, el.querySelector('.hero-title'), { at: 0.2 });
  R.reveal(tl, el.querySelector('.lead'), { at: '-=0.2' });
  tl.addLabel('final');
  return { tl: tl };
});
