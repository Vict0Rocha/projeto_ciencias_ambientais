import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { getAllBiomas } from '../../domain/especiesRepository';
import type { Bioma } from '../../domain/types';
import { TUTORIAL_ATIVO } from '../../config';
import { Button } from '../../design-system/components/Button';
import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import { Overlay } from '../../design-system/components/Overlay';
import { OnboardingWelcome } from '../onboarding/OnboardingWelcome';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const somLigado = useProgressStore((s) => s.somLigado);
  const alternarSom = useProgressStore((s) => s.alternarSom);
  const tutorialConcluido = useProgressStore((s) => s.tutorialConcluido);
  const biomas = getAllBiomas();
  const [biomaAberto, setBiomaAberto] = useState<Bioma | null>(null);
  // Capturado uma vez: se o onboarding fechar antes do fim (coachmarks pendentes),
  // tutorialConcluido continua false, mas não queremos reabrir a tela de boas-vindas
  // por cima do Modo Livre/challenge que o fechamento já deveria ter aberto.
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState(() => TUTORIAL_ATIVO && !tutorialConcluido);

  return (
    <div className={styles.page}>
      <div className={styles.blob} aria-hidden="true" />

      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link className={styles.navLink} to="/colecao">
            Coleção
          </Link>
          <Link className={styles.navLink} to="/sobre">
            Sobre o jogo
          </Link>
          <CircleIconButton aria-label={somLigado ? 'Desligar som' : 'Ligar som'} onClick={alternarSom}>
            {somLigado ? '♪' : '🔇'}
          </CircleIconButton>
        </nav>
      </header>

      <main className={styles.hero}>
        <div className={styles.textCol}>
          <svg className={styles.triangleBig} width="120" height="108" viewBox="0 0 196 176" aria-hidden="true">
            <polygon points="98,0 143,80 53,80" fill="#14532d" />
            <polygon points="49,88 94,168 4,168" fill="#b0562c" />
            <polygon points="147,88 192,168 102,168" fill="#1f8f8a" />
          </svg>

          <h1 className={styles.titulo}>BIO TRÍADE</h1>

          <p className={styles.tagline}>
            Amazônia, Cerrado e Pantanal. Descubra a importância de cada bioma e um pouco sobre suas espécies.
          </p>

          <div className={styles.acoes}>
            <Button variant="primary" size="lg" onClick={() => navigate('/modo-livre')}>
              Escolher um desafio
            </Button>
            <span className={styles.jornadaNota}>Modo Jornada — em breve</span>
          </div>

          <div className={styles.legenda} aria-hidden="true">
            {biomas.map((bioma) => (
              <span key={bioma.id} className={styles.legendaItem}>
                <span className={styles.legendaDot} style={{ background: bioma.cor }} />
                {bioma.nome}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.photosCol}>
          {biomas.map((bioma) => (
            <button
              key={bioma.id}
              type="button"
              className={styles.photoCard}
              onClick={() => setBiomaAberto(bioma)}
              aria-label={`Saiba mais sobre o bioma ${bioma.nome}`}
            >
              <img src={`/${bioma.foto}`} alt="" loading="lazy" decoding="async" width={900} height={1000} />
              <span
                className={styles.photoGradient}
                style={{ background: `linear-gradient(to bottom, transparent, ${bioma.cor})` }}
              />
              <span className={styles.photoLabel}>{bioma.nome}</span>
            </button>
          ))}
        </div>
      </main>

      {mostrarBoasVindas && (
        <OnboardingWelcome
          onFinish={() => {
            setMostrarBoasVindas(false);
            navigate('/modo-livre');
          }}
        />
      )}

      <Overlay
        open={biomaAberto !== null}
        onClose={() => setBiomaAberto(null)}
        ariaLabel={biomaAberto ? `Sobre o bioma ${biomaAberto.nome}` : 'Sobre o bioma'}
        maxWidthDesktop={480}
      >
        {biomaAberto && (
          <div className={styles.biomaModalInner}>
            <div className={styles.biomaModalPhotoWrap}>
              <img
                className={styles.biomaModalPhoto}
                src={`/${biomaAberto.foto}`}
                alt=""
                width={900}
                height={600}
              />
              <span
                className={styles.biomaModalGradient}
                style={{ background: `linear-gradient(to bottom, transparent, ${biomaAberto.cor})` }}
              />
              <span className={styles.biomaModalLabel}>{biomaAberto.nome}</span>
              <CircleIconButton
                className={styles.biomaModalClose}
                style={{ background: 'rgba(18, 41, 15, 0.55)', color: '#fff', borderColor: 'transparent' }}
                aria-label="Fechar"
                onClick={() => setBiomaAberto(null)}
              >
                ✕
              </CircleIconButton>
            </div>
            <p className={styles.biomaModalTexto}>{biomaAberto.descricao}</p>
          </div>
        )}
      </Overlay>
    </div>
  );
}
