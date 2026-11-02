---
name: deck-storyline
description: Planeja a palestra antes do código — objetivo, público, tempo, arco narrativo, um slide por ideia, qual cena animada cada slide usa, notas do palestrante e fontes. Use quando o usuário trouxer um tema, roteiro, artigo ou ideia de palestra/aula, ou pedir para reorganizar a ordem e o conteúdo dos slides.
---

# deck-storyline — roteiro primeiro, animação depois

A referência que inspirou este kit funciona porque cada slide tem **uma ideia** e cada animação
**explica** essa ideia. Isso se decide no roteiro, não no CSS. Nunca comece a escrever slides sem
`deck/ROTEIRO.md` aprovado pelo usuário.

## 1. Perguntas de partida (pergunte só o que não estiver claro)

- Evento, público e nível técnico.
- Duração total e tempo de perguntas (regra: ~1,5 min por slide; 40 min ≈ 24–28 slides).
- A **uma frase** que o público deve levar para casa.
- Material de base (artigos, repositório, aulas, dados) e o que é demonstração real vs. ilustrativa.
- Identidade visual (cores, logo) ou se usa o tema padrão.

## 2. Arco narrativo

1. **Abertura** (2–3 slides): capa, quem fala e por que importa, QR dos slides.
2. **Contexto** (3–5): como chegamos aqui; linha do tempo funciona muito bem.
3. **Conceito central** (3–5): o modelo mental, com um diagrama que se repete e evolui.
4. **Casos reais** (6–10): um caso por slide, sempre entrada → processo → resultado → verificação.
5. **Limites e cuidados** (1–3): o que não fazer, permissões, riscos. Dá credibilidade.
6. **Fechamento** (2): o que levar, materiais, perguntas.

## 3. Formato do `deck/ROTEIRO.md`

```markdown
# <Título> — <evento>, <duração>
Mensagem central: <uma frase>
Público: <quem> · Nível: <iniciante/intermediário/avançado>

| # | id | título (frase com verbo) | ideia única | cena / receitas | tempo | fonte ou ressalva |
|---|----|--------------------------|-------------|-----------------|-------|-------------------|
| 1 | capa | ... | ... | splitChars + marquee | 0:30 | — |
| 7 | pipeline | Da pesquisa à publicação | 6 etapas, revisão humana no meio | flow + drawPath, loop | 2:00 | "Interface ilustrativa" |

## Notas do palestrante
### 7 · pipeline
- o que falar enquanto o pacote anda...
```

Regras:
- `id` em kebab-case, estável (vira link e nome de arquivo).
- Título é uma **frase** que afirma algo ("O agente só publica depois da revisão"), não um rótulo ("Pipeline").
- Cada linha escolhe a receita pela tabela da skill animated-scenes. Slide sem animação também vale.
- Toda afirmação factual tem fonte; toda interface/número inventado tem ressalva.
- Some o tempo e mostre o total ao usuário.

## 4. Do roteiro ao deck

Depois de aprovado, construa em **lotes de 3 a 5 slides**: HTML + CSS + cena → `npm run qa`
→ olhar screenshots → mostrar ao usuário. Coloque as notas no `<aside class="notes">` de cada slide
(elas vão para o PPTX). Atualize o ROTEIRO.md se a ordem mudar.
