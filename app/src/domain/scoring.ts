/**
 * Regras de pontuação do Bio Tríade (README § "Regras do jogo").
 * Tentativas: 2 por desafio. Pistas: até 3, só em Quem Sou Eu — pedir pista não
 * consome tentativa, mas reduz a estrela máxima possível.
 */

export const MAX_TENTATIVAS = 2;
export const MAX_PISTAS = 3;

export type NumeroTentativa = 1 | 2;
export type Estrelas = 0 | 1 | 2 | 3;

/**
 * - 3 estrelas: acertou na 1ª tentativa, sem pedir pista extra (pistasReveladas === 1)
 * - 2 estrelas: acertou na 1ª tentativa usando 2 ou 3 pistas
 * - 1 estrela: acertou na 2ª tentativa
 * - 0 estrelas: errou as duas tentativas
 */
export function calcularEstrelas(
  acertou: boolean,
  tentativaDoAcerto: NumeroTentativa,
  pistasReveladas: number,
): Estrelas {
  if (!acertou) return 0;
  if (tentativaDoAcerto === 2) return 1;
  return pistasReveladas <= 1 ? 3 : 2;
}

export function somarEstrelasDaFase(estrelasPorDesafio: Estrelas[]): number {
  return estrelasPorDesafio.reduce((total: number, estrelas) => total + estrelas, 0);
}
