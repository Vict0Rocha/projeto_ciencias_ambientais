import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Overlay.module.css';

export interface OverlayProps {
  open: boolean;
  onClose?: () => void;
  ariaLabel: string;
  /** largura máxima do modal no desktop; no mobile é sempre bottom-sheet full-width */
  maxWidthDesktop?: number;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Pilha de overlays abertos ao mesmo tempo (acontece de verdade: o ResultPopup de
 * acerto/erro já é um Overlay, e seu botão "Ver a ficha completa" abre outro por
 * cima, sem fechar o primeiro). Só o topo da pilha reage a Tab/Esc — os de baixo já
 * ficam cobertos visualmente pelo backdrop de cima, então isso só afeta teclado.
 * O travamento de scroll do body e o `inert` da árvore principal usam contagem de
 * referência: só destravam quando o último overlay fecha.
 */
const pilhaDeOverlays: symbol[] = [];
let overlaysAbertos = 0;
let overflowOriginalDoBody: string | null = null;
let overflowOriginalDoHtml: string | null = null;

export function Overlay({ open, onClose, ariaLabel, maxWidthDesktop, children }: OverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Symbol('overlay'));

  useEffect(() => {
    if (!open) return;
    contentRef.current?.focus();

    const id = idRef.current;
    const raizApp = document.getElementById('root');
    pilhaDeOverlays.push(id);
    overlaysAbertos += 1;
    if (overlaysAbertos === 1) {
      // `html` (não só `body`) precisa travar: o layout usa `#root { height: 100% }`,
      // então quem estoura e vira o elemento de rolagem real é o documentElement.
      overflowOriginalDoBody = document.body.style.overflow;
      overflowOriginalDoHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    raizApp?.setAttribute('inert', '');

    function ehTopoDaPilha() {
      return pilhaDeOverlays[pilhaDeOverlays.length - 1] === id;
    }

    function prenderFoco(event: KeyboardEvent) {
      const container = contentRef.current;
      if (!container) return;
      const focaveis = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focaveis.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const ativo = document.activeElement;
      const dentro = ativo instanceof Node && container.contains(ativo);
      if (event.shiftKey) {
        if (!dentro || ativo === primeiro) {
          event.preventDefault();
          ultimo.focus();
        }
      } else if (!dentro || ativo === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!ehTopoDaPilha()) return;
      if (event.key === 'Escape') {
        onClose?.();
      } else if (event.key === 'Tab') {
        prenderFoco(event);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const indice = pilhaDeOverlays.indexOf(id);
      if (indice !== -1) pilhaDeOverlays.splice(indice, 1);
      overlaysAbertos -= 1;
      if (overlaysAbertos === 0) {
        document.body.style.overflow = overflowOriginalDoBody ?? '';
        document.documentElement.style.overflow = overflowOriginalDoHtml ?? '';
        raizApp?.removeAttribute('inert');
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={contentRef}
        className={styles.content}
        style={maxWidthDesktop ? ({ '--overlay-max-width': `${maxWidthDesktop}px` } as React.CSSProperties) : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
