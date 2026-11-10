# Páginas Internas

Etapa 2 da Fase 3. A Home e o shell estão em [`home.md`](./home.md) e [`global-shell.md`](./global-shell.md).

---

## 1. Rotas implementadas

| Rota | Tipo | O que responde | CTA primário |
|---|---|---|---|
| `/concursos` | estática | Quais concursos, e qual serve para mim? | matrícula |
| `/concursos/espcex` · `afa` · `eear` · `efomm` | **SSG** (`generateStaticParams`) | O que a escola exige e como nos preparamos para ela | matrícula contextual |
| `/metodologia` | estática | Como funciona a preparação? | matrícula |
| `/professores` | estática | Quem ensina? | matrícula |
| `/o-curso` | estática | Quem é a Prime Prep? | matrícula |
| `/bolsas` | estática | E se eu não puder pagar? | **bolsa** |
| `/contato` | estática | Como falo com vocês? | **WhatsApp** |
| `/_not-found` | estática | — | WhatsApp |

Todas pré-renderizadas no build. Nenhuma requisição em runtime.

**As quatro páginas de concurso derivam de `concursos.ts`.** Acrescentar um concurso cria a página, o item de menu, a linha da tabela e a entrada do sitemap — sem tocar em componente.

---

## 2. Anatomia de uma página interna

```
PageHeader (navy)        eyebrow + h1 + lead [+ ficha/CTA]
LogEntry 01 (bone)       conteúdo
LogEntry 02 (navy|bone)  conteúdo
…
CtaFinal (navy)          fechamento de alta intenção
Footer (ink)
```

**`PageHeader`** é a abertura das internas: mesma superfície navy e mesma linguagem do hero, em escala menor. Uma entrada de capítulo, não uma segunda capa — a Home continua sendo a única página com peso de abertura total.

**`CtaFinal`** foi extraído do antigo `Fechamento` da Home e parametrizado (`titulo`, `lead`, `concurso`, `labelPrimario`, `section`, `mostrarBolsa`). Um único componente fecha as oito páginas com a mesma hierarquia — e o texto muda conforme o contexto.

A alternância de superfícies segue o mesmo princípio da Home: navy abre, bone lê, navy afirma, ink fecha.

---

## 3. `/concursos` — o hub

A resposta à única pergunta que traz alguém a esta página: *qual desses serve para mim?*

**Entrada 01 — Comparativo.** A tabela do carrossel do cliente, traduzida para web:
- `≥ md`: `<table>` real com `<caption>` para leitor de tela, `<th scope="col">` no cabeçalho e `<th scope="row">` na sigla. `table-fixed` + `<colgroup>` com larguras percentuais, dentro de um wrapper `overflow-x-auto`.
- `< md`: cartões com pares rótulo/valor. **Não é scroll lateral** — rolar uma tabela de seis colunas no celular esconde informação.

**Entrada 02 — As escolas.** Quatro cartões navegáveis com barra de cor de contexto, sigla, nome por extenso em itálico, resumo e disciplinas da prova.

**Entrada 03 — O que estudamos.** As quatro disciplinas e a ponte para `/metodologia`.

---

## 4. Páginas de concurso

**Cabeçalho:** sigla como eyebrow, losango na cor da força, nome por extenso em itálico como H1, resumo como lead, nome da força e o CTA contextual `Quero me preparar para a {SIGLA}`.

**01 · Ficha técnica.** `<dl>` com Você vira, Idade, Escolaridade, Onde e Remuneração inicial. **Campo ausente não é renderizado** — a seção inteira some se não houver nenhum. Nota obrigatória de que os dados são referência.

**02 · A prova.** As disciplinas do edital, cada uma marcada como *Aula na Prime Prep* ou *Conteúdo do edital*, cruzando `disciplinasProva` com as quatro disciplinas do corpo docente. Quando há disciplinas não cobertas (Geografia e História na EsPCEx), a página **diz isso explicitamente** em vez de omitir — é a mesma doutrina de não inventar, aplicada ao que falta.

**03 · A preparação.** O ciclo de `metodologia.ts`, com o alvo do concurso nomeado.

**04 · Outros concursos.** Navegação lateral entre os quatro.

**Fechamento** com mensagem de WhatsApp já contextualizada pelo concurso.

`generateMetadata` monta título e description a partir do próprio conteúdo — nada escrito à mão por página.

---

## 5. `/bolsas` — a página mais sensível

Fluxo **separado** de matrícula: o CTA primário aqui é `bolsa`.

- **01 · O que existe:** os dois caminhos confirmados — desempenho e possibilidade de critérios socioeconômicos.
- **02 · O que ainda não está definido:** uma lista explícita de percentual, quantidade, prazos, critérios e documentos, cada um marcado *A definir*. Publicar a ausência é mais honesto — e mais útil — do que o silêncio, e elimina a tentação de preencher depois com número inventado.
- **03 · Como pedir:** uma mensagem, sem burocracia.

Nenhuma frase garante concessão. Há aviso explícito disso.

---

## 6. `/contato` — canais, não formulário

**A hierarquia se inverte aqui:** o CTA primário é o WhatsApp, porque quem chega nesta página já quer falar, não decidir.

- **01 · Por assunto:** três intenções (dúvida, matrícula, bolsa), cada uma com um link de WhatsApp que já leva a mensagem correspondente de `conversionMessages`.
- **02 · Os canais:** WhatsApp e Instagram Direct lado a lado, com ícone **e** rótulo textual.

Sem `CtaFinal` — a página inteira já é o CTA.

Endereço, telefone fixo e horário **não existem e não aparecem**. Nenhum placeholder, nenhum "em breve".

---

## 7. `/_not-found`

Em vez de beco sem saída, oferece o caminho de volta e os quatro concursos — a unidade de navegação do site.

---

## 8. Bugs encontrados nesta etapa

### `--container-full` sobrescrevia `w-full` (grave)

O namespace `--container-*` do Tailwind v4 gera utilitários `w-<nome>`, `max-w-<nome>` e `min-w-<nome>`. O token `--container-full: 96rem` da fundação **sobrescreveu o `w-full` nativo**: `w-full` passou a valer 96rem (1536px) em vez de 100%.

Sintomas, ambos atribuídos antes a outra causa:
- o monograma dos professores media 1536px (contornado na Etapa 1 trocando por altura fixa — o contorno funcionou, o diagnóstico estava errado);
- a tabela comparativa media **1536px dentro de um container de 974px**, com as últimas colunas cortadas por `overflow: hidden`. Perda silenciosa de informação, exatamente o que a tabela existe para evitar.

Corrigido renomeando para `--container-pagina`, com um aviso no próprio token. **Nunca nomear um container com o nome de um utilitário existente** (`full`, `screen`, `min`, `max`, `fit`, `auto`, `px`).

### `overflow-hidden` na tabela
Trocado por `overflow-x-auto` e `table-fixed` + `<colgroup>`. Se algum conteúdo futuro não couber, ele rola dentro do bloco em vez de sumir.

### Botões com `white-space: nowrap`
Rótulos contextuais deste site são longos por decisão (`Quero me preparar para a EFOMM`). Com `nowrap` o botão estourava o container em 390px. `btn-base` agora quebra com `text-align: center` e `text-wrap: balance`.

---

## 9. Validação

**Rotas:** as 11 respondem 200; rota inexistente responde 404.

**Por página** (todas as 10 internas): 1 H1 · nenhum salto de heading · zero menções à ESA · zero `<form>`/`<input>`/`<textarea>` · zero link externo sem `noopener` · `canonical` presente · `title` e `description` próprios.

**Layout:** sem overflow horizontal em 390 e 1366; tabela dentro do container com a última coluna visível; nenhum alvo de toque abaixo de 44px em `pointer: coarse`.

**Console:** limpo.

`typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `build` ✅ (16 rotas) · `impeccable detect` ✅

---

## 10. Pendências

Continuam as da Etapa 1 (logo em SVG, brasões, fotografias) e mais:

1. **Sem FAQ.** O planejamento previa; não há perguntas e respostas fornecidas pelo cliente. Inventá-las seria inventar posicionamento.
2. **Sem página de valores** — decisão em aberto (pergunta 15 do planejamento).
3. **Sem JSON-LD** — depende de endereço, telefone e horário.
4. **Discrepância nos dados de remuneração da EFOMM**: o carrossel mostra "~R$ 13 mil" na tabela final e "R$ 15.000 a R$ 24.000" no slide individual. O site usa o valor do slide. **Confirmar com o cliente qual é o correto.**
5. **`/dev/foundation`** precisa sair antes do deploy público.
