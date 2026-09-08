import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, type SimulationNodeDatum } from 'd3-force';

export interface NoPosicionado extends SimulationNodeDatum {
  id: string;
  x: number;
  y: number;
}

/** Espaço lógico do grafo — o SVG escala isso via viewBox, então funciona em qualquer largura de tela. */
export const LARGURA_LOGICA = 640;
export const ALTURA_LOGICA = 420;
const MARGEM = 56;

/**
 * Calcula posições dos nós com d3-force (força/repulsão), rodado de forma
 * síncrona (sem animação do próprio layout — só o resultado final é usado).
 * README § Fidelity marca isso como decisão de implementação em aberto; a
 * simulação roda uma vez quando a rede é sorteada, não a cada render.
 */
export function calcularLayoutRede(nos: string[], pares: Array<{ de: string; para: string }>): NoPosicionado[] {
  // Posições iniciais espalhadas pelo canvas inteiro (em círculo) — começar todo
  // mundo perto do centro é uma armadilha conhecida do d3-force: com distância
  // ~0 entre nós, a repulsão inicial fica instável e o layout não converge bem.
  const nodes: NoPosicionado[] = nos.map((id, index) => {
    const angulo = (index / nos.length) * Math.PI * 2;
    const raio = Math.min(LARGURA_LOGICA, ALTURA_LOGICA) / 3;
    return {
      id,
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
        .distance(120)
        .strength(0.4),
    )
    .force('charge', forceManyBody().strength(-420))
    .force('center', forceCenter(LARGURA_LOGICA / 2, ALTURA_LOGICA / 2))
    .force('collide', forceCollide(54))
    .stop();

  for (let i = 0; i < 400; i++) simulation.tick();

  return clampAoContainer(nodes);
}

function clampAoContainer(nodes: NoPosicionado[]): NoPosicionado[] {
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const larguraUtil = LARGURA_LOGICA - MARGEM * 2;
  const alturaUtil = ALTURA_LOGICA - MARGEM * 2;
  const escalaX = maxX > minX ? larguraUtil / (maxX - minX) : 1;
  const escalaY = maxY > minY ? alturaUtil / (maxY - minY) : 1;
  const escala = Math.min(escalaX, escalaY, 1.4);

  return nodes.map((n) => ({
    ...n,
    x: MARGEM + (n.x - minX) * escala + (larguraUtil - (maxX - minX) * escala) / 2,
    y: MARGEM + (n.y - minY) * escala + (alturaUtil - (maxY - minY) * escala) / 2,
  }));
}
