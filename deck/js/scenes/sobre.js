// Cena: sobre — a foto entra, os tópicos da trajetória aparecem em ordem e o número de alunos conta até 75 mil
Deck.scene('sobre', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  tl.from(el.querySelector('.about-photo'), { autoAlpha: 0, x: -40, duration: 0.8, ease: 'power3.out' });
  R.reveal(tl, el.querySelectorAll('.kicker, h2'), { y: 24, stagger: 0.1, at: 0.2 });
  R.reveal(tl, el.querySelectorAll('.about-list li'), { y: 20, stagger: 0.18, at: '-=0.2' });
  R.reveal(tl, el.querySelector('.about-stat'), { y: 20, at: '+=0.1' });
  var n = el.querySelector('[data-count]');
  R.countUp(tl, n, Number(n.dataset.count), { prefix: n.dataset.prefix, suffix: n.dataset.suffix, at: '<0.1' });
  R.reveal(tl, el.querySelector('.qr'), { y: 0, scale: 0.9, duration: 0.5, at: '<0.4' });
  tl.addLabel('final');
  return { tl: tl };
});
