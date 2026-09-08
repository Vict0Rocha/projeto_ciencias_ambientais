import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Coachmarks.module.css';

interface PassoCoachmark {
  /** valor do atributo data-coachmark do elemento real a destacar */
  seletor: string;
  texto: string;
}

const PASSOS: PassoCoachmark[] = [
  {
    seletor: 'pistas',
    texto: 'As pistas aparecem aqui. Se travar, toque em "Próxima pista" para revelar mais uma — não gasta tentativa.',
  },
  {
    seletor: 'palpites',
    texto: 'Escolha seu palpite aqui: toque no nome da espécie que você acha que é a resposta certa.',
  },
  {
    seletor: 'progresso',
    texto: 'Aqui ficam suas tentativas e o progresso da partida. Cada desafio dá duas chances antes de revelar a resposta.',
  },
];

const PAD = 10;
const ALTURA_ESTIMADA_CARD = 200;
const MARGEM = 12;

interface Retangulo {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface CoachmarksProps {
  /** Chamado ao fim da 3ª dica ou ao "Pular dicas". */
  onFinish: () => void;
}

/** Tour de spotlight sobre a tela real de "Quem sou eu?" — mede os elementos de verdade, não posições fixas. */
export function Coachmarks({ onFinish }: CoachmarksProps) {
  const [passo, setPasso] = useState(0);
  const [rect, setRect] = useState<Retangulo | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const passoFocadoRef = useRef(-1);

  useLayoutEffect(() => {
    const alvo = document.querySelector<HTMLElement>(`[data-coachmark="${PASSOS[passo].seletor}"]`);
    if (!alvo) {
      setRect(null);
      return;
    }

    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    alvo.scrollIntoView({ block: 'center', behavior: reduzMovimento ? 'auto' : 'smooth' });

    function medir() {
      const r = alvo!.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', medir, true);
    return () => {
      window.removeEventListener('resize', medir);
      window.removeEventListener('scroll', medir, true);
    };
  }, [passo]);

  // Roda a cada render, mas só move o foco quando o card de um passo NOVO acabou de montar
  // (o guard pelo ref evita roubar o foco de novo a cada remedição por resize/scroll).
  useEffect(() => {
    if (rect && passoFocadoRef.current !== passo) {
      cardRef.current?.focus();
      passoFocadoRef.current = passo;
    }
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onFinish();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish]);

  if (!rect) return null;

  const ultimoPasso = passo === PASSOS.length - 1;

  function avancar() {
    if (ultimoPasso) onFinish();
    else setPasso((p) => p + 1);
  }

  const hole = {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  };

  const espacoAbaixo = window.innerHeight - (hole.top + hole.height);
  const cardAcima = espacoAbaixo < ALTURA_ESTIMADA_CARD + MARGEM;
  const cardWidth = Math.min(360, window.innerWidth - 2 * MARGEM);
  const cardLeftIdeal = hole.left + hole.width / 2 - cardWidth / 2;
  const cardLeft = Math.max(MARGEM, Math.min(cardLeftIdeal, window.innerWidth - cardWidth - MARGEM));

  return createPortal(
    <div className={styles.root}>
      <span className={styles.banda} style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.top) }} />
      <span
        className={styles.banda}
        style={{ top: hole.top + hole.height, left: 0, right: 0, bottom: 0 }}
      />
      <span className={styles.banda} style={{ top: hole.top, left: 0, width: Math.max(0, hole.left), height: hole.height }} />
      <span
        className={styles.banda}
        style={{ top: hole.top, left: hole.left + hole.width, right: 0, height: hole.height }}
      />
      <span
        className={styles.contorno}
        style={{ top: hole.top, left: hole.left, width: hole.width, height: hole.height }}
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        className={styles.card}
        style={
          cardAcima
            ? { left: cardLeft, width: cardWidth, bottom: window.innerHeight - hole.top + MARGEM }
            : { left: cardLeft, width: cardWidth, top: hole.top + hole.height + MARGEM }
        }
        role="dialog"
        aria-modal="true"
        aria-label={`Dica ${passo + 1} de ${PASSOS.length}`}
        tabIndex={-1}
      >
        <span className={styles.dicaLabel}>
          DICA {passo + 1} DE {PASSOS.length}
        </span>
        <p className={styles.dicaTexto}>{PASSOS[passo].texto}</p>
        <div className={styles.acoes}>
          <button type="button" className={styles.entendi} onClick={avancar}>
            Entendi
          </button>
          <button type="button" className={styles.pular} onClick={onFinish}>
            Pular dicas
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
