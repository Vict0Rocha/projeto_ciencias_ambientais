import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from 'd3-force';

export interface NoPosicionado extends SimulationNodeDatum {
  id: string;
  x: number;
  y: number;
  /** Tamanho do "chip" (rótulo) deste nó, já considerando quebra em 2 linhas quando o nome é longo. */
  largura: number;
  altura: number;
  linhas: string[];
}

/** Espaço lógico do grafo — o SVG escala isso via viewBox, então funciona em qualquer largura de tela. */
export const LARGURA_LOGICA = 700;
export const ALTURA_LOGICA = 440;
const MARGEM = 36;

const ALTURA_CHIP_1_LINHA = 32;
const ALTURA_CHIP_2_LINHAS = 46;
const PADDING_HORIZONTAL_CHIP = 14;
const LARGURA_MIN_CHIP = 58;
/** Acima disso, o nome quebra em 2 linhas em vez de alargar o chip indefinidamente. */
const LARGURA_MAX_UMA_LINHA = 118;
const FONTE_MEDICAO = "700 11.5px 'Outfit', system-ui, sans-serif";

let ctxMedicao: CanvasRenderingContext2D | null | undefined;

function medirLarguraTexto(texto: string): number {
  if (ctxMedicao === undefined) {
    ctxMedicao = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  if (!ctxMedicao) return texto.length * 6.5; // fallback sem canvas (ex.: testes)
  ctxMedicao.font = FONTE_MEDICAO;
  return ctxMedicao.measureText(texto).width;
}

/** Quebra o nome em 2 linhas no espaço entre palavras que deixa as duas mais parecidas em largura. */
function dividirEmLinhas(nome: string): string[] {
  if (medirLarguraTexto(nome) <= LARGURA_MAX_UMA_LINHA) return [nome];
  const partes = nome.split(' ');
  if (partes.length < 2) return [nome];

  let melhorIndex = 1;
  let melhorDiferenca = Infinity;
  for (let i = 1; i < partes.length; i++) {
    const linha1 = partes.slice(0, i).join(' ');
    const linha2 = partes.slice(i).join(' ');
    const diferenca = Math.abs(medirLarguraTexto(linha1) - medirLarguraTexto(linha2));
    if (diferenca < melhorDiferenca) {
      melhorDiferenca = diferenca;
      melhorIndex = i;
    }
  }
  return [partes.slice(0, melhorIndex).join(' '), partes.slice(melhorIndex).join(' ')];
}

function calcularTamanhoChip(nome: string): { largura: number; altura: number; linhas: string[] } {
  const linhas = dividirEmLinhas(nome);
  const larguraTexto = Math.max(...linhas.map(medirLarguraTexto));
  return {
    largura: Math.max(LARGURA_MIN_CHIP, larguraTexto + PADDING_HORIZONTAL_CHIP * 2),
    altura: linhas.length > 1 ? ALTURA_CHIP_2_LINHAS : ALTURA_CHIP_1_LINHA,
    linhas,
  };
}

function clampValor(valor: number, min: number, max: number): number {
  if (min > max) return (min + max) / 2;
  return Math.min(max, Math.max(min, valor));
}

/**
 * Calcula posições dos nós com d3-force (força/repulsão), rodado de forma
 * síncrona (sem animação do próprio layout — só o resultado final é usado).
 * O raio de colisão de cada nó é derivado do tamanho real do seu rótulo (medido
 * via canvas), não de um raio fixo — é isso que evita nomes se sobrepondo quando
 * alguns são bem mais longos que outros.
 */
export function calcularLayoutRede(
  nos: string[],
  pares: Array<{ de: string; para: string }>,
  nomePorId: (id: string) => string,
): NoPosicionado[] {
  // Posições iniciais espalhadas pelo canvas inteiro (em círculo) — começar todo
  // mundo perto do centro é uma armadilha conhecida do d3-force: com distância
  // ~0 entre nós, a repulsão inicial fica instável e o layout não converge bem.
  const nodes: NoPosicionado[] = nos.map((id, index) => {
    const angulo = (index / nos.length) * Math.PI * 2;
    const raio = Math.min(LARGURA_LOGICA, ALTURA_LOGICA) / 3;
    return {
      id,
      ...calcularTamanhoChip(nomePorId(id)),
      x: LARGURA_LOGICA / 2 + Math.cos(angulo) * raio,
      y: ALTURA_LOGICA / 2 + Math.sin(angulo) * raio,
    };
  });
  const links = pares.map((par) => ({ source: par.de, target: par.para }));

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((d) => (d as NoPosicionado).id)
        .distance(110)
        .strength(0.3),
    )
    .force('charge', forceManyBody().strength(-260))
    .force('center', forceCenter(LARGURA_LOGICA / 2, ALTURA_LOGICA / 2))
    // Puxa cada nó (fracamente) de volta pro centro do canvas — sem isso, a repulsão
    // de muitos nós espalha o layout bem além da área útil, e o reenquadramento
    // final precisa encolher tanto que os chips ficam pequenos demais pra ler.
    .force('x', forceX(LARGURA_LOGICA / 2).strength(0.025))
    .force('y', forceY(ALTURA_LOGICA / 2).strength(0.025))
    .force(
      'collide',
      forceCollide((d) => {
        const no = d as NoPosicionado;
        return Math.hypot(no.largura, no.altura) / 2 + 12;
      }).iterations(3),
    )
    .stop();

  for (let i = 0; i < 400; i++) simulation.tick();

  return reencaixarNoContainer(nodes);
}

/**
 * Encaixa o conjunto de nós na área útil do canvas. Reescala posição E tamanho
 * do chip pelo MESMO fator — por isso nunca introduz sobreposição nova: o
 * espaçamento relativo entre nós (calculado pelo collide, com base no tamanho
 * original de cada chip) fica preservado, só o conjunto todo encolhe ou cresce
 * junto. (Reescalar só a posição, mantendo o tamanho do chip fixo, foi tentado
 * antes e colidia nomes; recortar cada nó pro canto do canvas, de forma
 * independente, foi tentado depois e colapsava nós diferentes no mesmo ponto —
 * ambos descartados.)
 */
function reencaixarNoContainer(nodes: NoPosicionado[]): NoPosicionado[] {
  // Usa as BORDAS do chip (não só o centro) pro bounding box — senão um nó cujo
  // centro já está perto da margem pode ter metade do chip cortada fora do canvas.
  const minX = Math.min(...nodes.map((n) => n.x - n.largura / 2));
  const maxX = Math.max(...nodes.map((n) => n.x + n.largura / 2));
  const minY = Math.min(...nodes.map((n) => n.y - n.altura / 2));
  const maxY = Math.max(...nodes.map((n) => n.y + n.altura / 2));
  const larguraUtil = LARGURA_LOGICA - MARGEM * 2;
  const alturaUtil = ALTURA_LOGICA - MARGEM * 2;
  const escalaX = maxX > minX ? larguraUtil / (maxX - minX) : 1;
  const escalaY = maxY > minY ? alturaUtil / (maxY - minY) : 1;
  // O piso é só uma rede de segurança pra casos extremos: alto o bastante pra nunca
  // precisar ser o fator realmente aplicado (senão os nós vazam da área útil — ver
  // a prova no comentário da função), baixo o bastante pra não ficar ilegível.
  const escala = clampValor(Math.min(escalaX, escalaY), 0.45, 1.3);

  return nodes.map((n) => ({
    ...n,
    x: MARGEM + (n.x - minX) * escala + (larguraUtil - (maxX - minX) * escala) / 2,
    y: MARGEM + (n.y - minY) * escala + (alturaUtil - (maxY - minY) * escala) / 2,
    largura: n.largura * escala,
    altura: n.altura * escala,
  }));
}
