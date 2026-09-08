import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './CircleIconButton.module.css';

export interface CircleIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  'aria-label': string;
}

export function CircleIconButton({ children, className, type = 'button', ...rest }: CircleIconButtonProps) {
  const classes = [styles.button, className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
