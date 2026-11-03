// Cena: praticar — o título entra, o robô faz repetições (um loop até concluir), o Claude Code abre no
// terminal e recebe o primeiro pedido, e o roteiro da prática aparece passo a passo
Deck.scene('praticar', function (el, api) {
  var R = api.recipes, gsap = api.gsap;

  var intro = api.timeline();
  intro.from(el.querySelector('.glow'), { autoAlpha: 0, scale: 0.6, duration: 1.4, ease: 'power2.out' }, 0);
  R.reveal(intro, el.querySelector('.kicker'), { y: 20, at: 0 });
  R.splitChars(intro, el.querySelector('.pr-title'), { at: 0.2 });
  R.reveal(intro, el.querySelector('.pr-lead'), { y: 16, at: '-=0.2' });
  intro.from(el.querySelector('.robot'), { autoAlpha: 0, y: 60, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.3');
  R.reveal(intro, el.querySelector('.cc'), { y: 30, at: '<0.15' });
  R.reveal(intro, el.querySelectorAll('.pr-steps li'), { y: 20, stagger: 0.12, duration: 0.45 });
  intro.addLabel('final');

  // robô: desce a barra, empurra para cima com esforço e conta a repetição
  var lift = el.querySelector('.rb-lift'), armL = el.querySelector('.rb-arm-l'), armR = el.querySelector('.rb-arm-r');
  var eyes = el.querySelector('.rb-eyes'), sweat = el.querySelector('.rb-sweat'), rep = el.querySelector('.rb-rep');
  var reps = api.timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.8 });
  [1, 2, 3].forEach(function (n) {
    reps.to(lift, { y: 150, duration: 0.6, ease: 'power2.inOut' })
      .to([armL, armR], { attr: { y2: 206 }, duration: 0.6, ease: 'power2.inOut' }, '<')
      .to(eyes, { scaleY: 0.25, duration: 0.15 })
      .to(sweat, { opacity: 1, y: 6, duration: 0.3 }, '<')
      .to(lift, { y: 0, duration: 0.55, ease: 'back.out(1.4)' })
      .to([armL, armR], { attr: { y2: 56 }, duration: 0.55, ease: 'back.out(1.4)' }, '<')
      .add(function () { rep.textContent = 'rep ' + n; }, '<0.3')
      .to(eyes, { scaleY: 1, duration: 0.2 })
      .to(sweat, { opacity: 0, y: 14, duration: 0.3 }, '<');
    R.hold(reps, 0.5);
  });
  reps.addLabel('final');
  R.hold(reps, 1);

  // terminal: abre o Claude Code e faz o primeiro pedido
  var term = api.timeline({ repeat: -1, repeatDelay: 2.5, delay: intro.duration() * 0.5 });
  R.terminal(term, el.querySelector('.cc-cmd'), { cps: 30 });
  term.fromTo(el.querySelector('.cc-welcome'), { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
  R.terminal(term, el.querySelector('.cc-chat'), { cps: 28 });
  term.fromTo(el.querySelector('.cc-hint'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
  term.addLabel('final');
  R.hold(term, 3);
  term.to(el.querySelectorAll('.cc .term-line, .cc-welcome, .cc-hint'), { autoAlpha: 0, duration: 0.4 });

  // roteiro da prática: cada passo acende em sequência
  var steps = el.querySelectorAll('.pr-steps li');
  var walk = api.timeline({ repeat: -1, repeatDelay: 1, delay: intro.duration() });
  steps.forEach(function (li) { R.pulse(walk, li, { repeat: 0, duration: 0.9 }); });
  walk.addLabel('final');
  return { tl: reps };
});
