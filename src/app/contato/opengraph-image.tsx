import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";

export const alt = "Sem formulário. Só uma conversa.";
export const size = tamanhoOg;
export const contentType = tipoOg;

/** O cartão repete a promessa da própria página, e não a da home: quem
 *  compartilha esta URL está falando deste assunto, não do site inteiro. */
export default function Imagem() {
  return imagemOg({ eyebrow: "Contato", titulo: "Sem formulário. Só uma conversa." });
}
