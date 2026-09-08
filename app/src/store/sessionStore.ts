import { create } from 'zustand';
import type { MecanicaId } from '../domain/journeyConfig';
import { MAX_PISTAS, MAX_TENTATIVAS, calcularEstrelas, somarEstrelasDaFase, type Estrelas } from '../domain/scoring';
import { shuffle } from '../domain/random';

/**
 * Sessão de uma "partida" de escolha (Quem Sou Eu / Função na Natureza): ambas
 * mecânicas compartilham a mesma forma — N opções, 2 tentativas, pistas opcionais
 * (só Quem Sou Eu as usa; nas demais `pistasReveladas` fica sempre em 1 e não
 * afeta a pontuação). Rede da Vida tem forma própria (grafo) e vive num store
 * separado.
 *
 * `desafios` guarda o "sujeito" de cada rodada (sempre um id de espécie — é
 * sobre ela que a pergunta é feita). A resposta certa nem sempre é a própria
 * espécie: em Função na Natureza o sujeito é a espécie, mas a resposta é a
 * função dela. `respostasCorretas` guarda essa resposta já resolvida, no mesmo
 * namespace de `opcoesAtuais`, para as duas mecânicas funcionarem de forma
 * genérica aqui dentro.
 *
 * `faseId` existe só para o futuro Modo Jornada (ainda não implementado — em
 * aberto com o cliente). Por enquanto toda partida vem do Modo Livre e faseId
 * fica sempre null.
 */
export type RespostaStatus = 'pendente' | 'acerto' | 'erro';

interface SessionState {
  mecanica: MecanicaId | null;
  faseId: string | null;

  desafios: string[];
  respostasCorretas: string[];
  desafioAtualIndex: number;

  /** pool de onde as opções erradas são sorteadas (ids de espécie ou de função, conforme a mecânica) */
  opcoesPool: string[];
  opcoesQtd: number;
  /** opções do desafio atual, já sorteadas (inclui a correta) */
  opcoesAtuais: string[];

  pistasReveladas: number;
  tentativasRestantes: number;
  respostaEscolhida: string | null;
  /** guarda o 1º palpite errado durante a 2ª tentativa, para continuar marcado na lista */
  respostaErradaAnterior: string | null;
  status: RespostaStatus;

  estrelasPorDesafio: Estrelas[];

  /**
   * Inicia uma partida do Modo Livre. `sujeitos` já deve vir embaralhado e sem
   * repetição; `resolverCorreta` traduz cada sujeito na resposta certa (use
   * `(id) => id` quando sujeito e resposta forem a mesma coisa, como em Quem Sou Eu).
   */
  iniciarPartida: (
    mecanica: MecanicaId,
    sujeitos: string[],
    resolverCorreta: (sujeitoId: string) => string,
    opcoesPool: string[],
    opcoesQtd?: number,
  ) => void;
  revelarProximaPista: () => void;
  responder: (idEscolhido: string) => void;
  tentarNovamente: () => void;
  /** Usado pelo link "Revelar a resposta": abandona a tentativa restante e força o desfecho de erro. */
  revelarResposta: () => void;
  avancarParaProximoDesafio: () => void;
  encerrarSessao: () => void;

  /** id do sujeito (espécie) do desafio atual */
  desafioAtualId: () => string | undefined;
  /** id da resposta certa do desafio atual, no namespace da mecânica */
  respostaCorretaAtual: () => string | undefined;
  estrelasTotais: () => number;
  ehUltimoDesafio: () => boolean;
}

const ESTADO_INICIAL_DESAFIO = {
  pistasReveladas: 1,
  tentativasRestantes: MAX_TENTATIVAS,
  respostaEscolhida: null,
  respostaErradaAnterior: null,
  status: 'pendente' as RespostaStatus,
};

function gerarOpcoes(pool: string[], correta: string, quantidade: number): string[] {
  const outras = shuffle(pool.filter((id) => id !== correta)).slice(0, Math.max(0, quantidade - 1));
  return shuffle([correta, ...outras]);
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  mecanica: null,
  faseId: null,
  desafios: [],
  respostasCorretas: [],
  desafioAtualIndex: 0,
  opcoesPool: [],
  opcoesQtd: 4,
  opcoesAtuais: [],
  estrelasPorDesafio: [],
  ...ESTADO_INICIAL_DESAFIO,

  iniciarPartida: (mecanica, sujeitos, resolverCorreta, opcoesPool, opcoesQtd = 4) => {
    const respostasCorretas = sujeitos.map(resolverCorreta);
    set({
      mecanica,
      faseId: null,
      desafios: sujeitos,
      respostasCorretas,
      desafioAtualIndex: 0,
      opcoesPool,
      opcoesQtd,
      opcoesAtuais: gerarOpcoes(opcoesPool, respostasCorretas[0], opcoesQtd),
      estrelasPorDesafio: [],
      ...ESTADO_INICIAL_DESAFIO,
    });
  },

  revelarProximaPista: () =>
    set((state) =>
      state.status !== 'pendente' ? state : { pistasReveladas: Math.min(state.pistasReveladas + 1, MAX_PISTAS) },
    ),

  responder: (idEscolhido) =>
    set((state) => {
      const idCorreto = state.respostasCorretas[state.desafioAtualIndex];
      const acertou = idEscolhido === idCorreto;
      if (acertou) {
        const tentativaDoAcerto = state.tentativasRestantes === MAX_TENTATIVAS ? 1 : 2;
        const estrelas = calcularEstrelas(true, tentativaDoAcerto, state.pistasReveladas);
        return {
          respostaEscolhida: idEscolhido,
          status: 'acerto',
          estrelasPorDesafio: [...state.estrelasPorDesafio, estrelas],
        };
      }

      const tentativasRestantes = state.tentativasRestantes - 1;
      if (tentativasRestantes <= 0) {
        return {
          respostaEscolhida: idEscolhido,
          status: 'erro',
          tentativasRestantes: 0,
          estrelasPorDesafio: [...state.estrelasPorDesafio, calcularEstrelas(false, 2, state.pistasReveladas)],
        };
      }
      return { respostaEscolhida: idEscolhido, respostaErradaAnterior: idEscolhido, status: 'erro', tentativasRestantes };
    }),

  /** Usado após o 1º erro (ainda resta 1 tentativa): fecha o popup e libera a lista de novo, mas mantém o palpite errado marcado. */
  tentarNovamente: () => set((state) => (state.tentativasRestantes > 0 ? { status: 'pendente' } : state)),

  revelarResposta: () =>
    set((state) => ({
      status: 'erro',
      tentativasRestantes: 0,
      estrelasPorDesafio: [...state.estrelasPorDesafio, calcularEstrelas(false, 2, state.pistasReveladas)],
    })),

  avancarParaProximoDesafio: () =>
    set((state) => {
      const novoIndex = state.desafioAtualIndex + 1;
      const novaCorreta = state.respostasCorretas[novoIndex];
      return {
        desafioAtualIndex: novoIndex,
        opcoesAtuais: novaCorreta ? gerarOpcoes(state.opcoesPool, novaCorreta, state.opcoesQtd) : state.opcoesAtuais,
        ...ESTADO_INICIAL_DESAFIO,
      };
    }),

  encerrarSessao: () =>
    set({
      mecanica: null,
      faseId: null,
      desafios: [],
      respostasCorretas: [],
      desafioAtualIndex: 0,
      opcoesPool: [],
      opcoesAtuais: [],
      estrelasPorDesafio: [],
      ...ESTADO_INICIAL_DESAFIO,
    }),

  desafioAtualId: () => get().desafios[get().desafioAtualIndex],
  respostaCorretaAtual: () => get().respostasCorretas[get().desafioAtualIndex],
  estrelasTotais: () => somarEstrelasDaFase(get().estrelasPorDesafio),
  ehUltimoDesafio: () => get().desafioAtualIndex >= get().desafios.length - 1,
}));
