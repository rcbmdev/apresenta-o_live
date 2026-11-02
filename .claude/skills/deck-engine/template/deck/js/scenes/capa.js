// Cena: capa — título letra a letra, entrada em cascata e faixa infinita
Deck.scene('capa', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  R.reveal(tl, el.querySelector('.kicker'), { y: 20 });
  R.splitChars(tl, el.querySelector('.hero-title'), { at: '-=0.3' });
  R.reveal(tl, el.querySelectorAll('.lead, .byline'), { at: '-=0.2' });
  tl.from(el.querySelector('.glow'), { autoAlpha: 0, scale: 0.6, duration: 1.6, ease: 'power2.out' }, 0);
  tl.addLabel('final');
  if (!api.exporting) R.marquee(el.querySelector('.marquee'), { duration: 40 });
  return { tl: tl };
});
