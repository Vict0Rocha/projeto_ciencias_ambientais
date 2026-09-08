import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import { ProgressBar } from '../../design-system/components/ProgressBar';
import { AttemptDots } from '../../design-system/components/AttemptDots';
import { BiomaChip } from '../../design-system/components/BiomaChip';
import type { BiomaId } from '../../domain/types';
import styles from './ChallengeHeader.module.css';

export interface ChallengeHeaderProps {
  titulo: string;
  contadorLabel: string;
  progressPercent: number;
  /** omitido em mecânicas sem o conceito de tentativas por desafio (ex.: Rede da Vida) */
  tentativasRestantes?: number;
  bioma: BiomaId;
  faseOrdem?: number;
  somLigado: boolean;
  onToggleSom: () => void;
  onBack: () => void;
}

export function ChallengeHeader({
  titulo,
  contadorLabel,
  progressPercent,
  tentativasRestantes,
  bioma,
  faseOrdem,
  somLigado,
  onToggleSom,
  onBack,
}: ChallengeHeaderProps) {
  return (
    <header className={styles.header}>
      <CircleIconButton aria-label="Voltar" onClick={onBack} className={styles.back}>
        ←
      </CircleIconButton>
      <div className={styles.titleChip}>
        <h1 className={styles.title}>{titulo}</h1>
        <BiomaChip bioma={bioma} suffix={faseOrdem ? `FASE ${faseOrdem}` : undefined} />
      </div>
      <div className={styles.progressBlock} data-coachmark="progresso">
        <div className={styles.progressTopLine}>
          <span className={styles.counter}>{contadorLabel}</span>
          {tentativasRestantes !== undefined && <AttemptDots tentativasRestantes={tentativasRestantes} />}
        </div>
        <ProgressBar percent={progressPercent} />
      </div>
      <CircleIconButton aria-label={somLigado ? 'Desligar som' : 'Ligar som'} onClick={onToggleSom} className={styles.sound}>
        {somLigado ? '♪' : '🔇'}
      </CircleIconButton>
    </header>
  );
}
