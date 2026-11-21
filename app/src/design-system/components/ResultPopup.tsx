import type { ReactNode } from 'react';
import { Overlay } from './Overlay';
import { Pill } from './Pill';
import { Button } from './Button';
import { CircleIconButton } from './CircleIconButton';
import styles from './ResultPopup.module.css';

export interface ResultPopupProps {
  open: boolean;
  kind: 'acerto' | 'erro';
  titulo: string;
  seloTexto: string;
  corpo: ReactNode;
  children?: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** "X" pra fechar (+ Esc/backdrop, via Overlay) — mesmo efeito do botão principal. */
  onClose?: () => void;
}

/**
 * Popup de resultado compartilhado pelas 3 mecânicas (README: "Um popup para os
 * três jogos... Mesma estrutura... Só muda o conteúdo"). Bottom-sheet no mobile,
 * modal centralizado no desktop — via Overlay.
 */
export function ResultPopup({
  open,
  kind,
  titulo,
  seloTexto,
  corpo,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onClose,
}: ResultPopupProps) {
  return (
    <Overlay open={open} onClose={onClose} ariaLabel={titulo} maxWidthDesktop={620}>
      <div className={styles.inner}>
        {onClose && (
          <div className={styles.closeRow}>
            <CircleIconButton aria-label="Fechar" onClick={onClose}>
              ✕
            </CircleIconButton>
          </div>
        )}
        <span className={`${styles.icon} ${kind === 'acerto' ? styles.iconAcerto : styles.iconErro}`} aria-hidden="true">
          {kind === 'acerto' ? '✓' : '✕'}
        </span>
        <h2 className={styles.titulo}>{titulo}</h2>
        <Pill
          className={styles.selo}
          background={kind === 'acerto' ? 'var(--color-success-bg)' : 'var(--color-error-bg)'}
          color={kind === 'acerto' ? 'var(--color-success-ink)' : 'var(--color-error-ink)'}
        >
          {seloTexto}
        </Pill>
        {children}
        <p className={styles.corpo}>{corpo}</p>
        <div className={styles.acoes}>
          <Button variant="primary" fullWidth onClick={onPrimary}>
            {primaryLabel}
          </Button>
          {secondaryLabel && (
            <button type="button" className={styles.linkSecundario} onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </Overlay>
  );
}
