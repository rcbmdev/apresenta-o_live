/*!
 * recipes.js — receitas de animação reutilizáveis para as cenas (GSAP core, sem plugins pagos)
 * Todas recebem uma timeline (tl) e devolvem a própria tl, para encadear.
 * Uso dentro de uma cena:  var R = api.recipes;  R.reveal(tl, '.card');
 * Documentação completa: .claude/skills/animated-scenes/references/recipes.md
 */
(function () {
  'use strict';
  var gsap = window.gsap;
  var nf = new Intl.NumberFormat('pt-BR');

  function els(target, scope) {
    if (!target) return [];
    if (typeof target === 'string') return Array.prototype.slice.call((scope || document).querySelectorAll(target));
    if (target.length !== undefined && !target.nodeType) return Array.prototype.slice.call(target);
    return [target];
  }
  // centro de um elemento em coordenadas de layout do container (imune ao scale do palco)
  function centerIn(el, container) {
    var x = el.offsetWidth / 2, y = el.offsetHeight / 2, n = el;
    while (n && n !== container) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: x, y: y };
  }

  var R = {
    /** Entrada em cascata (fade + sobe). */
    reveal: function (tl, targets, opts) {
      opts = opts || {};
      return tl.from(targets, {
        autoAlpha: 0, y: opts.y !== undefined ? opts.y : 40, scale: opts.scale || 1,
        duration: opts.duration || 0.7, ease: opts.ease || 'power3.out',
        stagger: opts.stagger !== undefined ? opts.stagger : 0.12
      }, opts.at);
    },

    /** Título que entra letra a letra (sem SplitText: quebra o texto em <span>). */
    splitChars: function (tl, el, opts) {
      opts = opts || {};
      el = els(el)[0];
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = '';
      var spans = [];
      // palavras ficam inteiras (nowrap) para o título não quebrar no meio da palavra
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('span');
        w.setAttribute('aria-hidden', 'true');
        w.style.display = 'inline-block';
        w.style.whiteSpace = 'nowrap';
        part.split('').forEach(function (ch) {
          var s = document.createElement('span');
          s.style.display = 'inline-block';
          s.textContent = ch;
          w.appendChild(s);
          spans.push(s);
        });
        el.appendChild(w);
      });
      return tl.from(spans, {
        yPercent: 110, autoAlpha: 0, rotate: opts.rotate || 6, duration: opts.duration || 0.6,
        ease: 'back.out(1.6)', stagger: opts.stagger || 0.025
      }, opts.at);
    },

    /** Digita um texto num elemento (cursor via CSS .is-typing). */
    type: function (tl, el, text, opts) {
      opts = opts || {};
      el = els(el)[0];
      var o = { n: 0 };
      var speed = opts.cps || 38; // caracteres por segundo
      el.textContent = '';
      return tl.to(o, {
        n: text.length, duration: Math.max(0.2, text.length / speed), ease: 'none',
        onStart: function () { el.classList.add('is-typing'); },
        onUpdate: function () { el.textContent = text.slice(0, Math.round(o.n)); },
        onComplete: function () { el.classList.remove('is-typing'); el.textContent = text; }
      }, opts.at);
    },

    /**
     * Terminal. Escreva as linhas no HTML (estado final legível):
     *   <div class="term-body">
     *     <div class="term-line" data-t="cmd">pytest -q</div>
     *     <div class="term-line" data-t="ok">12 passed</div>
     *   </div>
     * data-t: cmd (digitado, prompt "$") | prompt (digitado, prompt ">") | out | dim | add | del | ok
     * Opcional: passar lines = [{ t, text }] para gerar as linhas por JS.
     */
    terminal: function (tl, container, lines, opts) {
      if (lines && !Array.isArray(lines)) { opts = lines; lines = null; }
      opts = opts || {};
      container = els(container)[0];
      if (lines) {
        container.innerHTML = '';
        lines.forEach(function (ln) {
          var row = document.createElement('div');
          row.className = 'term-line';
          row.dataset.t = ln.t || 'out';
          row.textContent = ln.text;
          container.appendChild(row);
        });
      }
      var rows = els('.term-line', container);
      gsap.set(rows, { autoAlpha: 0 });
      rows.forEach(function (row) {
        if (row.dataset.t === 'cmd' || row.dataset.t === 'prompt') {
          var text = row.textContent;
          tl.set(row, { autoAlpha: 1 }, '+=' + (opts.gap || 0.12));
          R.type(tl, row, text, { cps: opts.cps || 32 });
          tl.to({}, { duration: opts.pause || 0.25 });
        } else {
          tl.fromTo(row, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, ease: 'power2.out' }, '+=' + (opts.gap || 0.12));
        }
      });
      return tl;
    },

    /** Contador numérico formatado pt-BR. opts: { from, prefix, suffix, duration, decimals } */
    countUp: function (tl, el, to, opts) {
      opts = opts || {};
      el = els(el)[0];
      var o = { v: opts.from || 0 };
      var fmt = opts.decimals ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: opts.decimals, maximumFractionDigits: opts.decimals }) : nf;
      var render = function () { el.textContent = (opts.prefix || '') + fmt.format(opts.decimals ? o.v : Math.round(o.v)) + (opts.suffix || ''); };
      render();
      return tl.to(o, { v: to, duration: opts.duration || 1.6, ease: opts.ease || 'power2.out', onUpdate: render }, opts.at);
    },

    /** Odômetro: cada dígito rola numa coluna 0–9. Bom para anos (2022 → 2026). opts: { from, duration, at } */
    rollDigits: function (tl, el, value, opts) {
      opts = opts || {};
      el = els(el)[0];
      var str = String(value);
      el.classList.add('roll');
      el.setAttribute('aria-label', str);
      el.innerHTML = '';
      var cols = str.split('').map(function (d) {
        var win = document.createElement('span'); win.className = 'roll-win'; win.setAttribute('aria-hidden', 'true');
        var col = document.createElement('span'); col.className = 'roll-col';
        if (/\d/.test(d)) { for (var i = 0; i <= 9; i++) { var s = document.createElement('span'); s.textContent = i; col.appendChild(s); } }
        else { var x = document.createElement('span'); x.textContent = d; col.appendChild(x); }
        win.appendChild(col); el.appendChild(win);
        return { col: col, d: /\d/.test(d) ? parseInt(d, 10) : 0 };
      });
      // opts.from: valor de partida (ex.: '2022' → '2023' rola só o último dígito)
      var from = opts.from !== undefined ? String(opts.from) : '';
      cols.forEach(function (c, i) {
        var f = /\d/.test(from.charAt(i)) ? parseInt(from.charAt(i), 10) : 0;
        tl.fromTo(c.col, { yPercent: -f * 10 }, { yPercent: -c.d * 10, duration: (opts.duration || 1.2) + i * 0.15, ease: 'power3.inOut' }, i === 0 ? opts.at : '<');
      });
      return tl;
    },

    /**
     * Fluxo: destaca nós em sequência e move um "pacote" entre os centros deles.
     * container: elemento position:relative; nodes: seletor dos nós em ordem.
     * Cria um .flow-packet automaticamente se não existir.
     */
    flow: function (tl, container, nodes, opts) {
      opts = opts || {};
      container = els(container)[0];
      var list = els(nodes, container);
      var packet = container.querySelector('.flow-packet');
      if (!packet) { packet = document.createElement('div'); packet.className = 'flow-packet'; container.appendChild(packet); }
      var pts = list.map(function (n) { return centerIn(n, container); });
      tl.set(packet, { x: pts[0].x, y: pts[0].y, xPercent: -50, yPercent: -50, autoAlpha: 1 });
      list.forEach(function (n, i) {
        tl.add(function () { list.forEach(function (m) { m.classList.remove('is-on'); }); n.classList.add('is-on'); });
        tl.to(n, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        tl.to({}, { duration: opts.hold || 0.5 });
        if (i < list.length - 1) tl.to(packet, { x: pts[i + 1].x, y: pts[i + 1].y, duration: opts.travel || 0.6, ease: 'power2.inOut' });
      });
      // o pacote some no fim para não ficar parado em cima do texto do último nó
      tl.to(packet, { autoAlpha: 0, duration: 0.2 });
      tl.add(function () { list.forEach(function (m) { m.classList.add('is-done'); }); });
      return tl;
    },

    /** Desenha um <path>/<line> SVG (stroke) sem DrawSVGPlugin. A linha (e suas pontas de seta) só aparece junto com o traço. */
    drawPath: function (tl, path, opts) {
      opts = opts || {};
      els(path).forEach(function (p, i) {
        var len = p.getTotalLength ? p.getTotalLength() : 1000;
        tl.fromTo(p, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, duration: opts.duration || 1, ease: opts.ease || 'power2.inOut' }, i === 0 ? opts.at : '<' + (opts.stagger || 0.15));
      });
      return tl;
    },

    /** Move um elemento ao longo de um <path> SVG (sem MotionPathPlugin). path e el no mesmo sistema de coordenadas. */
    alongPath: function (tl, el, path, opts) {
      opts = opts || {};
      el = els(el)[0]; path = els(path)[0];
      var len = path.getTotalLength(), o = { p: 0 };
      var place = function () { var pt = path.getPointAtLength(o.p * len); gsap.set(el, { x: pt.x, y: pt.y, xPercent: -50, yPercent: -50 }); };
      place();
      return tl.to(o, { p: 1, duration: opts.duration || 2, ease: opts.ease || 'none', onUpdate: place }, opts.at);
    },

    /** Faixa de texto infinita. Não usa a timeline da cena: roda sozinha e é limpa pelo contexto. */
    marquee: function (el, opts) {
      opts = opts || {};
      el = els(el)[0];
      var track = el.querySelector('.marquee-track');
      if (!track.dataset.cloned) { track.innerHTML += track.innerHTML; track.dataset.cloned = '1'; }
      return gsap.fromTo(track, { xPercent: opts.reverse ? -50 : 0 }, { xPercent: opts.reverse ? 0 : -50, duration: opts.duration || 30, ease: 'none', repeat: -1 });
    },

    /**
     * Chat. Escreva as bolhas no HTML (estado final):
     *   <div class="phone-body"><div class="bubble bubble-them">Oi</div><div class="bubble bubble-me">Olá</div></div>
     * Bolhas "them" ganham um indicador "digitando" antes. Opcional: msgs = [{ from:'me'|'them', text }].
     */
    chat: function (tl, container, msgs, opts) {
      if (msgs && !Array.isArray(msgs)) { opts = msgs; msgs = null; }
      opts = opts || {};
      container = els(container)[0];
      if (msgs) {
        container.innerHTML = '';
        msgs.forEach(function (m) {
          var b = document.createElement('div');
          b.className = 'bubble bubble-' + (m.from || 'them');
          b.textContent = m.text;
          container.appendChild(b);
        });
      }
      var bubbles = els('.bubble', container);
      gsap.set(bubbles, { autoAlpha: 0 });
      bubbles.forEach(function (b) {
        if (b.classList.contains('bubble-them') && opts.typing !== false) {
          var dots = document.createElement('div');
          dots.className = 'bubble bubble-them bubble-typing';
          dots.innerHTML = '<i></i><i></i><i></i>';
          dots.style.display = 'none';
          container.insertBefore(dots, b);
          tl.set(dots, { display: 'flex' })
            .fromTo(dots, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 })
            .to({}, { duration: opts.typingTime || 0.9 })
            .set(dots, { display: 'none' });
        }
        tl.fromTo(b, { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }, '+=0.1');
        tl.to({}, { duration: opts.read || 0.6 });
      });
      return tl;
    },

    /**
     * Stepper clicável: steps = elementos (botões) na ordem; cada passo i recebe label 'step'+i
     * que o autor coloca na timeline. Clicar assume o controle (api.takeover) e salta para o passo.
     */
    stepper: function (tl, api, steps, opts) {
      opts = opts || {};
      var list = els(steps, api.el);
      var mark = function (i) { list.forEach(function (s, j) { s.classList.toggle('is-current', j === i); s.classList.toggle('is-past', j < i); s.setAttribute('aria-pressed', j === i ? 'true' : 'false'); }); };
      list.forEach(function (s, i) {
        tl.add(function () { mark(i); }, 'step' + i);
        var onClick = function () {
          api.takeover();
          mark(i);
          if (tl.labels['step' + i] !== undefined) {
            var end = tl.labels['step' + (i + 1)] !== undefined ? tl.labels['step' + (i + 1)] : (tl.labels.final !== undefined ? tl.labels.final : tl.duration());
            tl.tweenFromTo('step' + i, end);
          }
          if (opts.onSelect) opts.onSelect(i);
        };
        s.addEventListener('click', onClick);
        api.onCleanup(function () { s.removeEventListener('click', onClick); });
      });
      return tl;
    },

    /**
     * Painéis com etapas clicáveis: mostra um painel por vez (labels step0, step1, …), coloca 'final'
     * depois do último e liga os botões com stepper. opts: { hold, each(tl, painel, i) }
     */
    stepPanels: function (tl, api, panels, steps, opts) {
      opts = opts || {};
      panels = els(panels, api.el);
      gsap.set(panels, { autoAlpha: 0 });
      panels.forEach(function (p, i) {
        tl.addLabel('step' + i);
        tl.to(panels, { autoAlpha: 0, duration: 0.2 });
        tl.fromTo(p, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' });
        if (opts.each) opts.each(tl, p, i);
        R.hold(tl, opts.hold || 2.2);
      });
      tl.addLabel('final');
      return R.stepper(tl, api, steps, opts);
    },

    /** Pulso de destaque (chamar atenção para um elemento). */
    pulse: function (tl, el, opts) {
      opts = opts || {};
      return tl.fromTo(el, { boxShadow: '0 0 0 0 var(--accent-glow)' }, { boxShadow: '0 0 0 18px rgba(0,0,0,0)', duration: opts.duration || 0.9, ease: 'power2.out', repeat: opts.repeat || 1 }, opts.at);
    },

    /** Pausa explícita na timeline (respiro para o público ler). */
    hold: function (tl, seconds) { return tl.to({}, { duration: seconds || 1.5 }); }
  };

  window.DeckRecipes = R;
})();
