# Shell Global

Arquivos: [`layout.tsx`](../../src/app/layout.tsx) · [`Header.tsx`](../../src/components/layout/Header.tsx) · [`Footer.tsx`](../../src/components/layout/Footer.tsx) · [`Wordmark.tsx`](../../src/components/layout/Wordmark.tsx) · [`LogEntry.tsx`](../../src/components/layout/LogEntry.tsx)

---

## 1. Root layout

```
<html lang="pt-BR" data-surface="bone" class={fontVariables}>
  <body>
    <a class="sr-only-focusable">Pular para o conteúdo</a>
    <Header />
    <main id="conteudo">{children}</main>
    <Footer />
  </body>
</html>
```

**As variáveis de fonte ficam no `<html>`, não no `<body>`.** O `@theme` compõe `--font-display: var(--font-fraunces)` no `:root`; com as classes do `next/font` no `<body>`, a variável de origem ficaria um nível *abaixo* e `--font-display` resolveria vazio. Bug encontrado e corrigido durante a revisão visual — as três famílias estavam caindo para a sans do sistema.

Server Component. Nenhum provider, nenhum contexto.

---

## 2. Header

Client Component — precisa de estado (menu) e de evento (rolagem).

### Estrutura
`Wordmark` · navegação (`≥lg`) · CTAs · botão de menu (`<lg`)

### Navegação
Deriva de `mainNav` em [`navigation.ts`](../../src/content/navigation.ts). **Nenhum item é escrito à mão.** Um item novo aparece no header, no menu mobile, no footer e no sitemap de uma vez.

Item ativo: `aria-current="page"` + losango dourado abaixo, com transição de opacidade. `pathname.startsWith()` marca a seção inteira como ativa em rotas filhas.

### CTAs — hierarquia por largura

| Largura | O que aparece |
|---|---|
| `< sm` | só o botão de menu |
| `≥ sm` | Matrícula (primário) + menu |
| `≥ lg` | navegação completa + Matrícula |
| `≥ 2xl` | + WhatsApp (secundário) |

O WhatsApp entra só em `2xl`. Descoberto na revisão: entre `xl` e `2xl` o grupo direito transbordava o container em ~25px, com logo + seis itens + dois CTAs disputando a linha. O gap da navegação também passou a `gap-5 xl:gap-7`.

Nunca há quatro CTAs no header.

### Estado de rolagem
Acima de 8px de rolagem o header ganha `backdrop-blur`, fundo a 92% e um filete inferior. Listener `passive`. Altura: 64px mobile / 72px (`lg:h-18`) desktop.

### Menu mobile
Painel full-screen navy abaixo do header, itens em Fraunces na escala `h3`, numerados `01`–`06` em Cinzel — a mesma linguagem de "entrada de diário" do corpo do site.

Acessibilidade implementada e verificada:
- `aria-expanded` no gatilho, `aria-controls` apontando para o painel;
- rolagem do body travada enquanto aberto;
- foco vai para o primeiro link ao abrir;
- **foco preso** no painel (Tab e Shift+Tab circulam);
- `Esc` fecha e **devolve o foco ao gatilho**;
- fecha ao clicar num link (via `onClick`, não por efeito sobre `pathname` — a regra `react-hooks/set-state-in-effect` reprova a segunda forma, e com razão: causa render em cascata).

Entrada/saída animadas com `motion` + `AnimatePresence` (fade + 8px, 260ms). É o único lugar onde o `motion` roda: o painel não existe sem JavaScript de qualquer forma, então não há custo de degradação. `useReducedMotion()` desliga o deslocamento.

---

## 3. Footer

Server Component. Superfície **`ink`** — o contraste máximo do sistema, usado só aqui na Home.

Quatro colunas em `lg`: marca + descrição · Institucional · Concursos · Fale com a gente. Colapsa para uma coluna no mobile.

- Os dois grupos de navegação derivam de `footerNav`.
- CTAs: Matrícula (primário) e Bolsa (fantasma).
- Canais: WhatsApp e Instagram com ícone + rótulo textual — nunca só o ícone.
- Divisor ornamental no topo (o único da seção).
- Linha final: copyright + o aviso de que dados de concurso são referência.

**Campos inexistentes não aparecem.** Sem endereço, CNPJ, telefone fixo, horário ou dado legal — e sem "em breve" no lugar deles.

---

## 4. Wordmark — asset temporário

Não existe logo em SVG nem PNG com transparência; as únicas versões da marca estão rasterizadas dentro das peças de social media, com fundo azul chapado. O briefing proíbe redesenhar ou vetorizar a marca.

**Solução:** composição tipográfica — losango dourado + "Prime Prep" em Cinzel (a mesma família capitular do wordmark original), com a assinatura "Curso Preparatório Militar" abaixo no footer.

> **PONTO DE SUBSTITUIÇÃO:** a águia em SVG entra em `Wordmark.tsx`, à esquerda do texto (horizontal no header, empilhada no footer). **Nenhum outro arquivo muda.**

`whitespace-nowrap` no wordmark: sem isso ele quebrava em duas linhas no header (encontrado na revisão).

---

## 5. LogEntry — assinatura estrutural

O componente que estrutura toda seção de conteúdo. Trilho de margem à esquerda com número da entrada (Cinzel, dourado), rótulo inscricional e filete vertical; conteúdo à direita.

- **`≥ lg`**: grade `13rem 1fr`, trilho `position: sticky` a 7rem — acompanha a leitura da seção.
- **`< lg`**: colapsa em uma coluna; o trilho vira linha horizontal acima do conteúdo, com número e rótulo lado a lado.

Verificado nas duas formas. É o que impede a Home de virar uma pilha de blocos centralizados.

---

## 6. Acessibilidade do shell

| Item | Estado |
|---|---|
| Skip link para `#conteudo` | ✅ visível ao focar |
| Landmarks `<header>` `<nav>` `<main>` `<footer>` | ✅ elementos reais |
| `aria-label` distinto em cada `<nav>` | ✅ |
| H1 único na página | ✅ verificado |
| Foco visível em qualquer superfície | ✅ token `--color-focus` por superfície |
| Alvos de toque ≥ 44px em `pointer: coarse` | ✅ verificado — só o skip link fica abaixo, e ele cresce ao focar |
| Links externos com `rel="noopener noreferrer"` | ✅ 12 de 12 |
| Aviso "(abre em nova aba)" para leitor de tela | ✅ em todo CTA |
| Ícone sozinho como ação | ❌ não existe — todo ícone tem rótulo ao lado |

---

## 7. Responsividade verificada

| Largura | Resultado |
|---|---|
| 390 (`pointer: coarse`) | sem overflow · 1 alvo pequeno (skip link, correto) · H1 quebra natural |
| 768 | trilho horizontal · nav desktop oculta · professores em 2 colunas |
| 1280 | sem overflow · header cabe |
| 1366 | sem overflow · trilho vertical sticky · header 72px |

`scrollWidth === clientWidth` em todas. Nenhum item do menu quebra linha (`whitespace-nowrap` — "O curso" quebrava antes).
