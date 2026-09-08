import { useNavigate } from 'react-router-dom';
import { getAllBiomas } from '../../domain/especiesRepository';
import { useProgressStore } from '../../store/progressStore';
import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import { Button } from '../../design-system/components/Button';
import styles from './AboutPage.module.css';

const MECANICAS = [
  {
    titulo: 'Quem Sou Eu?',
    descricao: 'Pistas até reconhecer a espécie — e a ficha completa como recompensa.',
  },
  {
    titulo: 'Função na Natureza',
    descricao: 'Cada carta no seu papel: predador, polinizador, dispersor, produtor.',
  },
  {
    titulo: 'Rede da Vida',
    descricao: 'Um evento ambiental atinge a rede e o aluno prevê o efeito em cascata.',
  },
];

export function AboutPage() {
  const navigate = useNavigate();
  const biomas = getAllBiomas();
  const reverTutorial = useProgressStore((s) => s.reverTutorial);

  function handleReverTutorial() {
    reverTutorial();
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <CircleIconButton aria-label="Voltar" onClick={() => navigate('/')}>
          ←
        </CircleIconButton>
        <div className={styles.headerText}>
          <h1 className={styles.titulo}>Sobre o jogo</h1>
          <p className={styles.subtitulo}>O que é o Bio Tríade e para que serve</p>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.textCol}>
            <div className={styles.wordmark}>
              <svg width="16" height="14" viewBox="0 0 20 18" aria-hidden="true">
                <polygon points="10,0 20,18 0,18" fill="var(--color-ink)" />
              </svg>
              BIO TRÍADE
            </div>

            <h2 className={styles.h2}>Entender a floresta é entender quem vive nela</h2>

            <p className={styles.paragrafo}>
              Bio Tríade é um jogo educativo web (serious game) voltado para alunos e curiosos, com o objetivo de
              promover a conscientização sobre biodiversidade, conservação ambiental e a importância das espécies
              para o equilíbrio dos ecossistemas. O foco do conteúdo são os biomas brasileiros presentes no estado de
              Mato Grosso: Amazônia, Cerrado e Pantanal.
            </p>

            <p className={styles.paragrafo}>
              Diferentemente de jogos educativos que se limitam à memorização de nomes e características de animais,
              a proposta busca desenvolver uma compreensão mais ampla sobre as relações ecológicas existentes entre
              as espécies e os impactos causados pela perda da biodiversidade. O aluno deverá compreender que cada
              organismo desempenha uma função essencial dentro do ecossistema e que a extinção de uma espécie pode
              gerar consequências para toda a rede ecológica.
            </p>

            <div>
              <div className={styles.ensinaLabel}>COMO O JOGO ENSINA</div>
              <div className={styles.ensinaGrid}>
                {MECANICAS.map((mecanica) => (
                  <div key={mecanica.titulo} className={styles.ensinaCard}>
                    <span className={styles.ensinaTitulo}>{mecanica.titulo}</span>
                    <span className={styles.ensinaDesc}>{mecanica.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div>
              <div className={styles.biomasLabel}>OS BIOMAS DO JOGO</div>
              <div className={styles.biomasList}>
                {biomas.map((bioma) => (
                  <div key={bioma.id} className={styles.biomaCard}>
                    <img src={`/${bioma.foto}`} alt="" />
                    <span
                      className={styles.biomaGradient}
                      style={{ background: `linear-gradient(to bottom, transparent, ${bioma.cor})` }}
                    />
                    <span className={styles.biomaLabel}>{bioma.nome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ctaCard}>
              <h3 className={styles.ctaTitulo}>Pronto para começar?</h3>
              <Button variant="accent" fullWidth onClick={() => navigate('/modo-livre')}>
                Jogar agora
              </Button>
            </div>

            <Button variant="secondary" fullWidth onClick={handleReverTutorial}>
              Rever tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
