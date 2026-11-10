"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/cn";
import { Cta } from "@/components/ui/Cta";
import { Wordmark } from "@/components/layout/Wordmark";
import { CloseIcon, MenuIcon } from "@/components/decorative/icons";

/**
 * Header fixo. Client component por causa do menu mobile e do estado de rolagem.
 *
 * A navegação deriva de `mainNav` (src/content/navigation.ts) — nenhum item é
 * duplicado à mão.
 *
 * CAMADA PRÓPRIA: o header usa `canvas-alt`, um degrau tonal MAIS ESCURO que o
 * conteúdo, com luz no topo e filete na base. Antes ele usava `canvas`, o mesmo
 * navy do hero, e por isso se fundia com a abertura: a navegação parecia perdida
 * dentro dela. A separação é composicional, não `background + box-shadow`, e sem
 * blur — glassmorphism está vetado na direção da marca.
 *
 * DOIS ESTADOS: no topo ele é integrado mas identificável; após rolar comprime a
 * altura e ganha elevação real. A altura é a única coisa que muda de layout, e
 * como o header é `fixed`, o conteúdo abaixo não salta.
 *
 * BREAKPOINT DA NAVEGAÇÃO: `xl` (1280), não `lg`. Medido: em 1024 o conteúdo do
 * header pede 1029px numa caixa de 944px — a barra com seis itens transbordava.
 * De 1024 a 1279 o usuário vê marca + CTA de matrícula + menu, então a conversão
 * continua visível no laptop e a navegação fica a um toque.
 * O WhatsApp só entra em `2xl`, onde sobra espaço de verdade.
 */
export function Header() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const pathname = usePathname();
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Painel aberto: trava a rolagem, prende o foco, Esc fecha e devolve o foco.
  useEffect(() => {
    if (!aberto) return;

    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        gatilhoRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !painelRef.current) return;

      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) return;

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    painelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [aberto]);

  const ativo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-surface="navy"
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--layer-header)] transition-[box-shadow] duration-[var(--duration-base)]",
        rolou || aberto ? "header-rolado" : "header-topo",
      )}
    >
      <div
        className={cn(
          "container-wide flex items-center justify-between gap-6 transition-[height] duration-[var(--duration-base)] ease-[var(--ease-out-quart)]",
          // Com o menu aberto o header não comprime: o painel ancora em `top-16`,
          // e um header de 56px deixaria uma fresta mostrando a página atrás.
          rolou && !aberto ? "h-14 xl:h-16" : "h-16 xl:h-20",
        )}
      >
        <Wordmark variacao="aguia" altura="1.625rem" />

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-6 2xl:gap-7">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex py-1 text-label-caps whitespace-nowrap transition-colors duration-[var(--duration-fast)]",
                    ativo(item.href) ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {/* Filete que corre sob o rótulo, no vocabulário de trilho do
                      Diário de Bordo. O losango anterior media 10px e era
                      imperceptível como estado ativo. */}
                  <span
                    aria-hidden
                    className={cn(
                      "marcador-nav",
                      ativo(item.href) ? "marcador-nav-ativo" : "group-hover:marcador-nav-hover",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Cta
            intent="whatsapp"
            variant="secondary"
            size="sm"
            section="header"
            /* Só a partir de 2xl: entre lg e xl o header já carrega logo, seis
               itens de navegação e o CTA de matrícula — o WhatsApp transbordava. */
            className="hidden 2xl:inline-flex"
          />
          <Cta
            intent="matricula"
            variant="primary"
            size="sm"
            label="Matrícula"
            section="header"
            className="hidden sm:inline-flex"
          />

          <button
            ref={gatilhoRef}
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-fg xl:hidden"
          >
            {aberto ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      {/* LINHA DE LEITURA — filete de progresso na base do header. Não é
          enfeite: as páginas deste site são longas, e ele responde "quanto
          falta", que é a pergunta de quem está rolando. Mesmo vocabulário do
          marcador de item ativo, aplicado ao eixo vertical. Sem JavaScript:
          `animation-timeline: scroll()` amarra o filete à barra de rolagem do
          documento. Sem suporte no navegador, ele simplesmente não existe. */}
      <span aria-hidden className="linha-leitura" />

      {/* Painel mobile — full-screen navy, itens em escala editorial.
          A entrada é CSS (`painel-menu`), e a saída é instantânea. Era `motion`
          com `AnimatePresence`, e essa era a única coisa no projeto que ainda
          usava a biblioteca: 46KB comprimidos em toda página por causa de uma
          animação de menu. Manter a saída animada era justamente o que exigia a
          biblioteca, porque obriga a manter o elemento montado depois do fim da
          intenção. Fechar na hora é o que menu nativo faz. */}
      {aberto ? (
        <div
          id="menu-mobile"
          ref={painelRef}
          /* O painel rola por conta própria; sem isto a roda do mouse
             continuaria movendo a página atrás dele. */
          data-lenis-prevent
          className="painel-menu fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-canvas shadow-[var(--shadow-overlay)] xl:hidden"
        >
          <nav aria-label="Navegação principal (mobile)" className="container-wide py-8">
            <ul className="flex flex-col">
              {mainNav.map((item, i) => (
                <li
                  key={item.href}
                  className="entrada-item-menu border-b border-hairline"
                  style={{ "--pp-i": i } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    data-touch-target
                    onClick={() => setAberto(false)}
                    aria-current={ativo(item.href) ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="w-8 shrink-0 text-inscription text-[0.75rem] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-[family-name:var(--font-display)] text-[length:var(--text-h3)] leading-tight",
                        ativo(item.href) ? "text-accent" : "text-fg",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <Cta intent="matricula" variant="primary" section="menu-mobile" />
              <Cta intent="whatsapp" variant="secondary" section="menu-mobile" />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
