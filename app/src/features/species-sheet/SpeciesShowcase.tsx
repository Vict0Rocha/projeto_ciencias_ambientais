import { useState } from 'react';
import { getBioma, getFotoAltText } from '../../domain/especiesRepository';
import type { Especie } from '../../domain/types';
import { StatusBadge } from '../../design-system/components/StatusBadge';
import { BiomaChip } from '../../design-system/components/BiomaChip';
import styles from './SpeciesShowcase.module.css';

/** Card de espécie visível durante o desafio (ex.: Função na Natureza) — diferente
 * da ficha educativa (com flip) e do teaser de resultado (mais compacto). */
export function SpeciesShowcase({ especie }: { especie: Especie }) {
  const [fotoCarregada, setFotoCarregada] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.photoWrap}>
        <div className={styles.stripe} aria-hidden="true">
          {especie.biomas.map((biomaId) => (
            <span key={biomaId} className={styles.stripeSegment} style={{ background: getBioma(biomaId).cor }} />
          ))}
        </div>
        <img
          src={`/${especie.foto}`}
          alt={getFotoAltText(especie)}
          className={`${styles.photo} ${fotoCarregada ? styles.photoLoaded : ''}`}
          onLoad={() => setFotoCarregada(true)}
        />
      </div>
      <span className={styles.name}>{especie.nome}</span>
      <span className={styles.metaRow}>
        <StatusBadge status={especie.status} size="sm" />
        {especie.biomas.map((id) => (
          <BiomaChip key={id} bioma={id} />
        ))}
      </span>
    </div>
  );
}
