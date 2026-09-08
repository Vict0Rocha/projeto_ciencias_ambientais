import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  tutorialConcluido: boolean;
  fasesConcluidas: string[];
  estrelasPorFase: Record<string, number>;
  especiesDescobertas: string[];
  somLigado: boolean;

  concluirTutorial: () => void;
  /** Reabre o onboarding — acionado pelo botão "Rever tutorial" na tela Sobre. */
  reverTutorial: () => void;
  marcarFaseConcluida: (faseId: string, estrelas: number) => void;
  descobrirEspecie: (especieId: string) => void;
  alternarSom: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      tutorialConcluido: false,
      fasesConcluidas: [],
      estrelasPorFase: {},
      especiesDescobertas: [],
      somLigado: true,

      concluirTutorial: () => set({ tutorialConcluido: true }),
      reverTutorial: () => set({ tutorialConcluido: false }),

      marcarFaseConcluida: (faseId, estrelas) =>
        set((state) => ({
          fasesConcluidas: state.fasesConcluidas.includes(faseId)
            ? state.fasesConcluidas
            : [...state.fasesConcluidas, faseId],
          // a fase é concluída mesmo com 0 estrelas; só sobrescreve se a nova nota for maior
          estrelasPorFase: {
            ...state.estrelasPorFase,
            [faseId]: Math.max(state.estrelasPorFase[faseId] ?? 0, estrelas),
          },
        })),

      descobrirEspecie: (especieId) =>
        set((state) =>
          state.especiesDescobertas.includes(especieId)
            ? state
            : { especiesDescobertas: [...state.especiesDescobertas, especieId] },
        ),

      alternarSom: () => set((state) => ({ somLigado: !state.somLigado })),
    }),
    { name: 'bio-triade/progresso' },
  ),
);

export function totalDeEstrelas(estrelasPorFase: Record<string, number>): number {
  return Object.values(estrelasPorFase).reduce((total, estrelas) => total + estrelas, 0);
}
