// qr.mjs — gera o QR code do link público do deck (GitHub Pages) em deck/assets/img/qr.svg.
// Módulos escuros sobre fundo claro: é o contraste que os leitores de QR esperam, mesmo num slide escuro.
// Uso: npm run qr [-- <url>]
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.argv[2] || 'https://rcbmdev.github.io/apresenta-o_live/';
const svg = await QRCode.toString(url, {
  type: 'svg', errorCorrectionLevel: 'M', margin: 2,
  color: { dark: '#05070d', light: '#eef2fb' }, // mesmos valores de --bg e --fg em tokens.css
});
writeFileSync(join(root, 'deck/assets/img/qr.svg'), svg);
console.log('✓ deck/assets/img/qr.svg →', url);
