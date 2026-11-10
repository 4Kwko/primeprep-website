# Robustez e peso

Rodada de endurecimento sobre o site pronto. Nada de conteúdo novo e nada de
composição nova: o alvo é o que acontece quando algo dá errado, o que o site
pesa, e o que estava valendo só porque alguém lembrava.

---

## 1. O projeto tinha zero teste

Essa era a lacuna maior, e ela não aparecia em lugar nenhum porque `typecheck`,
`lint` e `build` passavam.

O `AGENTS.md` lista vinte regras que o projeto se impôs, e todas viviam como
convenção: valiam enquanto alguém lembrasse. A primeira delas, "não inventar
dados", é fácil de respeitar num dia calmo e fácil de furar às duas da manhã,
preenchendo um campo vazio para não deixar feio.

Agora são **159 testes**, e `npm run check` roda eles junto.

| Arquivo | O que trava |
|---|---|
| `diagnostico.test.ts` | as 180 combinações de resposta, exaustivas, com invariantes |
| `conversion.test.ts` | destinos e mensagens; `href: null` nunca vira link morto |
| `invariantes.test.ts` | as regras 1, 2 e 17 do `AGENTS.md`, verificadas |
| `paginas-de-erro.test.tsx` | o contrato das telas de erro |
| `seo-e-assets.test.ts` | JSON-LD sem campo inventado, ícones, cabeçalhos |
| `movimento.test.ts` | a regra 18: nenhuma animação decide se o conteúdo existe |
| `mascaras-da-marca.test.ts` | o fallback do AVIF, que falha feio se sumir |
| `cores-literais.test.ts` | os hex fora do CSS não podem divergir dos tokens |

### Testes foram testados contra si mesmos

Teste que não sabe falhar é teatro. Cada suíte foi verificada plantando a
violação que ela existe para pegar:

- a marca do livro isolada, `verifiedAt` inválido, travessão em copy pública e um
  campo que deve ser nulo preenchido: **quatro violações, quatro testes certos**;
- `opacity: 0` na transição de rota: pegou pelos dois testes que cobrem a D-39;
- AVIF sem fallback na regra base: pegou;
- um dígito trocado no navy literal: pegou.

### Sem `jsdom`, e é decisão

Comportamento de interface é verificado onde ele existe de verdade: medindo o DOM
renderizado no navegador. Foi assim que apareceram os defeitos que mais custaram
neste projeto, e nenhum deles apareceria num DOM simulado. `jsdom` traria três
dependências para simular mal o que a medição real faz bem.

---

## 2. Uma exceção derrubava o site inteiro

Não havia `error.tsx` nem `global-error.tsx`. Qualquer exceção em componente
cliente caía na tela padrão do Next: fundo branco, tipografia de sistema, nenhuma
marca e **nenhuma saída**. Quem chegasse ali via um site quebrado sem sequer um
caminho de volta, o que é pior que a falha em si.

Agora as duas fronteiras existem, com as saídas na ordem certa: `reset()`
primeiro, porque a maioria dos erros de renderização passa na segunda tentativa,
e WhatsApp depois, porque nenhuma falha de interface deve interromper a conversão.

Nenhuma das duas imprime a mensagem ou a pilha do erro: `error.message` pode
carregar caminho de arquivo. Só o `digest` vai para a tela, porque é curto e é o
que localiza a ocorrência no log.

A tela global **não importa componente do site**, e há teste garantindo isso: um
componente quebrado pode ter sido a causa da queda, e a tela de erro que o
importasse cairia junto.

---

## 3. Peso: 565KB para 425KB

Medido na build de produção, não em desenvolvimento (onde 244KB são só as
ferramentas do Next e não vão para lugar nenhum).

| | Antes | Depois |
|---|---|---|
| Fontes | 206,8KB | 206,8KB |
| **Imagens** | **141,5KB** | **40,9KB** |
| **JavaScript** | **187,5KB** | **147,9KB** |
| CSS | 11,2KB | 11,6KB |
| **Total da Home** | **565,5KB** | **~425KB** |

Duas mudanças respondem por quase tudo: as máscaras da marca em AVIF e a
remoção da biblioteca de animação.

### As máscaras da marca em AVIF

As quatro máscaras somavam 190KB de PNG, o segundo maior item da página. Em AVIF
somam 54KB.

**q85 e não q70**, que seria menor ainda: o que está sendo comprimido é o canal
alfa, e aqui o alfa não é transparência acessória, é a própria arte. Medido pixel
a pixel contra o PNG:

| Qualidade | Tamanho (águia) | Erro médio | Erro máximo | Pixels com erro > 8 |
|---|---|---|---|---|
| q70 | 13,5KB | 0,75 | 12 | 0,03% |
| **q85** | **18,9KB** | **0,50** | **8** | **0,00%** |
| q95 | 30,6KB | 0,23 | 3 | 0,00% |

São 5KB de diferença entre q70 e q85, e não vale arriscar borda suja numa marca.

### O fallback foi a parte difícil

A forma óbvia de servir os dois formatos é declarar o PNG e sobrescrever com
`image-set()`, deixando o navegador antigo ficar com a primeira. **Não funciona
neste projeto:** o Lightning CSS, que compila o Tailwind v4, considera a primeira
declaração redundante e a apaga. Verificado no CSS compilado, sobrava só a
`image-set`.

E o modo de falhar é feio. O elemento é pintado com `background-color:
currentColor`, então sem `mask-image` nenhuma o que aparece no lugar da marca é
um **retângulo sólido da cor do texto**. Um Safari 16, que entende `mask-image`
mas não entende `type()` dentro de `image-set()`, cairia exatamente nisso.

`@supports` resolve, porque o compilador não pode colapsar regras que vivem em
contextos condicionais diferentes: o PNG fica na regra base, o AVIF só entra onde
o navegador confirma que sabe ler a sintaxe.

**Consequência de arquitetura:** a URL saiu do `style` inline, então
`Wordmark.tsx` passa a conter só a proporção e a classe. Continua sendo o ponto
único de aplicação da marca, e agora há teste que falha se outro componente
referenciar a classe de máscara direto.

### A biblioteca de animação saiu inteira

`motion` era usada em **um** arquivo, para **uma** animação: a entrada e saída do
painel do menu mobile. Custava 46KB comprimidos em toda página.

A saída animada era justamente o que exigia a biblioteca: animar a saída obriga a
manter o elemento montado depois do fim da intenção, e é para isso que serve o
`AnimatePresence`. Fechar na hora é o que menu nativo faz, e lê como resposta,
não como corte.

**E aí veio o achado que valeu mais que os 46KB.** A primeira versão da animação
em CSS partia de `opacity: 0`, com a justificativa de que o painel só existe
depois de um clique e portanto teria JavaScript e quadros de animação garantidos.
A justificativa estava errada, e foi medida: com a renderização suspensa, o
painel abriu com `animationPlayState: "running"`, `opacity: 0`, e ficou assim.

**Ter JavaScript não garante quadro de animação.** As animações do menu passaram
a ser só deslocamento, e com isso a lista de exceções da regra 18 deixou de
existir. Nenhuma animação do projeto esconde conteúdo, e a regra não precisa de
exceção nenhuma.

### O itálico saiu da precarga

Três fontes eram precarregadas somando 193KB, e o itálico do Fraunces era 80KB
deles, apesar de nunca aparecer acima da dobra. Separado em chamada própria com
`preload: false`, ele saiu da rajada inicial: medido, as duas precarregadas
começam em 7ms e 8ms, e o itálico em 12ms.

**O que isso não faz**, e está registrado para não virar promessa falsa: o
arquivo continua sendo baixado em toda página. Verificado numa rota sem um único
elemento itálico, ele é buscado assim mesmo, porque o `next/font` dá o mesmo nome
de família às duas chamadas. **O ganho é de ordem, não de bytes.**

No caminho eu tinha tirado o itálico da ressalva do rodapé, achando que
economizaria os 80KB em todas as rotas. A medição mostrou que não economiza nada,
então a mudança foi revertida: ela não tinha outro motivo além de um ganho que
não existia.

---

## 4. O que faltava para o link ser compartilhável

Os dois canais de conversão são WhatsApp e DM do Instagram, e é exatamente ali
que um link colado vira cartão. **Sem imagem, saía uma tira de texto cinza**, no
momento em que alguém está recomendando o curso para outra pessoa.

Agora há cartão para a home, o diagnóstico, as seis internas e um por concurso,
cada um com a cor de contexto da sua força. A composição é a do hero traduzida
para 1200x630: campo navy com degrau tonal, marca no topo, águia sangrando pela
borda, régua de acento e assinatura.

**A tipografia é a fonte padrão do Satori, de propósito.** Buscar as fontes do
site na rede durante o build tornaria a build dependente de conexão para um
resultado cosmético. E a marca completa já contém o wordmark "PRIME" como arte,
então a tipografia da identidade está na imagem sem fonte nenhuma; o que sobra é
texto de apoio, que em sans neutra fica mais adequado do que em serifada de
display.

**Bug encontrado ao centralizar as cores:** o cartão do concurso mapeava a cor
por força, e AFA e EEAR são as duas da Aeronáutica. As duas saíam com a mesma
cor, apagando no cartão uma distinção que o site inteiro faz. Agora mapeia pelo
`accentToken` do concurso.

### E o favicon era o do scaffold

Passava por definitivo para quem olhasse a aba. Um script recolore e enquadra os
recortes que já existem, que é a **mesma operação** que o site faz em tempo de
execução com `currentColor`, só que num momento em que não há CSS.

Cada tamanho é renderizado da origem, não reduzido a partir do maior: a marca é
linha fina, e reduzir 512 para 16 apaga a linha. Medido, sobravam 10 pixels com
tinta em 256; renderizando o 32 direto do original de 760px, são 91 em 1024.

A 16px ainda é um navy com marca discreta, e não um símbolo legível. Isso só o
símbolo isolado que a lista de pendências pede ao cliente resolve.

---

## 5. Dados estruturados, e o lugar mais perigoso para inventar

A Prime Prep é curso presencial numa cidade específica, e quem procura "curso
preparatório militar São Gabriel" precisa encontrá-la.

A regra 1 vale aqui com mais rigor que em qualquer outro lugar. No texto, um dado
falso é lido por uma pessoa e alguém percebe; no JSON-LD ele é lido por máquina,
como declaração formal da própria organização, e ninguém olha. `address`,
`telephone`, `aggregateRating` e `priceRange` inventados não são só desonestos:
rendem penalização. **Vinte campos proibidos estão travados por teste.**

`EducationalOrganization` e não `LocalBusiness`: sem endereço confirmado,
`LocalBusiness` ficaria incompleto justamente no campo que o define, e o que
descreve a Prime Prep é ensinar, não ter ponto comercial.

Sem `Course` por concurso: `Course` pede `hasCourseInstance` com data e
modalidade, e as datas dependem de edital. Sem isso seria marcação vazia.

Trilha só nas páginas de concurso, que são as únicas com profundidade real.
"Início > Contato" não informa nada que a URL já não diga.

---

## 6. Duas portas que estavam abertas

**O `next.config.ts` estava vazio.** Agora envia CSP (`frame-ancestors`,
`base-uri`, `form-action`), `nosniff`, `Referrer-Policy` e `Permissions-Policy`,
e desliga o `X-Powered-By`.

Cada um resolve algo concreto: `frame-ancestors` impede enquadrar o site dentro
de outro e colar outro WhatsApp por cima; `base-uri` impede que um `<base>`
injetado reescreva todos os links relativos de uma vez, CTAs incluídos;
`form-action 'none'` porque o site não tem formulário e não terá, então se um
aparecer sem passar por decisão ele quebra.

**Sem `script-src`, e é decisão registrada:** uma `script-src` séria no App
Router exige nonce por requisição, o que obriga renderização dinâmica e
derrubaria o site de estático para SSR. Não compensa num site sem sessão, sem
formulário e sem dado de usuário.

**O `/dev/foundation` continuava servido.** Estava `noindex` e fora do sitemap,
mas quem digitasse a URL via a folha de tokens do projeto, e a remoção dependia
de alguém lembrar antes do deploy. Agora responde 404 fora de desenvolvimento.
Verificado com `build` e `start` reais.

---

## 7. Coisas que estavam erradas e ninguém tinha olhado

**O sitemap mentia.** `lastModified: new Date()` carimbava o instante do build em
todas as URLs, ou seja, a cada deploy ele afirmava que as doze páginas tinham
mudado ao mesmo tempo. Um `lastmod` que sempre muda é pior que nenhum: o buscador
aprende a ignorar o campo, e aí ele deixa de valer no dia em que uma página muda
de verdade. Não há fonte confiável para preenchê-lo hoje, então foi omitido.

**O README era o do `create-next-app`.** A porta de entrada do repositório
mandava editar `app/page.tsx` e citava a fonte Geist, que o projeto não usa.

**Três exports mortos**, achados varrendo todos os símbolos exportados:
`pageMetadata` (um atalho que nenhuma das doze rotas usava), o tipo `Site`, e
`FaqItem` (tipo de uma seção que o produto deliberadamente não tem).

**Sem `.gitattributes`.** O `core.autocrlf` trocava LF por CRLF em todo checkout,
e qualquer arquivo restaurado com `git checkout` passava a reprovar no
`format:check` sem que nada tivesse mudado. Aconteceu nesta sessão.

---

## 8. A ferramenta de auditoria quebrou, e isso foi bom

O `frame-ancestors 'none'` que eu mesmo adicionei bloqueou a técnica que eu vinha
usando para medir contraste e overflow: carregar as rotas em iframes.

Não houve falso verde. O `contentDocument` vem `null`, então a varredura falha em
vez de medir documento vazio, que era o risco real.

A técnica mudou: agora a auditoria **emula o viewport na aba e navega**, o que
mede o documento de topo com os cabeçalhos de verdade aplicados. É mais lento e é
mais fiel do que o iframe era. Fica registrado no `AGENTS.md`, porque é o tipo de
coisa que a próxima pessoa descobriria do jeito difícil.

---

## 9. Verificação

**Teclado, com teclas de verdade.** No diagnóstico: a seta move dentro do grupo
de rádio, e o anel de foco aparece **no rótulo** (`solid 2px` em `--color-focus`,
offset 2px), que era exatamente o ponto do `has-[:focus-visible]`. O rádio real é
`sr-only` para manter a semântica de grupo, e sem esse ajuste o anel cairia num
elemento invisível.

**Varredura responsiva** com a técnica nova: 320, 390, 768, 1024, 1280 e 1440 nas
rotas principais. Zero scroll horizontal, zero falha de contraste AA, alvo mínimo
de toque em 57px.

**Cadeia técnica:** `typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `test` ✅ 156 ·
`build` ✅ 34 páginas estáticas.

Dependências de runtime: `next`, `react`, `react-dom` e `lenis`.

---

## 10. O que continua pendente

Nada disto é trabalho de código. Lista completa em
[`content-pending.md`](./content-pending.md).

- **Marca em SVG.** O raster está correto e agora também em AVIF, mas SVG escala
  melhor e a troca é em um arquivo só.
- **Símbolo isolado** para o favicon funcionar a 16px.
- **Domínio** e liberação de indexação.
- **Remuneração da EFOMM**, que diverge no material do cliente.
- **Fotografias** e brasões.
