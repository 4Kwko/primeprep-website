import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Credibilidade } from "@/components/sections/Credibilidade";
import { Concursos } from "@/components/sections/Concursos";
import { Metodologia } from "@/components/sections/Metodologia";
import { Professores } from "@/components/sections/Professores";
import { Bolsas } from "@/components/sections/Bolsas";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name}: ${site.tagline} em ${site.city}/${site.state}`,
  description:
    "Preparatório para EsPCEx, AFA, EEAR e EFOMM em São Gabriel/RS. Acompanhamento individual, planilha de desempenho por aluno, simulados periódicos e correção individual de questões e redações.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: ${site.tagline}`,
    description:
      "Preparatório para concursos militares em São Gabriel/RS, com acompanhamento individual do primeiro simulado à prova.",
    url: "/",
  },
};

/**
 * HOME — o diário de bordo, do hero ao fechamento.
 *
 * Ritmo de superfícies: navy (hero) → bone → bone → navy → bone → bone → navy →
 * ink (footer). A alternância é o que dá respiro à página longa.
 *
 * Ordem por decisão de produto (D-17): credibilidade primeiro, para o
 * responsável; concursos e metodologia em seguida, onde o aluno se encontra.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Credibilidade />
      <Concursos />
      <Metodologia />
      <Professores />
      <Bolsas />
      <CtaFinal />
    </>
  );
}
