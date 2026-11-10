/**
 * Família de ícones própria — traço de linha uniforme, geométrico, monocromático.
 * Extraída do estilo das peças da marca (ver docs/planning/visual-identity-analysis.md § 6).
 *
 * Deliberadamente NÃO é uma biblioteca genérica: o briefing veta "ícone Lucide em
 * cada bloco apenas para preencher espaço" (D-12). Só existe ícone quando ele
 * carrega significado — nunca como enfeite de cartão.
 *
 * Todos são decorativos por padrão (`aria-hidden`): o significado está sempre no
 * texto ao lado. Exceção: ícones de marca no footer, que recebem rótulo próprio.
 */

type IconProps = {
  className?: string;
  /** Torna o ícone perceptível a leitores de tela, com este rótulo. */
  title?: string;
};

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: props.className,
    "aria-hidden": props.title ? undefined : true,
    role: props.title ? ("img" as const) : undefined,
  };
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M3.8 20.2l1.2-3.5A8.2 8.2 0 1 1 7.9 19.4l-4.1.8z" />
      <path d="M9 9.2c.2 1 .8 2.1 1.7 3s2 1.5 3 1.7l.9-1.2 2 .9-.2 1.4c-1.7.5-3.9-.4-5.5-2s-2.5-3.8-2-5.5l1.4-.2.9 2z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Bússola — acompanhamento individualizado: cada aluno tem um rumo próprio. */
export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.2 8.8l-1.9 4.4-4.4 1.9 1.9-4.4z" />
    </svg>
  );
}

/** Régua graduada — a planilha individual de desempenho. */
export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M3.5 17.5h17" />
      <path d="M6.5 17.5v-3M10 17.5V9.5M13.5 17.5v-5.5M17 17.5V6.5" />
    </svg>
  );
}

/** Pena — correção individual de questões, simulados e redações. */
export function QuillIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4.5 19.5c0-6 4-11 15-12-1 11-6 15-12 15" />
      <path d="M4.5 19.5c3-3 6-4.5 9.5-5.5" />
    </svg>
  );
}

/** Alvo — simulados periódicos, intensificados na aproximação das provas. */
export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Relógio — reforço fora do horário regular quando o desempenho indicar. */
export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** Louros — bolsas por desempenho. */
export function LaurelIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M9 20c-3-1.5-4.5-4.5-4.5-8S6 5.5 9 4" />
      <path d="M15 20c3-1.5 4.5-4.5 4.5-8S18 5.5 15 4" />
      <path d="M9.5 12.5l2 2 3.5-4" />
    </svg>
  );
}

/** Camadas — preparação para mais de um concurso no mesmo ciclo. */
export function LayersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M12 3.5l8.5 4.2-8.5 4.3-8.5-4.3z" />
      <path d="M3.5 12.2L12 16.5l8.5-4.3" />
      <path d="M3.5 16.4L12 20.7l8.5-4.3" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 7.5h16M4 12h16M4 16.5h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Púlpito — professores especializados: quem sobe para ensinar a matéria.
 *  Substituiu uma estrela-insígnia genérica, que é vocabulário de ícone de IA e
 *  não dizia nada sobre ensinar. */
export function PulpitoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 6h16l-2.2 7H6.2z" />
      <path d="M12 13v5.5" />
      <path d="M8 18.5h8" />
    </svg>
  );
}

/** Mapa de ícones dos diferenciais, indexado pelo campo `icone` do conteúdo. */
export const diferencialIcons = {
  compass: CompassIcon,
  chart: GaugeIcon,
  quill: QuillIcon,
  target: TargetIcon,
  clock: ClockIcon,
  laurel: LaurelIcon,
  layers: LayersIcon,
  pulpito: PulpitoIcon,
} as const;

export type DiferencialIconName = keyof typeof diferencialIcons;
