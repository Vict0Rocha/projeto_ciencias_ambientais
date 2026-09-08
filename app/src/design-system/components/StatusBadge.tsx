import { getStatusConservacao } from '../../domain/especiesRepository';
import type { StatusConservacaoId } from '../../domain/types';
import { Pill } from './Pill';

export function StatusBadge({
  status,
  size = 'md',
  className,
}: {
  status: StatusConservacaoId;
  size?: 'md' | 'sm';
  className?: string;
}) {
  const { nome, bg, ink } = getStatusConservacao(status);
  return (
    <Pill background={bg} color={ink} size={size} className={className}>
      {nome.toUpperCase()}
    </Pill>
  );
}
