export type BiomaId = 'amazonia' | 'cerrado' | 'pantanal';

export type StatusConservacaoId = 'lc' | 'nt' | 'vu' | 'en' | 'ne';

export type FuncaoId = 'predador' | 'dispersor' | 'controlador' | 'produtor' | 'polinizador' | 'herbivoro';

export type TipoRelacaoId =
  | 'preda'
  | 'dispersa'
  | 'poliniza'
  | 'alimenta'
  | 'abriga'
  | 'depende'
  | 'compete'
  | 'melhora';

export interface Bioma {
  id: BiomaId;
  nome: string;
  cor: string;
  foto: string;
}

export interface StatusConservacao {
  id: StatusConservacaoId;
  nome: string;
  bg: string;
  ink: string;
}

export interface Funcao {
  id: FuncaoId;
  nome: string;
  descricao: string;
}

export interface Recurso {
  id: string;
  nome: string;
  descricao: string;
}

export interface TipoRelacao {
  id: TipoRelacaoId;
  rotulo: string;
  descricao: string;
}

export interface Especie {
  id: string;
  nome: string;
  nomeCientifico: string;
  biomas: BiomaId[];
  funcao: FuncaoId;
  alimentacao: string;
  funcaoEcologica: string;
  status: StatusConservacaoId;
  ameacas: string[];
  curiosidade: string;
  curiosidadePorBioma?: Partial<Record<BiomaId, string>>;
  pistas: string[];
  conexoes: string[];
  foto: string;
  revisar?: boolean;
}

export interface RelacaoRede {
  de: string;
  tipo: TipoRelacaoId;
  para: string;
  fonte?: string;
  nota?: string;
  revisar?: boolean;
}

export interface EventoCascataAlvo {
  alvo: string;
  efeito: 'declinio' | 'aumento';
  porque: string;
}

export interface EventoRede {
  id: string;
  titulo: string;
  cenario: string;
  impactoDireto: string[];
  cascata: EventoCascataAlvo[];
  explicacao: string;
  revisar?: boolean;
}

export interface RedeBioma {
  bioma: BiomaId;
  nos: string[];
  relacoes: RelacaoRede[];
  eventos: EventoRede[];
}

export interface EspeciesData {
  versao: string;
  atualizadoEm: string;
  observacao: string;
  biomas: Bioma[];
  statusConservacao: StatusConservacao[];
  funcoes: Funcao[];
  recursos: Recurso[];
  tiposRelacao: TipoRelacao[];
  especies: Especie[];
  redes: RedeBioma[];
}

/** Nó do grafo da Rede da Vida: ou é uma carta de espécie (id numérico) ou um recurso (id textual). */
export type NoRede = { kind: 'especie'; data: Especie } | { kind: 'recurso'; data: Recurso };

export const CARTA_ID_REGEX = /^\d{3}$/;
