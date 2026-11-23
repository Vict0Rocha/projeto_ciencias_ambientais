import type { CSSProperties, KeyboardEvent } from 'react';
import { ALTURA_LOGICA, LARGURA_LOGICA, type NoPosicionado } from '../../../domain/redeLayout';
import type { NoRede } from '../../../domain/types';
import styles from './RedeGraph.module.css';

export interface Aresta {
  de: string;
  para: string;
  cor: string;
  tracejada?: boolean;
}

export type DestaqueNo = 'impacto' | 'declinio' | 'aumento';

export interface RedeGraphProps {
  nos: NoPosicionado[];
  resolveNo: (id: string) => NoRede | undefined;
  arestas: Aresta[];
  corBioma: string;
  noSelecionado?: string | null;
  onSelecionarNo?: (id: string) => void;
  interativo: boolean;
  nosDestacados?: Partial<Record<string, DestaqueNo>>;
  ariaLabel: string;
}

/** Área de toque mínima recomendada, mesmo quando o chip visual do nó é menor. */
const TOQUE_MINIMO = 44;

const COR_DESTAQUE: Record<DestaqueNo, string> = {
  impacto: 'var(--color-ink)',
  declinio: 'var(--color-error-ink)',
  aumento: 'var(--color-increase-ink)',
};

const GLIFO_DESTAQUE: Partial<Record<DestaqueNo, string>> = {
  declinio: '▼',
  aumento: '▲',
};

export function RedeGraph({
  nos,
  resolveNo,
  arestas,
  corBioma,
  noSelecionado,
  onSelecionarNo,
  interativo,
  nosDestacados,
  ariaLabel,
}: RedeGraphProps) {
  const posicaoPorId = new Map(nos.map((n) => [n.id, n]));

  function handleKeyDown(event: KeyboardEvent<SVGGElement>, id: string) {
    if (!interativo) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelecionarNo?.(id);
    }
  }

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${LARGURA_LOGICA} ${ALTURA_LOGICA}`}
        role="group"
        aria-label={ariaLabel}
      >
        {arestas.map((aresta, index) => {
          const de = posicaoPorId.get(aresta.de);
          const para = posicaoPorId.get(aresta.para);
          if (!de || !para) return null;
          return (
            <line
              key={`${aresta.de}-${aresta.para}-${index}`}
              x1={de.x}
              y1={de.y}
              x2={para.x}
              y2={para.y}
              stroke={aresta.cor}
              strokeWidth={3}
              strokeDasharray={aresta.tracejada ? '7 7' : undefined}
              strokeLinecap="round"
            />
          );
        })}

        {nos.map((no) => {
          const resolvido = resolveNo(no.id);
          if (!resolvido) return null;
          const ehEspecie = resolvido.kind === 'especie';
          const nome = resolvido.data.nome;
          const selecionado = noSelecionado === no.id;
          const destaque = nosDestacados?.[no.id];
          const larguraToque = Math.max(no.largura, TOQUE_MINIMO);
          const alturaToque = Math.max(no.altura, TOQUE_MINIMO);

          const estiloChip: CSSProperties | undefined = ehEspecie
            ? { stroke: destaque ? COR_DESTAQUE[destaque] : corBioma, strokeWidth: destaque ? 4 : 2.5 }
            : destaque
              ? { stroke: COR_DESTAQUE[destaque], strokeWidth: 4 }
              : undefined;

          return (
            <g
              key={no.id}
              className={styles.no}
              transform={`translate(${no.x}, ${no.y})`}
              role="button"
              tabIndex={interativo ? 0 : -1}
              aria-disabled={!interativo}
              aria-pressed={selecionado}
              aria-label={nome}
              onClick={() => interativo && onSelecionarNo?.(no.id)}
              onKeyDown={(event) => handleKeyDown(event, no.id)}
            >
              {selecionado && (
                <rect
                  x={-no.largura / 2 - 6}
                  y={-no.altura / 2 - 6}
                  width={no.largura + 12}
                  height={no.altura + 12}
                  rx={(no.altura + 12) / 2}
                  fill="none"
                  stroke="var(--color-accent-lime)"
                  strokeWidth={3}
                />
              )}
              <rect
                className={styles.foco}
                x={-no.largura / 2 - 10}
                y={-no.altura / 2 - 10}
                width={no.largura + 20}
                height={no.altura + 20}
                rx={(no.altura + 20) / 2}
                fill="none"
                stroke="var(--color-accent-lime)"
                strokeWidth={2}
              />
              {/* área de toque mínima, mesmo quando o chip visual é menor */}
              <rect x={-larguraToque / 2} y={-alturaToque / 2} width={larguraToque} height={alturaToque} fill="transparent" />
              <rect
                className={ehEspecie ? styles.chipEspecie : styles.chipRecurso}
                x={-no.largura / 2}
                y={-no.altura / 2}
                width={no.largura}
                height={no.altura}
                rx={no.altura / 2}
                style={estiloChip}
              />
              {destaque && GLIFO_DESTAQUE[destaque] && (
                <text className={styles.efeito} y={-no.altura / 2 - 10} fill={COR_DESTAQUE[destaque]}>
                  {GLIFO_DESTAQUE[destaque]}
                </text>
              )}
              {no.linhas.map((linha, i) => (
                <text key={i} className={styles.label} y={(i - (no.linhas.length - 1) / 2) * 13}>
                  {linha}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
