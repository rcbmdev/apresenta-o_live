# IA Generativa para Desenvolvedores: do ChatGPT ao Claude Code — palestra, 40 min + 5 min de perguntas

Mensagem central: **IA generativa deixou de ser um chat que sugere código e virou um agente que trabalha no seu projeto. O resultado depende do contexto, das checagens e dos limites que você dá a ele.**
Público: desenvolvedores · Nível: intermediário (já usaram ChatGPT/Copilot, pouco ou nada de agentes)
Palestrante: Rodrigo
Tema visual: padrão do kit (escuro, acento ciano). Logos em `deck/assets/img/logos/` (registrar origem em `deck/assets/CREDITS.md`).

> **Para o Claude Code:** construa este deck seguindo o `CLAUDE.md` e as skills do projeto. Faça em lotes
> (1–7, 8–12), rodando `npm run qa` e olhando os screenshots a cada lote. Apague os slides
> de exemplo do template. Os slides 5–9 são uma **linha do tempo com o mesmo layout**: o ano no topo rola
> com `rollDigits` e uma régua 2022–2026 marca o ano atual, para parecer uma única cena que avança.
> Antes de finalizar, confira na documentação oficial (code.claude.com/docs) cada comando citado nos slides 12–15.
> O slide 11 usa `img/CLIs.jpg` **só como referência de conteúdo**: é a foto da tela de outra apresentação, com o rosto
> de outra pessoa. Recrie o conteúdo em HTML com os componentes do deck; não coloque a foto no slide.

## Resumo

| # | id | título (frase com verbo) | ideia única | cena / receitas | tempo | fonte ou ressalva |
|---|----|--------------------------|-------------|-----------------|-------|-------------------|
| 1 | capa | IA generativa para desenvolvedores | do ChatGPT ao agente que trabalha no seu repositório | splitChars + reveal + marquee de logos (Python, MCP, Claude Code, OpenAI, LangChain) | 0:30 | — |
| 2 | sobre | Quem fala com vocês | trajetória do palestrante e QR para acompanhar os slides | foto + reveal dos tópicos + countUp "+75 mil alunos" + QR code (GitHub Pages) | 0:45 | dados informados pelo palestrante |
| 3 | llms | Os LLMs deram à IA o poder de criar | da IA que classifica à IA que gera; principais modelos de fronteira e de pesos abertos | demo de próximo token (barras de probabilidade em loop) + abas clicáveis Fronteira / Pesos abertos com logos | 2:00 | famílias de modelos em nov/2026 (versões mudam; conferir sites oficiais); probabilidades ilustrativas |
| 4 | por-que | O desenvolvedor passou de autor a revisor | a mudança de papel, que a palestra inteira explica | reveal em dois cards: "antes: você escreve, a IA sugere" → "agora: a IA executa, você define e revisa" | 1:30 | — |
| 5 | t-2022 | 2022: o chat chega ao cotidiano | modelos acessíveis por conversa e por API | rollDigits 2022 + régua + terminal curto (pergunta → resposta) + card LangChain | 2:00 | ChatGPT 30/11/2022; LangChain, 1º pacote Python out/2022 |
| 6 | t-2023 | 2023: frameworks, fluxos e os primeiros agentes | o modelo começa a escolher a próxima ação | rollDigits 2023 + flow em loop: Objetivo → Escolher ação → Executar → Observar | 2:00 | AutoGPT, LangChain, Langflow (2023) |
| 7 | t-2024 | 2024: estado, ciclos e um protocolo para ferramentas | MCP padroniza a ligação entre IA e sistemas | rollDigits 2024 + drawPath: Aplicação de IA ↔ Servidor MCP → Arquivos / Banco / APIs | 2:00 | LangGraph jan/2024; MCP anunciado 25/11/2024 |
| 8 | t-2025 | 2025: a IA passa a trabalhar dentro do projeto | agentes de terminal leem, editam, testam e mostram o diff | rollDigits 2025 + terminal: lendo arquivo → diff → pytest passed → "diff pronto para revisão" + cards Claude Code / Codex CLI / Agent Skills | 2:30 | Claude Code: preview fev/2025, disponibilidade geral mai/2025; Codex CLI abr/2025. "Representação didática" |
| 9 | t-2026 | 2026: agentes que trabalham enquanto você revisa | sessões longas, em paralelo e com autonomia controlada | rollDigits 2026 + reveal de 3 cards (auto mode, subagentes, sessões em paralelo/worktrees) + flow curto: pedido → agente → checagem → revisão humana | 2:30 | descrever recursos atuais da doc oficial, sem prometer datas |
| 10 | agentes | O que faz de uma IA um agente | agente = LLM + loop + ferramentas, para um problema específico | equação clicável (LLM + Loop + Ferramentas = Agente) com "sem isso…" + terminal de um agente resolvendo um teste | 2:30 | definição didática; execução ilustrativa |
| 11 | onde-usar | Três lugares para trabalhar com um agente de código | IDE feita para agentes, plugin no seu editor ou agente no terminal | reveal das 3 colunas (ícone em círculo colorido → nome → frase → ferramentas em cascata) + pulse no Claude Code na coluna CLI | 2:00 | referência de conteúdo: `img/CLIs.jpg` (não usar a foto). Lista ilustrativa, não exaustiva |
| 12 | loop | Como o Claude Code trabalha: um loop com ferramentas | contexto → plano → ação → verificação, repetido | flow em loop com 4 nós + ícones de ferramentas (ler arquivos, terminal, editar, web, MCP) entrando no nó "ação" | 2:30 | baseado em "How Claude Code works" (doc oficial) |
| 13 | comecar | Começar leva três comandos | instalar, abrir no projeto, gerar o CLAUDE.md | terminal: install → `claude` → `/init` → arquivo CLAUDE.md aparecendo | 2:30 | comandos conferidos na doc |
| 14 | comandos | Os comandos que você usa todo dia | poucos comandos resolvem 90% do uso | stepper com 4 abas: Sessão · Contexto · Controle · Retomar (detalhe abaixo) | 3:30 | conferir a lista na doc antes do evento |
| 15 | contexto | Diga ao Claude o que ele não vê no código | CLAUDE.md curto, regras por pasta, skills e MCP | reveal em camadas (sempre carregado → por pasta → sob demanda → integrações) + terminal mostrando um CLAUDE.md enxuto | 3:00 | — |
| 16 | praticar | Vamos praticar | transição para a parte prática com o Claude Code | splitChars no título + robô levantando peso em loop (rep 1→3) + terminal ilustrativo abrindo o Claude Code + roteiro da prática (5 passos) | 0:30 | "Interface ilustrativa" |

**Total: 34:15** (16 slides; slide 16 "praticar" adicionado em 02/11/2026; slides 3 "llms" e 10 "agentes" adicionados em 02/11/2026; slide 2 "sobre" adicionado em 02/11/2026; slides 13–15 — checagem, limites e workflow — removidos a pedido em 02/11/2026)

---

## Conteúdo de cada slide

### 1 · capa
- kicker: `EVENTO 2026 · PALESTRA` (trocar pelo nome do evento)
- título: **IA generativa para desenvolvedores**
- lead: Do chat que sugere código ao agente que trabalha no seu repositório.
- byline: **Rodrigo**
- faixa inferior: marquee com os logos/nomes da linha do tempo (Python · MCP · Claude Code · LangChain · OpenAI)

### 2 · sobre
- foto: `deck/assets/img/rodrigo.jpg` (de `img/Rodrigo.jpg`)
- Já fui programador · Já dei aulas particulares · Quase 8 anos como servidor concursado no IFMA · Em busca da liberdade geográfica: nômade digital
- destaque: **+75 mil alunos**
- QR code para rcbmdev.github.io/apresenta-o_live (acompanhar os slides)

### 3 · llms — os LLMs deram à IA o poder de criar
- IA clássica classifica e prevê ("é spam?" → sim); IA generativa cria (texto, código, imagem)
- demo: "Escreva uma função que" → soma (54%) → dois (61%) → números (72%), um token por vez
- abas: **Fronteira** (Claude · GPT · Gemini · Grok; fechados, via app/API) e **Pesos abertos** (Llama · Qwen · DeepSeek · Mistral · Gemma · Kimi; rodar com Ollama, baixar no Hugging Face)
- mostrar famílias, não versões: em nov/2026 as fontes citam versões diferentes e elas mudam a cada poucos meses

### 4 · por-que
- Card "Antes": você escreve, a IA completa a linha. Contexto: o arquivo aberto.
- Card "Agora": a IA lê o projeto, executa comandos, testa e entrega um diff. Contexto: o repositório, as ferramentas e as regras que você define.
- frase de transição: Como chegamos aqui em quatro anos?

### 5 · t-2022 — ChatGPT e aplicações com modelos de linguagem
- **ChatGPT** · 30 de novembro: a interface de conversa chega ao cotidiano.
- **LangChain** · primeiro pacote Python em outubro: o desenvolvedor conecta o modelo à aplicação.
- mini-diagrama: Aplicação (seu código e suas regras) → Modelo (uma chamada por API) → Dados (documentos e ferramentas)
- footnote: Marcos de acesso e composição, não o início da pesquisa em IA.

### 6 · t-2023 — frameworks, fluxos visuais e agentes
- Construir um fluxo: Entrada → Modelo → Saída (LangChain, Langflow, n8n)
- Experimentar agentes: Objetivo → Escolher a próxima ação → Executar → Observar (**AutoGPT**)
- frase: O modelo participa da escolha das ações e recebe os resultados das ferramentas.

### 7 · t-2024 — estado, ciclos e MCP
- **LangGraph** (janeiro): o fluxo guarda o que já aconteceu e decide continuar, repetir ou encerrar.
- **MCP — Model Context Protocol** (25 de novembro, Anthropic): um protocolo aberto para conectar ferramentas e dados.
- diagrama: Aplicação de IA ↔ Servidor MCP → Arquivos · Banco · APIs
- footnote: O MCP padroniza a integração; as permissões continuam na implementação.

### 8 · t-2025 — a IA trabalha no projeto
- terminal (representação didática):
  ```
  $ claude "corrija o filtro de busca"
  lendo src/busca.py
  - if filtro and termo:
  + if filtro is not None and termo:
  $ pytest -q
  12 passed
  diff pronto para revisão
  ```
- cards: **Claude Code** (preview em fevereiro, disponibilidade geral em maio) · **Codex CLI** (abril, terminal) · **Agent Skills** (procedimentos, scripts e referências carregados conforme a tarefa)
- footnote: A CLI conduz a execução; o modelo é uma escolha separada.

### 9 · t-2026 — agentes que trabalham enquanto você revisa
- **Auto mode**: sessões novas rodam sem pedir aprovação a cada comando; um classificador revisa o que for arriscado antes de executar.
- **Subagentes**: trabalho independente em paralelo, sem poluir a conversa principal.
- **Sessões em paralelo**: `claude -w feature-x` abre uma sessão em outra worktree; também há desktop, web e agendamentos.
- fluxo: pedido → agente → checagem automática → **revisão humana**
- footnote: Recursos conforme a documentação oficial em <data da revisão>. Autonomia sempre dentro de permissões.

### 10 · agentes — o que faz de uma IA um agente
- equação clicável: **LLM** (o cérebro) + **Loop** (pensa, age, observa) + **Ferramentas** (as mãos) = **Agente de IA**
- sem LLM: script fixo · sem loop: uma resposta só · sem ferramentas: só texto
- definição: Um agente de IA usa um LLM em loop, com ferramentas, para resolver um problema específico.
- terminal: objetivo → npm test → ✗ 1 failed → pensa e edita → npm test → ✓ passed

### 11 · onde-usar — três lugares para trabalhar com um agente de código
- kicker: `ONDE USAR`
- título: **Três lugares para trabalhar com um agente de código**
- três colunas, cada uma com um ícone dentro de um círculo colorido (verde, amarelo e laranja; se faltar cor nos tokens, criar `--accent-3` e `--accent-4` em tokens.css):
  - **IDE**: um editor feito para agentes → Cursor · Antigravity · Kiro
  - **Plugin**: um agente dentro do seu editor → GitHub Copilot · extensão do Claude Code para VS Code e JetBrains
  - **CLI**: um agente no seu terminal → **Claude Code** · Codex CLI · Gemini CLI · Cursor CLI · OpenCode · Pi
- destaque: Claude Code com `pulse`, e um selo pequeno abaixo da coluna CLI: "também no desktop, na web e no VS Code"
- frase final: O tipo de ferramenta é o mesmo; muda onde você conversa com ela. Nesta palestra, vamos de terminal.
- footnote: Lista ilustrativa, não exaustiva. As ferramentas mudam rápido: conferir os nomes antes do evento.
- ícones: SVG simples e genéricos (editor, plugue, janela de terminal `>_`), sem logos de marca.

### 12 · loop — como o Claude Code trabalha
- 4 nós em loop: **Reunir contexto** (lê arquivos, busca, CLAUDE.md) → **Planejar** → **Agir** (edita, roda comandos) → **Verificar** (testes, build, diff) → volta
- ferramentas entrando em "Agir": Read · Edit · Bash · Web · MCP · Subagentes
- frase: Você pode interromper a qualquer momento com `Esc`; o trabalho feito até ali fica.

### 13 · comecar — começar leva três comandos
- terminal:
  ```
  $ curl -fsSL https://claude.ai/install.sh | bash
  $ cd meu-projeto && claude
  > /init
  ✓ CLAUDE.md criado
  ```
- lado direito: alternativas `brew install --cask claude-code` · Windows: `irm https://claude.ai/install.ps1 | iex` · também no VS Code, JetBrains, desktop e web
- dica: o `/init` gera um rascunho; o trabalho depois é **cortar** linhas (a doc recomenda menos de 200).

### 14 · comandos — os comandos de todo dia (stepper com 4 abas)
- **Sessão**: `/help` · `/` (lista comandos e skills) · `@arquivo` (referenciar um arquivo) · `Shift+Tab` (alternar modo de permissão) · `/model` e `/effort`
- **Contexto**: `/context` (o que está ocupando o contexto) · `/clear` (entre tarefas diferentes) · `/compact <foco>` (resumir mantendo o importante) · `/btw` (pergunta rápida sem sujar o histórico)
- **Controle**: `Esc` (parar e redirecionar) · `Esc Esc` ou `/rewind` (voltar código e conversa a um ponto anterior) · `/permissions` · `/hooks`
- **Retomar e automatizar**: `claude -c` (continuar a última) · `claude -r` / `--resume <nome>` · `/rename` · `claude -p "..."` (uma execução, para scripts e CI) · `/code-review`
- footnote: Lista resumida. Referência completa: code.claude.com/docs/en/commands

### 15 · contexto — diga o que ele não vê no código
- camadas:
  1. **CLAUDE.md** (toda sessão): comandos de build/teste, convenções, armadilhas. Curto.
  2. **`.claude/rules/`** com `paths:` (só quando mexe naquela pasta)
  3. **Skills** em `.claude/skills/` (procedimentos sob demanda, também como `/nome`)
  4. **MCP**: `claude mcp add ...` para sistemas sem CLI (Notion, banco, issue tracker)
- exemplo de CLAUDE.md enxuto no terminal:
  ```
  # Commands
  npm test · npm run typecheck
  # Conventions
  named exports; zod nas rotas
  # Gotchas
  migrations/ é gerado — não editar
  ```
- dica: rode `/context` para confirmar o que foi carregado.




### 16 · praticar — vamos praticar
- título "Vamos praticar" + "Agora é com o Claude Code, ao vivo, num projeto de verdade."
- robô levantando peso (SVG animado, contador "loop · rep 3")
- terminal ilustrativo: `cd meu-projeto && claude` → boas-vindas → "explique a estrutura deste projeto"
- roteiro da prática: Instalar → Abrir no projeto → /init → Primeira tarefa → Revisar o diff

---

## Notas do palestrante

### 1 · capa
Apresente o tema em uma frase: "hoje vamos ver como a IA saiu do chat e foi parar dentro do terminal, e como usar isso bem".

### 2 · sobre
Apresente-se em 30 segundos e mostre o QR code para quem quiser acompanhar os slides no celular.

### 3 · llms
Explique o salto: a IA clássica escolhe entre respostas prontas; o LLM gera, um token por vez. Clique nas abas e diga que o que importa é a família, não a versão.

### 4 · por-que
Pergunte à plateia: "quem aqui já deixou um agente rodar um comando no seu terminal?". Use a resposta para calibrar o resto.

### 5–9 · linha do tempo
Ritmo rápido, cerca de 2 minutos por ano. A ideia que atravessa os cinco slides: a cada ano, o modelo ganha mais **ação** e o desenvolvedor ganha mais **responsabilidade de definir limites**. No 2024, enfatize o MCP: vai voltar no slide 15.

### 10 · agentes
Monte a equação com a plateia, clicando em cada parte. Termine na definição e mostre o terminal: o agente roda, falha, corrige e para sozinho.

### 11 · onde-usar
Pergunte quem usa cada um dos três. Os conceitos da palestra (contexto, checagem e limites) valem para todos; daqui em diante, o exemplo é o Claude Code no terminal.

### 12 · loop
Este é o modelo mental da palestra. Volte a ele no slide 15: o contexto alimenta "Reunir contexto".

### 13 · comecar
Se houver tempo e internet, faça a demo ao vivo do `/init` num repositório pequeno. Tenha o screenshot de backup.

### 14 · comandos
Não leia todos. Clique em cada aba e destaque um por aba: `@arquivo`, `/clear`, `Esc Esc`, `claude -p`.

### 15 · contexto
Mensagem: o CLAUDE.md é lido em toda sessão, então cada linha custa atenção. Só o que o modelo não descobre lendo o código.




### 16 · praticar
Mostre o roteiro da faixa de baixo e abra o terminal de verdade. Daqui em diante é demo ao vivo.

---

## Fontes para conferir antes do evento
- Claude Code: code.claude.com/docs (Quickstart, Best practices, Commands, Permission modes, Hooks, Memory/CLAUDE.md)
- MCP: anúncio da Anthropic de 25/11/2024 e modelcontextprotocol.io
- ChatGPT: anúncio da OpenAI de 30/11/2022
- LangChain, LangGraph, Langflow, AutoGPT: repositórios oficiais e notas de versão
- Codex CLI: anúncio da OpenAI de abril/2025
- Slide 8: páginas oficiais de Cursor, Antigravity, Kiro, GitHub Copilot, Gemini CLI, OpenCode e Pi
- Referência de formato e linha do tempo: palestra "Agentes Autônomos de IA com Hermes Agent", Felipe Azambuja/PycodeBR, Python Brasil 2026 (pycodebr.com.br/python-brasil-2026). Usar como inspiração, sem copiar textos ou artes.
