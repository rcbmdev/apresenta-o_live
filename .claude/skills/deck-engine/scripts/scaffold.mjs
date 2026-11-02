// scaffold.mjs — copia o template do deck para a pasta do projeto sem sobrescrever nada.
// Uso (na raiz do projeto): node .claude/skills/deck-engine/scripts/scaffold.mjs [destino]
import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tpl = join(here, '..', 'template');
const dest = process.argv[2] || process.cwd();
const created = [], kept = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const src = join(dir, name);
    const rel = relative(tpl, src);
    const target = join(dest, rel === 'gitignore.txt' ? '.gitignore' : rel);
    if (statSync(src).isDirectory()) { mkdirSync(target, { recursive: true }); walk(src); continue; }
    if (existsSync(target)) { kept.push(rel); continue; }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(src, target);
    created.push(rel);
  }
}
walk(tpl);
console.log(`criados: ${created.length}` + (created.length ? '\n  ' + created.join('\n  ') : ''));
if (kept.length) console.log(`mantidos (já existiam): ${kept.length}\n  ` + kept.join('\n  '));
console.log('\nPróximo passo: npm run setup   (instala GSAP, Playwright, pptxgenjs e copia vendor/)');
