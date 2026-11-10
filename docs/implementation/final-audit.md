# Auditoria Final — Etapa 3

Passagem de qualidade sobre o produto inteiro e fechamento técnico. Nenhuma feature nova.

---

## 1. Escopo auditado

11 rotas públicas + 404: `/` · `/o-curso` · `/metodologia` · `/concursos` · `/concursos/{espcex,afa,eear,efomm}` · `/professores` · `/bolsas` · `/contato` · 404.

Dimensões: consistência visual entre páginas · copy · conversão · navegação · responsividade · acessibilidade · motion · performance · SEO técnico · código morto.

**Método:** medição no browser, não inspeção de código. As auditorias foram executadas contra o DOM renderizado em viewports reais. O bug de `--container-full` da Etapa 2 é o precedente que justifica isso — ele passou por typecheck, lint e build sem ser notado.

---

## 2. Problemas encontrados e corrigidos

### P0 — `--color-fg-subtle` reprovava AA em texto real
**20 nós de texto** abaixo de 4.5:1 numa única página: rótulos de seção, cabeçalhos de tabela, legendas e nomes de força.

Origem: na Fase 2 o token foi calibrado para o patamar de **3:1** (elemento gráfico / texto grande), mas na implementação ele acabou carregando **texto normal**. A auditoria anterior mediu o token contra o critério errado.

Corrigido no token, não nos 20 usos:

| Superfície | Antes | Depois | Contraste |
|---|---|---|---|
| bone | `#6a7691` | `#5c6880` | 4.11 → **5.06** |
| navy | `#7787a6` | `#8b98b5` | 4.21 → **5.27** |
| ink | `#5b6b8c` | `#7787a6` | 3.58 → **5.28** |

Reverificado em 5 páginas / **552 nós de texto**: zero falhas.

### P1 — Header transbordava em 1024px
Medido: o conteúdo do header pedia **1029px numa caixa de 944px**. A barra de navegação com seis itens ocupa 683px sozinha.

A Etapa 1 já havia corrigido a faixa `xl`–`2xl`; o ponto exato de `lg` continuava quebrado.

Corrigido movendo a navegação desktop de `lg` para **`xl`**. De 1024 a 1279 o usuário vê marca + CTA de matrícula + menu — **a conversão continua visível no laptop** e a navegação fica a um toque. Sem overflow em 1024, 1280, 1366 e 1440.

### P1 — Três páginas terminavam com duas superfícies navy adjacentes
`/concursos`, `/professores` e `/bolsas` fechavam com uma seção navy seguida do `CtaFinal` navy. Os dois blocos se fundiam e o fechamento perdia o peso que vem da troca de superfície.

Corrigido reequilibrando o ritmo. Estado final, verificado em todas as rotas:

| Rota | Ritmo |
|---|---|
| `/` | n b b n b b n |
| `/o-curso` | n b n b n |
| `/metodologia` | n b n b b n |
| `/concursos` | n b n b n |
| `/concursos/*` | n b b n b n |
| `/professores` | n b b n |
| `/bolsas` | n b n b n |
| `/contato` | n b n |

Nenhuma superfície igual adjacente. Contraste revalidado nas seções que trocaram: zero falhas.

### P1 — `/o-curso` duplicava o bloco de credibilidade da Home
A seção 02 ("O que nos separa") repetia os mesmos quatro pilares da Home **no mesmo layout** — lista com filete, grid `1fr/1.4fr`, losango. Quem navegasse Home → O curso via a mesma coisa duas vezes, com palavras trocadas.

Substituída por **"Para quem é"**: as duas audiências (aluno e responsável) e a pergunta que cada uma traz, com ponte para `/concursos` e `/metodologia`. Verdade de produto confirmada em `PRODUCT.md § Users` — nada inventado — e a única coisa que apenas essa página pode dizer.

### P2 — Frase-muleta repetida em quatro lugares
"Conte qual concurso você quer prestar e em que ponto está" aparecia quase literal no `CtaFinal` padrão, em `/metodologia`, em `/professores` e em `/contato`. Cada ocorrência foi reescrita com ângulo próprio.

### P2 — Rótulo de CTA não batia com a mensagem enviada
Em `/metodologia` o botão dizia "Quero conhecer a preparação" mas disparava a intenção `matricula`, cuja mensagem é *"Tenho interesse em me matricular"*. Promessa e ação divergentes. Removido o rótulo customizado; o botão agora diz o que faz.

### P2 — Título contradizia o próprio lead
`/professores` fechava com "Fale direto com quem vai te ensinar", enquanto o lead logo abaixo explicava que quem atende é a coordenação administrativa. Reescrito para "Converse antes de decidir", e o lead agora diz o que a coordenação de fato oferece.

### P2 — Metáfora virando gimmick
O 404 dizia "Esta rota não consta no diário". O North Star é princípio de composição, não slogan. Trocado por "Esta página não existe".

### P2 — Duração e easing hardcoded no Header
`transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}` violava a regra 3 do `AGENTS.md`. `src/lib/motion.ts` foi reduzido aos dois tokens que o painel realmente usa e o Header passou a importá-los.

### P2 — Payload de fontes com desperdício material
- O eixo **`SOFT`** da Fraunces engordava o arquivo variável e **nunca era variado** (zero `font-variation-settings` no projeto).
- O peso **600** da Cinzel nunca era usado (`text-inscription` jamais aparece em negrito).

Removidos os dois. Payload real baixado: **344KB → 207KB (−40%)**. Fraunces, o itálico editorial e a Cinzel seguem funcionando — verificado no DOM.

### P2 — Travessão na copy pública
Pedido do cliente durante a auditoria: nada de em dash nem en dash em texto visível.

As 49 ocorrências foram reescritas caso a caso, não trocadas por hífen. A célula vazia da tabela deixou de ser "—" e passou a dizer "não informado". Verificado no texto renderizado das 11 rotas, incluindo `title` e `description`: zero ocorrências. Comentários de código não foram alterados, por não serem conteúdo público.

### P3 — Código morto
Removidos: `RouteMarks` · `ctaHierarchy` · tipos `CtaWeight` e `ConversionContext` · campos `defaultWeight` e `external` · mensagens `duvidaConcurso` e `metodologia` · utilitários `animate-rise-in` (+ keyframes), `rule-hairline` e `container-prose` · tokens `--container-prose`, `--container-pagina` e a tríade `success`/`warning`/`danger`.

`resolveIntent()` passou a **ler** `channel.fallback` de verdade — antes o destino era fixado na função e o campo era decoração que podia divergir da realidade.

---

## 3. Verificado e correto — sem alteração necessária

- **Detector do Impeccable**: `impeccable detect src` limpo antes e depois.
- **Anel de foco**: `outline: 2px solid`, cor por superfície. Confirmado com **Tab real** — o teste programático com `.focus()` dava falso negativo porque não ativa `:focus-visible`.
- **Movimento reduzido**: sob `prefers-reduced-motion`, zero elementos de reveal ficam invisíveis.
- **Menu mobile**: `aria-expanded`, foco preso, `Esc` fecha e devolve o foco, rolagem travada.
- **Tabela comparativa**: `table-fixed` + colgroup, última coluna visível, sem clipping em 1366 e 1440; cartões equivalentes abaixo de `md`.
- **Cor de contexto**: nunca sozinha — sempre com a sigla em texto.
- **Zero formulários**, **zero menções à ESA**, **zero links externos sem `noopener`**.
- **Client components**: apenas dois (`Header`, `Reveal`). `motion` importado em um único arquivo.
- **Cores hardcoded**: apenas `viewport.themeColor` no layout — metadata de browser que não aceita `var()`.
- **Linhas de leitura**: os "alertas" de linha longa eram falso positivo do heurístico (media a caixa, não o texto).

---

## 4. Validações executadas

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm run format:check` | ✅ |
| `npm run build` | ✅ 16 rotas |
| `npm run check` | ✅ |
| `impeccable detect src` | ✅ sem achados |
| Console do browser | ✅ limpo em 6 navegações |
| Travessões na copy pública | ✅ zero em 11 rotas |

### Viewports medidos
320 · 390 · 1024 · 1280 · 1366 · 1440.
`scrollWidth === clientWidth` em todas as rotas; zero alvos de toque abaixo de 44px em `pointer: coarse` (exceto o skip link, que cresce ao focar).

### Contraste
552 nós de texto em 5 páginas, medidos contra o fundo real computado. **Zero falhas AA.**

### SEO
11 rotas com `title`, `description`, `canonical` e Open Graph próprios. `robots.txt` bloqueando (`Disallow: /`) até `NEXT_PUBLIC_ALLOW_INDEXING=true`. Sitemap com 11 URLs; `/dev/foundation` fora dele e com `noindex`.

---

## 5. Não corrigido — e por quê

- **JSON-LD ausente**: depende de endereço, telefone e horário, que não existem. Publicar structured data incompleto é pior que não publicar.
- **`/dev/foundation` mantida**: continua útil para inspecionar tokens durante manutenção. Tem `noindex` e está fora do sitemap. Consta no checklist de lançamento.
- **Sem FAQ**: sem perguntas e respostas do cliente, criá-las seria inventar posicionamento.
- **`--color-arma-exercito` mantido**: reservado para a ESA, cuja remoção é revisível.
- **Tabela comparativa limitada a ~975px**: o trilho da entrada de diário consome a largura. É a assinatura estrutural do sistema e as seis colunas continuam legíveis. Trade-off consciente.
