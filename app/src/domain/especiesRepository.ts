import rawData from '../data/especies.json';
import {
  CARTA_ID_REGEX,
  type Bioma,
  type BiomaId,
  type Especie,
  type EspeciesData,
  type Funcao,
  type FuncaoId,
  type NoRede,
  type Recurso,
  type RedeBioma,
  type StatusConservacao,
  type StatusConservacaoId,
  type TipoRelacao,
  type TipoRelacaoId,
} from './types';

const data = rawData as unknown as EspeciesData;

const especiesPorId = new Map<string, Especie>(data.especies.map((especie) => [especie.id, especie]));
const recursosPorId = new Map<string, Recurso>(data.recursos.map((recurso) => [recurso.id, recurso]));
const biomasPorId = new Map<string, Bioma>(data.biomas.map((bioma) => [bioma.id, bioma]));
const statusPorId = new Map<string, StatusConservacao>(data.statusConservacao.map((status) => [status.id, status]));
const funcoesPorId = new Map<string, Funcao>(data.funcoes.map((funcao) => [funcao.id, funcao]));
const tiposRelacaoPorId = new Map<string, TipoRelacao>(data.tiposRelacao.map((tipo) => [tipo.id, tipo]));
const redesPorBioma = new Map<string, RedeBioma>(data.redes.map((rede) => [rede.bioma, rede]));

export function getEspeciesData(): EspeciesData {
  return data;
}

export function getEspecieById(id: string): Especie | undefined {
  return especiesPorId.get(id);
}

export function getRecursoById(id: string): Recurso | undefined {
  return recursosPorId.get(id);
}

/** Resolve um id de nó da Rede da Vida: ids de 3 dígitos são cartas de espécie, o resto são recursos. */
export function resolveNoRede(id: string): NoRede | undefined {
  if (CARTA_ID_REGEX.test(id)) {
    const especie = especiesPorId.get(id);
    return especie ? { kind: 'especie', data: especie } : undefined;
  }
  const recurso = recursosPorId.get(id);
  return recurso ? { kind: 'recurso', data: recurso } : undefined;
}

export function getBioma(id: BiomaId): Bioma {
  const bioma = biomasPorId.get(id);
  if (!bioma) throw new Error(`Bioma desconhecido: ${id}`);
  return bioma;
}

export function getAllBiomas(): Bioma[] {
  return data.biomas;
}

export function getStatusConservacao(id: StatusConservacaoId): StatusConservacao {
  const status = statusPorId.get(id);
  if (!status) throw new Error(`Status de conservação desconhecido: ${id}`);
  return status;
}

export function getFuncao(id: FuncaoId): Funcao {
  const funcao = funcoesPorId.get(id);
  if (!funcao) throw new Error(`Função desconhecida: ${id}`);
  return funcao;
}

export function getAllFuncoes(): Funcao[] {
  return data.funcoes;
}

export function getTipoRelacao(id: TipoRelacaoId): TipoRelacao {
  const tipo = tiposRelacaoPorId.get(id);
  if (!tipo) throw new Error(`Tipo de relação desconhecido: ${id}`);
  return tipo;
}

export function getRedePorBioma(bioma: BiomaId): RedeBioma {
  const rede = redesPorBioma.get(bioma);
  if (!rede) throw new Error(`Rede desconhecida para o bioma: ${bioma}`);
  return rede;
}

/** Espécies de um bioma, na ordem em que aparecem no especies.json. */
export function getEspeciesPorBioma(bioma: BiomaId): Especie[] {
  return data.especies.filter((especie) => especie.biomas.includes(bioma));
}

export function getAllEspecies(): Especie[] {
  return data.especies;
}

/** Curiosidade a exibir: usa a variante por bioma quando existir, senão a curiosidade geral. */
export function getCuriosidade(especie: Especie, bioma?: BiomaId): string {
  const porBioma = bioma ? especie.curiosidadePorBioma?.[bioma] : undefined;
  return porBioma ?? especie.curiosidade;
}

/**
 * Alt-text placeholder (README § Pendências: os textos alternativos das fotos de
 * espécie ainda não foram escritos pelo cliente). Neutro e derivado do nome até
 * haver descrições definitivas.
 */
export function getFotoAltText(especie: Especie): string {
  return `Foto de ${especie.nome}`;
}

export function buscarEspeciesPorNome(termo: string, biomas: Especie[]): Especie[] {
  const normalizado = normalizarTexto(termo);
  if (!normalizado) return biomas;
  return biomas.filter((especie) => normalizarTexto(especie.nome).includes(normalizado));
}

// eslint-disable-next-line no-misleading-character-class -- intervalo de marcas diacríticas combinantes (NFD)
const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalizarTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .toLowerCase()
    .trim();
}
