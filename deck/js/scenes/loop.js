// Cena: loop — contexto → plano → ação → verificação, repetido; as ferramentas entram no nó "Agir"
Deck.scene('loop', function (el, api) {
  var R = api.recipes;
  var box = el.querySelector('.loop9');
  var nodes = Array.prototype.slice.call(box.querySelectorAll('.loop9-node'));
  var act = box.querySelector('.n-act');
  var tools = box.querySelectorAll('.loop9-tools li');

  var intro = api.timeline();
  R.reveal(intro, nodes, { y: 24, stagger: 0.12 });
  R.drawPath(intro, box.querySelectorAll('.loop9-lines > path:not(.loop9-in)'), { duration: 0.5, stagger: 0.2, at: 0.4 });
  R.reveal(intro, box.querySelector('.loop9-center'), { y: 10 });
  R.reveal(intro, box.querySelector('.loop9-tools'), { y: 0, scale: 0.96 });
  R.reveal(intro, tools, { y: 0, scale: 0.8, stagger: 0.07, duration: 0.35 });
  R.drawPath(intro, box.querySelector('.loop9-in'), { duration: 0.4 });
  R.reveal(intro, el.querySelector('.loop9-take'), { y: 16, at: '+=0.2' });
  intro.addLabel('final');

  var loop = api.timeline({ repeat: -1, repeatDelay: 1, delay: intro.duration() });
  loop.add(function () { nodes.forEach(function (n) { n.classList.remove('is-on', 'is-done'); }); });
  R.flow(loop, box, nodes.slice(0, 3), { hold: 0.5, travel: 0.6 });
  // no nó "Agir", as ferramentas são usadas uma a uma
  Array.prototype.forEach.call(tools, function (t) {
    loop.add(function () { t.classList.add('is-on'); });
    R.hold(loop, 0.18);
    loop.add(function () { t.classList.remove('is-on'); });
  });
  R.flow(loop, box, nodes.slice(2), { hold: 0.5, travel: 0.6 });
  loop.add(function () { act.classList.add('is-done'); });
  loop.addLabel('final');
  R.hold(loop, 1.5);
  return { tl: loop };
});
