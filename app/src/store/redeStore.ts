import { create } from 'zustand';
import { getAllBiomas, getRedePorBioma } from '../domain/especiesRepository';
import { calcularLayoutRede, type NoPosicionado } from '../domain/redeLayout';
import type { Estrelas } from '../domain/scoring';
import type { BiomaId, RedeBioma, RelacaoRede } from '../domain/types';

export type FaseRede = 'montagem' | 'confirmado' | 'eventos' | 'concluido';

export interface LigacaoFeita {
  de: string;
  para: string;
}

export interface LigacaoResultado extends LigacaoFeita {
  correta: boolean;
}

function mesmoPar(a: LigacaoFeita, b: LigacaoFeita): boolean {
  return (a.de === b.de && a.para === b.para) || (a.de === b.para && a.para === b.de);
}

/** A ligação do jogador não tem direção — casa com a relação real dos dados em qualquer sentido. */
function relacaoExiste(relacoes: RelacaoRede[], a: string, b: string): boolean {
  return relacoes.some((r) => (r.de === a && r.para === b) || (r.de === b && r.para === a));
}

const ESTADO_INICIAL = {
  bioma: null as BiomaId | null,
  rede: null as RedeBioma | null,
  nos: [] as NoPosicionado[],
  fase: 'montagem' as FaseRede,
  noSelecionado: null as string | null,
  ligacoesFeitas: [] as LigacaoFeita[],
  resultadoLigacoes: [] as LigacaoResultado[],
  estrelas: null as Estrelas | null,
  eventoAtualIndex: 0,
  cascataRevelada: false,
};

interface RedeSessionState {
  bioma: BiomaId | null;
  rede: RedeBioma | null;
  nos: NoPosicionado[];
  fase: FaseRede;

  noSelecionado: string | null;
  ligacoesFeitas: LigacaoFeita[];
  resultadoLigacoes: LigacaoResultado[];
  estrelas: Estrelas | null;

  eventoAtualIndex: number;
  cascataRevelada: boolean;

  /** Sorteia um bioma e prepara uma partida nova. */
  iniciarPartida: () => void;
  selecionarNo: (id: string) => void;
  removerLigacao: (ligacao: LigacaoFeita) => void;
  confirmarRede: () => void;
  avancarParaEventos: () => void;
  revelarCascata: () => void;
  avancarEvento: () => void;
  encerrarPartida: () => void;
}

export const useRedeStore = create<RedeSessionState>()((set) => ({
  ...ESTADO_INICIAL,

  iniciarPartida: () => {
    const biomas = getAllBiomas();
    const bioma = biomas[Math.floor(Math.random() * biomas.length)].id;
    const rede = getRedePorBioma(bioma);
    const nos = calcularLayoutRede(
      rede.nos,
      rede.relacoes.map((r) => ({ de: r.de, para: r.para })),
    );
    set({ ...ESTADO_INICIAL, bioma, rede, nos });
  },

  selecionarNo: (id) =>
    set((state) => {
      if (state.fase !== 'montagem') return state;
      if (!state.noSelecionado) return { noSelecionado: id };
      if (state.noSelecionado === id) return { noSelecionado: null };

      const novaLigacao: LigacaoFeita = { de: state.noSelecionado, para: id };
      const jaExiste = state.ligacoesFeitas.some((l) => mesmoPar(l, novaLigacao));
      return {
        noSelecionado: null,
        ligacoesFeitas: jaExiste ? state.ligacoesFeitas : [...state.ligacoesFeitas, novaLigacao],
      };
    }),

  removerLigacao: (ligacao) =>
    set((state) => ({
      ligacoesFeitas: state.ligacoesFeitas.filter((l) => !mesmoPar(l, ligacao)),
    })),

  /**
   * Estrelas por % de acerto líquido (corretas - erradas, nunca abaixo de 0)
   * sobre o total de relações reais do bioma — fórmula nossa (README não
   * define uma para essa mecânica): 3★ = achou a rede inteira sem erro
   * líquido, 2★ ≥ 60%, 1★ > 0%, 0★ = nenhum acerto líquido.
   */
  confirmarRede: () =>
    set((state) => {
      if (!state.rede) return state;
      const resultadoLigacoes: LigacaoResultado[] = state.ligacoesFeitas.map((l) => ({
        ...l,
        correta: relacaoExiste(state.rede!.relacoes, l.de, l.para),
      }));
      const corretas = resultadoLigacoes.filter((r) => r.correta).length;
      const erradas = resultadoLigacoes.length - corretas;
      const totalReais = state.rede.relacoes.length;
      const scorePct = totalReais > 0 ? Math.max(0, corretas - erradas) / totalReais : 0;
      const estrelas: Estrelas = scorePct >= 1 ? 3 : scorePct >= 0.6 ? 2 : scorePct > 0 ? 1 : 0;
      return { resultadoLigacoes, estrelas, fase: 'confirmado' };
    }),

  avancarParaEventos: () => set({ fase: 'eventos', eventoAtualIndex: 0, cascataRevelada: false }),

  revelarCascata: () => set({ cascataRevelada: true }),

  avancarEvento: () =>
    set((state) => {
      if (!state.rede) return state;
      const proximo = state.eventoAtualIndex + 1;
      if (proximo >= state.rede.eventos.length) return { fase: 'concluido' };
      return { eventoAtualIndex: proximo, cascataRevelada: false };
    }),

  encerrarPartida: () => set({ ...ESTADO_INICIAL }),
}));
