// Cenas: linha do tempo 2022–2026 — o ano rola só no dígito que muda e a régua avança um ponto,
// para os cinco slides parecerem uma única cena que avança. Cada ano acrescenta a sua demonstração.
// Um arquivo registra as cinco cenas (t-2022 … t-2026) porque o cabeçalho é idêntico.
(function () {
  // cabeçalho comum: ano + régua + título
  function head(el, api, tl) {
    var R = api.recipes;
    var year = el.querySelector('.tl-year');
    R.rollDigits(tl, year, year.dataset.year, { from: year.dataset.from, duration: 0.9, at: 0 });
    var pos = Number(getComputedStyle(el.querySelector('.tl-ruler')).getPropertyValue('--pos'));
    if (pos > 0) tl.from(el.querySelector('.tl-fill'), { scaleX: (pos - 1) / pos, duration: 0.9, ease: 'power2.inOut' }, 0.2);
    tl.from(el.querySelector('.tl-ruler .is-current'), { scale: 0.7, autoAlpha: 0.3, duration: 0.5, ease: 'power3.out' }, 0.9);
    R.reveal(tl, el.querySelector('h2'), { y: 24, at: 0.4 });
  }

  // limpa as marcas do recipe flow no começo de cada volta do loop
  function resetMarks(tl, nodes) {
    tl.add(function () { nodes.forEach(function (n) { n.classList.remove('is-on', 'is-done'); }); });
  }

  // abre a cena: entrada única + loop de demonstração que começa quando a entrada termina
  function intro(el, api, cards) {
    var tl = api.timeline();
    head(el, api, tl);
    api.recipes.reveal(tl, cards, { stagger: 0.15, at: 0.7 });
    var take = el.querySelector('.tl-take');
    if (take) api.recipes.reveal(tl, take, { y: 16 });
    tl.addLabel('final');
    return tl;
  }
  function loopAfter(api, introTl, repeatDelay) {
    return api.timeline({ repeat: -1, repeatDelay: repeatDelay || 1.5, delay: introTl.duration() });
  }
  function all(el, sel) { return Array.prototype.slice.call(el.querySelectorAll(sel)); }

  // 2022 — a pergunta vira resposta no chat; à direita, a aplicação chama o modelo e busca dados
  Deck.scene('t-2022', function (el, api) {
    var R = api.recipes;
    var first = intro(el, api, el.querySelectorAll('.tl-card'));
    var loop = loopAfter(api, first);
    var nodes = all(el, '.chain-node');
    resetMarks(loop, nodes);
    R.terminal(loop, el.querySelector('.term-body'), { cps: 26 });
    R.flow(loop, el.querySelector('.chain'), nodes, { hold: 0.4, travel: 0.5 });
    loop.addLabel('final');
    R.hold(loop, 2.5);
    loop.to(el.querySelectorAll('.term-line'), { autoAlpha: 0, duration: 0.4 });
    return { tl: loop };
  });

  // 2023 — fluxo fixo à esquerda; à direita o agente percorre o ciclo e volta para escolher de novo
  Deck.scene('t-2023', function (el, api) {
    var R = api.recipes;
    var first = intro(el, api, el.querySelectorAll('.tl-card'));
    var back = el.querySelector('.loop-back');
    first.from(el.querySelector('.loop-label'), { autoAlpha: 0, duration: 0.4 }, '<');
    var loop = loopAfter(api, first);
    var fixed = all(el, '.chain:not(.is-compact) .chain-node');
    var agent = all(el, '.chain.is-compact .chain-node');
    resetMarks(loop, fixed.concat(agent));
    R.flow(loop, el.querySelector('.chain:not(.is-compact)'), fixed, { hold: 0.3, travel: 0.45 });
    R.flow(loop, el.querySelector('.chain.is-compact'), agent, { hold: 0.35, travel: 0.45 });
    loop.fromTo(back, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' });
    R.flow(loop, el.querySelector('.chain.is-compact'), agent.slice(1), { hold: 0.35, travel: 0.45 });
    loop.addLabel('final');
    R.hold(loop, 2);
    return { tl: loop };
  });

  // 2024 — o estado decide o próximo passo; o servidor MCP liga a aplicação a arquivos, banco e APIs
  Deck.scene('t-2024', function (el, api) {
    var R = api.recipes;
    var first = intro(el, api, el.querySelectorAll('.tl-card'));
    R.reveal(first, el.querySelectorAll('.mcp-node'), { y: 16, stagger: 0.08, duration: 0.4 });
    R.drawPath(first, el.querySelectorAll('.mcp-lines path:not(marker path)'), { duration: 0.6, stagger: 0.1 });
    first.addLabel('final');

    var loop = loopAfter(api, first);
    var outs = all(el, '.branch-out li');
    var mcp = el.querySelector('.mcp');
    var app = mcp.querySelector('.mcp-app'), srv = mcp.querySelector('.mcp-server');
    var targets = all(mcp, '.mcp-t1, .mcp-t2, .mcp-t3');
    resetMarks(loop, outs.concat([app, srv], targets));
    outs.forEach(function (li) {
      loop.add(function () { outs.forEach(function (o) { o.classList.toggle('is-on', o === li); }); });
      R.hold(loop, 0.7);
    });
    targets.forEach(function (t) {
      R.flow(loop, mcp, [app, srv, t], { hold: 0.2, travel: 0.4 });
    });
    loop.addLabel('final');
    R.hold(loop, 2);
    return { tl: loop };
  });

  // 2025 — o agente lê, corrige, testa e para para revisão
  Deck.scene('t-2025', function (el, api) {
    var R = api.recipes;
    var first = intro(el, api, el.querySelectorAll('.term-window, .tl-mini'));
    var loop = loopAfter(api, first, 2);
    R.terminal(loop, el.querySelector('.term-body'), { cps: 30 });
    loop.addLabel('final');
    R.hold(loop, 3);
    loop.to(el.querySelectorAll('.term-line'), { autoAlpha: 0, duration: 0.4 });
    return { tl: loop };
  });

  // 2026 — o pedido passa pelo agente e pela checagem, e termina sempre na revisão humana
  Deck.scene('t-2026', function (el, api) {
    var R = api.recipes;
    var first = intro(el, api, el.querySelectorAll('.tl-three .tl-card, .chain-wide'));
    var loop = loopAfter(api, first);
    var nodes = all(el, '.chain-wide .chain-node');
    resetMarks(loop, nodes);
    R.flow(loop, el.querySelector('.chain-wide'), nodes, { hold: 0.5, travel: 0.6 });
    R.pulse(loop, el.querySelector('.is-human'));
    loop.addLabel('final');
    R.hold(loop, 2);
    return { tl: loop };
  });
})();
