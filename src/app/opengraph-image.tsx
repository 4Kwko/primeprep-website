import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline} em ${site.city}/${site.state}`;
export const size = tamanhoOg;
export const contentType = tipoOg;

/** Cartão padrão do site. Vale para toda rota que não declara o seu. */
export default function Imagem() {
  return imagemOg({
    eyebrow: "Preparação militar",
    titulo: "Um plano por aluno, do primeiro simulado até a prova.",
  });
}
