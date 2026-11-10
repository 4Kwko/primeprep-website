# Tradução da Marca para Web — Prime Prep
FASE: PLANEJAMENTO

Premissa central: **o site não é um post de Instagram esticado.** As peças são superfícies fechadas, de leitura única e distância curta. O site é uma superfície longa, escaneável, responsiva e navegável. A identidade migra pelo **sistema** (cor, tipo, hierarquia, ornamento pontual), não pela **composição**.

## 1. Sistema visual proposto para web

### 1.1 Cor
- **Navy** é a cor da marca, não o fundo obrigatório de tudo. Uso: hero, footer, faixas de destaque e páginas de concurso.
- **Off-white** é o fundo de leitura padrão para conteúdo longo (metodologia, FAQ, blog, páginas de concursos).
- **Ritmo cromático alternado**: navy → claro → claro → navy → claro → navy (footer). Isso cria respiro e evita fadiga.
- **Dourado ≤5% da área** de qualquer tela. Papéis permitidos: borda de CTA primário, ícones, hairlines, sublinhado de palavra-chave, ativo de navegação, marcador de lista.
- **Dourado nunca**: em parágrafos, em texto abaixo de 18px sobre navy, como fundo de bloco grande, em gradientes.
- Texto de corpo sobre navy usa azul-claro dessaturado (não branco puro) para reduzir vibração.
- Meta de contraste: **AA em tudo, AAA em corpo**. Verificar dourado sobre navy — provavelmente só aprova em tamanhos grandes/bold.

### 1.2 Tipografia
- **Serifada display** apenas em: wordmark, títulos de seção (h1/h2), números de destaque, rótulos de CTA. Peso regular/medium, nunca light em tamanhos pequenos.
- **Versaletes/small caps**: exclusivo de eyebrows e rótulos curtos, nunca em frases longas.
- **Sans geométrica** em todo o corpo, UI, formulários, tabelas, navegação.
- **Tracking largo** só em rótulos de até ~4 palavras.
- **Itálico serifado** para o nome por extenso de cada concurso e para citações — herança direta das peças.
- Escala tipográfica com salto claro entre h1/h2/h3; hierarquia por **tamanho + cor + espaço**, não por caixas.
- Corpo em 17–19px desktop, altura de linha 1.6–1.75, medida de 62–72 caracteres.

### 1.3 Ornamento
- A moldura completa **não** vai para o site.
- Destilar em três tokens:
  1. **Divisor de seção**: filete fino com losango central. Uso máximo: 1 por dobra, e não em toda seção.
  2. **Bullet losango**: marcadores de lista e âncoras de título.
  3. **Canto ornamental**: apenas em 1–2 superfícies especiais (hero e/ou card de destaque), em opacidade reduzida.
- **Águia em marca d'água**: hero e footer, opacidade 4–6%, sempre atrás de área sem texto denso.
- **Textura de linho**: no máximo em duas superfícies navy, quase imperceptível.
- Regra dura: **nunca ornamento + textura + marca d'água na mesma seção.**

### 1.4 Superfícies e cards
- Cards com **borda de 1px hairline** e fundo levemente elevado — não sombras pesadas.
- Raio pequeno e consistente (8–12px), coerente com o QR/mockup das peças.
- Hover: elevação sutil + borda passa a dourada. Nada de escala grande ou glow.
- Cards de professor: retrato, nome em serifada, disciplina em rótulo caixa alta, credenciais em lista curta.

### 1.5 Botões
- **Primário**: fundo dourado sólido com texto navy **ou** outline dourado sobre navy — decidir um só e manter. Recomendação: sólido no CTA principal da dobra, outline nos secundários (mantém a herança das peças e resolve conversão).
- **Secundário**: outline branco/navy, sem preenchimento.
- **Terciário**: link com sublinhado dourado no hover.
- Rótulos curtos, caixa alta, tracking moderado.

### 1.6 Ícones
- Linha, traço uniforme (1.5px), cantos suaves, estilo geométrico — exatamente a família das peças.
- Monocromáticos: branco sobre navy, navy sobre claro; dourado só em destaques.
- Sem ícones preenchidos, sem emoji, sem ilustrações 3D.

### 1.7 Motion
- Discreto e curto: fade + translate de 8–16px, 200–400ms, easing suave.
- Reveal on scroll uma vez por seção, nunca elemento a elemento em cascata longa.
- Header com transição de estado ao rolar.
- Contadores/números podem animar uma vez.
- **Sem** parallax pesado, carrosséis automáticos rápidos, marquee de logos, cursor customizado.
- Respeitar `prefers-reduced-motion`.

## 2. O que MANTER
- Azul-marinho como cor-âncora e assinatura imediata.
- Dourado escasso e estratégico.
- Par serifada + sans e o contraste display/itálico.
- Losango e filete como assinatura gráfica.
- Águia + livro como símbolo central.
- Ícones outline finos.
- Tom de CTA convidativo, não agressivo.
- Simetria nas peças institucionais (hero, footer, seção de manifesto).
- Uso de brasões oficiais nas páginas de concurso.
- Rigor e organização da tabela comparativa.

## 3. O que ADAPTAR
| Nas peças | No site |
|---|---|
| Moldura ornamental integral | divisores + cantos pontuais |
| Fundo navy em tudo | ritmo navy ↔ off-white |
| Sans condensada pesada em títulos | serifada display + sans regular |
| Densidade de carrossel | blocos escaneáveis, listas curtas, tabelas |
| Composição centralizada sempre | centralizada no hero/manifesto, alinhada à esquerda no conteúdo |
| Tabela comparativa estática | componente responsivo (tabela no desktop, cards no mobile), com filtro por concurso |
| Cartão de contato | seção/página de contato com WhatsApp, Instagram e formulário |
| Peça do chatbot | bloco de CTA de atendimento, sem mockup literal de celular |
| Brasões espalhados | selos consistentes, tamanho normalizado, sempre no mesmo lugar do card |

## 4. O que EVITAR
- Moldura ornamental envolvendo a página.
- Dourado dominante, gradiente dourado, texto de corpo dourado.
- Site inteiro escuro sem alívio.
- Camuflagem, estêncil, tipografia militar caricatural, patentes falsas.
- Estética de infoproduto: contagem regressiva, "últimas vagas", setas amarelas, badges de urgência.
- Estética gamer: neon, glassmorphism forte, glow.
- Cara de template genérico de cursinho (fotos de banco de imagem sorridentes, azul-ciano, blobs).
- Excesso de motion, parallax, animação por item.
- Texturas visíveis e repetitivas.
- Falta de respiro entre seções.
- Serifada leve em corpo de texto.

## 5. Recomendações de UI por área

**Header** — fixo, altura enxuta, fundo navy translúcido com blur ao rolar; logo horizontal reduzido (águia + wordmark); 5–6 itens; "Concursos" com dropdown; CTA de WhatsApp em outline dourado à direita; menu mobile em painel full-screen navy com itens em serifada.

**Hero** — navy, simétrico, águia em marca d'água, eyebrow em versaletes ("Curso Preparatório Militar · São Gabriel/RS"), título em serifada display, subtítulo em sans, divisor com losango, dois CTAs (primário WhatsApp, secundário "Conheça os concursos"). Sem imagem de banco de imagens; se houver foto, com overlay navy forte.

**Seções institucionais** — fundo claro, títulos alinhados à esquerda, eyebrow + h2 + parágrafo curto, conteúdo em grid de 2–3 colunas. Diferenciais (acompanhamento individual, planilha de desempenho, correções, simulados) viram grid de cards com ícone outline.

**Páginas de concursos** — hub com a tabela comparativa; página por concurso (ESA, EsPCEx, AFA, EEAR, EFOMM) com brasão, nome por extenso em itálico serifado, ficha técnica em lista de pares rótulo/valor, disciplinas cobradas e CTA. Dados de edital sempre marcados como referência, com data de revisão.

**Cards de professores** — 3 colunas desktop / 1 mobile; foto em recorte consistente; nome serifado; disciplina em rótulo; credenciais em bullets losango. Somente as informações fornecidas.

**Blocos comparativos** — tabela com cabeçalho navy, linhas zebradas em claro, coluna-âncora fixa no mobile ou conversão em cards; scroll horizontal contido.

**CTAs** — no máximo um CTA primário visível por dobra; repetição do CTA de WhatsApp ao final de cada página; faixa navy de CTA antes do footer.

**Formulários** — campos com borda hairline, label acima, foco com borda dourada, mensagens de erro claras, botão primário à esquerda; pedir apenas nome, WhatsApp, concurso de interesse e mensagem.

**FAQ** — acordeão com divisor fino entre itens, ícone de losango girando na abertura, fundo claro.

**Footer** — navy profundo, águia em marca d'água, três colunas (marca/assinatura, navegação, contato + redes), filete ornamental no topo, `@primeprep.sg` e crédito final.

**Grid e ritmo** — container de 1200–1280px, conteúdo de leitura em 720px, grid de 12 colunas, gutters de 24–32px; espaçamento vertical entre seções de 96–128px desktop e 64–80px mobile; escala de espaçamento em base 4/8.

**Responsividade** — mobile-first na hierarquia; ornamentos reduzidos ou removidos abaixo de 768px; tabelas viram cards; tracking de rótulos reduzido; tamanhos de fonte com escala fluida.

---

# ADENDO — REVISÃO DA DIREÇÃO CROMÁTICA (Fase 2)

**Este adendo supera o item "1.1 Cor" acima.** Revisão pedida explicitamente pelo usuário na abertura da Fase 2: *"não quero algo monocromático navy blue, 3 cores sem elas funcionarem entre si"* e *"quero bem dinâmico que nem os links"*.

## O que muda

A proposta original — navy + branco + ouro escasso — é **cromaticamente pobre demais** para sustentar um site institucional completo. Três cores que não conversam entre si produzem ou monotonia ou colagem.

A paleta passa a ter **cinco famílias que se explicam mutuamente**, mais cinco cores de contexto derivadas das instituições reais:

| Família | Papel | Por que existe |
|---|---|---|
| Navy `#0f2350` | autoridade, marca | é a cor da instituição |
| **Bone `#f6f3ec`** | leitura, respiro | **pergaminho quente** — a peça decisiva: cria tensão contra o navy frio sem introduzir cor decorativa |
| Gold `#c8a24b` | mérito, distinção | acento, ≤5% da área |
| Crimson `#8e2f3c` | ênfase heráldica | calor onde o ouro seria excessivo |
| Steel `#5b6b8c` | estrutura, texto secundário | neutro frio que não é cinza morto |

Cores de contexto por concurso (EFOMM, AFA, EEAR, ESA, EsPCEx): derivadas de Marinha, Aeronáutica e Exército. Dão dinamismo cromático **com justificativa institucional** — nenhuma cor arbitrária. São sensíveis à superfície: os mesmos nomes assumem variantes claras em fundo escuro, garantindo AA em qualquer contexto.

## O que permanece

- Navy continua sendo a cor da marca.
- Ouro continua sendo acento estratégico, ≤5% da área.
- O ritmo alternado claro ↔ escuro continua sendo a estrutura — agora com três superfícies (`bone`, `navy`, `ink`) em vez de duas.
- Todas as restrições anti-caricatura seguem valendo. O verde do Exército é **exclusivamente** código de concurso, nunca cor de tema.

Especificação técnica completa: [`../setup/design-system-foundation.md`](../setup/design-system-foundation.md).
