# Diagnóstico: qual concurso serve para você

Primeira funcionalidade interativa do site. Quatro perguntas, resultado no
navegador, conversa no fim. **Sem backend, sem cadastro, sem dado armazenado.**

---

## 1. O problema

O Princípio 5 do produto diz que o visitante não pensa "quero um cursinho",
pensa "quero passar na EEAR". A arquitetura inteira do site segue isso: o
concurso é a unidade de navegação.

Só que boa parte do público chega **antes** disso. Sabe que quer carreira
militar e não sabe qual das quatro escolas serve. Para essa pessoa o site
oferecia uma tabela comparativa de cinco colunas, e comparar cinco colunas exige
justamente saber o que comparar.

O diagnóstico é a porta que faltava antes da tabela.

---

## 2. Por que não é formulário

A D-18 é clara: o site não tem e não terá formulário. Isto não é exceção a ela.

- Nada é enviado. Não existe `fetch`, `action` nem endpoint.
- Nada é armazenado. Sem `localStorage`, sem cookie. O estado morre com a aba.
- Nada é pedido. Sem nome, sem e-mail, sem telefone.

É uma **calculadora**: a conta acontece no navegador e o resultado aparece ali.
O site continua 100% estático e sem backend.

A diferença prática para um formulário de captura é a ordem da troca. Um
formulário pede antes de entregar; aqui a pessoa recebe a resposta primeiro, e
só então o WhatsApp aparece, já com o resultado escrito na mensagem:

> Olá! Fiz o diagnóstico no site e o resultado apontou a EEAR. Quero saber como
> funciona a preparação.

Quem atende sabe do que se trata antes de responder. É a mesma lógica de
`resolveIntent()`: a intenção do visitante nunca se perde no caminho.

---

## 3. Nada é inventado

Toda a lógica lê [`concursos.ts`](../../src/content/concursos.ts), que é a fonte
única. **Não existe tabela paralela** de idade, força ou disciplina.

Por isso a patente e a faixa etária são **derivadas** dos campos que já existem,
em vez de redigitadas:

| Critério | De onde sai |
|---|---|
| Força | `forca` |
| Oficial ou sargento | `voceVira` (`patenteDe()`) |
| Faixa etária | `faixaEtaria` (`faixaEmNumeros()`) |
| Física ou humanas | `disciplinasProva` |

Se um dado mudar em `concursos.ts`, o diagnóstico muda junto. Não há como
divergirem.

### A faixa etária falha aberta, de propósito

`faixaEmNumeros()` extrai `{min, max}` de textos como `"17 a 22 anos"`. Se o
formato mudar e o padrão não casar, a função devolve `null` e o concurso passa a
**não ter restrição** de idade, em vez de ser eliminado.

Eliminar alguém por causa de um regex que quebrou seria o pior resultado
possível numa ferramenta cuja saída é "isso não é para você".

### O resultado nunca afirma elegibilidade

`faixaEtaria` tem `verifiedAt: null`, como todo dado de edital do site. O
resultado por isso diz o que a faixa de **referência** sugere e manda conferir no
edital vigente. Regra de idade muda a cada edição e depende da data de corte.

---

## 4. As quatro perguntas

São quatro porque quatro bastam para separar quatro concursos. Uma quinta seria
conversa, não diagnóstico.

| # | Pergunta | Peso |
|---|---|---|
| 01 | Que idade você terá na data da prova? | filtro duro |
| 02 | Onde você se imagina trabalhando? | 3 |
| 03 | Comandar ou ser o especialista técnico? | 2 |
| 04 | Física, ou Geografia e História? | 1 |

A força pesa mais porque é escolha de vida. A patente separa carreiras dentro da
mesma força. A disciplina é desempate, não decisão. **"Tanto faz" não pontua e
não penaliza.**

Os quatro caminhos canônicos separam limpo:

| Respostas | Resultado |
|---|---|
| Exército · oficial · humanas | EsPCEx |
| Força Aérea · oficial · Física | AFA |
| Força Aérea · sargento · Física | EEAR |
| Marinha Mercante · oficial · Física | EFOMM |

A pergunta 02 diz, na própria opção, que a Marinha Mercante é **carreira civil,
não militar**. É a confusão mais comum sobre a EFOMM, e o lugar certo de
desfazê-la é onde a pessoa está escolhendo.

---

## 5. Empate é informação

Se duas escolas servem igual, o resultado diz as duas com o motivo de cada uma.
Sortear uma seria inventar precisão que não existe.

E quando sobra mais de um caminho, o resultado diz **qual pergunta afinaria**:
"se você decidir em qual área quer trabalhar, o resultado fica mais específico".
É a única saída que a pessoa resolve sozinha, ali mesmo, subindo a página. O
resto seria repetir "fale com a gente".

---

## 6. Dois defeitos que o teste exaustivo pegou

As 180 combinações possíveis foram exercitadas antes de olhar a tela.

**A copy dizia "duas" para empates de três.** Quem responde "ainda não sei" na
força mas escolhe "oficial" casa com EsPCEx, AFA e EFOMM ao mesmo tempo, e o
título dizia "Duas combinam igual". Agora o título é montado pela contagem.

**A idade sozinha já é resposta, e era ignorada.** Quem tem 24 anos e responde
"tanto faz" em tudo tinha nenhuma preferência declarada, então ouvia "suas
respostas não apontaram um caminho" — quando na prática só a EEAR estava ao
alcance dele, porque é a única com faixa até 24. Agora, se a idade eliminou
alguém e não há preferência, o que sobra **é** o resultado, e o motivo é a
própria idade.

Nenhum dos dois apareceria clicando na tela: exigem combinações específicas que
ninguém testa à mão.

---

## 7. Interface

**Tudo numa tela, sem passo a passo.** Um assistente de quatro etapas seria mais
"produto" e pior de usar: obriga a avançar para trocar de ideia, esconde quanto
falta e atrapalha quem navega por teclado ou leitor de tela. Quatro grupos de
rádio numa página só respondem-se mais rápido no celular, que é onde este link
vai ser aberto.

**Sem botão de enviar.** O resultado aparece quando a quarta resposta entra,
porque não há nada para enviar. Um botão "calcular" seria um controle que não faz
nada além do que a última resposta já fez.

**O losango é o marcador de seleção.** O vocabulário do site já tem um, então não
entra um radio de sistema.

### O anel de foco precisou de `has-[:focus-visible]`

O `input[type=radio]` real é `sr-only`, o que é correto para a semântica (grupo
de rádio de verdade, navegável com as setas). Mas o anel de foco do navegador
cairia num elemento invisível, e quem navega por teclado não veria onde está.

`has-[:focus-visible]` traz o anel para a caixa que a pessoa realmente enxerga.
Verificado no CSS compilado: `outline-width: 2px`, `outline-offset: 2px`,
`outline-color: var(--color-focus)`, com `--tw-outline-style` em `solid`.

---

## 8. Onde ele aparece

**Rota própria** (`/diagnostico`), e não seção, porque precisa ser um link que se
cola na bio do Instagram e se manda numa conversa. É o caminho mais curto entre o
alcance que a Prime Prep já tem e uma conversa com contexto.

**Fora do menu principal, de propósito.** A barra já pede 1029px numa caixa de
944px em 1024 (D-28), e um sétimo item a quebraria. Entra por:

- o hub `/concursos`, como carga do cabeçalho, que por isso vira de duas colunas
  (é exatamente o critério da D-41: quem tem algo a mais para oferecer ganha a
  coluna);
- a seção de concursos da Home, ao lado de "ver todos";
- o rodapé, abrindo o grupo Concursos.

E no sitemap, via `plannedRoutes`.

---

## 9. Verificação

**Lógica:** as 180 combinações de resposta, com invariantes: nenhum concurso
some ou duplica, nada fora da faixa é recomendado, todo recomendado tem ao menos
um motivo, e os estados não se contradizem. **Zero problemas.** Os quatro
caminhos canônicos e os três filtros de idade batem.

Distribuição: 110 combinações dão resposta única, 36 caem fora da faixa (as de 25
anos ou mais, correto), 16 dão empate de dois ou três, 16 são resolvidas só pela
idade, e 2 não apontam nada (todas as preferências em "tanto faz").

**Interface:** 20 estados medidos (4 larguras × 5 cenários de resultado), 1.934
nós de texto, **zero falhas AA e zero scroll horizontal**. Menor alvo de toque:
57px, acima do mínimo de 44.

**Estrutura:** 4 `fieldset` com `legend`, 15 rádios em 4 grupos nomeados, todo
`label` envolvendo o seu `input`, resultado dentro de `aria-live="polite"`.

**Varredura do site inteiro depois da mudança:** 40 combinações (5 larguras × 8
rotas), 3.805 nós, zero overflow e zero falha de contraste.

`typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `build` ✅ **18 rotas**.

---

## 10. O que ele não faz

- **Não guarda nada**, então não dá para saber quais concursos as pessoas mais
  tiram. Isso exigiria backend ou analytics, e nenhum dos dois está decidido.
- **Não substitui o edital**, e o diz na tela.
- **Não fala de preço, aprovação nem vaga.** Continua valendo a restrição dura:
  nada inventado.
