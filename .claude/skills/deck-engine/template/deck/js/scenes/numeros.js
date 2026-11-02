// Cena: números — contadores e odômetro, em loop com respiro
Deck.scene('numeros', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline({ repeat: -1, repeatDelay: 1 });
  R.reveal(tl, el.querySelectorAll('.stat'), { stagger: 0.15 });
  el.querySelectorAll('[data-count]').forEach(function (n) {
    R.countUp(tl, n, Number(n.dataset.count), { prefix: n.dataset.prefix, suffix: n.dataset.suffix, at: '<0.1' });
  });
  var y = el.querySelector('[data-year]');
  R.rollDigits(tl, y, y.dataset.year, { at: '<' });
  tl.addLabel('final', '+=0.2');
  R.hold(tl, 3);
  tl.to(el.querySelectorAll('.stat'), { autoAlpha: 0, y: -20, duration: 0.4, stagger: 0.08 });
  return { tl: tl };
});
