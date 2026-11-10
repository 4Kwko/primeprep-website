import { describe, it, expect } from "vitest";
import { concursos } from "./concursos";
import {
  perguntas,
  diagnosticar,
  completo,
  patenteDe,
  faixaEmNumeros,
  type Respostas,
  type IdIntencao,
} from "./diagnostico";

/**
 * O diagnóstico é a única coisa do site que RESPONDE alguma coisa, em vez de
 * apenas informar. Errado, ele manda a pessoa para o concurso errado, e isso é
 * pior que não existir. Por isso é a lógica mais testada do projeto.
 *
 * A abordagem é exaustiva, não amostral: são 180 combinações possíveis de
 * resposta, um número pequeno o bastante para percorrer inteiro. Testar por
 * amostra aqui seria escolher não descobrir. As duas correções que este arquivo
 * documenta (empate de três e idade resolvendo sozinha) só aparecem em
 * combinações específicas que ninguém tentaria à mão.
 */

/** Todas as combinações possíveis de resposta. */
function todasAsCombinacoes(): Respostas[] {
  const porPergunta = perguntas.map((p) => p.opcoes.map((o) => o.valor));
  let acumulado: Respostas[] = [{}];
  perguntas.forEach((pergunta, i) => {
    const valores = porPergunta[i] ?? [];
    acumulado = acumulado.flatMap((parcial) =>
      valores.map((valor) => ({ ...parcial, [pergunta.id]: valor })),
    );
  });
  return acumulado;
}

const combinacoes = todasAsCombinacoes();

describe("dados derivados de concursos.ts", () => {
  it("deriva a patente de todos os quatro concursos", () => {
    for (const c of concursos) {
      expect(patenteDe(c), `${c.sigla} sem patente derivável`).not.toBeNull();
    }
  });

  it("extrai a faixa etária de todos os quatro, com min menor que max", () => {
    for (const c of concursos) {
      const faixa = faixaEmNumeros(c);
      expect(faixa, `${c.sigla} sem faixa extraível`).not.toBeNull();
      expect(faixa!.min).toBeLessThan(faixa!.max);
      expect(faixa!.min).toBeGreaterThanOrEqual(16);
      expect(faixa!.max).toBeLessThanOrEqual(40);
    }
  });

  it("falha ABERTA: texto de faixa irreconhecível vira ausência de restrição", () => {
    const inventado = {
      ...concursos[0]!,
      faixaEtaria: { valor: "conforme o edital", verifiedAt: null },
    };
    // Nunca `{min: NaN}` nem exceção: `null` significa "sem restrição", e sem
    // restrição ninguém é eliminado. Eliminar alguém por causa de um padrão que
    // deixou de casar seria o pior resultado possível desta ferramenta.
    expect(faixaEmNumeros(inventado)).toBeNull();
  });

  it("não usa nenhuma tabela paralela: só existem os concursos de concursos.ts", () => {
    const r: Respostas = { idade: "17a22", forca: "", patente: "", prova: "" };
    const d = diagnosticar(r);
    const slugs = [...d.recomendados, ...d.demais].map((x) => x.concurso.slug).sort();
    expect(slugs).toEqual(concursos.map((c) => c.slug).sort());
  });
});

describe("as quatro perguntas", () => {
  it("cobre as quatro intenções, sem repetir id", () => {
    const ids = perguntas.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.sort()).toEqual((["forca", "idade", "patente", "prova"] as IdIntencao[]).sort());
  });

  it("toda pergunta tem ao menos duas opções e rótulos únicos", () => {
    for (const p of perguntas) {
      expect(p.opcoes.length, `${p.id} com opções demais ou de menos`).toBeGreaterThanOrEqual(2);
      const rotulos = p.opcoes.map((o) => o.rotulo);
      expect(new Set(rotulos).size, `${p.id} com rótulo repetido`).toBe(rotulos.length);
    }
  });

  it("só a idade não oferece saída neutra: as outras três aceitam não decidir", () => {
    for (const p of perguntas) {
      const temNeutra = p.opcoes.some((o) => o.valor === "");
      if (p.id === "idade") expect(temNeutra).toBe(false);
      else expect(temNeutra, `${p.id} deveria aceitar "tanto faz"`).toBe(true);
    }
  });

  it("`completo` só é verdadeiro com as quatro respondidas", () => {
    expect(completo({})).toBe(false);
    expect(completo({ idade: "17a22" })).toBe(false);
    expect(completo({ idade: "17a22", forca: "exercito", patente: "oficial" })).toBe(false);
    expect(completo({ idade: "17a22", forca: "", patente: "", prova: "" })).toBe(true);
  });
});

describe("invariantes, nas 180 combinações", () => {
  it("percorre exatamente 180 combinações", () => {
    expect(combinacoes.length).toBe(180);
  });

  it("nenhum concurso some nem duplica", () => {
    for (const r of combinacoes) {
      const d = diagnosticar(r);
      const todos = [...d.recomendados, ...d.demais];
      expect(todos.length, JSON.stringify(r)).toBe(concursos.length);
      const slugs = todos.map((x) => x.concurso.slug);
      expect(new Set(slugs).size, JSON.stringify(r)).toBe(slugs.length);
    }
  });

  it("nunca recomenda alguém fora da faixa de referência", () => {
    for (const r of combinacoes) {
      const d = diagnosticar(r);
      expect(
        d.recomendados.filter((x) => x.foraDaFaixa),
        JSON.stringify(r),
      ).toHaveLength(0);
    }
  });

  it("todo recomendado carrega ao menos um motivo", () => {
    for (const r of combinacoes) {
      for (const rec of diagnosticar(r).recomendados) {
        expect(rec.motivos.length, `${rec.concurso.sigla} em ${JSON.stringify(r)}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it("estados não se contradizem", () => {
    for (const r of combinacoes) {
      const d = diagnosticar(r);
      if (d.todosForaDaFaixa) expect(d.recomendados, JSON.stringify(r)).toHaveLength(0);
      if (d.restringidoPorIdade) expect(d.semPreferencia, JSON.stringify(r)).toBe(true);
      if (d.recomendados.length > 0 && !d.restringidoPorIdade) {
        expect(d.semPreferencia, JSON.stringify(r)).toBe(false);
      }
    }
  });

  it("recomendados estão sempre empatados na maior pontuação", () => {
    for (const r of combinacoes) {
      const d = diagnosticar(r);
      if (d.restringidoPorIdade || d.recomendados.length === 0) continue;
      const pontos = new Set(d.recomendados.map((x) => x.pontos));
      expect(pontos.size, JSON.stringify(r)).toBe(1);
      const maiorDosDemais = Math.max(
        0,
        ...d.demais.filter((x) => !x.foraDaFaixa).map((x) => x.pontos),
      );
      expect(d.recomendados[0]!.pontos, JSON.stringify(r)).toBeGreaterThan(maiorDosDemais);
    }
  });

  it("nenhuma copy de motivo sai vazia ou com travessão", () => {
    for (const r of combinacoes) {
      for (const item of [...diagnosticar(r).recomendados, ...diagnosticar(r).demais]) {
        for (const motivo of item.motivos) {
          expect(motivo.trim().length).toBeGreaterThan(0);
          expect(motivo, "travessão proibido na copy pública (D-32)").not.toMatch(/[—–]/);
        }
      }
    }
  });
});

describe("os quatro caminhos canônicos", () => {
  const casos: [string, Respostas][] = [
    ["EsPCEx", { idade: "17a22", forca: "exercito", patente: "oficial", prova: "humanas" }],
    ["AFA", { idade: "17a22", forca: "aeronautica", patente: "oficial", prova: "fisica" }],
    ["EEAR", { idade: "17a22", forca: "aeronautica", patente: "graduado", prova: "fisica" }],
    ["EFOMM", { idade: "17a22", forca: "marinha", patente: "oficial", prova: "fisica" }],
  ];

  it.each(casos)("responde %s, sozinho", (sigla, respostas) => {
    const d = diagnosticar(respostas);
    expect(d.recomendados.map((x) => x.concurso.sigla)).toEqual([sigla]);
    expect(d.semPreferencia).toBe(false);
  });
});

describe("a idade", () => {
  const neutro = { forca: "", patente: "", prova: "" } as const;

  it("aos 24 sobra só a EEAR, e o motivo é a própria idade", () => {
    const d = diagnosticar({ idade: "24", ...neutro });
    expect(d.recomendados.map((x) => x.concurso.sigla)).toEqual(["EEAR"]);
    expect(d.restringidoPorIdade).toBe(true);
    expect(d.recomendados[0]!.motivos[0]).toMatch(/faixa de referência/i);
  });

  it("aos 23 sobram EEAR e EFOMM", () => {
    const d = diagnosticar({ idade: "23", ...neutro });
    expect(d.recomendados.map((x) => x.concurso.sigla).sort()).toEqual(["EEAR", "EFOMM"]);
  });

  it("aos 25 ou mais, nenhuma, e nada é recomendado", () => {
    const d = diagnosticar({ idade: "25mais", ...neutro });
    expect(d.todosForaDaFaixa).toBe(true);
    expect(d.recomendados).toHaveLength(0);
  });

  it("aos 16 não elimina ninguém: quem tem 16 vai ter 17", () => {
    const d = diagnosticar({ idade: "ate16", forca: "exercito", patente: "oficial", prova: "" });
    expect(d.aindaJovem).toBe(true);
    expect(d.todosForaDaFaixa).toBe(false);
    expect(d.recomendados.map((x) => x.concurso.sigla)).toEqual(["EsPCEx"]);
  });

  it("a preferência declarada vence a idade na ordem, mas nunca a contorna", () => {
    // Quer Exército, mas tem 24: a EsPCEx não pode ser recomendada mesmo sendo a
    // única do Exército. Ela aparece entre as demais, marcada como fora da faixa.
    const d = diagnosticar({ idade: "24", forca: "exercito", patente: "oficial", prova: "" });
    expect(d.recomendados.map((x) => x.concurso.sigla)).not.toContain("EsPCEx");
    const espcex = d.demais.find((x) => x.concurso.sigla === "EsPCEx");
    expect(espcex?.foraDaFaixa).toBe(true);
  });
});

describe("empates", () => {
  it("três concursos empatam quando a força fica em aberto mas a patente não", () => {
    // Esta é a combinação que a primeira versão da copy errava, dizendo
    // "duas combinam" para três resultados.
    const d = diagnosticar({ idade: "17a22", forca: "", patente: "oficial", prova: "" });
    expect(d.recomendados.map((x) => x.concurso.sigla).sort()).toEqual(["AFA", "EFOMM", "EsPCEx"]);
  });

  it("aponta qual pergunta afinaria o resultado", () => {
    const d = diagnosticar({ idade: "17a22", forca: "", patente: "oficial", prova: "" });
    expect(d.perguntaQueAfina).toBe("forca");

    const semPatente = diagnosticar({
      idade: "17a22",
      forca: "aeronautica",
      patente: "",
      prova: "fisica",
    });
    expect(semPatente.perguntaQueAfina).toBe("patente");
  });

  it("sem nenhuma preferência e sem corte de idade, não inventa recomendação", () => {
    const d = diagnosticar({ idade: "17a22", forca: "", patente: "", prova: "" });
    expect(d.semPreferencia).toBe(true);
    expect(d.recomendados).toHaveLength(0);
    expect(d.demais).toHaveLength(concursos.length);
  });
});
