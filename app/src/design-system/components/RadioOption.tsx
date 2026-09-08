import styles from './RadioOption.module.css';

export type RadioOptionStatus = 'idle' | 'correct' | 'incorrect';

export interface RadioOptionProps {
  label: string;
  status: RadioOptionStatus;
  disabled?: boolean;
  onSelect: () => void;
}

export function RadioOption({ label, status, disabled = false, onSelect }: RadioOptionProps) {
  const classes = [styles.option, status === 'correct' && styles.correct, status === 'incorrect' && styles.incorrect]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} disabled={disabled} onClick={onSelect} aria-pressed={status !== 'idle'}>
      <span className={styles.marker} aria-hidden="true">
        {status === 'correct' ? '✓' : status === 'incorrect' ? '✕' : ''}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
