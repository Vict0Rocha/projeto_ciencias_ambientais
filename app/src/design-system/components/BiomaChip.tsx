import { getBioma } from '../../domain/especiesRepository';
import type { BiomaId } from '../../domain/types';
import { Pill } from './Pill';

export function BiomaChip({ bioma, suffix, className }: { bioma: BiomaId; suffix?: string; className?: string }) {
  const { nome, cor } = getBioma(bioma);
  return (
    <Pill background={cor} color="#f4fcf4" className={className}>
      {nome}
      {suffix ? ` · ${suffix}` : ''}
    </Pill>
  );
}

/** Quadradinho de cor usado em rótulos mono ("CERRADO · FASE 7", filtros da Coleção). */
export function BiomaSwatch({ bioma, size = 10 }: { bioma: BiomaId; size?: number }) {
  const { cor, nome } = getBioma(bioma);
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: 3,
        background: cor,
      }}
      title={nome}
    />
  );
}
