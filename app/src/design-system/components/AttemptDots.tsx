import { MAX_TENTATIVAS } from '../../domain/scoring';

/** HUD de tentativas: quadradinhos — disponível em lima, gasto em cinza-esverdeado. */
export function AttemptDots({ tentativasRestantes }: { tentativasRestantes: number }) {
  return (
    <span
      role="status"
      aria-label={`${tentativasRestantes} de ${MAX_TENTATIVAS} tentativas restantes`}
      style={{ display: 'flex', gap: 5, alignItems: 'center' }}
    >
      {Array.from({ length: MAX_TENTATIVAS }, (_, index) => {
        const disponivel = index < tentativasRestantes;
        return (
          <span
            key={index}
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: disponivel ? 'var(--color-accent-lime)' : 'var(--color-attempt-spent)',
            }}
          />
        );
      })}
    </span>
  );
}
