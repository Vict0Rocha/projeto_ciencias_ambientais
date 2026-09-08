import { getBioma, getFotoAltText } from '../../domain/especiesRepository';
import type { Especie } from '../../domain/types';
import { StatusBadge } from '../../design-system/components/StatusBadge';
import styles from './SpeciesTeaser.module.css';

/** Card compacto (foto + nome + status + biomas) embutido nos popups de resultado. */
export function SpeciesTeaser({ especie }: { especie: Especie }) {
  return (
    <div className={styles.teaser}>
      <img src={`/${especie.foto}`} alt={getFotoAltText(especie)} className={styles.photo} />
      <div className={styles.info}>
        <span className={styles.name}>{especie.nome}</span>
        <span className={styles.metaRow}>
          <StatusBadge status={especie.status} size="sm" />
          {especie.biomas.map((id) => getBioma(id).nome).join(' · ')}
        </span>
      </div>
    </div>
  );
}
