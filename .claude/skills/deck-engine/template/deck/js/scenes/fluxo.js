// Cena: fluxo — linha se desenha, pacote percorre as etapas em loop
Deck.scene('fluxo', function (el, api) {
  var R = api.recipes;
  var intro = api.timeline();
  R.drawPath(intro, el.querySelector('.flow-lines path'), { duration: 1.2 });
  R.reveal(intro, el.querySelectorAll('.flow-node'), { stagger: 0.1, at: 0.2 });
  intro.addLabel('final');

  var loop = api.timeline({ repeat: -1, repeatDelay: 0.8, delay: 1.4 });
  R.flow(loop, el.querySelector('.flow'), '.flow-node', { hold: 0.45, travel: 0.55 });
  loop.addLabel('final');
  return { tl: loop };
});
