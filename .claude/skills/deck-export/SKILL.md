---
name: deck-export
description: Gera os downloads do deck — PDF com texto pesquisável, PowerPoint (uma imagem por slide + notas do palestrante) e PNGs — a partir do HTML, no estado final de cada cena, e confere o resultado. Use quando o usuário pedir PDF, PPTX, imagens dos slides, material para enviar ao evento ou para publicar o deck.
---

# deck-export — PDF, PPTX e PNG a partir do HTML

```bash
npm run qa:all          # sempre antes: não exporte deck com erro
npm run export          # dist/deck.pdf, dist/deck.pptx, dist/png/NN.png
npm run export -- --only=pdf
```

## Como funciona

- **PNG** (`dist/png/`): cada slide aberto com `?export#N`, 1920×1080, cena levada ao label `final`.
- **PDF** (`dist/deck.pdf`): `?print` empilha todos os slides no estado final e o Chromium imprime
  uma página 1920×1080 por slide. O **texto é real** (pesquisável e copiável).
- **PPTX** (`dist/deck.pptx`): `pptxgenjs`, layout 16:9, um PNG por slide em tela cheia;
  nas notas vão o título, o `<aside class="notes">` e os links do slide.
  O design fica idêntico, mas o texto não é editável no PowerPoint. Avise o usuário disso.
- `dist/export.json` registra contagem e erros; o script sai com código 1 se o PDF não tiver
  uma página por slide ou se houver erro de página.

## Conferência obrigatória depois de exportar

1. Abra algumas páginas do PDF como imagem (renderize com `pdftoppm -png -r 40 dist/deck.pdf /tmp/p`
   ou pypdfium2) e compare com `dist/png/`. Atenção a: fontes trocadas, slide em branco,
   animação que ficou no meio, elementos do HUD aparecendo.
2. Confirme que o texto existe: `pdftotext dist/deck.pdf - | head` (ou pypdf).
3. Confira no PPTX a quantidade de slides e as notas.
4. Se um slide sair no meio da animação: a cena não tem `addLabel('final')` no ponto certo, ou cria
   timeline com `gsap.timeline` em vez de `api.timeline` (skill animated-scenes).

## Publicar

O deck é estático: publique a pasta `deck/` (GitHub Pages, Netlify, Vercel, qualquer hospedagem).
Para o link de download no painel de opções, copie `dist/deck.pdf` e `dist/deck.pptx` para
`deck/downloads/` e ajuste os `href` no `#deck-options` do `index.html`. Use `?v=N` no link a cada
nova versão para não servir arquivo antigo em cache.
QR Code para o público acompanhar: gere um SVG (pacote npm `qrcode`, `npx qrcode -t svg -o deck/assets/img/qr.svg <url>`)
e confira lendo o QR pelo celular antes do evento.
