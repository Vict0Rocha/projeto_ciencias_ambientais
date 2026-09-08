import { useState, type KeyboardEvent } from 'react';
import { getBioma, getCuriosidade, getFotoAltText } from '../../domain/especiesRepository';
import type { BiomaId, Especie } from '../../domain/types';
import { BiomaChip } from '../../design-system/components/BiomaChip';
import { StatusBadge } from '../../design-system/components/StatusBadge';
import styles from './SpeciesFlipCard.module.css';

export interface SpeciesFlipCardProps {
  especie: Especie;
  /** bioma em que o desafio está ocorrendo — usado para escolher a curiosidade certa */
  biomaContexto?: BiomaId;
}

export function SpeciesFlipCard({ especie, biomaContexto }: SpeciesFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [fotoCarregada, setFotoCarregada] = useState(false);

  function toggleFlip() {
    setFlipped((atual) => !atual);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  }

  const nomesBiomas = especie.biomas.map((id) => getBioma(id).nome).join(' · ');

  return (
    <div
      className={styles.cardOuter}
      role="button"
      tabIndex={0}
      aria-label={flipped ? `Ver frente da carta de ${especie.nome}` : `Ver ficha de ${especie.nome}`}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
    >
      <div className={`${styles.flipper} ${flipped ? styles.flipped : ''}`}>
        {/* Frente */}
        <div className={`${styles.face} ${styles.front}`}>
          <div className={styles.stripe} aria-hidden="true">
            {especie.biomas.map((biomaId) => (
              <span key={biomaId} className={styles.stripeSegment} style={{ background: getBioma(biomaId).cor }} />
            ))}
          </div>
          <div className={styles.photoWrap}>
            <img
              src={`/${especie.foto}`}
              alt={getFotoAltText(especie)}
              className={`${styles.photo} ${fotoCarregada ? styles.photoLoaded : ''}`}
              onLoad={() => setFotoCarregada(true)}
            />
          </div>
          <div className={styles.body}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{especie.nome}</span>
              <StatusBadge status={especie.status} />
            </div>
            <div className={styles.biomaRow}>
              {especie.biomas.map((biomaId) => (
                <BiomaChip key={biomaId} bioma={biomaId} />
              ))}
            </div>
            <div className={styles.footerHint}>
              <span className={styles.footerHintIcon} aria-hidden="true">
                ↻
              </span>
              Toque para ver a ficha
            </div>
          </div>
        </div>

        {/* Verso */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.backHeader}>
            <span className={styles.backName}>{especie.nome}</span>
            <StatusBadge status={especie.status} />
          </div>

          <div className={styles.fields}>
            <div>
              <div className={styles.fieldLabel}>BIOMAS</div>
              <div className={styles.fieldValue}>{nomesBiomas}</div>
            </div>
            <div>
              <div className={styles.fieldLabel}>ALIMENTAÇÃO</div>
              <div className={styles.fieldValue}>{especie.alimentacao}</div>
            </div>
            <div>
              <div className={styles.fieldLabel}>FUNÇÃO ECOLÓGICA</div>
              <div className={styles.fieldValue}>{especie.funcaoEcologica}</div>
            </div>
            <div>
              <div className={styles.fieldLabel}>AMEAÇAS</div>
              <div className={styles.fieldValue}>{especie.ameacas.join(', ')}</div>
            </div>
          </div>

          <div className={styles.connections}>
            <div className={styles.fieldLabel}>CONEXÕES ECOLÓGICAS</div>
            <ul className={styles.connectionsList}>
              {especie.conexoes.map((conexao) => (
                <li key={conexao}>{conexao}</li>
              ))}
            </ul>
            <p className={styles.curiosidade}>{getCuriosidade(especie, biomaContexto)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
