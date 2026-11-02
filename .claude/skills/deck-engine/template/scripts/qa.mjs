// qa.mjs — percorre todos os slides em vários viewports, tira screenshots e reprova o que quebrou.
// Uso: node scripts/qa.mjs [--viewports=desktop|all|nome,nome] [--slide=3] [--settle=1400] [--engine=chromium|firefox|webkit]
// Saída: qa/report.md, qa/report.json, qa/index.html (folha de contato) e qa/<viewport>/NN.png
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as pw from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const deckUrl = pathToFileURL(join(root, 'deck', 'index.html')).href;
const outDir = join(root, 'qa');
const settle = Number(args.settle || 1400);

const VIEWPORTS = {
  'full-hd':   { width: 1920, height: 1080 },
  'notebook':  { width: 1366, height: 768 },
  'hd':        { width: 1280, height: 720 },
  'projetor':  { width: 1024, height: 768 },
  'ultrawide': { width: 2560, height: 1080 },
  'tablet-pe': { width: 820, height: 1180, isMobile: true, hasTouch: true },
  'celular':   { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'celular-deitado': { width: 844, height: 390, isMobile: true, hasTouch: true },
};
const preset = args.viewports || 'desktop';
const names = preset === 'all' ? Object.keys(VIEWPORTS)
  : preset === 'desktop' ? ['full-hd', 'notebook', 'celular']
  : String(preset).split(',');

const problems = [];   // { level: 'erro'|'aviso', viewport, slide, msg }
const shots = {};      // viewport -> [paths]
const add = (level, viewport, slide, msg) => problems.push({ level, viewport, slide, msg });

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const browserType = pw[args.engine || 'chromium'];
const browser = await browserType.launch();

// ---------- inspeção de um slide, rodada dentro da página ----------
function inspect(vw) {
  const D = window.Deck;
  const slide = D.slides[D.index];
  const flow = D.flow;
  const out = { overflow: [], tiny: [], broken: [], hscroll: false, empty: false };
  const sr = slide.getBoundingClientRect();
  const scale = flow ? 1 : sr.width / 1920;
  const visible = el => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
  const ignored = el => el.closest('[data-qa-ignore], .glow, .marquee, .notes, .flow-packet');
  // recortado de propósito por um ancestral com overflow (odômetro, janelas, máscaras)
  const clipped = (el, r) => {
    for (let a = el.parentElement; a && a !== slide; a = a.parentElement) {
      const o = getComputedStyle(a).overflow;
      if (o === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (r.bottom <= ar.top + 1 || r.top >= ar.bottom - 1 || r.right <= ar.left + 1 || r.left >= ar.right - 1) return true;
      if (r.left >= ar.left - 2 && r.right <= ar.right + 2 && r.top >= ar.top - 2 && r.bottom <= ar.bottom + 2) return false;
      return true;
    }
    return false;
  };
  const label = el => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : el.tagName.toLowerCase()) + (el.textContent ? ' "' + el.textContent.trim().slice(0, 40) + '"' : '');

  for (const el of slide.querySelectorAll('*')) {
    if (ignored(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || clipped(el, r)) continue;
    // 1. elemento saindo do palco (modo palco) ou da largura da tela (modo flow)
    const tol = 2;
    if (!flow && (r.left < sr.left - tol || r.right > sr.right + tol || r.top < sr.top - tol || r.bottom > sr.bottom + tol)) out.overflow.push(label(el));
    if (flow && r.right > vw + tol) out.overflow.push(label(el));
    // 2. texto pequeno demais para o fundo da sala
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      const px = parseFloat(getComputedStyle(el).fontSize) * scale;
      const minStage = 18 * scale, minFlow = 12;
      if (px < (flow ? minFlow : minStage) - 0.1) out.tiny.push(label(el) + ' (' + px.toFixed(1) + 'px)');
    }
  }
  for (const img of slide.querySelectorAll('img')) if (img.complete && img.naturalWidth === 0) out.broken.push(img.getAttribute('src'));
  // no celular o layout viewport cresce junto com o conteúdo: compare com a largura configurada
  out.hscroll = document.scrollingElement.scrollWidth > vw + 1 || window.innerWidth > vw + 1;
  out.empty = !slide.textContent.trim() && !slide.querySelector('img, svg, video');
  out.overflow = out.overflow.slice(0, 6);
  out.tiny = out.tiny.slice(0, 6);
  return out;
}

for (const name of names) {
  const vp = VIEWPORTS[name];
  if (!vp) { console.error('viewport desconhecido:', name); continue; }
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && m.text().includes('[deck]'))) consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(e.message));
  page.on('requestfailed', r => consoleErrors.push('falhou ao carregar: ' + r.url()));

  await page.goto(deckUrl + '#1');
  await page.waitForFunction(() => window.Deck && window.Deck.ready, null, { timeout: 15000 });
  const count = await page.evaluate(() => window.Deck.count);
  const dir = join(outDir, name);
  mkdirSync(dir, { recursive: true });
  shots[name] = [];

  const list = args.slide ? [Number(args.slide) - 1] : [...Array(count).keys()];
  for (const i of list) {
    await page.evaluate(n => window.Deck.go(n), i);
    await page.waitForTimeout(settle);
    // por padrão inspeciona o estado 'final' da cena (determinístico); --live captura no meio da animação
    if (!args.live) { await page.evaluate(() => window.Deck.finalize()); await page.waitForTimeout(150); }
    const r = await page.evaluate(inspect, vp.width);
    const n = i + 1;
    r.overflow.forEach(m => add('erro', name, n, 'sai da área visível: ' + m));
    r.tiny.forEach(m => add('aviso', name, n, 'texto pequeno: ' + m));
    r.broken.forEach(m => add('erro', name, n, 'imagem quebrada: ' + m));
    if (r.hscroll) add('erro', name, n, 'rolagem horizontal na página');
    if (r.empty) add('erro', name, n, 'slide vazio');
    const file = join(dir, String(n).padStart(2, '0') + '.png');
    const isFlow = await page.evaluate(() => window.Deck.flow);
    if (isFlow) {
      const box = await page.evaluate(([n, w]) => { const r = window.Deck.slides[n].getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: w, height: r.height }; }, [i, vp.width]);
      await page.screenshot({ path: file, fullPage: true, clip: box });
    }
    else await page.screenshot({ path: file });
    shots[name].push(file);
  }
  [...new Set(consoleErrors)].forEach(m => add('erro', name, '-', 'console: ' + m));

  // ---------- interações (só no primeiro viewport) ----------
  if (name === names[0] && !args.slide) {
    const idx = () => page.evaluate(() => window.Deck.index);
    await page.evaluate(() => window.Deck.go(0));
    await page.keyboard.press('ArrowRight');
    if (await idx() !== 1) add('erro', name, '-', 'seta → não avançou');
    await page.keyboard.press('ArrowLeft');
    if (await idx() !== 0) add('erro', name, '-', 'seta ← não voltou');
    await page.keyboard.press('End');
    if (await idx() !== count - 1) add('erro', name, '-', 'End não foi para o último slide');
    await page.keyboard.press('Home');
    await page.keyboard.press('o');
    if (!(await page.isVisible('.deck-index'))) add('erro', name, '-', 'tecla O não abriu o índice');
    await page.keyboard.press('Escape');
    // links por id (#workflow) precisam funcionar
    const firstId = await page.evaluate(() => (window.Deck.slides.find(s => s.dataset.id && window.Deck.slides.indexOf(s) > 0) || {}).dataset?.id);
    if (firstId) {
      await page.evaluate(id => { location.hash = id; }, firstId);
      await page.waitForTimeout(200);
      const want = await page.evaluate(id => window.Deck.slides.findIndex(s => s.dataset.id === id), firstId);
      if (await idx() !== want) add('erro', name, '-', 'link #' + firstId + ' não abriu o slide certo');
    }
    // depois de clicar em um controle da cena, as setas continuam navegando (bug clássico de foco)
    const clickable = await page.evaluate(() => window.Deck.slides.findIndex(s => s.querySelector('button:not(.deck-btn)')));
    if (clickable >= 0) {
      await page.evaluate(n => window.Deck.go(n), clickable);
      await page.waitForTimeout(400);
      await page.locator('.slide.is-active button:not(.deck-btn)').first().click();
      await page.keyboard.press('ArrowRight');
      if (await idx() !== Math.min(clickable + 1, count - 1)) add('erro', name, clickable + 1, 'após clicar num botão da cena, a seta → parou de funcionar');
    }
  }
  await ctx.close();
}
await browser.close();

// ---------- relatórios ----------
const erros = problems.filter(p => p.level === 'erro');
const avisos = problems.filter(p => p.level === 'aviso');
const md = ['# QA do deck', '', `Viewports: ${names.join(', ')}`, `Erros: **${erros.length}** · Avisos: **${avisos.length}**`, ''];
if (problems.length) {
  md.push('| nível | viewport | slide | problema |', '|---|---|---|---|');
  problems.forEach(p => md.push(`| ${p.level} | ${p.viewport} | ${p.slide} | ${p.msg.replace(/\|/g, '\\|')} |`));
} else md.push('Nenhum problema encontrado. Ainda assim, olhe os screenshots.');
md.push('', 'Screenshots: `qa/<viewport>/NN.png` · folha de contato: `qa/index.html`');
writeFileSync(join(outDir, 'report.md'), md.join('\n'));
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ viewports: names, problems }, null, 2));
const sheet = `<!doctype html><meta charset="utf-8"><title>QA</title><style>body{background:#111;color:#ddd;font:14px system-ui;margin:24px}section{margin-bottom:40px}div{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}figure{margin:0}img{width:100%;border:1px solid #333}</style>` +
  Object.entries(shots).map(([vp, files]) => `<section><h2>${vp}</h2><div>${files.map((f, i) => `<figure><img src="${vp}/${f.split('/').pop()}"><figcaption>${i + 1}</figcaption></figure>`).join('')}</div></section>`).join('');
writeFileSync(join(outDir, 'index.html'), sheet);

console.log(md.join('\n'));
process.exit(erros.length ? 1 : 0);
