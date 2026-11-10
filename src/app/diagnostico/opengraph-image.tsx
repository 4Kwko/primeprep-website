import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";

export const alt = "Diagnóstico: qual concurso militar serve para você";
export const size = tamanhoOg;
export const contentType = tipoOg;

/**
 * O cartão do diagnóstico é o mais importante depois do da home: é este link que
 * vai na bio do Instagram e no meio de conversa. O título é a pergunta, e não o
 * nome da ferramenta, porque quem vê o cartão está decidindo se clica.
 */
export default function Imagem() {
  return imagemOg({
    eyebrow: "Quatro perguntas",
    titulo: "Qual concurso militar serve para você?",
  });
}
