# Impeccable

**Status: instalado e inicializado.** Skill v4.2.2, engine v0.1.3 (windows-x64).

## Instalação

O bloqueio anterior (registrado em D-14) não era ausência da ferramenta — era o **prompt interativo** de hooks, que o terminal do usuário não suporta. A flag `-y` resolve:

```bash
npx impeccable install --providers=claude --scope=project -y
```

## O que foi instalado

| Caminho | Conteúdo |
|---|---|
| `.claude/skills/impeccable/SKILL.md` | a skill e a tabela de comandos |
| `.claude/skills/impeccable/reference/` | ~40 playbooks (`init`, `new-work`, `craft-floor`, `audit`, `critique`, `polish`, `typeset`, `layout`, `animate`, `live`, …) |
| `.claude/skills/impeccable/scripts/` | binário autocontido — **não requer Node** — + índice de fontes e scripts do modo live |
| `.claude/agents/` | 4 subagentes: `asset-producer`, `documenter`, `finish-reviewer`, `manual-edit-applier` |
| `.claude/settings.local.json` | manifesto de hooks |

### Hooks ativos

| Evento | Quando | Timeout |
|---|---|---|
| `PostToolUse` (Edit\|Write) | checagem imediata após editar arquivo de UI | 5s |
| `Stop` | passe profundo com o conjunto completo de regras | 30s |

Já verificado em funcionamento: a primeira edição em `src/styles/tokens.css` após a instalação disparou o detector e retornou sem achados.

Desligar/ligar: `/impeccable hooks off|on|status`.

## `/impeccable init` — executado

O `init` captura **verdade de produto**, não visual. Ele explicitamente proíbe perguntar sobre estética, paleta, tipografia ou referências visuais nesta etapa, e não escreve `DESIGN.md`.

### Diagnóstico do `impeccable context`

```
NO_PRODUCT_MD          — sem PRODUCT.md, mas com implementação visual incumbente
EXISTING_VISUAL_SYSTEM — código e tokens são autoridade de design incumbente;
                         DESIGN.md ausente é lacuna de documentação, não greenfield
```

Isto é exatamente o estado correto: a fundação da Fase 2 **é** o sistema incumbente e será preservada, não substituída.

### Resultado

[`PRODUCT.md`](../../PRODUCT.md) na raiz, com o schema `impeccable:product-schema 1`.

Três perguntas materiais foram levadas ao cliente (o resto o repositório já respondia). As respostas:

| Pergunta | Resposta | Decisão |
|---|---|---|
| Audiência primária | os dois, **responsável primeiro** | D-17 |
| ESA no site? | **fora por ora** | D-19 |
| Canal de conversão | **WhatsApp + chatbot da DM do Instagram**, sem formulário | D-18 |

`buildPath` (comp-first vs. code-first) **não foi perguntado nem gravado**: não há geração de imagem disponível nesta sessão, e sem ela code-first é o único caminho. Se uma sessão futura tiver geração de imagem, o `new-work` fará a pergunta uma vez.

Live mode não configurado — fica para a Fase 3, quando houver interface para iterar.

## Relação com a identidade da Prime Prep

O Impeccable **consome** a fundação existente; não a substitui.

Ordem de prioridade em caso de conflito, definida pelo briefing e reafirmada aqui:

1. identidade oficial da Prime Prep
2. planejamento da Fase 1 (+ adendos da Fase 2)
3. requisitos de acessibilidade
4. contexto do negócio (`PRODUCT.md`)
5. recomendações do Impeccable

Se ele propuser paleta, escala tipográfica ou raio próprios, prevalece `src/styles/tokens.css`. O papel dele é **refinamento e detecção de slop** — consistência de spacing, qualidade de estados, coerência entre componentes, padrões genéricos — não geração de identidade.

Ponto de atenção real: a skill instrui a "sonhar grande e ousado". Isso é compatível com a Prime Prep desde que a ousadia apareça em **hierarquia, escala tipográfica e composição** — nunca em efeito, glow ou saturação. O princípio 19 do projeto ("dinamismo vem de ritmo, não de saturação") tem precedência.

## Como usar na Fase 3

| Momento | Comando |
|---|---|
| Antes de construir uma superfície | `/impeccable shape <superfície>` — brief confirmado antes de código |
| Construir superfície nova | pedido normal; o `new-work` roda e **preserva** o mundo visual incumbente |
| Registrar o design system como `DESIGN.md` | `/impeccable document` |
| Revisar UX de uma tela | `/impeccable critique <alvo>` |
| Checar a11y / performance / responsivo | `/impeccable audit <alvo>` |
| Passe final antes de entregar | `/impeccable polish <alvo>` |
| Iterar visualmente no browser | `/impeccable live` (exige configuração na primeira vez) |

Recomendação para o primeiro passo da Fase 3: **`/impeccable document`**, para transformar a fundação já construída em `DESIGN.md` no formato que o Impeccable entende — assim todo comando posterior trabalha a favor dos tokens da Prime Prep em vez de propor os próprios.

## Limitações conhecidas

- **O slash command `/impeccable` só fica registrado após reiniciar a sessão** do Claude Code. A skill foi instalada com a sessão já em andamento; o fluxo do `init` foi executado lendo diretamente `reference/init.md`, com o mesmo resultado. Numa sessão nova, `/impeccable <comando>` funciona normalmente.
- Sem geração de imagem nesta sessão: `buildPath` fica não gravado e o caminho é code-first.
- **Não versionado.** `.claude/skills/`, `.claude/agents/` e `.claude/settings.local.json` estão no `.gitignore` — o binário é de 15MB e específico de plataforma. Em outra máquina, rodar o comando de instalação novamente.
- `.claude/**` também está em `globalIgnores` do ESLint e no `.prettierignore`: sem isso o `npm run lint` reprova nos scripts JS que o Impeccable instala.
