// icons.mjs — logos e ícones do deck, sem CDN (o palco pode não ter Wi-Fi).
// 1. Logos de marca (simple-icons, CC0): grava deck/assets/img/logos/<slug>.svg com a cor da marca;
//    marcas muito escuras ganham a cor de texto do tema, para aparecerem no fundo escuro.
// 2. Ícones de conceito (lucide-static, ISC): embute o SVG dentro de cada <i class="ic" data-icon="nome"></i>
//    do index.html. Pode rodar de novo: o conteúdo de cada marcador é regenerado.
// Uso: npm run icons
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as si from 'simple-icons';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const deck = join(root, 'deck');
const LIGHT = '#eef2fb'; // mesmo valor de --fg em tokens.css

// ---------- logos ----------
const LOGOS = ['python', 'langchain', 'langgraph', 'langflow', 'n8n', 'modelcontextprotocol', 'claude', 'anthropic',
  'cursor', 'githubcopilot', 'googlegemini', 'opencode', 'pi', 'jetbrains', 'apple', 'homebrew',
  'meta', 'qwen', 'deepseek', 'mistralai', 'google', 'kimi', 'ollama', 'huggingface'];

const luminance = hex => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// logos que saíram do simple-icons atual: cópia do simple-icons v13 guardada em scripts/brand/
const LOCAL = {
  openai: { title: 'OpenAI', hex: '412991', source: 'https://openai.com/brand (via simple-icons v13)', file: 'brand/openai.svg' },
};
for (const [slug, l] of Object.entries(LOCAL)) {
  l.slug = slug;
  l.path = readFileSync(join(root, 'scripts', l.file), 'utf8').match(/ d="([^"]+)"/)[1];
}

mkdirSync(join(deck, 'assets/img/logos'), { recursive: true });
const credits = [];
for (const slug of [...LOGOS, ...Object.keys(LOCAL)]) {
  const icon = LOCAL[slug] || Object.values(si).find(i => i && i.slug === slug);
  if (!icon) { console.error('✗ logo não encontrado:', slug); process.exitCode = 1; continue; }
  const fill = luminance(icon.hex) < 0.08 ? LIGHT : '#' + icon.hex;
  writeFileSync(join(deck, 'assets/img/logos', slug + '.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img"><title>${icon.title}</title><path fill="${fill}" d="${icon.path}"/></svg>\n`);
  credits.push(`| ${icon.title} | \`logos/${slug}.svg\` | ${icon.source} |`);
  console.log('✓ logo', slug);
}

// ---------- ícones embutidos ----------
const htmlPath = join(deck, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const used = new Set();
html = html.replace(/<i class="ic" data-icon="([a-z0-9-]+)"[^>]*>[\s\S]*?<\/i>/g, (m, name) => {
  const file = join(root, 'node_modules/lucide-static/icons', name + '.svg');
  if (!existsSync(file)) { console.error('✗ ícone não encontrado:', name); process.exitCode = 1; return m; }
  used.add(name);
  const svg = readFileSync(file, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/ class="[^"]*"/, '')
    .replace(/ width="24" height="24"/, '')
    .replace('<svg', '<svg aria-hidden="true" focusable="false"')
    .trim();
  return `<i class="ic" data-icon="${name}">${svg}</i>`;
});
writeFileSync(htmlPath, html);
console.log(`✓ ${used.size} ícones embutidos: ${[...used].sort().join(', ')}`);

// ---------- créditos ----------
writeFileSync(join(deck, 'assets/CREDITS.md'), `# Créditos de imagens e marcas

Gerado por \`npm run icons\` (scripts/icons.mjs). Não edite à mão.

## Logos de marca — \`assets/img/logos/\`

SVGs do pacote [simple-icons](https://simpleicons.org) (dados sob CC0). As marcas pertencem aos seus donos e
aparecem só para identificar as ferramentas citadas, sem sugerir parceria ou patrocínio.
Marcas muito escuras foram recoloridas com a cor de texto do tema para ficarem visíveis no fundo escuro.

| marca | arquivo | fonte |
|---|---|---|
${credits.join('\n')}

O logo da OpenAI (usado para ChatGPT e Codex CLI) saiu do simple-icons atual; a cópia vem do simple-icons v13
e fica em \`scripts/brand/openai.svg\`.

Sem logo disponível (aparecem só pelo nome ou com ícone genérico): AutoGPT, Kiro, Antigravity, Windows, VS Code, xAI/Grok.

## Ícones de conceito

[Lucide](https://lucide.dev) (\`lucide-static\`, licença ISC), embutidos no \`index.html\`: ${[...used].sort().join(', ')}.

## Fotos

- \`assets/img/rodrigo.jpg\`: foto do palestrante, arquivo pessoal (cópia reduzida de \`img/Rodrigo.jpg\`).

Os ícones das três colunas do slide "onde usar" (editor, plugue, terminal) foram desenhados à mão no próprio
\`index.html\`. A foto \`img/CLIs.jpg\` serviu só de referência de conteúdo e **não** entra no deck.
`);
console.log('✓ assets/CREDITS.md');
