import type { HTMLAttributes } from 'react';
import styles from './Pill.module.css';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  background?: string;
  color?: string;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'sm';
}

export function Pill({ background, color, variant = 'solid', size = 'md', className, style, ...rest }: PillProps) {
  const classes = [styles.pill, styles[size], variant === 'outline' && styles.outline, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span
      className={classes}
      style={{ background: variant === 'solid' ? background : undefined, color, ...style }}
      {...rest}
    />
  );
}
