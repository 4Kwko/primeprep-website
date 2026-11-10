import { diferencialIcons, type DiferencialIconName } from "@/components/decorative/icons";
import { cn } from "@/lib/cn";

/**
 * Marcador visual de um diferencial.
 *
 * Cada glifo é desenhado para o significado específico do item: bússola para
 * rumo individual, régua graduada para a planilha de desempenho, pena para
 * correção, púlpito para quem ensina. Nenhum é estrela, faísca ou raio, que é o
 * vocabulário genérico de ícone de IA e não diz nada sobre o conteúdo.
 *
 * Todos são quadrados e do mesmo traço, para que a coluna de texto alinhe.
 * O significado vive no texto ao lado; isto é reforço visual.
 */
export function IconeDiferencial({ nome, className }: { nome: string; className?: string }) {
  const Glifo = diferencialIcons[nome as DiferencialIconName];
  if (!Glifo) return null;

  return <Glifo className={cn("size-5", className)} />;
}
