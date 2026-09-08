import type { BiomaId } from './types';
import { getAllBiomas, getEspeciesPorBioma, getRedePorBioma } from './especiesRepository';

export type MecanicaId = 'quem_sou_eu' | 'funcao' | 'rede';
export type NivelJornada = 1 | 2 | 3 | 4;

export interface NivelConfig {
  nivel: NivelJornada;
  titulo: string;
  mecanica: MecanicaId;
}

/**
 * 4 níveis de compreensão, na ordem fixada pelo README:
 * identificação → função ecológica → interdependência → impacto e extinção.
 */
export const NIVEIS: NivelConfig[] = [
  { nivel: 1, titulo: 'Identificação', mecanica: 'quem_sou_eu' },
  { nivel: 2, titulo: 'Papéis ecológicos', mecanica: 'funcao' },
  { nivel: 3, titulo: 'Interdependência', mecanica: 'rede' },
  { nivel: 4, titulo: 'Impacto da extinção', mecanica: 'rede' },
];

export const DESAFIOS_POR_FASE = 5;

export interface Fase {
  id: string;
  bioma: BiomaId;
  nivel: NivelJornada;
  titulo: string;
  mecanica: MecanicaId;
  /** posição 1-12 na trilha completa (Amazônia → Cerrado → Pantanal) */
  ordem: number;
}

/** As 12 fases da Jornada, agrupadas por bioma na ordem Amazônia → Cerrado → Pantanal. */
export function getFasesDaJornada(): Fase[] {
  const fases: Fase[] = [];
  let ordem = 1;
  for (const bioma of getAllBiomas()) {
    for (const nivelConfig of NIVEIS) {
      fases.push({
        id: `${bioma.id}-${nivelConfig.nivel}`,
        bioma: bioma.id,
        nivel: nivelConfig.nivel,
        titulo: nivelConfig.titulo,
        mecanica: nivelConfig.mecanica,
        ordem: ordem++,
      });
    }
  }
  return fases;
}

export function getFaseById(id: string): Fase | undefined {
  return getFasesDaJornada().find((fase) => fase.id === id);
}

/**
 * Espécies-desafio de uma fase de Quem Sou Eu / Função na Natureza: as primeiras
 * DESAFIOS_POR_FASE espécies do bioma, na ordem do especies.json. Qual subconjunto
 * de espécies (quando o bioma tem mais que 5) é decisão de implementação, não
 * conteúdo científico, e pode mudar sem tocar em especies.json.
 */
export function getEspeciesDaFase(fase: Fase) {
  return getEspeciesPorBioma(fase.bioma).slice(0, DESAFIOS_POR_FASE);
}

/**
 * Grafo da Rede da Vida para uma fase de nível 3/4. As duas fases de um mesmo
 * bioma comparilham o mesmo grafo; qual(is) evento(s) cada nível usa é definido
 * na própria feature de Rede da Vida (redes[].eventos tem 3-4 itens por bioma).
 */
export function getRedeDaFase(fase: Fase) {
  return getRedePorBioma(fase.bioma);
}
