import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";

export const alt = "Quatro caminhos para a carreira militar.";
export const size = tamanhoOg;
export const contentType = tipoOg;

/** O cartão repete a promessa da própria página, e não a da home: quem
 *  compartilha esta URL está falando deste assunto, não do site inteiro. */
export default function Imagem() {
  return imagemOg({ eyebrow: "Concursos", titulo: "Quatro caminhos para a carreira militar." });
}
