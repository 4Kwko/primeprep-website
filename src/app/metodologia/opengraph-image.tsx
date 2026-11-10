import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";

export const alt = "Medir, corrigir, ajustar e repetir até a prova.";
export const size = tamanhoOg;
export const contentType = tipoOg;

/** O cartão repete a promessa da própria página, e não a da home: quem
 *  compartilha esta URL está falando deste assunto, não do site inteiro. */
export default function Imagem() {
  return imagemOg({
    eyebrow: "Metodologia",
    titulo: "Medir, corrigir, ajustar e repetir até a prova.",
  });
}
