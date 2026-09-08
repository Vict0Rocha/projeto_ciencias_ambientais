import type { KeyboardEvent } from 'react';
import { getFotoAltText } from '../../../domain/especiesRepository';
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

const RAIO_ESPECIE = 30;
const RAIO_RECURSO = 24;

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
        <defs>
          {nos.map((no) => {
            const resolvido = resolveNo(no.id);
            if (resolvido?.kind !== 'especie') return null;
            return (
              <pattern key={no.id} id={`foto-${no.id}`} patternUnits="objectBoundingBox" width="1" height="1">
                <image
                  href={`/${resolvido.data.foto}`}
                  aria-label={getFotoAltText(resolvido.data)}
                  x="-25%"
                  y="-25%"
                  width="150%"
                  height="150%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            );
          })}
        </defs>

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
          const raio = ehEspecie ? RAIO_ESPECIE : RAIO_RECURSO;
          const nome = resolvido.data.nome;
          const selecionado = noSelecionado === no.id;
          const destaque = nosDestacados?.[no.id];

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
                <circle r={raio + 7} fill="none" stroke="var(--color-accent-lime)" strokeWidth={3} />
              )}
              <circle
                className={styles.foco}
                r={raio + 11}
                fill="none"
                stroke="var(--color-accent-lime)"
                strokeWidth={2}
              />
              {/* área de toque mínima de 44px, mesmo quando o círculo visual é menor */}
              <circle r={Math.max(raio, 22)} fill="transparent" />
              <circle
                r={raio}
                fill={ehEspecie ? `url(#foto-${no.id})` : 'var(--color-surface-sunken)'}
                stroke={destaque ? COR_DESTAQUE[destaque] : ehEspecie ? corBioma : 'var(--color-border-strong)'}
                strokeWidth={destaque ? 4 : 2.5}
              />
              {destaque && GLIFO_DESTAQUE[destaque] && (
                <text className={styles.efeito} y={-raio - 10} fill={COR_DESTAQUE[destaque]}>
                  {GLIFO_DESTAQUE[destaque]}
                </text>
              )}
              <text className={styles.label} y={raio + 18}>
                {nome}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
