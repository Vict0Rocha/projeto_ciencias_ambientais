import type { NivelId } from '../../domain/types';
import styles from './NivelToggle.module.css';

export interface NivelToggleProps {
  nivel: NivelId;
  onAlterar: (nivel: NivelId) => void;
}

const OPCOES: { id: NivelId; rotulo: string }[] = [
  { id: 'facil', rotulo: 'Fácil' },
  { id: 'dificil', rotulo: 'Difícil' },
];

/** Alterna o nível de dificuldade das perguntas sorteadas no Modo Livre. */
export function NivelToggle({ nivel, onAlterar }: NivelToggleProps) {
  return (
    <div className={styles.grupo} role="group" aria-label="Nível de dificuldade">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.id}
          type="button"
          className={`${styles.opcao} ${nivel === opcao.id ? styles.ativa : ''}`}
          aria-pressed={nivel === opcao.id}
          onClick={() => onAlterar(opcao.id)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}
