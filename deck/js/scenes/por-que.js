// Cena: por-que — primeiro o "antes" (a IA completa a linha), depois o "agora" (a IA executa e entrega um diff)
Deck.scene('por-que', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  var before = el.querySelector('.shift-card'), now = el.querySelector('.is-now');
  R.reveal(tl, before, { y: 30 });
  tl.from(before.querySelector('.ghost'), { autoAlpha: 0, duration: 0.6 }, '+=0.3');
  R.hold(tl, 0.8);
  R.reveal(tl, el.querySelector('.shift-arrow'), { y: 0, scale: 0.6, duration: 0.4 });
  R.reveal(tl, now, { y: 30 });
  R.reveal(tl, now.querySelectorAll('.shift-steps li'), { y: 12, stagger: 0.15, duration: 0.4 });
  R.reveal(tl, el.querySelector('.shift-q'), { y: 16, at: '+=0.8' });
  tl.addLabel('final');
  return { tl: tl };
});
