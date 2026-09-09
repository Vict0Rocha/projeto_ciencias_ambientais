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
 * Alt-text definitivo das fotos em `public/img/` (README § Pendências, resolvida:
 * escrito olhando cada foto real, não gerado do nome). Chave é o id da carta.
 * Se uma espécie nova entrar em especies.json sem entrada aqui, cai no fallback
 * neutro — nunca falha, só fica menos descritivo até alguém escrever a definitiva.
 */
const FOTO_ALT_TEXT: Record<string, string> = {
  '101': 'Harpia pousada em um galho, com a crista de penas erguida e garras amarelas firmes na madeira, mata fechada ao fundo.',
  '102': "Boto-cor-de-rosa nadando debaixo d'água, entre raízes de árvores alagadas, com feixes de luz atravessando o rio.",
  '103': 'Retrato de onça-pintada de frente, pelagem amarela com rosetas escuras e olhos amendoados fixos na câmera.',
  '104': 'Macaco-aranha andando sobre um galho na copa da floresta, cauda longa enrolada para trás, outros indivíduos ao fundo.',
  '105': 'Castanheira-do-pará vista de baixo, tronco largo com raízes tabulares, ouriços caídos no chão da floresta.',
  '106': 'Mamangava pousada em uma flor roxa, coletando pólen com o corpo preto e amarelo, campo florido do Cerrado ao entardecer.',
  '201': 'Lobo-guará caminhando pelo campo ao amanhecer, pelagem alaranjada, pernas escuras e orelhas grandes eretas.',
  '202': 'Tamanduá-bandeira caminhando entre cupinzeiros no campo, focinho longo abaixado e faixa diagonal clara no ombro.',
  '203': 'Tatu-canastra escavando a terra ao lado de um cupinzeiro, carapaça segmentada e garras longas à mostra.',
  '204': 'Pequizeiro carregado de frutos amarelados, com pessoas colhendo ao fundo em um campo de Cerrado ao entardecer.',
  '205': 'Seriema parada no campo seco, com o topete de penas eriçado sobre a testa e o bico avermelhado curvo.',
  '206': 'Morcego-polinizador em voo, asas abertas, aproximando-se de um cacho de frutos pendurados na entrada de uma gruta.',
  '301': 'Tuiuiú parado à beira de um brejo, pescoço com faixa vermelha na base, outros indivíduos e um ninho ao fundo.',
  '302': 'Ariranha no rio com um peixe na boca, filhote descansando na margem atrás dela, entrada da toca visível.',
  '303': 'Jacaré-do-pantanal deitado na margem lamacenta, boca entreaberta mostrando os dentes, olhando de frente.',
  '304': 'Capivara deitada na margem de um rio, pelagem marrom-avermelhada, focinho quadrado voltado para a câmera.',
  '305': 'Beija-flor-tesoura em voo, cabeça azul e corpo verde iridescentes, cauda longa bifurcada, bebendo néctar de uma flor vermelha.',
};

export function getFotoAltText(especie: Especie): string {
  return FOTO_ALT_TEXT[especie.id] ?? `Foto de ${especie.nome}`;
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
