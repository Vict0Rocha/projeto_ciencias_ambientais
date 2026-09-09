import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRedeStore, type LigacaoFeita } from '../../../store/redeStore';
import { useProgressStore } from '../../../store/progressStore';
import { getBioma, resolveNoRede } from '../../../domain/especiesRepository';
import { CARTA_ID_REGEX } from '../../../domain/types';
import { tocarAcerto, tocarErro } from '../../../domain/sound';
import { ChallengeHeader } from '../ChallengeHeader';
import { Button } from '../../../design-system/components/Button';
import { StarRating } from '../../../design-system/components/StarRating';
import { RedeGraph, type Aresta, type DestaqueNo } from './RedeGraph';
import styles from './RedeDaVidaPage.module.css';

function nomeDoNo(id: string): string {
  return resolveNoRede(id)?.data.nome ?? id;
}

export function RedeDaVidaPage() {
  const navigate = useNavigate();
  const progress = useProgressStore();
  const {
    bioma,
    rede,
    nos,
    fase,
    noSelecionado,
    ligacoesFeitas,
    resultadoLigacoes,
    estrelas,
    eventoAtualIndex,
    cascataRevelada,
    selecionarNo,
    removerLigacao,
    confirmarRede,
    avancarParaEventos,
    revelarCascata,
    avancarEvento,
    encerrarPartida,
  } = useRedeStore();

  const [alvosRevelados, setAlvosRevelados] = useState(0);

  useEffect(() => {
    setAlvosRevelados(0);
  }, [eventoAtualIndex]);

  useEffect(() => {
    if (fase === 'concluido' && rede) {
      rede.nos.filter((id) => CARTA_ID_REGEX.test(id)).forEach((id) => progress.descobrirEspecie(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  useEffect(() => {
    if (!progress.somLigado || fase !== 'confirmado') return;
    if ((estrelas ?? 0) > 0) tocarAcerto();
    else tocarErro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  if (!rede || !bioma) {
    return (
      <div style={{ padding: 24 }}>
        <p>Nenhuma partida de "Rede da Vida" ativa no momento.</p>
        <Link to="/modo-livre">Ir para o Modo Livre</Link>
      </div>
    );
  }

  const redeAtual = rede;
  const corBioma = getBioma(bioma).cor;
  const eventoAtual = redeAtual.eventos[Math.min(eventoAtualIndex, redeAtual.eventos.length - 1)];

  function handleVerCascata() {
    revelarCascata();
    eventoAtual.cascata.forEach((_, i) => {
      setTimeout(() => setAlvosRevelados((atual) => Math.max(atual, i + 1)), i * 400);
    });
  }

  function arestasParaFase(): Aresta[] {
    if (fase === 'montagem') {
      return ligacoesFeitas.map((l) => ({ de: l.de, para: l.para, cor: 'var(--color-accent-lime)' }));
    }
    if (fase === 'confirmado') {
      return resultadoLigacoes.map((r) => ({
        de: r.de,
        para: r.para,
        cor: r.correta ? 'var(--color-accent-lime)' : 'var(--color-error-ink)',
      }));
    }
    return redeAtual.relacoes.map((r) => ({ de: r.de, para: r.para, cor: 'var(--color-border-strong)' }));
  }

  const nosDestacados: Partial<Record<string, DestaqueNo>> = {};
  if (fase === 'eventos') {
    eventoAtual.impactoDireto.forEach((id) => {
      nosDestacados[id] = 'impacto';
    });
    if (cascataRevelada) {
      eventoAtual.cascata.slice(0, alvosRevelados).forEach((c) => {
        nosDestacados[c.alvo] = c.efeito;
      });
    }
  }

  const contadorLabel =
    fase === 'eventos' || fase === 'concluido'
      ? `EVENTO ${Math.min(eventoAtualIndex + 1, rede.eventos.length)} DE ${rede.eventos.length}`
      : `${ligacoesFeitas.length} LIGAÇÕES FEITAS`;
  const progressPercent =
    fase === 'eventos' || fase === 'concluido'
      ? ((eventoAtualIndex + 1) / rede.eventos.length) * 100
      : Math.min(100, (ligacoesFeitas.length / rede.relacoes.length) * 100);

  const corretas = resultadoLigacoes.filter((r) => r.correta).length;

  return (
    <div className={styles.page}>
      <ChallengeHeader
        titulo="Rede da Vida"
        contadorLabel={contadorLabel}
        progressPercent={progressPercent}
        bioma={bioma}
        somLigado={progress.somLigado}
        onToggleSom={progress.alternarSom}
        onBack={() => navigate(-1)}
      />

      {fase === 'montagem' && (
        <div className={styles.body}>
          <div className={styles.main}>
            <p className={styles.instrucao}>Ligue as espécies como você acha que elas se relacionam — confira no final.</p>
            <RedeGraph
              nos={nos}
              resolveNo={resolveNoRede}
              arestas={arestasParaFase()}
              corBioma={corBioma}
              noSelecionado={noSelecionado}
              onSelecionarNo={selecionarNo}
              interativo
              ariaLabel={`Grafo de relações ecológicas — ${getBioma(bioma).nome}`}
            />
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.ligacoesCard}>
              <span className={styles.ligacoesLabel}>LIGAÇÕES FEITAS</span>
              {ligacoesFeitas.length === 0 ? (
                <p className={styles.vazio}>Toque em duas espécies para ligá-las.</p>
              ) : (
                <ul className={styles.ligacoesList}>
                  {ligacoesFeitas.map((l: LigacaoFeita) => (
                    <li key={`${l.de}-${l.para}`} className={styles.ligacaoItem}>
                      <span>
                        {nomeDoNo(l.de)} — {nomeDoNo(l.para)}
                      </span>
                      <button
                        type="button"
                        className={styles.ligacaoRemover}
                        onClick={() => removerLigacao(l)}
                        aria-label={`Remover ligação entre ${nomeDoNo(l.de)} e ${nomeDoNo(l.para)}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button variant="primary" fullWidth disabled={ligacoesFeitas.length === 0} onClick={confirmarRede}>
              Confirmar rede
            </Button>
          </aside>
        </div>
      )}

      {fase === 'confirmado' && (
        <div className={styles.body}>
          <div className={styles.main}>
            <RedeGraph
              nos={nos}
              resolveNo={resolveNoRede}
              arestas={arestasParaFase()}
              corBioma={corBioma}
              interativo={false}
              ariaLabel={`Resultado da rede — ${getBioma(bioma).nome}`}
            />
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.painel}>
              <h2 className={styles.painelTitulo}>{(estrelas ?? 0) > 0 ? 'Boa!' : 'Quase lá'}</h2>
              <div className={styles.placar}>
                <StarRating estrelas={estrelas ?? 0} />
                <span>
                  {corretas} de {resultadoLigacoes.length} ligações certas
                </span>
              </div>
              <p className={styles.painelTexto}>
                As linhas verdes bateram com a rede real; as vermelhas, não. Agora vamos ver o que acontece quando um
                evento atinge essa rede.
              </p>
              <Button variant="primary" fullWidth onClick={avancarParaEventos}>
                Continuar
              </Button>
            </div>
          </aside>
        </div>
      )}

      {fase === 'eventos' && (
        <div className={styles.body}>
          <div className={styles.main}>
            <RedeGraph
              nos={nos}
              resolveNo={resolveNoRede}
              arestas={arestasParaFase()}
              corBioma={corBioma}
              interativo={false}
              nosDestacados={nosDestacados}
              ariaLabel={`Cascata do evento — ${eventoAtual.titulo}`}
            />
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.painel}>
              <span className={styles.ligacoesLabel} style={{ color: 'var(--color-ink-muted)' }}>
                EVENTO {eventoAtualIndex + 1} DE {rede.eventos.length}
              </span>
              <h2 className={styles.painelTitulo}>{eventoAtual.titulo}</h2>
              <p className={styles.painelTexto}>{eventoAtual.cenario}</p>
              {!cascataRevelada ? (
                <Button variant="primary" fullWidth onClick={handleVerCascata}>
                  Ver o que acontece
                </Button>
              ) : (
                <>
                  {alvosRevelados >= eventoAtual.cascata.length && (
                    <p className={styles.painelTexto}>
                      <strong>{eventoAtual.explicacao}</strong>
                    </p>
                  )}
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={alvosRevelados < eventoAtual.cascata.length}
                    onClick={avancarEvento}
                  >
                    {eventoAtualIndex + 1 >= rede.eventos.length ? 'Ver resultado final' : 'Próximo evento'}
                  </Button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {fase === 'concluido' && (
        <div className={styles.body}>
          <div className={styles.painel} style={{ margin: '0 auto', maxWidth: 420, width: '100%' }}>
            <h2 className={styles.painelTitulo}>Partida concluída</h2>
            <div className={styles.placar}>
              <StarRating estrelas={estrelas ?? 0} />
            </div>
            <p className={styles.painelTexto}>
              Você explorou a rede ecológica de {getBioma(bioma).nome} e viu como um evento se espalha por ela.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                encerrarPartida();
                navigate('/modo-livre');
              }}
            >
              Voltar ao Modo Livre
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
