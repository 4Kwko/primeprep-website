// @ts-check
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * GERA OS ASSETS DERIVADOS DA MARCA.
 *
 * Rode com `npm run assets:marca`. Não roda no build: os arquivos são
 * versionados, porque são binários estáveis e um build offline não pode depender
 * de gerá-los.
 *
 * O QUE ESTE SCRIPT FAZ, E O QUE ELE NÃO FAZ.
 * Ele apenas RECOLORE e ENQUADRA recortes que já existem. É exatamente a mesma
 * operação que o site faz em tempo de execução, onde a marca é uma máscara alfa
 * pintada com `background-color: currentColor` (D-33). A diferença é só o
 * momento: no navegador dá para pintar com CSS; num PNG de favicon e numa imagem
 * de Open Graph, não dá, porque nem um nem outro passam por CSS.
 *
 * Ele NÃO redesenha, NÃO vetoriza, NÃO recorta a silhueta e NÃO inventa símbolo.
 * A regra 15 continua valendo inteira. Se o recorte precisasse mudar de forma
 * para caber num quadrado, o certo seria pedir o símbolo isolado ao cliente, e é
 * o que a lista de pendências já registra.
 *
 * POR QUE A MÁSCARA PRECISA SER RECOLORIDA: os arquivos de origem são arte preta
 * com canal alfa. Desenhados sobre navy, ficariam pretos sobre navy, ou seja,
 * invisíveis. `.tint()` sozinho não serve porque preto absoluto não recebe tinta;
 * o caminho é extrair o alfa e usá-lo como máscara de um retângulo da cor certa.
 */

const RAIZ = process.cwd();
const ORIGEM = join(RAIZ, "public", "assets", "brand", "logo");

/** Tokens reais, copiados de src/styles/tokens.css. Se lá mudar, aqui muda. */
const COR = {
  navy: { r: 15, g: 35, b: 80 }, // --color-navy-600, o canvas da superfície navy
  bone: { r: 251, g: 250, b: 246 }, // --color-fg sobre navy
  gold: { r: 200, g: 162, b: 75 }, // --color-gold-500, o acento
};

/**
 * Pinta uma máscara alfa com uma cor sólida, preservando o antialiasing.
 * O alfa do original vira o alfa do resultado; o RGB é substituído inteiro.
 *
 * Devolve um Buffer, e não um pipeline, porque `joinChannel` sobre uma imagem
 * criada por `create` encerra a cadeia: um `.resize()` encadeado depois dele é
 * silenciosamente ignorado. Medido: a imagem saía com as dimensões da origem.
 * Redimensionar exige abrir uma nova instância a partir do buffer.
 */
async function pintar(arquivo, cor) {
  const origem = sharp(join(ORIGEM, arquivo));
  const { width, height } = await origem.metadata();
  if (!width || !height) throw new Error(`sem dimensões: ${arquivo}`);

  const alfa = await origem.clone().extractChannel("alpha").toBuffer();

  return sharp({ create: { width, height, channels: 3, background: cor } })
    .joinChannel(alfa)
    .png()
    .toBuffer();
}

/** Compõe a marca centrada num quadrado da cor de fundo, com folga nas bordas. */
async function tile({ arquivo, lado, corMarca, fundo, folga }) {
  const marca = await pintar(arquivo, corMarca);
  const disponivel = Math.round(lado * (1 - folga * 2));

  const redimensionada = await sharp(marca)
    .resize({ width: disponivel, height: disponivel, fit: "inside" })
    .toBuffer();

  const dim = await sharp(redimensionada).metadata();
  if ((dim.width ?? 0) > lado || (dim.height ?? 0) > lado) {
    throw new Error(`marca ${dim.width}x${dim.height} não cabe em ${lado}x${lado}`);
  }

  return sharp({
    create: { width: lado, height: lado, channels: 4, background: { ...fundo, alpha: 1 } },
  })
    .composite([{ input: redimensionada, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Gera o AVIF de cada máscara, ao lado do PNG.
 *
 * Por que vale: as máscaras somam 190KB de PNG, e são o segundo maior item da
 * página depois das fontes. Em AVIF ficam em 50KB, uma redução de 74%.
 *
 * Por que q85 e não q70, que seria menor ainda: o que está sendo comprimido é o
 * canal ALFA, e aqui o alfa não é transparência acessória, é a própria arte.
 * Medido contra o PNG, pixel a pixel: em q85 o erro médio do alfa é 0.5 em 255,
 * o máximo é 8, e NENHUM pixel passa de 8. Em q70 o máximo sobe para 14. A
 * diferença entre os dois é de uns 5KB por arquivo, e não vale arriscar borda
 * suja numa marca.
 *
 * O PNG continua existindo e continua sendo o que o CSS declara primeiro. O AVIF
 * entra por `image-set()`, então navegador que não o decodifica cai no PNG em
 * vez de mostrar um retângulo colorido no lugar da marca.
 */
async function avifDasMascaras() {
  const nomes = ["marca-completa", "marca-aguia", "marca-wordmark", "marca-livro"];
  const saidas = [];
  for (const nome of nomes) {
    const avif = await sharp(join(ORIGEM, `${nome}.png`))
      .avif({ quality: 85, effort: 6 })
      .toBuffer();
    await writeFile(join(ORIGEM, `${nome}.avif`), avif);
    saidas.push([nome, avif.length, statSync(join(ORIGEM, `${nome}.png`)).size]);
  }
  return saidas;
}

/**
 * GRÃO DE PAPEL.
 *
 * O north star do projeto é um diário de bordo, e as superfícies eram cor
 * chapada. O grão dá matéria a elas, e é a mesma família de textura das peças de
 * identidade do cliente (ver `texture-linen`).
 *
 * POR QUE UM PNG GERADO, E NÃO `feTurbulence` EM SVG EMBUTIDO, que seria zero
 * arquivo: porque `feTurbulence` é implementado de forma diferente por cada
 * renderizador, e a calibragem depende de números exatos. Medido no rasterizador
 * usado aqui, a média do ruído saía em **187, não em 128**, o que sob mesclagem
 * empurrava toda superfície para o cinza: o pergaminho escurecia 16 níveis e o
 * navy clareava 19. Calibrar contra um renderizador e servir para outro não é
 * calibrar. Um PNG gerado tem média exata e o mesmo resultado em todo lugar.
 *
 * A MÉDIA É EXATAMENTE 128 de propósito. O CSS mescla em `overlay`, onde cinza
 * médio é a identidade: assim o grão adiciona variação sem deslocar a cor da
 * superfície. Medido: deslocamento de 0,25 nível, desvio de 2 níveis.
 *
 * Dois arquivos, porque `overlay` amplifica muito mais sobre fundo escuro: o
 * mesmo ruído que dá grão discreto no pergaminho vira sujeira visível no navy.
 *
 * 64x64 com cinco níveis quantizados: 1,3KB cada. Ruído puro não comprime, então
 * o tamanho vem de reduzir ladrilho e número de níveis, e nenhum dos dois se
 * percebe numa amplitude tão baixa.
 */
async function graoDePapel() {
  const LADO = 64;
  const NIVEIS = 5;

  /** Gaussiano por Box-Muller, com gerador próprio para a saída ser reproduzível. */
  const gerar = (sigma, semente) => {
    let s = semente;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    const buf = Buffer.alloc(LADO * LADO);
    const passo = (sigma * 6) / NIVEIS;
    for (let i = 0; i < LADO * LADO; i++) {
      const u = Math.max(rnd(), 1e-9);
      const v = rnd();
      const g = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      const x = 128 + Math.round((g * sigma) / passo) * passo;
      buf[i] = Math.max(0, Math.min(255, Math.round(x)));
    }
    return buf;
  };

  const saidas = [];
  for (const [nome, sigma, semente] of [
    ["grao-claro", 20, 777], // superfície de leitura (pergaminho)
    ["grao-escuro", 8, 4242], // navy e ink, onde `overlay` amplifica mais
  ]) {
    const png = await sharp(gerar(sigma, semente), {
      raw: { width: LADO, height: LADO, channels: 1 },
    })
      .png({ compressionLevel: 9, effort: 10, palette: true, colours: 16 })
      .toBuffer();
    await writeFile(join(RAIZ, "public", "assets", "textura", `${nome}.png`), png);
    saidas.push([nome, png.length]);
  }
  return saidas;
}

async function main() {
  // Fora de `public/`: são lidos só em tempo de build, pelo gerador de Open
  // Graph. Em `public/` seriam servidos e nunca baixados.
  const derivados = join(RAIZ, "assets", "brand", "derivados");
  await mkdir(derivados, { recursive: true });

  // 1. Marca em bone, para as imagens de Open Graph (desenhadas sobre navy).
  //    O `next/og` não passa por CSS, então lá a máscara não tem como ser
  //    pintada por `currentColor`: precisa chegar já na cor certa.
  const claras = [
    ["marca-aguia.png", "aguia-bone.png"],
    ["marca-completa.png", "completa-bone.png"],
  ];
  const gerados = [];
  for (const [origem, destino] of claras) {
    const png = await pintar(origem, COR.bone);
    await writeFile(join(derivados, destino), png);
    gerados.push([destino, png]);
  }

  // 2. Ícones do aplicativo, e a variação MUDA COM O TAMANHO.
  //
  //    Isto foi decidido olhando, não argumentando. Os três recortes foram
  //    renderizados em 16 e em 32 e ampliados para comparação:
  //
  //      completa (2.06:1)  32px: "PRIME" ilegível sob a águia; 16px: borrão
  //      wordmark (2.08:1)  32px: "PRIME" NÍTIDO;               16px: textura
  //      aguia    (4.86:1)  32px: silhueta limpa, sem nome;     16px: asa
  //
  //    A completa perdia nos dois tamanhos, e perdia por um motivo estrutural:
  //    ela empilha TRÊS elementos (águia, PRIME, livro) na mesma altura em que
  //    a wordmark empilha dois, então cada um recebe menos da metade dos pixels.
  //
  //    Usar a wordmark no ícone de aba não é exceção à regra da marca, é a regra
  //    aplicada: "quando o espaço não comporta a águia, use wordmark" (ver
  //    `Wordmark.tsx`). Um quadrado de 32px não comporta uma marca de 4.86:1, e
  //    variar a aplicação por papel é o que a regra 15 pede.
  //
  //    Nos tamanhos grandes continua a COMPLETA: ali cabe a assinatura inteira,
  //    e é o que aparece na tela inicial do telefone.
  //
  //    CADA TAMANHO É RENDERIZADO DA ORIGEM, não reduzido a partir do maior. A
  //    marca é linha fina, e reduzir 512 para 16 no navegador apaga a linha:
  //    medido, sobravam 10 pixels com tinta em 256. Redimensionar a partir do
  //    original de 760px deixa o reamostrador trabalhar com informação real.
  //
  //    A folga é 8%, e não os 14% de antes, pelo mesmo motivo: num ícone de aba
  //    cada pixel de moldura é um pixel a menos de marca. Com folga 0 a wordmark
  //    encosta nas duas bordas, e navegador que arredonda o canto comeria o E.
  //
  //    O símbolo isolado que a lista de pendências pede ao cliente continua
  //    sendo a solução real para 16px. Isto é o melhor que dá com os recortes
  //    que existem, e agora é o melhor medido, não o melhor suposto.
  const icones = [
    { nome: "icon.png", lado: 32, arquivo: "marca-wordmark.png" },
    { nome: "icon1.png", lado: 192, arquivo: "marca-completa.png" },
    { nome: "icon2.png", lado: 512, arquivo: "marca-completa.png" },
    { nome: "apple-icon.png", lado: 180, arquivo: "marca-completa.png" },
  ];
  for (const { nome, lado, arquivo } of icones) {
    const png = await tile({
      arquivo,
      lado,
      corMarca: COR.bone,
      fundo: COR.navy,
      folga: 0.08,
    });
    await writeFile(join(RAIZ, "src", "app", nome), png);
    console.log(
      `  src/app/${nome}  ${lado}x${lado}  ${arquivo.replace("marca-", "").replace(".png", "")}  ${(png.length / 1024).toFixed(1)}KB`,
    );
  }

  for (const [nome, png] of gerados) {
    const meta = await sharp(png).metadata();
    console.log(
      `  assets/brand/derivados/${nome}  ${meta.width}x${meta.height}  ${(png.length / 1024).toFixed(1)}KB`,
    );
  }
  // 3. AVIF das máscaras, para o site servir em vez do PNG onde o navegador der.
  let somaPng = 0;
  let somaAvif = 0;
  for (const [nome, bytesAvif, bytesPng] of await avifDasMascaras()) {
    somaPng += bytesPng;
    somaAvif += bytesAvif;
    console.log(
      `  public/assets/brand/logo/${nome}.avif  ${(bytesAvif / 1024).toFixed(1)}KB  (PNG tem ${(bytesPng / 1024).toFixed(1)}KB)`,
    );
  }
  console.log(
    `  mascaras: ${(somaPng / 1024).toFixed(1)}KB em PNG, ${(somaAvif / 1024).toFixed(1)}KB em AVIF (${Math.round((1 - somaAvif / somaPng) * 100)}% menos)`,
  );

  // 4. Grão de papel, para as superfícies terem matéria.
  await mkdir(join(RAIZ, "public", "assets", "textura"), { recursive: true });
  for (const [nome, bytes] of await graoDePapel()) {
    console.log(`  public/assets/textura/${nome}.png  ${(bytes / 1024).toFixed(2)}KB`);
  }

  console.log("\nassets derivados gerados a partir dos recortes existentes.");
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
