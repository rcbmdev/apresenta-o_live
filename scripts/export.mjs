// export.mjs — gera dist/deck.pdf (texto pesquisável), dist/deck.pptx (imagem por slide + notas) e dist/png/NN.png
// Cada slide é exportado no label 'final' da sua timeline (veja a skill animated-scenes).
// Uso: node scripts/export.mjs [--only=pdf|pptx|png]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const only = args.only;
const want = k => !only || only === k || (k === 'png' && only === 'pptx');
const deck = pathToFileURL(join(root, 'deck', 'index.html')).href;
const dist = join(root, 'dist');
mkdirSync(join(dist, 'png'), { recursive: true });

const browser = await chromium.launch();
const errors = [];

// ---------- PNG por slide (base do PPTX) ----------
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => errors.push(e.message));
await page.goto(deck + '?export#1');
await page.waitForFunction(() => window.Deck && window.Deck.ready);
const meta = await page.evaluate(() => window.Deck.slides.map((s, i) => ({
  title: window.Deck.titleOf(i),
  notes: (s.querySelector('.notes')?.innerText || '').trim(),
  links: [...s.querySelectorAll('a[href]')].map(a => a.href).filter(h => /^https?:/.test(h)),
})));
const pngs = [];
if (want('png')) {
  for (let i = 0; i < meta.length; i++) {
    await page.evaluate(n => window.Deck.go(n), i);
    await page.waitForTimeout(700); // transição CSS do slide
    await page.evaluate(() => window.Deck.finalize());
    await page.waitForTimeout(100);
    const file = join(dist, 'png', String(i + 1).padStart(2, '0') + '.png');
    await page.screenshot({ path: file });
    pngs.push(file);
  }
  console.log(`✓ ${pngs.length} PNGs em dist/png`);
}
await page.close();

// ---------- PDF com texto real (modo ?print: todos os slides empilhados no estado final) ----------
if (want('pdf')) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(deck + '?print');
  await p.waitForFunction(() => window.Deck && window.Deck.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: join(dist, 'deck.pdf'), width: '1920px', height: '1080px', printBackground: true });
  await p.close();
  const pages = (readFileSync(join(dist, 'deck.pdf'), 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== meta.length) errors.push(`PDF tem ${pages} páginas, deck tem ${meta.length} slides`);
  console.log(`✓ dist/deck.pdf (${pages} páginas)`);
}
await browser.close();

// ---------- PPTX: imagem por slide, título e notas ----------
if (want('pptx')) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 × 7.5 pol = 16:9
  pptx.title = meta[0]?.title || 'Apresentação';
  meta.forEach((m, i) => {
    const s = pptx.addSlide();
    s.addImage({ path: pngs[i], x: 0, y: 0, w: 13.333, h: 7.5, altText: m.title });
    const notes = [m.title, m.notes, ...m.links].filter(Boolean).join('\n\n');
    if (notes) s.addNotes(notes);
  });
  await pptx.writeFile({ fileName: join(dist, 'deck.pptx') });
  console.log('✓ dist/deck.pptx');
}

writeFileSync(join(dist, 'export.json'), JSON.stringify({ slides: meta.length, errors, date: new Date().toISOString() }, null, 2));
if (errors.length) { console.error('✗ problemas na exportação:\n- ' + errors.join('\n- ')); process.exit(1); }
