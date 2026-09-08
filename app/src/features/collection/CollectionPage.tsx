import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buscarEspeciesPorNome,
  getAllBiomas,
  getEspeciesPorBioma,
  getFotoAltText,
} from '../../domain/especiesRepository';
import type { BiomaId, Especie } from '../../domain/types';
import { CircleIconButton } from '../../design-system/components/CircleIconButton';
import { StatusBadge } from '../../design-system/components/StatusBadge';
import { Overlay } from '../../design-system/components/Overlay';
import { SpeciesFlipCard } from '../species-sheet/SpeciesFlipCard';
import styles from './CollectionPage.module.css';

type FiltroBioma = BiomaId | 'todos';

export function CollectionPage() {
  const navigate = useNavigate();
  const biomas = getAllBiomas();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroBioma>('todos');
  const [especieAberta, setEspecieAberta] = useState<Especie | null>(null);

  const secoes = useMemo(
    () =>
      biomas
        .filter((bioma) => filtro === 'todos' || filtro === bioma.id)
        .map((bioma) => ({
          bioma,
          especies: buscarEspeciesPorNome(busca, getEspeciesPorBioma(bioma.id)),
        }))
        .filter((secao) => secao.especies.length > 0),
    [biomas, filtro, busca],
  );

  const semResultados = secoes.length === 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <CircleIconButton aria-label="Voltar" onClick={() => navigate('/')}>
            ←
          </CircleIconButton>
          <div className={styles.titleBlock}>
            <h1 className={styles.titulo}>Coleção</h1>
            <p className={styles.subtitulo}>{biomas.length} biomas · todas as cartas disponíveis</p>
          </div>
          <label className={styles.busca}>
            <span className={styles.buscaIcone} aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              className={styles.buscaInput}
              placeholder="Buscar espécie"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              aria-label="Buscar espécie pelo nome"
            />
          </label>
        </div>

        <div className={styles.filtros} role="group" aria-label="Filtrar por bioma">
          <button
            type="button"
            className={`${styles.filtroPill} ${filtro === 'todos' ? styles.filtroAtivo : ''}`}
            onClick={() => setFiltro('todos')}
            aria-pressed={filtro === 'todos'}
          >
            Todos os biomas
          </button>
          {biomas.map((bioma) => (
            <button
              key={bioma.id}
              type="button"
              className={`${styles.filtroPill} ${filtro === bioma.id ? styles.filtroAtivo : ''}`}
              onClick={() => setFiltro(bioma.id)}
              aria-pressed={filtro === bioma.id}
            >
              {filtro !== bioma.id && <span className={styles.filtroDot} style={{ background: bioma.cor }} />}
              {bioma.nome}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.body}>
        {semResultados ? (
          <p className={styles.vazio}>Nenhuma espécie encontrada para "{busca}".</p>
        ) : (
          secoes.map(({ bioma, especies }) => (
            <section key={bioma.id} aria-labelledby={`secao-${bioma.id}`}>
              <div className={styles.secaoHeader} id={`secao-${bioma.id}`}>
                <span className={styles.secaoDot} style={{ background: bioma.cor }} aria-hidden="true" />
                {bioma.nome}
              </div>
              <div className={styles.grid}>
                {especies.map((especie) => (
                  <button
                    key={`${bioma.id}-${especie.id}`}
                    type="button"
                    className={styles.card}
                    onClick={() => setEspecieAberta(especie)}
                  >
                    <span className={styles.stripe} style={{ background: bioma.cor }} aria-hidden="true" />
                    <img className={styles.cardPhoto} src={`/${especie.foto}`} alt={getFotoAltText(especie)} />
                    <span className={styles.cardBody}>
                      <span className={styles.cardNome}>{especie.nome}</span>
                      <span className={styles.cardCientifico}>{especie.nomeCientifico}</span>
                      <StatusBadge status={especie.status} size="sm" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <Overlay
        open={especieAberta !== null}
        onClose={() => setEspecieAberta(null)}
        ariaLabel={especieAberta ? `Ficha de ${especieAberta.nome}` : 'Ficha da espécie'}
        maxWidthDesktop={360}
      >
        {especieAberta && (
          <div className={styles.fichaModalInner}>
            <div className={styles.fichaCloseRow}>
              <CircleIconButton aria-label="Fechar ficha" onClick={() => setEspecieAberta(null)}>
                ✕
              </CircleIconButton>
            </div>
            <SpeciesFlipCard especie={especieAberta} biomaContexto={especieAberta.biomas[0]} />
          </div>
        )}
      </Overlay>
    </div>
  );
}
