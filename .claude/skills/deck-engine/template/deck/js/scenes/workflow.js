// Cena: workflow — etapas automáticas em loop; clique assume o controle
Deck.scene('workflow', function (el, api) {
  var R = api.recipes;
  var panels = el.querySelectorAll('.panel');
  var gsap = api.gsap;
  gsap.set(panels, { autoAlpha: 0 });

  var tl = api.timeline({ repeat: -1 });
  panels.forEach(function (p, i) {
    tl.addLabel('step' + i);
    tl.to(panels, { autoAlpha: 0, duration: 0.2 });
    tl.fromTo(p, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' });
    R.hold(tl, 2.2);
  });
  tl.addLabel('final');
  R.stepper(tl, api, '.step');
  return { tl: tl };
});
