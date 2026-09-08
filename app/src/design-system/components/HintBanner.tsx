import type { ReactNode } from 'react';
import styles from './HintBanner.module.css';

export interface HintBannerProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

/** Pílula turquesa usada em "Próxima pista", "Resta 1 tentativa" e status da Rede da Vida. */
export function HintBanner({ children, onClick, disabled, fullWidth }: HintBannerProps) {
  const classes = [styles.banner, onClick && styles.button, fullWidth && styles.full].filter(Boolean).join(' ');
  const icon = (
    <span className={styles.icon} aria-hidden="true">
      ?
    </span>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} disabled={disabled}>
        {icon}
        {children}
      </button>
    );
  }

  return (
    <div className={classes} role="status">
      {icon}
      {children}
    </div>
  );
}
