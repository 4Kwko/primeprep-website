# Log de Decisões — Fase 2

Somente decisões com consequência arquitetural ou visual. Trivialidades não entram.

---

## D-01 · Next.js em vez de Astro
**Decisão**: Next.js 16, App Router, Turbopack.
**Motivo**: o briefing pede site institucional expansível com páginas de concurso e motion refinado, não uma landing. Astro venceria em bundle mínimo, mas boa parte do site viraria ilha React por causa do motion, e qualquer funcionalidade dinâmica futura exigiria adaptador.
**Alternativas**: Astro (finalista), Vite SPA (descartado por SEO), Webflow/WordPress (descartados — empurram para estética de template).
**Impacto**: alto. Define roteamento, renderização e deploy.

---

## D-02 · Paleta expandida — o navy deixa de ser o site inteiro
**Decisão**: sistema de cinco famílias (navy, bone, gold, crimson, steel) + cinco cores de contexto por concurso, em vez do navy + ouro proposto na Fase 1.
**Motivo**: correção explícita do usuário — "não quero algo monocromático navy blue" e "3 cores sem elas funcionarem entre si". Navy sólido em página longa cansa e não sustenta hierarquia. O **bone** (pergaminho quente) é a peça-chave: cria tensão cromática contra o navy frio sem introduzir cor decorativa.
**Alternativas**: navy + ouro (rejeitado pelo usuário); paleta com uma cor de destaque arbitrária (rejeitado — cor sem razão institucional).
**Impacto**: alto. Redefine a direção visual da Fase 1.

---

## D-03 · Cores de contexto derivadas das instituições reais
**Decisão**: cada concurso tem uma cor derivada da sua força (Marinha, Aeronáutica, Exército), sensível à superfície.
**Motivo**: entrega o dinamismo cromático pedido sem inventar cor arbitrária — cada cor tem justificativa institucional. Também resolve navegação: o usuário reconhece o concurso pela cor.
**Restrição**: o verde do Exército é **exclusivamente** código de concurso, nunca cor de tema — a proibição anti-caricatura do planejamento continua valendo.
**Impacto**: médio. Afeta páginas de concurso, tabela comparativa e navegação.

---

## D-04 · `@theme` em vez de `@theme inline` — bug corrigido
**Decisão**: tokens semânticos declarados com `@theme` normal e sobrescritos nos escopos `[data-surface]`.
**Motivo**: a primeira implementação usava `@theme inline` com uma camada de indireção `--c-*`. Testado no browser: os escopos **não trocavam nada** em CSS escrito à mão, porque `@theme inline` resolve a variável no `:root`, não no elemento. Com `@theme` normal, `bg-canvas` compila para `var(--color-canvas)` e a resolução acontece no elemento — que é o que faz o sistema de superfícies funcionar.
**Ganho colateral**: um único nome por token, válido em utilitário Tailwind e em `var()`.
**Impacto**: alto. É o mecanismo central da UI.

---

## D-05 · Cores de contexto sensíveis à superfície
**Decisão**: os cinco tokens `--color-arma-*` são redefinidos nos escopos escuros com variantes claras.
**Motivo**: auditoria de contraste durante o Setup mostrou o azul da EEAR em 2.56:1 sobre pergaminho — reprovado até para elemento gráfico. Em vez de dez tokens (`-light`/`-dark`) com escolha manual em cada uso, os escopos redefinem os mesmos nomes. `var(--color-arma-efomm)` sempre atinge AA onde estiver.
**Impacto**: médio. Elimina uma classe inteira de erro de acessibilidade por construção.

---

## D-06 · Três famílias tipográficas
**Decisão**: Cinzel (inscricional) + Fraunces (display) + Inter (sans).
**Motivo**: as peças mostram três comportamentos tipográficos distintos e recorrentes. Fundir os dois primeiros perderia o contraste inscricional/editorial que é a assinatura mais reconhecível da marca. Fraunces foi escolhida pelo eixo `opsz`, que resolve o risco documentado na Fase 1 de serifada de alto contraste quebrando em tamanhos pequenos.
**Custo**: acima da média. Mitigado por fontes variáveis, self-hosting no build e Cinzel sem preload.
**Impacto**: alto e reversível — trocar exige editar dois arquivos.

---

## D-07 · `cn()` próprio em vez de `clsx` + `tailwind-merge`
**Decisão**: cinco linhas escritas à mão.
**Motivo**: `tailwind-merge` existe para resolver colisão de utilitários. O design system evita colisão por construção — tokens semânticos e poucos utilitários de assinatura, sem variantes que sobrescrevem classes umas das outras. Trazer ~6KB para um problema que o sistema não tem é custo sem contrapartida.
**Reversível**: se a Fase 3 provar o contrário, trocar e documentar aqui.
**Impacto**: baixo.

---

## D-08 · Conteúdo como módulos TypeScript, não CMS nem Markdown
**Decisão**: `src/content/*.ts` com tipos em `src/types/content.ts`.
**Motivo**: o conteúdo é estruturado (fichas com campos fixos), não editorial livre. Ganha checagem de tipo, e menu/sitemap/tabela derivam da mesma fonte.
**Alternativas**: MDX (melhor para prosa, pior para dado estruturado), CMS headless (complexidade sem demanda declarada).
**Impacto**: médio. Se aparecer blog, a decisão será reavaliada — MDX ao lado, não prosa dentro destes arquivos.

---

## D-09 · `DadoReferencia<T>` — o tipo impede mentir
**Decisão**: todo dado de edital é `{ valor: T; verifiedAt: string | null }`.
**Motivo**: a restrição mais forte do briefing é não inventar e não apresentar edital como definitivo. Um comentário não impede; um tipo impede. Com `verifiedAt: null`, a UI é obrigada a marcar o dado como referência.
**Impacto**: médio. Torna a restrição do briefing executável em vez de aspiracional.

---

## D-10 · Indexação bloqueada por padrão
**Decisão**: `robots` e metadata só liberam com `NEXT_PUBLIC_ALLOW_INDEXING=true`.
**Motivo**: site em construção indexado é dano difícil de reverter. Liberar deve ser ato deliberado no deploy.
**Impacto**: baixo, alto valor preventivo.

---

## D-11 · Sem test runner nesta fase
**Decisão**: nenhum runner instalado.
**Motivo**: não há lógica de negócio. Testaria `cn()` e a forma de arrays literais. `tsc` + ESLint + build de produção cobrem o que existe.
**Gatilho de reavaliação**: formulário com validação, filtro/busca, ou qualquer cálculo → Vitest + Playwright.
**Impacto**: baixo, revisitável.

---

## D-12 · Família de ícones própria, não Lucide
**Decisão**: 8–12 SVGs desenhados no traço das peças, como componentes React.
**Motivo**: o briefing veta explicitamente "ícones Lucide em cada linha apenas para preencher espaço". As peças já têm família coerente de ícones outline; adotar biblioteca genérica jogaria fora uma assinatura que a marca já tem.
**Exceção**: glifos oficiais de marca (WhatsApp, Instagram).
**Impacto**: médio. Trabalho manual na Fase 3, em troca de identidade própria.

---

## D-13 · Peças de social media ficam fora de `public/`
**Decisão**: `docs/references/social/`, não `public/assets/`.
**Motivo**: são referência de identidade, não asset de produção. Fora de `public/` é impossível publicá-las por acidente.
**Impacto**: baixo, evita erro classe "post de Instagram virou imagem do site".

---

## D-14 · `/impeccable init` não executado ~~(SUPERADA por D-16)~~
**Decisão**: não executado; registrado como pendência bloqueante.
**Motivo**: o comando não existe neste ambiente. Verificado em skills, catálogo de plugins, `~/.claude/commands/` e `~/.claude/plugins/`. Simular uma configuração equivalente e chamá-la de Impeccable produziria documentação falsa.
**Impacto**: bloqueava o critério nº 4 da Fase 2. **Resolvido em D-16** — o pacote npm existia, só o prompt interativo travava.

---

## D-15 · Rota `/dev/foundation`
**Decisão**: folha de referência visual dos tokens, com `robots: noindex`.
**Motivo**: permite inspecionar o sistema durante a Fase 3 sem abrir a Home. Não é página do site.
**Obrigação**: remover ou bloquear antes do deploy público (consta no checklist de lançamento em `seo-technical.md`).
**Impacto**: baixo.

---

## D-16 · Impeccable instalado — `/impeccable init` executado
**Decisão**: instalado via `npx impeccable install --providers=claude --scope=project -y`; `PRODUCT.md` criado.
**Motivo**: a tentativa anterior travava no prompt interativo de hooks (o terminal do usuário não suporta prompts). A flag `-y` resolve. Corrige o bloqueio registrado em D-14 — **D-14 está superada**.
**O que foi instalado**: skill em `.claude/skills/impeccable/` (binário autocontido, sem runtime Node), 4 subagentes em `.claude/agents/`, e hooks em `.claude/settings.local.json` — detector de design roda em `PostToolUse` (Edit/Write, 5s) e passe profundo em `Stop` (30s).
**Nota de sessão**: o slash command `/impeccable` só fica registrado após reiniciar a sessão; o fluxo do `init` foi executado a partir dos arquivos de referência instalados, com o mesmo resultado.
**Impacto**: médio. Ver [`impeccable.md`](./impeccable.md).

---

## D-17 · Audiência primária: o responsável, depois o aluno
**Decisão**: o site abre estabelecendo credibilidade institucional para o responsável; o aluno é conquistado nas páginas de concurso.
**Motivo**: resposta do cliente no `init`. Resolve a pendência C-8 do planejamento.
**Impacto**: alto. Define a ordem das seções da home, o tom da copy e o que ocupa a primeira dobra — credibilidade e método antes de carreira e salário.

---

## D-18 · Conversão só por WhatsApp + DM do Instagram ~~(AMPLIADA por D-20)~~
**Decisão**: **não haverá formulário de contato.** Todo CTA aponta para um dos dois canais que já existem.
**Motivo**: resposta do cliente no `init`. São os canais em operação, e o chatbot da DM já atende dúvidas sobre cursos, metodologia e professores.
**Consequências**: sem backend, sem Route Handler, sem armazenamento de dados pessoais, sem LGPD de formulário, sem `CONTACT_FORM_ENDPOINT`. A página `/contato` vira página de canais, não de formulário. Simplifica o site inteiro.
**Impacto**: alto. Remove uma camada arquitetural completa.

---

## D-19 · ESA fora do site por ora
**Decisão**: ESA removida de `src/content/concursos.ts`. O site cobre EsPCEx, AFA, EEAR e EFOMM.
**Motivo**: resposta do cliente no `init`. Constava no briefing inicial mas não nas peças, e não havia dado algum para preenchê-la — uma página de concurso vazia enfraquece as outras quatro.
**Reversível**: acrescentar a entrada em `concursos.ts` reintroduz menu, sitemap e página. O token `--color-arma-exercito` foi mantido reservado.
**Impacto**: baixo, por construção — a lista é fonte única.

---

## D-20 · Quatro intenções de conversão, dois transportes
**Decisão**: os canais oficiais passam a ser **Matrícula, Pedido de bolsa, WhatsApp e Instagram Direct**, com hierarquia por página. Matrícula e bolsa são *intenções* sem fluxo próprio definido; ambas resolvem hoje para WhatsApp com mensagem contextualizada.
**Motivo**: adendo do cliente à Fase 3. Amplia D-18 sem contradizê-la — continua sem formulário genérico e sem backend.
**Implementação**: `src/content/conversion.ts` é a fonte única (canais, mensagens, `resolveIntent()`, hierarquia, nomes de evento). `href: null` marca fluxo inexistente; nenhum placeholder chega à interface. Quando matrícula/bolsa ganharem fluxo real, preencher `href` — nenhum componente muda.
**Hierarquia**: primário = matrícula · secundário = WhatsApp · contextual = bolsa · terciário = Instagram. Varia por página; nunca os quatro com o mesmo peso.
**Tracking**: `cta_matricula`/`cta_bolsa`/`cta_whatsapp`/`cta_instagram` nomeados e devolvidos por `resolveIntent()`, mas **analytics não está ativo**.
**Conflito resolvido**: o adendo exemplifica com "página ESA", mas a ESA foi retirada em D-19. Mantida fora; os CTAs contextuais cobrem EsPCEx, AFA, EEAR e EFOMM.
**Impacto**: alto. Define toda a camada de conversão da Fase 3. Spec: [`../implementation/conversion.md`](../implementation/conversion.md).

---

## D-21 · Reveal por scroll em CSS, não em `motion`
**Decisão**: o reveal usa `@media (scripting: enabled)` + `IntersectionObserver` marcando `data-revealed`, com a transição em CSS. O `motion` fica restrito à transição do painel do menu mobile.
**Motivo**: a primeira implementação usava `motion` com `whileInView`. Verificado no HTML servido — saía `opacity:0;transform:translateY(14px)` **no SSR**. Sem JavaScript, ou com hidratação falha, todo o conteúdo revelado ficava invisível. Defeito grave num site cuja função é ser lido e encontrado.
**Alternativas**: gate por classe `.js` escrita por script inline (funcionava, mas o script causava mismatch de hidratação no `<html>` e um aviso do React sobre `<script>` dentro de componente); manter `motion` e aceitar o risco (rejeitado).
**Ganhos**: zero JavaScript de animação no bundle da página; sem script inline; sem mismatch; `prefers-reduced-motion` tratado em uma regra.
**Impacto**: alto para robustez e performance. O `motion` continua instalado e usado onde orquestração é real.

---

## D-22 · Variáveis de fonte no `<html>`, não no `<body>`
**Decisão**: as classes do `next/font` vão no elemento `<html>`.
**Motivo**: `@theme` compõe `--font-display: var(--font-fraunces)` no `:root`. Com as classes no `<body>`, a variável de origem fica um nível abaixo e `--font-display` resolve vazio — as três famílias caíam para a sans do sistema. Encontrado na revisão visual, não em teste automatizado: typecheck, lint e build passavam com o bug.
**Impacto**: alto e invisível para o tooling. Registrado para não regredir.

---

## D-23 · Composição por "entrada de diário"
**Decisão**: toda seção de conteúdo usa `LogEntry` — número, rótulo e filete no trilho de margem, conteúdo à direita.
**Motivo**: é a tradução estrutural do North Star ("O Diário de Bordo") e, na prática, o mecanismo que torna impossível o empilhamento de seções centralizadas que o briefing veta. Assimetria por construção, não por disciplina.
**Impacto**: alto. Define a composição de todas as páginas seguintes.

---

## D-24 · `--container-full` sobrescrevia o `w-full` nativo
**Decisão**: renomeado para `--container-pagina`, com aviso no token.
**Motivo**: o namespace `--container-*` do Tailwind v4 gera `w-<nome>`, `max-w-<nome>` e `min-w-<nome>`. `--container-full: 96rem` sequestrou o `w-full` nativo, que passou a valer 1536px em vez de 100%. Quebrou o monograma dos professores (Etapa 1, contornado com diagnóstico errado) e cortou as últimas colunas da tabela comparativa dentro de um `overflow: hidden` — perda silenciosa de informação.
**Regra derivada**: nunca nomear um container com o nome de um utilitário existente (`full`, `screen`, `min`, `max`, `fit`, `auto`, `px`).
**Impacto**: alto. Bug invisível para typecheck, lint e build; só apareceu na medição do layout no browser.

---

## D-25 · Botões quebram linha
**Decisão**: `btn-base` perdeu `white-space: nowrap` e ganhou `text-align: center` + `text-wrap: balance`.
**Motivo**: rótulos contextuais são característica do site por decisão de conversão ("Quero me preparar para a EFOMM"). Com `nowrap` o botão estourava o container em 390px.
**Impacto**: baixo, mas necessário para o padrão de CTA contextual funcionar no caso base.

---

## D-26 · Disciplinas do edital não cobertas são declaradas
**Decisão**: nas páginas de concurso, cada disciplina da prova é marcada como *Aula na Prime Prep* ou *Conteúdo do edital*; quando há disciplinas fora do corpo docente (Geografia e História na EsPCEx), a página diz isso em texto.
**Motivo**: é a doutrina de "nada inventado" aplicada ao que falta. Omitir a lacuna seria deixar o visitante descobrir depois — e a honestidade aqui reforça a credibilidade que a Home constrói.
**Impacto**: médio. Vale confirmar com o cliente se essas disciplinas são atendidas de outra forma.

---

## D-27 · `--color-fg-subtle` recalibrado para AA em texto
**Decisão**: o token subiu para `#5c6880` (bone), `#8b98b5` (navy) e `#7787a6` (ink) — todos ≥5:1.
**Motivo**: a auditoria da Fase 2 mediu `fg-subtle` contra o critério de 3:1 (elemento gráfico), mas na implementação ele carrega **texto normal**: rótulos de seção, cabeçalho de tabela, legendas. Medição no DOM renderizado encontrou 20 nós reprovando AA numa única página.
**Alternativa rejeitada**: trocar os 20 usos por `fg-muted` — perderia o degrau de hierarquia e o problema voltaria no próximo uso.
**Impacto**: alto para acessibilidade. Reverificado em 552 nós de texto: zero falhas.

---

## D-28 · Navegação desktop em `xl`, não em `lg`
**Decisão**: a barra de navegação aparece a partir de 1280; de 1024 a 1279 ficam marca + CTA de matrícula + menu.
**Motivo**: medido no browser — em 1024 o conteúdo do header pedia 1029px numa caixa de 944px, com a nav de seis itens ocupando 683px sozinha.
**Alternativa rejeitada**: esconder o CTA de matrícula entre `lg` e `xl` — 1024–1279 é faixa comum de laptop e a conversão sumiria justamente ali.
**Impacto**: médio. Terceira e última correção de aperto no header.

---

## D-29 · Ritmo de superfície obrigatório antes do fechamento
**Decisão**: nenhuma página tem duas seções de mesma superfície adjacentes; o `CtaFinal` sempre chega numa troca de superfície.
**Motivo**: `/concursos`, `/professores` e `/bolsas` fechavam com navy sobre navy — os blocos se fundiam e o fechamento perdia o peso que vem da troca.
**Impacto**: médio, puramente de composição. Verificado nas nove rotas.

---

## D-30 · `/o-curso` deixou de repetir a Home
**Decisão**: a seção 02 virou "Para quem é" (aluno e responsável), em vez de repetir os quatro pilares do bloco de credibilidade da Home.
**Motivo**: era o mesmo conteúdo no mesmo layout, com palavras trocadas — quem navegasse Home → O curso via duas vezes a mesma coisa. O mecanismo já é contado na Home (resumo) e em `/metodologia` (profundidade).
**Fonte**: `PRODUCT.md § Users` — verdade de produto confirmada, nada inventado.
**Impacto**: médio. Elimina a única duplicação real entre páginas.

---

## D-31 · Eixo `SOFT` e peso 600 removidos das fontes
**Decisão**: Fraunces com `axes: ["opsz"]` apenas; Cinzel com peso 400 apenas.
**Motivo**: auditoria confirmou zero `font-variation-settings` no projeto (o eixo SOFT nunca era variado) e zero usos de `text-inscription` em negrito.
**Ganho medido**: payload de fontes baixado caiu de 344KB para 207KB (−40%), sem perda visual — Fraunces, itálico editorial e Cinzel verificados no DOM depois da mudança.
**Impacto**: médio para performance em rede móvel, que é o caso base do público.

---

## D-32 · Sem travessão na copy pública
**Decisão**: nenhum em dash (—) ou en dash (–) no texto visível do site, incluindo `title` e `description`.
**Motivo**: preferência explícita do cliente.
**Como foi feito**: as 49 ocorrências foram reescritas caso a caso (vírgula, dois-pontos, ponto-e-vírgula, parênteses ou frase nova), não substituídas por hífen. A célula vazia da tabela comparativa deixou de ser "—" e passou a dizer "não informado", o que também é mais claro.
**Verificação**: varredura do texto renderizado nas 11 rotas, incluindo metadata. Zero ocorrências.
**Nota**: comentários de código não foram alterados, por não serem conteúdo público.
**Impacto**: baixo tecnicamente, alto para consistência de voz.

---

## D-33 · Marca real como máscara alfa
**Decisão**: o asset raster da marca é exportado em quatro variações (`completa`, `aguia`, `wordmark`, `livro`), cada uma como máscara alfa pintada por `currentColor`.
**Motivo**: o site tem três superfícies, o que exigiria versão branca e navy de cada variação. Com máscara, um arquivo serve as três e a marca nunca sai com a cor errada. O alfa vem de `255 - luminância`, o que preserva o antialiasing das penas sem halo.
**Origem**: as quatro variações são recortes do MESMO arquivo original (`docs/references/brand/logo-original-bw.png`), separados por análise do perfil de linhas. Nada redesenhado ou vetorizado à mão.
**Aplicação por papel**: águia no header e nas marcas d'água, completa no footer, livro no fecho. A marca não se repete idêntica na mesma tela.
**Impacto**: alto. A identidade deixou de depender de tipografia. Troca por SVG mexe em um arquivo só.

---

## D-34 · Elevação tonal antes de sombra em superfície escura
**Decisão**: `--shadow-*` passou a ser semântico por superfície; em navy e ink a base é quase preta, e painéis usam `surface-elevated`.
**Motivo**: descoberto na implementação — sombra tingida de navy é **invisível sobre navy**, porque fundo e sombra têm quase a mesma luminância. O painel do hero simplesmente não flutuava. O degrau tonal é o cue principal em fundo escuro; a sombra reforça.
**Impacto**: alto. É o que faz a profundidade funcionar nas superfícies escuras, que são metade do site.

---

## D-35 · `overflow-x: clip` nas seções compostas
**Decisão**: `.secao-composta` usa `overflow-x: clip`, nunca `overflow: hidden`.
**Motivo**: a marca d'água sangra pela borda direita e criava 97px de scroll horizontal. `hidden` resolveria o eixo X mas forçaria o eixo Y a `auto`, matando a sobreposição do painel na costura entre seções. `clip` corta um eixo sem travar o outro.
**Impacto**: médio. Permite ter sangramento e sobreposição ao mesmo tempo.

---

## D-36 · `fg-subtle` calibrado contra a superfície elevada
**Decisão**: `--color-fg-subtle` em navy passou de `#8b98b5` para `#9caac3`.
**Motivo**: painéis suspensos usam `surface-elevated` (`#1c3572`), mais clara que o canvas. O valor anterior passava no canvas (5.27) mas reprovava dentro do painel (4.03). Agora passa nos dois (6.5 e 4.97).
**Regra derivada**: token de texto sobre superfície escura é calibrado contra a superfície **elevada**, não só contra o canvas.
**Impacto**: médio. Segunda vez que este token reprova por ser medido contra o fundo errado.

---

## D-37 · Header em superfície própria, sem blur
**Decisão**: o header usa `--color-canvas-alt` (degrau tonal mais escuro que o conteúdo), luz no topo e filete na base, em dois estados de altura e elevação. Sem `backdrop-filter`.
**Motivo**: com `canvas` ele usava o mesmo navy do hero e se fundia com a abertura; a navegação parecia parte da arte, não uma camada de interface. Blur não resolveria: ele funde planos, e o problema era exatamente falta de separação. Glassmorphism também está vetado na direção da marca.
**Medido**: header `rgb(12,28,64)` contra hero `rgb(15,35,80)`; 80px no topo e 64px após rolar a 1440.
**Impacto**: alto. É a primeira coisa que se vê em qualquer rota.

---

## D-38 · `card-raised` removido do sistema
**Decisão**: cartão não interativo não recebe sombra. O utilitário `card-raised` deixou de existir.
**Motivo**: era sombra de repouso em oito cartões não clicáveis, e contradizia uma regra que o próprio sistema já tinha escrito ("só o que é alvo de navegação recebe sombra"). Somadas, produziam o efeito de página inteira flutuando, no qual elevação deixa de significar coisa alguma.
**Consequência**: `/contato` e `/bolsas` deixaram de usar cartão nas seções afetadas (viraram registro e glossário); `/professores` manteve o cartão e perdeu a sombra.
**Impacto**: médio. Devolve significado à elevação.

---

## D-39 · Animação nunca é o que torna o conteúdo visível
**Decisão**: nenhuma animação CSS de entrada pode partir de `opacity: 0` em conteúdo de página. A transição de rota anima só `transform`.
**Motivo**: descoberto na implementação. A primeira versão usava `animation … both` com `from { opacity: 0 }`, e num navegador com a renderização suspensa a medição devolveu `animationPlayState: "running"`, `currentTime: 0`, `opacity: "0"`: a página inteira invisível esperando um quadro que não vinha. Trocar o `fill-mode` para `none` não resolve, porque na fase ativa o keyframe vale de qualquer jeito.
**Relação com a D-21**: é o mesmo defeito por outra via. A D-21 proibiu `motion` no SSR; esta estende a regra ao CSS.
**Exceção**: o reveal por scroll e o painel do menu mobile podem esconder por opacidade, porque ambos vivem sob condição de JavaScript (`@media (scripting: enabled)` e um gatilho de botão) e têm o estado visível como padrão do HTML.
**Impacto**: alto. É regra de segurança de conteúdo, não de estética.

---

## D-40 · Trilho de margem precisa de `align-self: start`
**Decisão**: `.log-rail` declara `align-self: start` junto com `position: sticky`.
**Motivo**: o trilho é item de grade, e item de grade estica por padrão. A caixa tinha a altura da entrada inteira, então `sticky` não tinha curso e o trilho descia junto com o texto. Medido: o topo do trilho acompanhava o topo da entrada em qualquer posição de rolagem. O comportamento documentado desde a Etapa 1 nunca aconteceu.
**Como foi encontrado**: medição do retângulo em quatro posições de rolagem. `typecheck`, `lint` e `build` passavam, e a propriedade computada já era `sticky`.
**Impacto**: médio. Restaura a assinatura estrutural do site na leitura longa.

---

## D-41 · Cabeçalho interno tem duas composições, decididas pelo conteúdo
**Decisão**: `PageHeader` é uma coluna quando não recebe `children`, e duas colunas em `lg` quando recebe. `marcadores` (várias cores) existe só para o hub `/concursos`.
**Motivo**: as seis páginas internas abriam exatamente iguais. O corpo delas já era diferente; faltava diferenciar a abertura. O critério não é estético: quem tem carga a oferecer no cabeçalho (um CTA, a força do concurso) ganha a coluna da direita.
**Impacto**: médio. Sistema compartilhado, composição não compartilhada.

---

## D-42 · Lenis para rolagem suave (dependência nova)
**Decisão**: adicionado `lenis` (^1.3.26), montado em `RolagemSuave.tsx` no shell global.
**Motivo**: a rolagem nativa do desktop é discreta, e cada clique da roda salta um bloco fixo. A paralaxe entre planos (D-43) depende de posições intermediárias para ser lida como profundidade: com salto, o olho vê dois quadros e nenhuma distância.
**Escopo**: só a roda do mouse. Toque fica nativo (o `syncTouch` do Lenis é `false` por padrão, e a inércia do sistema operacional é melhor que qualquer reimplementação). Teclado e barra de rolagem seguem nativos.
**Segurança**: sob `prefers-reduced-motion: reduce` o Lenis não chega a ser instanciado, e a consulta é reavaliada em tempo real. Sem JavaScript, a rolagem é a nativa.
**Compatibilidade**: o Lenis escreve a posição com `behavior: "instant"`, então `position: sticky`, `scroll-padding-top` e as `animation-timeline` continuam funcionando sem ajuste. `html.lenis` recebe `scroll-behavior: auto` para que uma navegação por âncora não dispare uma rolagem suave nativa competindo com a dele.
**Custo**: ~3KB gzip, um `requestAnimationFrame` enquanto ativo.
**Impacto**: médio. É a única dependência de runtime além de `next`, `react` e `motion`.

---

## D-43 · Paralaxe por `animation-timeline`, e `plano-fundo` com `clip`
**Decisão**: a profundidade passou a ter componente de movimento. Planos diferentes percorrem cursos diferentes enquanto a seção atravessa a janela: fundo 40px a favor, marca d'água 120px a favor, conteúdo parado, painel do hero 32px contra.
**Motivo**: parado, o sistema de planos dependia de opacidade e sobreposição. Movimento diferencial é o cue de profundidade mais forte depois da oclusão.
**Implementação**: `animation-timeline: view()`, nativo, sem JavaScript, sem biblioteca, no compositor. Guardado por `@supports (animation-timeline: view())` **e** por `prefers-reduced-motion: no-preference`. A guarda de `@supports` não é detalhe: sem ela o navegador ignoraria só a linha do `animation-timeline` e rodaria a animação na linha do tempo do DOCUMENTO, fazendo tudo deslizar uma vez no carregamento e parar no lugar errado.
**Regra derivada**: plano de conteúdo não recebe paralaxe. A única exceção é bloco curto sem leitura corrida (o painel do hero); parágrafo nunca.
**Correção que isto exigiu**: `.plano-fundo` usava `overflow: hidden`, que cria container de ROLAGEM, e `view()` se amarra ao container de rolagem mais próximo. A paralaxe da grade nascia amarrada a uma div que não rola nunca, ou seja, inativa para sempre. Medido: a `source` da ViewTimeline vinha como `DIV` em vez de `HTML`. Trocado por `overflow: clip`, que recorta sem criar container. É a mesma lição da D-35, agora por outro motivo.
**Impacto**: alto para a percepção de profundidade, zero para o conteúdo.

---

## D-44 · Texto não selecionável, com exceção do contato
**Decisão**: `user-select: none` no `body`. `[data-selecionavel]`, `input` e `textarea` são exceção.
**Motivo**: pedido do cliente. A intenção é que o site leia como interface, não como documento.
**A exceção não é negociável**: o número do WhatsApp e o @ do Instagram continuam selecionáveis, porque copiar o contato é literalmente a ação que o site existe para provocar. Travar ali seria trocar estética por conversão. Campos de formulário entram por precaução: hoje não existem, e se existirem já nascem funcionando.
**Custo conhecido**: ninguém copia um trecho de texto do site para mandar a outra pessoa. É o preço da decisão, e está registrado aqui para não ser redescoberto como bug.
**Impacto**: médio, e reversível em uma regra.

---

## D-45 · Diagnóstico de concurso, calculadora e não formulário
**Decisão**: rota `/diagnostico` com quatro perguntas que apontam entre EsPCEx, AFA, EEAR e EFOMM.
**Motivo**: o Princípio 5 diz que a pessoa pensa "quero passar na EEAR", mas boa parte do público chega antes disso, sabendo só que quer carreira militar. Para ela o site oferecia uma tabela de cinco colunas, e comparar cinco colunas exige saber o que comparar.
**Não contraria a D-18**: nada é enviado, nada é armazenado, nada é pedido. Sem `fetch`, sem `localStorage`, sem nome, e-mail ou telefone. É calculadora no navegador; o site segue estático e sem backend. A diferença para um formulário de captura é a ordem: aqui a pessoa recebe a resposta primeiro, e o WhatsApp aparece depois, com o resultado já na mensagem.
**Fonte de dados**: `concursos.ts`, sempre. Patente derivada de `voceVira`, faixa etária extraída de `faixaEtaria`. Nenhuma tabela paralela, então não há como divergirem. A extração de idade falha **aberta**: padrão que não casa vira "sem restrição", nunca eliminação.
**Fora do menu principal**: a barra transborda com sete itens (D-28). Entra pelo hub de concursos como carga do cabeçalho (que por isso vira de duas colunas, D-41), pela Home e pelo rodapé.
**Verificação**: as 180 combinações de resposta exercitadas com invariantes, zero problemas. Dois defeitos corrigidos antes de ver a tela: a copy dizia "duas" em empates de três, e a idade sozinha resolvendo o caso era tratada como "sem resposta".
**Impacto**: médio. Primeira funcionalidade interativa do site, e a única página que responde a uma pergunta em vez de informar.

---

## D-46 · Vitest, e testes só onde eles ganham do navegador
**Decisão**: `vitest` como dependência de desenvolvimento, e `npm run check` passa a rodar `typecheck + lint + format:check + test`.
**Motivo**: o projeto tinha lógica pura relevante (pontuação do diagnóstico, resolução de intenção, invariantes de conteúdo) e **zero teste automatizado**. As regras invioláveis do `AGENTS.md` viviam como convenção: valiam enquanto alguém lembrasse.
**Sem `jsdom`, e isso é escolha**: comportamento de interface é verificado onde ele existe de verdade, medindo o DOM renderizado no navegador. Foi assim que apareceram o `--container-full` sombreando `w-full`, o trilho que nunca grudou e a paralaxe amarrada ao container errado; nenhum deles apareceria num DOM simulado. `jsdom` traria três dependências para simular mal o que a medição real faz bem.
**O que os testes cobrem**: as 180 combinações do diagnóstico com invariantes; os destinos e mensagens de conversão; e as regras 1, 2 e 17 do `AGENTS.md` transformadas em verificação (nada inventado, `DadoReferencia` disciplinado, sem travessão na copy). Mais o contrato de marcação das telas de erro.
**Verificação da própria suíte**: três violações foram plantadas de propósito (marca do livro isolada, `verifiedAt` inválido, travessão em copy, campo que deve ser nulo preenchido) e cada uma foi pega pelo teste correspondente. Teste que não sabe falhar é teatro.
**Efeito colateral**: `@types/node` subiu de ^20 para ^24, alinhando com o Node realmente em uso. Era requisito do vitest e já estava defasado.
**Impacto**: alto. É a primeira rede de segurança do projeto.

---

## D-47 · Fronteiras de erro com marca e com saída
**Decisão**: `src/app/error.tsx` e `src/app/global-error.tsx`.
**Motivo**: lacuna de resiliência (C-4). Qualquer exceção em componente cliente caía na tela padrão do Next: fundo branco, tipografia de sistema, nenhuma marca e nenhuma saída. Quem chegasse ali via um site quebrado sem sequer um caminho de volta, o que é pior que a falha em si.
**Duas portas, nesta ordem**: `reset()` primeiro, porque a maioria dos erros de renderização passa na segunda tentativa; WhatsApp depois, porque nenhuma falha de interface deve interromper a conversão.
**Não vaza mensagem nem pilha**: só o `digest`, que é curto e é o que localiza a ocorrência no log. `error.message` pode carregar caminho de arquivo.
**`global-error` não importa componente do site**, e isso é verificado por teste: um componente quebrado pode ter sido a causa da queda, e a tela de erro que o importasse cairia junto. É a única exceção à regra 12, pela mesma razão.
**Impacto**: médio. Não muda nada no caminho feliz, e muda tudo no dia em que quebrar.

---

## D-48 · Assets de marca derivados por script, nunca à mão
**Decisão**: `scripts/gerar-assets-marca.mjs` recolore e enquadra os recortes existentes para gerar os ícones do aplicativo e as versões claras usadas no Open Graph. Rodado com `npm run assets:marca`; a saída é versionada.
**Motivo**: o favicon era o do `create-next-app`, e passava por definitivo para quem olhasse a aba. E o `next/og` não passa por CSS, então lá a máscara alfa não tem como ser pintada por `currentColor`: precisa chegar já na cor certa.
**O que o script faz**: recolore e enquadra. É a MESMA operação que o site faz em tempo de execução (D-33), só que num momento em que não há CSS. Ele não redesenha, não vetoriza, não recorta silhueta e não inventa símbolo. A regra 15 continua inteira.
**Por que a marca completa e não a águia nos ícones**: a completa é 2.06:1 e a águia é 4.86:1; num quadrado a completa aproveita quase o dobro da altura. Recortar a águia para caber mudaria a silhueta da marca.
**Cada tamanho é renderizado da origem**, não reduzido a partir do maior: a marca é linha fina, e reduzir 512 para 16 apaga a linha. Medido, sobravam 10 pixels com tinta em 256; renderizando o 32 direto do original de 760px, são 91 em 1024.
**Limitação assumida**: a 16px continua sendo um bom navy com marca discreta, e não um símbolo legível. Isso só se resolve com o símbolo isolado que a lista de pendências pede ao cliente. Enquanto não vem, é honesto e é melhor que o ícone genérico do scaffold.
**Impacto**: médio. Tira um item da lista de bloqueios de publicação.

---

## D-49 · Imagem de Open Graph com a composição do site
**Decisão**: `src/lib/og.tsx` monta o cartão, e cada rota relevante declara o seu (`/`, `/diagnostico`, e uma por concurso).
**Motivo**: não é detalhe de SEO. Os dois canais de conversão são WhatsApp e DM do Instagram (D-18), e é exatamente ali que um link colado aparece como cartão. Sem imagem, sai uma tira de texto cinza no momento em que alguém está recomendando o curso.
**Composição**: campo navy com degrau tonal à direita, marca no topo, águia sangrando pela borda em opacidade baixa, régua de acento e assinatura. É o gesto do hero traduzido para 1200x630, não um cartão genérico.
**Tipografia**: fonte padrão do Satori, de propósito. Buscar as fontes do site na rede durante o build tornaria a build dependente de conexão para um resultado cosmético. E a marca COMPLETA já contém o wordmark "PRIME" como arte, então a tipografia da identidade está na imagem sem fonte nenhuma; o que sobra é texto de apoio, que em sans neutra fica mais adequado do que em serifada de display.
**Cores literais**: `src/lib/og.tsx` e o cartão de concurso são os dois únicos lugares do projeto com cor fixa, porque o Satori não resolve `var(--color-*)`. Os valores vêm de `tokens.css`.
**Sem `generateImageMetadata`**: ela existe para gerar várias imagens por rota, e aqui é uma só. Usá-la só acrescentava um segmento `/padrao` na URL e um segundo lugar para o tipo de `params` divergir.
**Impacto**: alto para conversão, zero para o site em si.

---

## D-50 · Dados estruturados que declaram só o que existe
**Decisão**: JSON-LD com `EducationalOrganization` e `WebSite` no layout, e `BreadcrumbList` nas páginas de concurso.
**Motivo**: a Prime Prep é curso presencial numa cidade específica, e quem procura "curso preparatório militar São Gabriel" precisa encontrá-la. Dado estruturado é como o buscador entende que o site é de uma organização de ensino que atende aquela região.
**A regra 1 é mais perigosa aqui**: `address`, `telephone`, `aggregateRating` ou `priceRange` inventados não são só desonestos; o buscador os trata como declaração formal da própria organização, e rendem penalização. Vinte campos proibidos estão travados por teste.
**`EducationalOrganization` e não `LocalBusiness`**: sem endereço confirmado, `LocalBusiness` ficaria incompleto justamente no campo que o define. E o que descreve a Prime Prep é ensinar, não ter ponto comercial.
**Sem `Course` por concurso**: `Course` pede `hasCourseInstance` com data e modalidade, e as datas dependem de edital. Sem isso seria marcação vazia.
**Trilha só onde há profundidade**: as páginas de concurso. "Início > Contato" não informa nada que a URL já não diga.
**Impacto**: médio, e cresce quando a indexação for liberada.

---

## D-51 · `/dev/foundation` não existe em produção
**Decisão**: a folha de referência do design system responde 404 fora de desenvolvimento, salvo com `NEXT_PUBLIC_MOSTRAR_DEV=true`.
**Motivo**: estava `noindex` e fora do sitemap, mas continuava servida a quem digitasse a URL, e dependia de alguém lembrar de apagá-la antes do deploy. É o tipo de pendência que sobrevive ao lançamento. Uma folha de tokens exposta é a estrutura interna do projeto à mostra.
**Verificado**: `next build && next start` responde 404 na rota, 200 nas demais.
**Impacto**: baixo tecnicamente. Tira outro item da lista de bloqueios de publicação.

---

## D-52 · Cabeçalhos de segurança, e o CSP que se pode ter
**Decisão**: `next.config.ts` passa a enviar `Content-Security-Policy` (só `frame-ancestors`, `base-uri` e `form-action`), `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`, e desliga o `X-Powered-By`.
**Motivo, item a item, em vez de "boa prática"**: `frame-ancestors 'none'` impede que alguém enquadre o site dentro de outro e cole o próprio WhatsApp por cima, que é o risco concreto para um preparatório. `base-uri 'self'` impede que um `<base>` injetado reescreva o destino de todos os links relativos, CTAs incluídos. `form-action 'none'` porque o site não tem formulário e não terá (D-18): se um aparecer sem passar por decisão, ele quebra, e é o comportamento desejado. `Referrer-Policy` importa porque a pessoa sai daqui para o WhatsApp, e o caminho percorrido antes não precisa viajar junto.
**SEM `script-src`, e isso é decisão**: uma `script-src` séria no App Router exige nonce por requisição, o que obriga renderização dinâmica e derrubaria o site de estático para SSR. A troca não compensa num site sem sessão, sem formulário e sem dado de usuário. Registrado para não ser "descoberto" como falha depois.
**Efeito colateral relevante**: `frame-ancestors 'none'` quebrou a própria ferramenta de auditoria, que media contraste e overflow carregando as rotas em iframes. Não houve falso verde (o `contentDocument` vem `null`, então a varredura falha em vez de medir vazio), mas a técnica mudou: agora a auditoria emula o viewport na aba real e navega, o que aliás mede o documento de topo com os cabeçalhos de verdade aplicados, e é mais fiel que o iframe era.
**Impacto**: médio.

---

## D-53 · Assets de build fora de `public/`
**Decisão**: as marcas claras usadas pelo Open Graph moram em `assets/brand/derivados/`, não em `public/`.
**Motivo**: são lidas só em tempo de build, para virar data URI dentro da imagem gerada. Em `public/` seriam servidas publicamente e baixadas por ninguém: 172KB de peso morto no deploy, mais uma cópia da marca acessível por URL crua, sem passar por `Wordmark.tsx`, que é o ponto único de aplicação da identidade.
**Travado por teste**: existe um teste que falha se elas voltarem para `public/`.
**Impacto**: baixo, e é higiene que só fica mais cara depois.

---

## D-54 · Máscaras da marca em AVIF, com fallback por `@supports`
**Decisão**: cada máscara passa a existir em PNG e AVIF. O CSS declara o PNG na regra base e o AVIF dentro de um `@supports`; a URL saiu do `style` inline e virou classe em `utilities.css`.
**Motivo**: medido na build de produção, a Home pesava 565KB, dos quais 141KB eram as duas máscaras PNG. Era o segundo maior item depois das fontes. Em AVIF a Home caiu para 465KB, e as imagens de 141KB para 41KB.
**Por que q85 e não q70**: o que está sendo comprimido é o canal ALFA, que aqui não é transparência acessória, é a própria arte. Medido pixel a pixel contra o PNG: em q85 o erro médio do alfa é 0.5 em 255, o máximo é 8, e nenhum pixel passa de 8. Em q70 o máximo sobe para 14. A diferença de tamanho entre os dois é de uns 5KB por arquivo, e não vale arriscar borda suja numa marca.
**Por que `@supports` e não cascata**: a forma óbvia seria declarar o PNG e sobrescrever com `image-set()`. **Não funciona**: o Lightning CSS considera a primeira declaração redundante e a apaga. Verificado no CSS compilado, sobrava só a `image-set`. E o modo de falhar é feio: o elemento é pintado com `background-color: currentColor`, então sem `mask-image` nenhuma aparece um retângulo sólido da cor do texto no lugar da marca. Um Safari 16, que entende `mask-image` mas não entende `type()` dentro de `image-set()`, cairia exatamente nisso.
**Consequência de arquitetura**: `Wordmark.tsx` deixa de conter a URL e passa a conter só a proporção e a classe. Continua sendo o ponto único de aplicação da marca, e agora há teste que falha se outro componente referenciar a classe direto.
**Verificação**: estrutura travada por teste (PNG na base, AVIF só no condicional, PNG sempre presente dentro da `image-set`), e a regressão foi plantada de propósito para confirmar que os testes a pegam.
**Impacto**: alto para peso, zero para aparência.

---

## D-55 · Itálico do display fora da precarga
**Decisão**: `Fraunces` passa a ser importado em duas chamadas, romano e itálico, com `preload: false` no itálico e uma família própria (`--font-display-italico`).
**Motivo**: medido na build de produção, três fontes eram precarregadas somando 193KB, e o itálico era 80KB deles. Ele nunca aparece acima da dobra: vive no nome por extenso dos concursos, na tabela comparativa e na ressalva do rodapé.
**Ganho real, medido**: as duas fontes precarregadas começam a ser buscadas em 7ms e 8ms; o itálico passou para 12ms, junto com o Cinzel. Os 113KB que o texto precisa primeiro deixam de disputar a primeira conexão com 193KB.
**O que NÃO mudou, e está registrado para não virar promessa falsa**: o arquivo continua sendo baixado em toda página. Verificado numa rota sem um único elemento itálico (`getComputedStyle` em todos os nós, zero itálicos): ele é buscado assim mesmo, com `initiatorType: "css"`. O `next/font` dá o mesmo nome de família às duas chamadas, e o navegador acaba buscando as duas faces quando a família entra em uso. **O ganho é de ordem, não de bytes.**
**Uma reversão pelo caminho**: cheguei a tirar o itálico da ressalva do rodapé achando que economizaria os 80KB em todas as rotas. A medição mostrou que não economiza nada, então a mudança foi revertida: ela não tinha outro motivo além de um ganho que não existia.
**Família própria é obrigatória**: apontar `text-editorial-italic` para a família romana faria o navegador sintetizar um itálico falso, inclinando o desenho romano, o que numa serifada de display é visivelmente errado.
**Impacto**: baixo a médio, e honesto sobre o tamanho.

---

## D-56 · `motion` removido: a última dependência de animação
**Decisão**: a biblioteca `motion` saiu do projeto. O painel do menu mobile entra por CSS e fecha na hora. `src/lib/motion.ts` foi apagado junto, porque só existia para ela.
**Motivo**: era usada em UM arquivo, para UMA animação, e custava **46KB comprimidos baixados em toda página**, medidos na build de produção. Num site que declara em `PRODUCT.md` atender conexão lenta e aparelho modesto, isso não se sustenta. A doutrina já era essa desde a D-21 ("reveal por scroll é CSS, nunca `motion`"); aqui ela terminou de valer.
**A saída animada era o que exigia a biblioteca**: animar a saída obriga a manter o elemento montado depois do fim da intenção, e é para isso que serve o `AnimatePresence`. Fechar na hora é o que menu nativo faz, e lê como resposta, não como corte.
**Ganho medido**: JavaScript da Home de 187,5KB para 147,9KB. Somado ao AVIF (D-54), a Home foi de 565KB para cerca de 425KB, 25% mais leve.
**Achado no caminho, e é o mais importante**: a primeira versão da animação em CSS partia de `opacity: 0`, com a justificativa de que o painel só existe depois de um clique e portanto teria JavaScript e quadros garantidos. **A justificativa estava errada.** Medido com a renderização suspensa: o painel abriu com `animationPlayState: "running"`, `opacity: 0`, e ficou assim. Ter JavaScript não garante quadro de animação. As animações do menu passaram a ser só deslocamento, e com isso a **lista de exceções da regra 18 deixou de existir**: nenhuma animação do projeto esconde conteúdo.
**Dependências de runtime agora**: `next`, `react`, `react-dom` e `lenis`.
**Impacto**: alto para peso, e melhora a regra 18 em vez de abrir exceção nela.

---

## D-57 · Matéria nas superfícies: grão de papel e luz de cima
**Decisão**: `[data-surface]` passa a pintar duas camadas além da cor: um decaimento de luz na borda superior e um grão de papel ladrilhado, este último em `background-blend-mode: overlay`.
**Motivo**: o north star do projeto é um diário de bordo, e as superfícies eram cor chapada. Grão dá matéria à folha; a luz faz o site inteiro concordar com uma coisa só, que a iluminação vem de cima. Sem ela, o relevo do botão, o filete claro no topo do header e a sombra de costura estavam cada um dizendo "luz de cima" sozinho, contra um fundo que não dizia nada.
**Por que um PNG gerado e não `feTurbulence` em SVG embutido**, que seria zero arquivo: `feTurbulence` é implementado de forma diferente por cada renderizador, e a calibragem depende de números exatos. Medido no rasterizador local, a média do ruído saía em **187, não em 128**, o que sob composição empurrava toda superfície para o cinza: o pergaminho escurecia 16 níveis e o navy clareava 19. Calibrar contra um renderizador e servir para outro não é calibrar.
**`overlay` é o que torna o grão seguro**: o ruído gerado tem média exatamente 128, e em `overlay` cinza médio é a identidade. Medido depois da correção: deslocamento de 0,25 nível e desvio de 2, que é o grão. Dois arquivos, porque `overlay` amplifica muito mais sobre fundo escuro.
**A altura da luz é fixa em 240px**, e é isso que a mantém sendo luz: com `background-size: auto` o decaimento se estica na altura do elemento, e numa seção de 2000px viraria uma lavagem cromática, que é o "fundo em gradiente" vetado pela regra 8.
**Custo**: 2,5KB, dois arquivos de 64x64 com cinco níveis quantizados. Ruído puro não comprime; o tamanho veio de reduzir ladrilho e níveis, e nenhum dos dois se percebe nessa amplitude.
**Impacto**: alto para a percepção de material, 2,5KB de peso, zero em contraste.

---

## D-58 · Costura, relevo e cor de contexto
**Decisão**: quatro tratamentos que usam o sistema que já existia em vez de acrescentar vocabulário novo.
**Costura entre superfícies**: onde duas superfícies diferentes se encontram, a de baixo recebe um filete e uma sombra interna curta, como duas folhas empilhadas. As seis combinações estão escritas uma a uma porque CSS não compara valor de atributo entre irmãos, e `[data-surface] + [data-surface]` pegaria também bone depois de bone, que é a mesma folha. O rodapé precisa de seletor próprio: ele não é irmão das seções, e era a única das cinco transições da Home que ficava sem.
**Relevo do botão primário**: é o elemento mais clicado do site e o ouro da marca, que no sistema significa mérito, e era um retângulo chapado. Gradiente vertical curto mais filete claro em cima e escuro embaixo. Pressionado, a luz inverte. Não é glow: nada desfoca para fora da caixa. Medido: a pior parada do gradiente dá 6,06:1 com o texto do botão, contra 7,5 do chapado, e o mínimo é 4,5.
**Cor de contexto no hover do cartão**: os cartões de concurso já declaravam `--concurso`, usada só no losango. Trazê-la para a borda do hover transforma o realce em informação: antes de clicar, a pessoa vê de qual escola é o cartão.
**Guia de leitura na tabela comparativa**: seis colunas, e acompanhar uma linha até o fim é onde se perde o dedo. O realce usa a cor daquela força. Alfa baixíssimo e sem mudança de cursor, de propósito: a linha inteira não é clicável, e realce forte prometeria um alvo que não existe.
**Impacto**: médio, e todo ele em cima de tokens e do escopo de superfície que já existiam.


## D-59 · Fuga: a tinta cai onde a página termina
**Decisão**: a marca d'água e o numeral de registro perdem densidade na direção da borda em que são cortados, em vez de terminarem num corte reto.
**A marca d'água**: a águia sangra para fora da seção, e o `overflow-x: clip` a guilhotinava no meio da asa. Agora a densidade cai na direção do sangramento, então a marca lê como passando POR BAIXO da página em vez de colada em cima dela. Só onde o corte é assimétrico: no CTA final a águia é centralizada, acima de ~500px nada nela é cortado, e abaixo disso o corte é igual dos dois lados, na ponta da asa, que já afina sozinha. Simulado em 320px, com fuga e sem são quase indistinguíveis, então ali fuga seria custo sem efeito. O início em 60% é medido, não escolhido: a cabeça fica em torno de 63% da largura do recorte e é ela que carrega o reconhecimento.
**O numeral**: a densidade cai da cabeça para a base. Vale por contraste antes de valer por matéria: a metade de baixo é exatamente onde o texto cruza o numeral, porque ele começa 2,75rem acima do conteúdo, e tirar tinta ali só pode melhorar o pior par medido.
**A pintura da máscara virou gradiente**, mesmo quando chapada. `background-image` é desenhado por cima de `background-color`, então uma pintura com parte transparente deixaria a cor chapada aparecer por baixo e a fuga não existiria. Com a cor saindo de um lugar só, `--marca-pintura` troca a pintura inteira.
**O numeral é máscara, e não `background-clip: text`.** A primeira versão recortava um gradiente no texto, e o CSS COMPILADO mostrou o defeito: o Lightning precisa emitir fallback para `color-mix`, e para isso resolveu `var(--color-fg)` no `:root`, congelando navy dentro do gradiente. O numeral vive nas três superfícies. A máscara não pinta nada, só remove alfa, então a cor continua resolvendo no elemento (D-34). De quebra some o `color: transparent`, que faria `currentColor` resolver para transparente ali dentro.
**Recusado**: baixo-relevo no numeral. Renderizado no tamanho real vira contorno vazado: perde a massa que o faz funcionar como peso de margem e ainda põe duas sombras atrás de texto. É a Regra da Área outra vez.
**Impacto**: baixo. Nenhum arquivo novo, nenhuma dependência.

## D-60 · A régua de margem, e o filete que viaja
**Decisão**: a entrada de registro ganha uma régua contínua na coluna de margem, e o filete do trilho fica curto e dourado.
**O defeito**: o trilho tinha `border-left` e ele deveria ser a régua de margem do razão. Medido: numa entrada de 1920px, o filete tinha 44px, ou seja, 2% da altura. `align-self: start`, que entrou para consertar o `sticky` (D-40), encolheu a caixa do trilho para o tamanho do conteúdo e o filete junto. A coluna existia na grade e não existia na página.
**A divisão é o que torna isto informação e não enfeite**: a régua é contínua e marca a coluna; o filete é curto, dourado e gruda no topo enquanto se lê, então responde "onde estou dentro desta entrada". Medido: numa entrada de 1920px ele percorre 1876px sobre a régua. Mesmo vocabulário do marcador de item ativo do menu e da linha de leitura do header. O dourado amarra ao número do trilho, que já era `text-accent`.
**1px nos dois**, e é o que faz alinharem na mesma coluna de pixel (medido: o trilho começa em x=0 da entrada). Em 2px, renderizado no tamanho real, o dourado passa a ler como a barra colorida de cartão que a direção veta.
**`opacity` e não `color-mix` na régua**, pelo mesmo motivo do numeral em D-59.
**Abaixo de lg não existe**: ali o trilho é horizontal e a coluna de margem não é a composição.
**Impacto**: baixo, e é o efeito com mais área da rodada, porque toda seção de leitura do site usa `LogEntry`.

## D-61 · O resultado do diagnóstico assenta, e o toque tem resposta
**Decisão**: o único conteúdo do site que aparece em resposta a uma ação passa a entrar com movimento, e dois controles ganham estado de pressionado.
**O resultado**: aparecia em silêncio, e trocar uma resposta reescrevia o bloco no mesmo lugar sem nada avisar. A chave de remontagem é o TEXTO QUE A PESSOA LÊ, não as respostas: trocar uma resposta que não muda a recomendação não replica a entrada. Amarrar às respostas faria o bloco assentar a cada toque, que é animação de template.
**A regra 18 provada em campo**: medido no navegador com o quadro suspenso, que é o caso da D-39, o bloco fica com `opacity: 1` e `transform: translateY(18px)`. Nasce baixo e legível, nunca invisível. É a diferença que a regra existe para garantir.
**Toque**: em ponteiro grosso não existe hover, e o site é aberto majoritariamente no celular. `btn-ghost` não tinha fundo nem borda, então não havia o que mudar: agora afunda 1px e escurece, igual ao secundário. `link-filete` desenha o filete também em `:active`, então o mesmo traço que é a resposta do ponteiro passa a ser a resposta do dedo.
**Impacto**: baixo.

## D-62 · Folha de impressão, e o defeito que ela conserta
**Decisão**: o site ganha `@media print`, e o motivo é um defeito, não acabamento.
**O defeito**: o reveal por scroll esconde por opacidade sob `scripting: enabled`, e nada revela o que nunca entrou na janela. Medido em `/metodologia` recém-carregada: as **sete** entradas de reveal estavam com `opacity: 0`. Imprimir a página nesse estado produzia um documento com quase todo o conteúdo em branco, e nada na tela denunciava. É a regra 18 num terceiro disfarce: a primeira vez foi JavaScript ausente (D-21), a segunda foi quadro de animação que não veio (D-39), e a terceira é um meio que não rola.
**A superfície é o papel**: nenhuma superfície pinta fundo, então o branco da folha é o `canvas` e não se gasta tinta com bloco chapado. Grão, luz de cima e costura saem juntos, porque os três são `background-image`.
**A tinta volta a ser escura em navy e ink**: ali o texto é osso, que sobre papel branco é invisível. Os valores são os mesmos que o pergaminho já usa. `--color-arma-*` fica como está de propósito: o losango tem 7px, a impressora provavelmente nem o pinta, e a cor dele nunca informa sozinha porque a sigla ao lado carrega o significado em texto.
**O que sai**: cabeçalho (interface impressa é ruído), planos de fundo e intermediário (campo gráfico, marca d'água e numeral são cenário, não conteúdo) e os CTAs. Botão no papel é controle morto, e o rótulo dele é a **mensagem** que seria enviada, não uma informação. O contato continua impresso: o número e o @ estão em texto no rodapé.
**Verificado**: em quatro rotas, com as regras de impressão forçadas e as transições desligadas (que é o que a impressão faz), zero falha de contraste, zero overflow, nove botões escondidos, todo reveal em `opacity: 1`, e o número do WhatsApp impresso em navy-600 a 18px.
**A armadilha da medição**: a primeira leitura acusou o número do WhatsApp em 2,32:1. Era artefato: o painel suspende a renderização e a `CSSTransition` de cor ficava parada em `currentTime: 0`, ou seja, na cor de origem. Com a transição desligada, a cor é navy-600. Foi o segundo falso positivo desta sessão com a mesma causa.
**Impacto**: baixo em código, alto em correção. Nenhum arquivo novo.

## D-63 · Alto contraste forçado: as quatro marcas que sumiam
**Decisão**: um bloco `@media (forced-colors: active)` que devolve cor de sistema às marcas desenhadas por `background-color`.
**O defeito**: o modo força `background-color` e `color` para as cores do sistema e ignora o valor do autor, **exceto quando esse valor é ele mesmo uma cor de sistema**. Quatro marcas deste site são desenhadas com `background-color` (o losango, o marcador de item ativo da navegação, o filete do link e a linha de leitura): as quatro eram pintadas com a cor do texto e passavam a ser pintadas com a cor do fundo, ou seja, desapareciam.
**A que importa é o losango.** No diagnóstico o rádio é `sr-only` e o losango é o **único** sinal visual de qual opção está marcada. Somado a isso, a borda de todos os cartões é forçada para a mesma cor, então "borda dourada na marcada" também deixa de distinguir. Sem a regra, quem usa alto contraste respondia o diagnóstico sem ver o que tinha escolhido. O leitor de tela nunca esteve em risco: o rádio é real e `checked`.
**`opacity` não é forçada**, e é ela que continua separando marcado de não marcado depois que a cor vira a mesma. Medido no navegador (com as transições desligadas, ver D-62): marcado 1, não marcado 0,3.
**Matéria sai no modo**: grão, luz e relevo do botão são `background-image`, que o modo não força. Sobre uma cor de sistema forçada eles viram textura sem propósito e o ouro da marca disputa com `ButtonFace`. Todos neutralizados.
**Efeito colateral bem-vindo da D-59**: a marca deixou de ser `background-color: currentColor` e passou a ser `background-image` com gradiente. `background-image` não é forçada, então a marca continua sendo pintada pela cor corrente, que no modo é a do texto. A troca foi feita por outro motivo e consertou esta também.
**NÃO OBSERVADO NO MODO**: não houve como emular alto contraste no navegador desta sessão. O que está aqui segue o comportamento especificado e a forma documentada de lidar com ele, e o risco é limitado por construção: fora do modo, nada disto existe.
**Impacto**: baixo em código. Nenhum arquivo novo.

## D-64 · `prefers-contrast: more` leva o site a AAA
**Decisão**: quando alguém pede mais contraste, o site sobe de AA para AAA e tira de trás do texto tudo que existe para dar profundidade.
**O ponto de partida**, medido por superfície (bone / navy / ink): `fg` 15,09 / 14,61 / 18,31; `fg-muted` 7,58 / 9,45 / 8,26; `fg-subtle` 5,06 / 6,50 / 5,28; `accent` 4,88 / 7,50 / 9,40. Ou seja, o site passa em AA em toda parte, e os pares abaixo de 7:1 eram o `fg-subtle` nas três e o ouro sobre pergaminho.
**O tom mais fraco sobe um degrau**: `fg-subtle` vira `fg-muted`, e o pior par passa de 5,06 para 7,58.
**O ouro sobre pergaminho** ganha `--color-gold-800` (#644e18, 7,16:1). Não é cor nova de marca: é o mesmo tom da rampa, escurecido, e existe só para este bloco. Em navy e ink o ouro claro já dá 7,5 e 9,4, então lá nada muda.
**A regra do degrau tonal, e o verbo é INVERTER**: um degrau que anda **na direção da cor do texto** fecha a distância entre os dois e custa contraste. Medido nas duas direções: na Home o `fg-muted` num painel afundado dava 6,81 em vez de 7,58, e em `/concursos` o `fg` num cartão elevado dava 6,85 em vez de 14,61. A primeira versão colapsava esses degraus na superfície; funcionava para o contraste e cobrava caro, porque some o zebrado da tabela comparativa, que é apoio de leitura de linha e é exatamente o que alguém pedindo mais contraste também precisa. Invertido, o degrau continua existindo, do mesmo tamanho, e passa a **afastar** o fundo da cor do texto: o zebrado fica, a profundidade fica, e o contraste sobe. Os degraus que já apontavam para longe do texto não são tocados.
**Sai o que fica atrás do texto**: numeral de registro, marca d'água e campo gráfico. É o custo declarado da profundidade, e quem pede mais contraste está dizendo que não quer pagá-lo. Grão e luz saem junto, por serem `background-image`; a costura fica, por ser `box-shadow` e por separar em vez de sujar.
**Verificado**: nove rotas, com o bloco forçado no navegador e as transições desligadas, zero par abaixo de 7:1 (4,5 para texto grande), e o zebrado da tabela continua alternando. Três rodadas: a primeira passou em sete rotas e falhou por 0,19 e 0,15 em duas, e as duas falhas eram degrau tonal, uma em cada direção; a segunda consertou colapsando e apagou o zebrado; a terceira inverteu.
**Impacto**: baixo em código, um token novo. Nada disto existe fora do modo.

## D-65 · `prefers-reduced-transparency`: as mesmas três, por outro motivo
**Decisão**: o mesmo esconder de `prefers-contrast: more` responde também a `prefers-reduced-transparency: reduce`.
**Por que o bloco é curto**: o site não tem vidro nem desfoque, porque glassmorphism está vetado na direção (regra 8). O que ele tem são três coisas que existem **por baixo** do texto e só funcionam por serem translúcidas: o numeral de registro (4,5%), a marca d'água (5,5%) e o campo gráfico da abertura.
**São exatamente as mesmas três do bloco de contraste, e o motivo é diferente**: lá elas saem por custarem contraste, aqui por serem o único lugar do site onde conteúdo aparece **através** de outra coisa. O pedido é o mesmo e a resposta também, e um teste garante que as duas listas não divirjam em silêncio.
**Impacto**: mínimo. Seis linhas.

## D-66 · O cartão de Open Graph tinha uma emenda no meio
**Decisão**: o degrau tonal do cartão deixa de ser um retângulo com aresta e passa a ser uma queda de densidade na borda por onde a águia sai.
**O defeito, visto e não deduzido**: o cartão tinha um retângulo de `navyEscuro` cobrindo 42% da direita, com a intenção de reproduzir o degrau tonal que separa o header do conteúdo no site. Renderizado, ele não lia como plano: lia como uma **emenda vertical no meio do cartão**, cortando a águia ao meio. Costura sem filete é troca de cor abrupta, que é exatamente o que a D-58 consertou no site; e aqui não havia nem o que a costura separasse, porque os dois lados são a mesma composição. Era enfeite que parecia defeito, no artefato mais compartilhado do site.
**A correção faz dois trabalhos com uma coisa só**: o cartão escurece na direção da borda por onde a águia sai. A asa se dissolve em vez de ser guilhotinada pelo corte de 1200px (é a fuga da D-59), e o degrau tonal continua existindo, sem aresta.
**Por que 30% e não mais**: com 62% a queda começava antes da cabeça da águia e apagava justamente o que identifica a marca; sobrava uma asa solta no meio do cartão. É a mesma regra da fuga no site, onde a queda só começa em 60% porque a cabeça fica em 63%.
**Duas coisas medidas sobre o Satori**, nenhuma documentada, cada uma custou uma rodada: (1) `transparent` dentro de `linear-gradient` sai errado, escurecendo até o meio da caixa e **clareando de volta** na borda, igual em toda altura, ou seja, não é ângulo; com as duas pontas escritas em `rgba()` o degrau fica monótono, com salto máximo de 2 níveis entre pixels vizinhos. (2) O degrau satura em torno de meio caminho entre `navy` e `navyEscuro` mesmo com a parada final em alfa 1 (medido: 12,28,64 contra 9,21,49 pedidos); com a águia já em 10% de opacidade, meio degrau dissolve o bastante.
**O método**: foi a primeira vez nesta sequência em que houve como **olhar o artefato final**. As páginas não renderizavam no painel, mas o endpoint de Open Graph devolve um PNG, e um PNG se lê. Sete iterações, cada uma medida no perfil de pixels e olhada.
**Impacto**: baixo em código, alto em percepção: é o que aparece quando alguém cola o link no WhatsApp, que é o canal de conversão do site.

## D-67 · O ícone de aba usa a wordmark, e isso foi medido
**Decisão**: `icon.png` (32px) passa a sair do recorte `wordmark`; os tamanhos grandes continuam na `completa`.
**Como foi decidido**: olhando, não argumentando. Os três recortes foram renderizados em 16 e 32px e ampliados lado a lado. Em 32px a `completa` mostra um "PRIME" ilegível sob a águia, a `wordmark` mostra "PRIME" nítido, e a `aguia` mostra uma silhueta limpa sem o nome. Em 16px a `completa` é borrão, a `wordmark` é textura e a `aguia` ainda lê como asa.
**Por que a completa perdia, e é estrutural**: ela empilha três elementos (águia, PRIME, livro) na mesma altura em que a wordmark empilha dois, então cada um recebe menos da metade dos pixels. A escolha anterior era defensável no papel (2.06:1 aproveita mais do quadrado que 4.86:1) e errada na tela.
**Não é exceção à regra da marca, é a regra aplicada**: "quando o espaço não comporta a águia, use wordmark" (`Wordmark.tsx`). Um quadrado de 32px não comporta 4.86:1, e variar a aplicação por papel é o que a regra 15 pede. Nada foi redesenhado nem recortado: o script só reenquadra recortes que já existiam, como manda a regra 19.
**O que continua pendente**: a 16px nenhum recorte de 2:1 se lê, porque a marca ocupa metade da altura do quadrado por definição. Só um símbolo quadrado resolve, e ele continua na lista do cliente. A diferença é que agora a pendência está medida em vez de suposta.
**Impacto**: baixo, e é o que aparece na aba do navegador em toda visita.
