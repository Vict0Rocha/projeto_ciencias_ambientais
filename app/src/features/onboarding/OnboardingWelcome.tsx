import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getBioma } from '../../domain/especiesRepository';
import type { BiomaId } from '../../domain/types';
import { Button } from '../../design-system/components/Button';
import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import styles from './OnboardingWelcome.module.css';

interface PassoOnboarding {
  biomaId: BiomaId;
  titulo: string;
  corpo: string;
  alt: string;
  chips?: string[];
}

const PASSOS: PassoOnboarding[] = [
  {
    biomaId: 'amazonia',
    titulo: 'Descubra quem vive ali',
    corpo: 'Você recebe pistas e tenta reconhecer a espécie. Cada acerto abre a ficha completa dela — bioma, alimentação, ameaças e curiosidades.',
    alt: 'Rio cercado de floresta amazônica',
  },
  {
    biomaId: 'cerrado',
    titulo: 'Cada espécie tem um papel',
    corpo: 'Predador, polinizador, dispersor de sementes, produtor vegetal. Você vai encaixar cada carta na função que ela cumpre no ecossistema.',
    alt: 'Campo de cerrado ao pôr do sol com lobo-guará',
    chips: ['Predador', 'Polinizador', 'Dispersor', 'Produtor'],
  },
  {
    biomaId: 'pantanal',
    titulo: 'Tudo está conectado',
    corpo: 'Na Rede da Vida você liga as espécies e vê o que acontece quando uma delas desaparece — o efeito não para na primeira carta.',
    alt: 'Rio do Pantanal com aves e canoa',
  },
];

export interface OnboardingWelcomeProps {
  /** Chamado ao fim do 3º passo ou ao "Pular" — quem monta este componente decide para onde navegar depois. */
  onFinish: () => void;
}

/** Boas-vindas em 3 passos: tela cheia no mobile, modal sobre fundo escurecido no desktop. */
export function OnboardingWelcome({ onFinish }: OnboardingWelcomeProps) {
  const [passo, setPasso] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onFinish();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish]);

  const ultimoPasso = passo === PASSOS.length - 1;
  const dadosPasso = PASSOS[passo];
  const bioma = getBioma(dadosPasso.biomaId);

  function avancar() {
    if (ultimoPasso) onFinish();
    else setPasso((p) => p + 1);
  }

  function voltar() {
    setPasso((p) => Math.max(0, p - 1));
  }

  return createPortal(
    <div
      ref={rootRef}
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label="Boas-vindas ao Bio Tríade"
      tabIndex={-1}
    >
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.backdropCol}>
          <img src={`/${getBioma('amazonia').foto}`} alt="" />
        </div>
        <div className={styles.backdropCol}>
          <img src={`/${getBioma('cerrado').foto}`} alt="" />
        </div>
        <div className={styles.backdropCol}>
          <img src={`/${getBioma('pantanal').foto}`} alt="" />
        </div>
        <span className={styles.backdropScrim} />
      </div>

      <div className={styles.card}>
        <div className={styles.imageArea}>
          <img src={`/${bioma.foto}`} alt={dadosPasso.alt} className={styles.image} />
          <span className={styles.imageGradient} aria-hidden="true" />
          <div className={styles.imageOverlayRow}>
            {passo === 0 ? (
              <span className={styles.wordmarkPill}>
                <svg width="15" height="13" viewBox="0 0 20 18" aria-hidden="true">
                  <polygon points="10,0 20,18 0,18" fill="var(--color-bg-app)" />
                </svg>
                <span className={styles.wordmarkPillText}>BIO TRÍADE</span>
              </span>
            ) : (
              <button type="button" aria-label="Voltar" className={styles.backImgBtn} onClick={voltar}>
                ←
              </button>
            )}
            {!ultimoPasso && (
              <button type="button" className={styles.pularMobile} onClick={onFinish}>
                Pular
              </button>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.topRow}>
            <div className={styles.topRowLeft}>
              {passo > 0 && (
                <CircleIconButton aria-label="Voltar" onClick={voltar} className={styles.backDesktopBtn}>
                  ←
                </CircleIconButton>
              )}
              <span className={styles.stepLabel}>PASSO {passo + 1} DE 3</span>
            </div>
            {!ultimoPasso && (
              <button type="button" className={styles.pularDesktop} onClick={onFinish}>
                Pular
              </button>
            )}
          </div>

          <div aria-live="polite">
            <h2 className={styles.titulo}>{dadosPasso.titulo}</h2>
            <p className={styles.corpo}>{dadosPasso.corpo}</p>

            {dadosPasso.chips && (
              <div className={styles.chips}>
                {dadosPasso.chips.map((chip) => (
                  <span key={chip} className={styles.chip}>
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.dots} aria-hidden="true">
              {PASSOS.map((_, index) => (
                <span key={index} className={`${styles.dot} ${index === passo ? styles.dotAtivo : ''}`} />
              ))}
            </div>
            <Button variant={ultimoPasso ? 'accent' : 'primary'} size="lg" className={styles.cta} onClick={avancar}>
              {ultimoPasso ? 'Começar a jogar' : 'Avançar'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
