import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../store/sessionStore';
import { useRedeStore } from '../../store/redeStore';
import { getAllEspecies, getAllFuncoes, getEspecieById } from '../../domain/especiesRepository';
import { shuffle } from '../../domain/random';
import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import { Pill } from '../../design-system/components/Pill';
import styles from './FreeModePage.module.css';

interface ModoDisponivel {
  id: 'quem_sou_eu' | 'funcao' | 'rede';
  titulo: string;
  descricao: string;
  disponivel: boolean;
}

const MODOS: ModoDisponivel[] = [
  {
    id: 'quem_sou_eu',
    titulo: 'Quem Sou Eu?',
    descricao: 'Pistas até reconhecer a espécie — e a ficha completa como recompensa.',
    disponivel: true,
  },
  {
    id: 'funcao',
    titulo: 'Função na Natureza',
    descricao: 'Cada carta no seu papel: predador, polinizador, dispersor, produtor.',
    disponivel: true,
  },
  {
    id: 'rede',
    titulo: 'Rede da Vida',
    descricao: 'Um evento ambiental atinge a rede e o aluno prevê o efeito em cascata.',
    disponivel: true,
  },
];

export function FreeModePage() {
  const navigate = useNavigate();
  const iniciarPartida = useSessionStore((state) => state.iniciarPartida);
  const iniciarPartidaRede = useRedeStore((state) => state.iniciarPartida);

  function jogar(modo: ModoDisponivel) {
    if (!modo.disponivel) return;
    if (modo.id === 'quem_sou_eu') {
      const ids = getAllEspecies().map((especie) => especie.id);
      iniciarPartida('quem_sou_eu', shuffle(ids), (id) => id, ids, 4);
      navigate('/desafio/quem-sou-eu');
    }
    if (modo.id === 'funcao') {
      const especieIds = getAllEspecies().map((especie) => especie.id);
      const funcaoIds = getAllFuncoes().map((funcao) => funcao.id);
      iniciarPartida('funcao', shuffle(especieIds), (id) => getEspecieById(id)!.funcao, funcaoIds, 4);
      navigate('/desafio/funcao-na-natureza');
    }
    if (modo.id === 'rede') {
      iniciarPartidaRede();
      navigate('/desafio/rede-da-vida');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <CircleIconButton aria-label="Voltar" onClick={() => navigate('/')}>
          ←
        </CircleIconButton>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Modo Livre</h1>
          <p className={styles.subtitle}>Escolha um modo de jogo — as perguntas são sorteadas, sem repetir na partida.</p>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.grid} role="list">
          {MODOS.map((modo) => (
            <button
              key={modo.id}
              type="button"
              role="listitem"
              className={styles.card}
              disabled={!modo.disponivel}
              onClick={() => jogar(modo)}
              aria-describedby={`desc-${modo.id}`}
            >
              <span className={styles.cardTitleRow}>
                <span className={styles.cardTitle}>{modo.titulo}</span>
                {!modo.disponivel && (
                  <Pill background="var(--color-surface-sunken)" color="var(--color-ink-muted)">
                    EM BREVE
                  </Pill>
                )}
              </span>
              <span className={styles.cardDesc} id={`desc-${modo.id}`}>
                {modo.descricao}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
