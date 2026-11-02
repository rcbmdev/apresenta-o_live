/*!
 * deck.js — motor de slides estático (sem build, abre via file://)
 * Depende apenas do GSAP (deck/vendor/gsap.min.js). Sem GSAP, navega sem animar.
 *
 * Contrato de cena:
 *   Deck.scene('id-do-slide', (el, api) => {
 *     const tl = api.timeline({ repeat: -1 });   // timeline da cena
 *     ...
 *     tl.addLabel('final');                      // estado usado no PDF/PPTX
 *     return { tl, onStep(i) {} };               // onStep: opcional
 *   });
 *
 * Tudo criado dentro da cena roda num gsap.context: ao sair do slide
 * o motor reverte estilos, mata timelines, roda api.onCleanup() e restaura
 * o innerHTML original do slide. Por isso o HTML escrito deve mostrar o
 * ESTADO FINAL legível (é o que aparece sem JS, no celular e no PDF).
 */
(function () {
  'use strict';

  var STAGE_W = 1920, STAGE_H = 1080;
  var root = document.documentElement;
  var deckEl = document.querySelector('.deck');
  var slides = Array.prototype.slice.call(deckEl.querySelectorAll(':scope > .slide'));
  var params = new URLSearchParams(location.search);
  var PRINT = params.has('print');            // export: todos os slides empilhados, estado final
  var EXPORT = params.has('export') || PRINT; // export: sem HUD, sem loop
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var factories = {};
  var current = -1, active = null, paused = false, flow = false;
  var timerStart = null, timerId = null;

  if (!hasGsap) console.warn('[deck] GSAP não encontrado: rode `npm run vendor`. Navegação funciona sem animação.');

  // ---------- utilidades ----------
  function clamp(n) { return Math.max(0, Math.min(slides.length - 1, n)); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function idOf(i) { return slides[i].dataset.id || String(i + 1); }
  function titleOf(i) {
    var s = slides[i];
    if (s.dataset.title) return s.dataset.title;
    var h = s.querySelector('h1, h2, h3');
    return h ? h.textContent.trim() : 'Slide ' + (i + 1);
  }
  function indexFromHash() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (!h) return 0;
    if (/^\d+$/.test(h)) return clamp(parseInt(h, 10) - 1);
    for (var i = 0; i < slides.length; i++) if (slides[i].dataset.id === h) return i;
    return 0;
  }

  // ---------- escala 16:9 e modo "flow" (celular em pé) ----------
  function layout() {
    var w = window.innerWidth, h = window.innerHeight;
    var wantFlow = !EXPORT && (w < 760 || (h > w * 1.15 && w < 1100));
    if (wantFlow !== flow) {
      flow = wantFlow;
      root.classList.toggle('is-flow', flow);
      if (flow) setupFlowObserver(); else teardownFlowObserver();
    }
    if (flow || PRINT) { deckEl.style.transform = ''; return; }
    var s = Math.min(w / STAGE_W, h / STAGE_H);
    deckEl.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
    root.style.setProperty('--deck-scale', s);
  }

  // ---------- ciclo de vida das cenas ----------
  function enterScene(i) {
    leaveScene();
    var el = slides[i], id = el.dataset.id, factory = factories[id];
    if (!factory || !hasGsap) return;
    // guarda o HTML original: ao sair, o slide volta exatamente ao que foi escrito (estado legível)
    if (el.__deckHTML === undefined) el.__deckHTML = el.innerHTML;
    var cleanups = [];
    var timelines = [];
    var result = null;
    var api = {
      gsap: window.gsap,
      recipes: window.DeckRecipes,
      el: el,
      reduced: reduced,
      exporting: EXPORT,
      timeline: function (opts) {
        opts = opts || {};
        if (EXPORT) { opts.repeat = 0; opts.paused = true; }
        var tl = window.gsap.timeline(opts);
        timelines.push(tl);
        return tl;
      },
      onCleanup: function (fn) { cleanups.push(fn); },
      // chamada por elementos clicáveis: assume o controle manual (R devolve o automático)
      takeover: function () { el.classList.add('is-manual'); timelines.forEach(function (t) { t.pause(); }); }
    };
    var ctx = window.gsap.context(function () {
      try { result = factory(el, api) || {}; }
      catch (err) { console.error('[deck] erro na cena "' + id + '":', err); result = {}; }
    }, el);
    active = { i: i, ctx: ctx, cleanups: cleanups, timelines: timelines, result: result };
    if (EXPORT || reduced) finalize();
    else if (paused) timelines.forEach(function (t) { t.pause(); });
  }

  function leaveScene() {
    if (!active) return;
    active.cleanups.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    active.ctx.revert();
    var el = slides[active.i];
    el.classList.remove('is-manual');
    if (el.__deckHTML !== undefined) el.innerHTML = el.__deckHTML;
    active = null;
  }

  // leva todas as timelines da cena para o label "final" (ou para o fim) e pausa
  function finalize() {
    if (!active) return;
    active.timelines.forEach(function (tl) {
      // suppressEvents=false: callbacks (onUpdate de textos digitados, contadores, marcações) também rodam
      tl.pause();
      if (tl.labels && tl.labels.final !== undefined) tl.seek('final', false);
      else tl.progress(1, false);
    });
  }

  function restartScene() { if (current >= 0) enterScene(current); }

  // ---------- navegação ----------
  function go(n, opts) {
    n = clamp(n);
    opts = opts || {};
    if (n === current && !opts.force) return;
    var prev = current;
    current = n;
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === n);
      s.classList.toggle('is-before', i < n);
      s.classList.toggle('is-after', i > n);
      s.setAttribute('aria-hidden', i === n ? 'false' : 'true');
      if ('inert' in s) s.inert = !flow && i !== n;
    });
    if (flow && !opts.fromScroll) { ignoreScrollUntil = Date.now() + 900; slides[n].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    history.replaceState(null, '', location.pathname + location.search + '#' + (n + 1));
    updateHud();
    enterScene(n);
    document.dispatchEvent(new CustomEvent('deck:change', { detail: { index: n, prev: prev, id: idOf(n) } }));
  }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  // ---------- modo flow: a cena visível é a ativa ----------
  var observer = null, ignoreScrollUntil = 0;
  function setupFlowObserver() {
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (Date.now() < ignoreScrollUntil) return;
        if (e.isIntersecting && e.intersectionRatio > 0.55) go(slides.indexOf(e.target), { fromScroll: true });
      });
    }, { threshold: [0.55] });
    slides.forEach(function (s) { observer.observe(s); });
  }
  function teardownFlowObserver() { if (observer) observer.disconnect(); observer = null; }

  // ---------- HUD, índice, opções ----------
  function buildChrome() {
    if (EXPORT) return;
    var hud = document.createElement('div');
    hud.className = 'deck-hud';
    hud.innerHTML =
      '<div class="deck-progress"><span></span></div>' +
      '<button class="deck-btn" data-action="index" aria-label="Índice (O)">Índice</button>' +
      '<span class="deck-counter"></span>' +
      '<span class="deck-timer" hidden>00:00</span>' +
      '<button class="deck-btn" data-action="options" aria-label="Opções (?)">Opções</button>';
    document.body.appendChild(hud);

    var idx = document.createElement('div');
    idx.className = 'deck-overlay deck-index';
    idx.hidden = true;
    idx.innerHTML = '<div class="deck-panel"><header><h2>Escolha um slide</h2><button class="deck-btn" data-action="close">Fechar</button></header><ol></ol></div>';
    var ol = idx.querySelector('ol');
    slides.forEach(function (s, i) {
      var li = document.createElement('li');
      li.innerHTML = '<button data-go="' + i + '"><b>' + String(i + 1).padStart(2, '0') + '</b><span></span></button>';
      li.querySelector('span').textContent = titleOf(i);
      ol.appendChild(li);
    });
    document.body.appendChild(idx);

    var opt = $('#deck-options');
    if (!opt) {
      opt = document.createElement('div');
      opt.id = 'deck-options';
      opt.innerHTML = '<div class="deck-panel"><header><h2>Opções</h2><button class="deck-btn" data-action="close">Fechar</button></header></div>';
      document.body.appendChild(opt);
    }
    opt.classList.add('deck-overlay');
    opt.hidden = true;
    var panel = opt.querySelector('.deck-panel');
    var actions = document.createElement('div');
    actions.className = 'deck-actions';
    actions.innerHTML =
      '<button class="deck-btn" data-action="fullscreen">Tela cheia</button>' +
      '<button class="deck-btn" data-action="pause">Pausar animações</button>' +
      '<button class="deck-btn" data-action="restart">Recomeçar a animação deste slide</button>' +
      '<p class="deck-keys"><kbd>→</kbd> <kbd>←</kbd> navegar · <kbd>Home</kbd> <kbd>End</kbd> início e fim · <kbd>O</kbd> índice · <kbd>F</kbd> tela cheia · <kbd>R</kbd> recomeçar · <kbd>M</kbd> pausar · <kbd>T</kbd> cronômetro · <kbd>B</kbd> tela preta · <kbd>?</kbd> opções</p>';
    panel.insertBefore(actions, panel.children[1] || null);

    var black = document.createElement('div');
    black.className = 'deck-black';
    black.hidden = true;
    document.body.appendChild(black);

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-action], [data-go]');
      if (!t) return;
      if (t.dataset.go !== undefined) { closeOverlays(); go(parseInt(t.dataset.go, 10)); return; }
      var a = t.dataset.action;
      if (a === 'index') toggleOverlay(idx);
      else if (a === 'options') toggleOverlay(opt);
      else if (a === 'close') closeOverlays();
      else if (a === 'fullscreen') toggleFullscreen();
      else if (a === 'pause') togglePause();
      else if (a === 'restart') { closeOverlays(); restartScene(); }
    });
  }

  function overlays() { return Array.prototype.slice.call(document.querySelectorAll('.deck-overlay')); }
  function closeOverlays() { overlays().forEach(function (o) { o.hidden = true; }); }
  function toggleOverlay(o) {
    var open = o.hidden;
    closeOverlays();
    o.hidden = !open;
    if (open) { var b = o.querySelector('[data-go="' + current + '"]') || o.querySelector('button'); if (b) b.focus(); }
  }
  function toggleFullscreen() {
    if (!document.fullscreenElement) { if (root.requestFullscreen) root.requestFullscreen().catch(function () {}); }
    else document.exitFullscreen();
  }
  function togglePause() {
    paused = !paused;
    root.classList.toggle('is-paused', paused);
    if (hasGsap) { if (paused) window.gsap.globalTimeline.pause(); else window.gsap.globalTimeline.resume(); }
    var b = $('[data-action="pause"]');
    if (b) b.textContent = paused ? 'Retomar animações' : 'Pausar animações';
  }
  function toggleTimer() {
    var t = $('.deck-timer');
    if (!t) return;
    if (timerId) { clearInterval(timerId); timerId = null; t.hidden = true; return; }
    timerStart = Date.now();
    t.hidden = false;
    timerId = setInterval(function () {
      var s = Math.floor((Date.now() - timerStart) / 1000);
      t.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 500);
  }
  function toggleBlack(force) {
    var b = $('.deck-black');
    if (b) b.hidden = force === false ? true : !b.hidden;
  }
  function updateHud() {
    var c = $('.deck-counter');
    if (c) c.textContent = (current + 1) + ' / ' + slides.length;
    var p = $('.deck-progress span');
    if (p) p.style.width = ((current + 1) / slides.length * 100) + '%';
  }

  // ---------- teclado e toque ----------
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    var k = e.key;
    var overlayOpen = overlays().some(function (o) { return !o.hidden; });
    if (k === 'Escape') { closeOverlays(); toggleBlack(false); return; }
    if (overlayOpen && k !== 'o' && k !== 'O' && k !== '?') return;
    switch (k) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(slides.length - 1); break;
      case 'o': case 'O': toggleOverlay($('.deck-index')); break;
      case '?': toggleOverlay($('#deck-options')); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'r': case 'R': restartScene(); break;
      case 'm': case 'M': togglePause(); break;
      case 't': case 'T': toggleTimer(); break;
      case 'b': case 'B': toggleBlack(); break;
    }
    // devolve o foco ao documento para as setas continuarem funcionando após cliques
    if (document.activeElement && document.activeElement !== document.body && !overlayOpen) document.activeElement.blur();
  }
  var touchX = null, touchY = null;
  function onTouchStart(e) { if (flow) return; touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }
  function onTouchEnd(e) {
    if (flow || touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else prev(); }
    touchX = null;
  }

  // ---------- modo print (PDF): todos os slides, estado final ----------
  function renderPrint() {
    root.classList.add('is-print');
    slides.forEach(function (s, i) {
      s.classList.add('is-active');
      var f = factories[s.dataset.id];
      if (!f || !hasGsap) return;
      var tls = [];
      var api = {
        gsap: window.gsap, recipes: window.DeckRecipes, el: s, reduced: true, exporting: true,
        timeline: function (o) { o = o || {}; o.repeat = 0; o.paused = true; var t = window.gsap.timeline(o); tls.push(t); return t; },
        onCleanup: function () {}, takeover: function () {}
      };
      window.gsap.context(function () { try { f(s, api); } catch (err) { console.error('[deck] print "' + s.dataset.id + '":', err); } }, s);
      tls.forEach(function (tl) { tl.pause(); if (tl.labels && tl.labels.final !== undefined) tl.seek('final', false); else tl.progress(1, false); });
    });
  }

  // ---------- API pública ----------
  window.Deck = {
    scene: function (id, factory) { factories[id] = factory; },
    go: go, next: next, prev: prev, restart: restartScene, finalize: finalize,
    get index() { return current; },
    get count() { return slides.length; },
    get flow() { return flow; },
    slides: slides,
    titleOf: titleOf,
    ready: false
  };

  function start() {
    if (EXPORT) root.classList.add('is-export');
    if (PRINT) { renderPrint(); window.Deck.ready = true; document.dispatchEvent(new Event('deck:ready')); return; }
    buildChrome();
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('hashchange', function () { go(indexFromHash()); });
    document.addEventListener('keydown', onKey);
    deckEl.addEventListener('touchstart', onTouchStart, { passive: true });
    deckEl.addEventListener('touchend', onTouchEnd);
    go(indexFromHash(), { force: true });
    window.Deck.ready = true;
    document.dispatchEvent(new Event('deck:ready'));
  }

  // cenas são registradas por scripts carregados depois deste; espere as fontes também
  window.addEventListener('load', function () {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fonts.then(start);
  });
})();
