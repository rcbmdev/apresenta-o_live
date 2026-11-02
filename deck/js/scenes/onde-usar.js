// Cena: onde-usar — três colunas entram (ícone → nome → frase → ferramentas) e o Claude Code pulsa na coluna CLI
Deck.scene('onde-usar', function (el, api) {
  var R = api.recipes;
  var tl = api.timeline();
  el.querySelectorAll('.where-col').forEach(function (col, i) {
    var at = i * 0.35;
    tl.from(col.querySelector('.where-icon'), { autoAlpha: 0, scale: 0.5, duration: 0.6, ease: 'back.out(1.6)' }, at);
    R.reveal(tl, col.querySelectorAll('h3, .where-desc'), { y: 20, stagger: 0.1, at: at + 0.2 });
    R.reveal(tl, col.querySelectorAll('.where-tools li, .where-badge'), { y: 14, stagger: 0.08, duration: 0.45, at: at + 0.45 });
  });
  R.reveal(tl, el.querySelector('.where-take'), { y: 16, at: '+=0.3' });
  R.pulse(tl, el.querySelector('.where-tools .is-key'), { repeat: 2, at: '-=0.2' });
  tl.addLabel('final');
  return { tl: tl };
});
