// Copia GSAP e fontes do node_modules para deck/vendor, para o deck rodar offline (palco sem Wi-Fi).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const out = join(root, 'deck', 'vendor');
mkdirSync(join(out, 'fonts'), { recursive: true });

const files = [
  ['gsap/dist/gsap.min.js', 'gsap.min.js'],
  // plugins oficiais opcionais (todos gratuitos desde 2025). Descomente e inclua o <script> no index.html.
  // ['gsap/dist/SplitText.min.js', 'SplitText.min.js'],
  // ['gsap/dist/DrawSVGPlugin.min.js', 'DrawSVGPlugin.min.js'],
  // ['gsap/dist/MotionPathPlugin.min.js', 'MotionPathPlugin.min.js'],
  // ['gsap/dist/Flip.min.js', 'Flip.min.js'],
  ['@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2', 'fonts/space-grotesk-latin-wght-normal.woff2'],
  ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'fonts/jetbrains-mono-latin-wght-normal.woff2'],
];

let missing = 0;
for (const [src, dst] of files) {
  const from = join(nm, src);
  if (!existsSync(from)) { console.error('✗ não encontrado:', src, '(rode npm install)'); missing++; continue; }
  copyFileSync(from, join(out, dst));
  console.log('✓', dst);
}
process.exit(missing ? 1 : 0);
