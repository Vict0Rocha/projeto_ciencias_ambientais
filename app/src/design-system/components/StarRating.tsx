export function StarRating({ estrelas, max = 3 }: { estrelas: number; max?: number }) {
  return (
    <span
      aria-label={`${estrelas} de ${max} estrelas`}
      style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 2, color: 'var(--color-accent-lime-text)' }}
    >
      {Array.from({ length: max }, (_, index) => (index < estrelas ? '★' : '☆')).join('')}
    </span>
  );
}
