// Cena: llms — o LLM escolhe o próximo token pela probabilidade e a frase cresce;
// as abas mostram os modelos de fronteira e os de pesos abertos (clique assume o controle).
// No PDF/PPTX e no celular, as duas listas aparecem juntas.
Deck.scene('llms', function (el, api) {
  var R = api.recipes, gsap = api.gsap;
  var overview = api.exporting || (window.Deck && window.Deck.flow);

  var intro = api.timeline();
  R.reveal(intro, el.querySelectorAll('.llm-shift p'), { y: 16, stagger: 0.2 });
  R.reveal(intro, el.querySelector('.token'), { y: 24, at: '-=0.2' });
  intro.addLabel('final');

  // próximo token: as barras crescem, o mais provável acende e entra na frase
  var lists = el.querySelectorAll('.cands'), toks = el.querySelectorAll('.tok');
  var gen = api.timeline({ repeat: -1, repeatDelay: 1.2, delay: intro.duration() });
  gen.set(toks, { autoAlpha: 0 });
  lists.forEach(function (ol, i) {
    gen.set(lists, { autoAlpha: 0 });
    gen.set(ol, { autoAlpha: 1 });
    gen.fromTo(ol.querySelectorAll('.fill'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' });
    gen.fromTo(ol.querySelector('.is-pick'), { scale: 1 }, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 });
    gen.fromTo(toks[i], { autoAlpha: 0, y: 12, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' });
    R.hold(gen, 0.8);
  });
  gen.addLabel('final');
  R.hold(gen, 1.5);

  if (overview) {
    if (api.exporting) el.classList.add('is-overview');
    api.onCleanup(function () { el.classList.remove('is-overview'); });
    R.reveal(intro, el.querySelectorAll('.llm-panel'), { y: 20, stagger: 0.15, at: 0.3 });
    return { tl: gen };
  }

  // abas: fronteira → pesos abertos, com os modelos entrando em cascata
  var tabs = api.timeline({ repeat: -1, delay: intro.duration() * 0.6 });
  R.stepPanels(tabs, api, '.llm-panel', '.llm-tabs .step', {
    hold: 3.5,
    each: function (tl, p) {
      R.reveal(tl, p.querySelectorAll('.model'), { y: 16, scale: 0.95, stagger: 0.08, duration: 0.4, at: '<' });
      R.reveal(tl, p.querySelector('.models-note'), { y: 10, duration: 0.4 });
    }
  });
  return { tl: gen };
});
