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

export function Overlay({ open, onClose, ariaLabel, maxWidthDesktop, children }: OverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    contentRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
