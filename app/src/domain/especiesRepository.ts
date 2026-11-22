import rawData from '../data/especies.json';
import { shuffle } from './random';
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

/**
 * Domínio amplo de cada `grupo` fino (ver `Especie.grupo`). Usado como 2º nível de
 * fallback em `gerarOpcoesQuemSouEu`: quando o grupo específico da carta não tem
 * gente o bastante para preencher as alternativas, busca no domínio antes de cair
 * no pool inteiro. Mantido aqui (e não no JSON) para não duplicar essa informação
 * por carta — é derivada do grupo, não um dado por espécie.
 */
const DOMINIO_POR_GRUPO: Record<string, string> = {
  ave_rapina: 'ave',
  ave_terrestre: 'ave',
  ave_pernalta: 'ave',
  psitacideo: 'ave',
  beija_flor: 'ave',
  mamifero_aquatico: 'mamifero',
  felino: 'mamifero',
  primata: 'mamifero',
  canideo: 'mamifero',
  mirmecofago: 'mamifero',
  roedor: 'mamifero',
  cervideo: 'mamifero',
  anta: 'mamifero',
  morcego: 'mamifero',
  crocodiliano: 'reptil',
  serpente: 'reptil',
  quelonio: 'reptil',
  anfibio: 'anfibio',
  peixe: 'peixe',
  inseto: 'inseto',
  arvore: 'planta',
  palmeira: 'planta',
};

/**
 * Opções para "Quem Sou Eu?": em vez de sortear 100% aleatório, prioriza espécies
 * do mesmo grupo (cobra com cobra, árvore com árvore), depois do mesmo domínio
 * (ave com ave), e só por último completa com o resto do jogo. Isso deixa as
 * alternativas mais parecidas entre si — e portanto mais difíceis de descartar
 * só pela "cara" do nome, sem olhar as pistas.
 */
export function gerarOpcoesQuemSouEu(_sujeitoId: string, correta: string, _pool: string[], quantidade: number): string[] {
  const especieCorreta = especiesPorId.get(correta);
  const todas = data.especies.filter((especie) => especie.id !== correta);
  if (!especieCorreta) return shuffle([correta, ...todas.map((e) => e.id)]).slice(0, quantidade);

  const dominioCorreto = DOMINIO_POR_GRUPO[especieCorreta.grupo];
  const mesmoGrupo = shuffle(todas.filter((especie) => especie.grupo === especieCorreta.grupo));
  const mesmoDominio = shuffle(
    todas.filter((especie) => especie.grupo !== especieCorreta.grupo && DOMINIO_POR_GRUPO[especie.grupo] === dominioCorreto),
  );
  const resto = shuffle(
    todas.filter((especie) => especie.grupo !== especieCorreta.grupo && DOMINIO_POR_GRUPO[especie.grupo] !== dominioCorreto),
  );

  const escolhidas: string[] = [];
  for (const candidata of [...mesmoGrupo, ...mesmoDominio, ...resto]) {
    if (escolhidas.length >= quantidade - 1) break;
    escolhidas.push(candidata.id);
  }
  return shuffle([correta, ...escolhidas]);
}

/**
 * IDs excluídos de "Qual é a função desta espécie?" (Função na Natureza): o nome
 * da própria carta já entrega a resposta. Ex.: "Morcego-polinizador" → polinizador.
 * A espécie continua disponível normalmente em Quem Sou Eu, Rede da Vida e na Coleção.
 */
const NOME_ENTREGA_FUNCAO = new Set(['206']);

/** Espécies aptas a serem o sujeito de uma pergunta de Função na Natureza (ver `NOME_ENTREGA_FUNCAO`). */
export function getEspeciesParaFuncaoNaNatureza(): Especie[] {
  return data.especies.filter((especie) => !NOME_ENTREGA_FUNCAO.has(especie.id));
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
  '107': "Tronco de seringueira com um corte diagonal na casca, de onde escorre látex branco até uma tigela presa ao tronco, floresta ao fundo.",
  '108': "Pirarucu nadando debaixo d'água, corpo prateado com a cauda avermelhada, vegetação aquática ao fundo.",
  '109': "Peixe-boi-da-amazônia nadando perto do fundo arenoso, corpo robusto e nadadeiras anteriores arredondadas, água esverdeada.",
  '110': 'Tucandeira em close sobre um galho molhado na mata, mandíbulas à mostra e longas antenas estendidas.',
  '111': 'Rã-kambô verde e amarela pousada sobre um galho coberto de musgo, olhos grandes e escuros, folhagem ao fundo.',
  '207': 'Buriti isolado à beira de uma lagoa, copa em leque com cachos de frutos marrons pendurados, outras palmeiras ao fundo.',
  '208': 'Raposa-do-campo parada entre arbustos, pelagem alaranjada e orelhas grandes eretas, olhando para a câmera.',
  '209': 'Anta-brasileira caminhando na mata, corpo marrom-escuro e focinho alongado em forma de pequena tromba.',
  '210': 'Cobra-cipó verde enrolada em um galho fino na mata, cabeça erguida e olhos atentos.',
  '211': 'Tracajá sobre um tronco caído na água, casco escuro e marcas amarelas na cabeça, vegetação aquática ao redor.',
  '306': 'Sucuri-amarela enrolada na margem de uma lagoa, corpo amarelado com manchas escuras, cabeça próxima à água.',
  '307': 'Cambará isolado em campo alagado, copa florida de amarelo, lagoa e vegetação ao fundo.',
  '308': 'Cervo-do-pantanal parado perto de uma área alagada, galhada ramificada e pelagem alaranjada.',
  '309': 'Colhereiro em uma lagoa rasa, plumagem rosada e bico longo achatado como uma colher.',
  '310': 'Duas araras-azuis-grandes na entrada de um oco de árvore, plumagem azul-cobalto e bico curvo preto.',
};

export function getFotoAltText(especie: Especie): string {
  return FOTO_ALT_TEXT[especie.id] ?? `Foto de ${especie.nome}`;
}

export function buscarEspeciesPorNome(termo: string, biomas: Especie[]): Especie[] {
  const normalizado = normalizarTexto(termo);
  if (!normalizado) return biomas;
  return biomas.filter(
    (especie) =>
      normalizarTexto(especie.nome).includes(normalizado) ||
      normalizarTexto(especie.nomeCientifico).includes(normalizado),
  );
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
