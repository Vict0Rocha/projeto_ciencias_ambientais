import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../../store/sessionStore';
import { useProgressStore } from '../../../store/progressStore';
import { getEspecieById, getCuriosidade } from '../../../domain/especiesRepository';
import { MAX_TENTATIVAS } from '../../../domain/scoring';
import { tocarAcerto, tocarErro } from '../../../domain/sound';
import { ChallengeHeader } from '../ChallengeHeader';
import { SessionSummary } from '../SessionSummary';
import { RadioOption, type RadioOptionStatus } from '../../../design-system/components/RadioOption';
import { HintBanner } from '../../../design-system/components/HintBanner';
import { ResultPopup } from '../../../design-system/components/ResultPopup';
import { Overlay } from '../../../design-system/components/Overlay';
import { CircleIconButton } from '../../../design-system/components/CircleIconButton';
import { SpeciesTeaser } from '../../species-sheet/SpeciesTeaser';
import { SpeciesFlipCard } from '../../species-sheet/SpeciesFlipCard';
import { Coachmarks } from '../../onboarding/Coachmarks';
import { TUTORIAL_ATIVO } from '../../../config';
import styles from './QuemSouEuPage.module.css';

export function QuemSouEuPage() {
  const navigate = useNavigate();
  const session = useSessionStore();
  const progress = useProgressStore();
  const [fichaAberta, setFichaAberta] = useState(false);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  // Capturado uma vez: o tour não deve sumir no meio só porque concluirTutorial()
  // (chamado pelo próprio onFinish dos coachmarks) muda tutorialConcluido no meio do passo.
  const [coachmarksAtivos, setCoachmarksAtivos] = useState(() => TUTORIAL_ATIVO && !progress.tutorialConcluido);

  const especieAtualId = session.desafioAtualId();
  const especieAtual = especieAtualId ? getEspecieById(especieAtualId) : undefined;

  const opcoes = useMemo(
    () =>
      session.opcoesAtuais
        .map((id) => getEspecieById(id))
        .filter((especie): especie is NonNullable<typeof especie> => Boolean(especie))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [session.opcoesAtuais],
  );

  const fichaRevelada = session.status === 'acerto' || (session.status === 'erro' && session.tentativasRestantes === 0);

  useEffect(() => {
    if (fichaRevelada && especieAtual) {
      progress.descobrirEspecie(especieAtual.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fichaRevelada, especieAtualId]);

  useEffect(() => {
    if (!progress.somLigado) return;
    if (session.status === 'acerto') tocarAcerto();
    else if (session.status === 'erro') tocarErro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  if (session.mecanica !== 'quem_sou_eu' || !especieAtual) {
    return (
      <div style={{ padding: 24 }}>
        <p>Nenhum desafio de "Quem Sou Eu?" ativo no momento.</p>
        <Link to="/modo-livre">Ir para o Modo Livre</Link>
      </div>
    );
  }

  const biomaAtual = especieAtual.biomas[0];

  if (mostrarResumo) {
    const acertos = session.estrelasPorDesafio.filter((e) => e > 0).length;
    return (
      <div className={styles.page}>
        <ChallengeHeader
          titulo="Quem sou eu?"
          contadorLabel={`DESAFIO ${session.desafios.length} DE ${session.desafios.length}`}
          progressPercent={100}
          bioma={biomaAtual}
          somLigado={progress.somLigado}
          onToggleSom={progress.alternarSom}
          onBack={() => navigate(-1)}
        />
        <SessionSummary
          totalDesafios={session.desafios.length}
          acertos={acertos}
          estrelas={session.estrelasTotais()}
          mensagem={`Você reconheceu ${acertos} de ${session.desafios.length} espécies nesta partida.`}
          onContinuar={() => {
            session.encerrarSessao();
            navigate('/modo-livre');
          }}
        />
      </div>
    );
  }

  const pistaAtual = especieAtual.pistas[session.pistasReveladas - 1] ?? especieAtual.pistas[0];

  function handleSelect(idEscolhido: string) {
    if (session.status !== 'pendente' || !especieAtual) return;
    session.responder(idEscolhido);
  }

  function handleAvancar() {
    if (session.ehUltimoDesafio()) {
      setMostrarResumo(true);
    } else {
      session.avancarParaProximoDesafio();
    }
  }

  function statusDaOpcao(especieId: string): RadioOptionStatus {
    if (session.status === 'pendente') {
      return especieId === session.respostaErradaAnterior ? 'incorrect' : 'idle';
    }
    if (especieId === session.respostaCorretaAtual()) return 'correct';
    if (especieId === session.respostaEscolhida) return 'incorrect';
    return 'idle';
  }

  const tentativaDoAcerto = session.tentativasRestantes === MAX_TENTATIVAS ? 1 : 2;
  const escolhidaErrada = session.respostaEscolhida ? getEspecieById(session.respostaEscolhida) : undefined;

  return (
    <div className={styles.page}>
      <ChallengeHeader
        titulo="Quem sou eu?"
        contadorLabel={`DESAFIO ${session.desafioAtualIndex + 1} DE ${session.desafios.length}`}
        progressPercent={((session.desafioAtualIndex + 1) / session.desafios.length) * 100}
        tentativasRestantes={session.tentativasRestantes}
        bioma={biomaAtual}
        somLigado={progress.somLigado}
        onToggleSom={progress.alternarSom}
        onBack={() => navigate(-1)}
      />

      <div className={styles.body}>
        <div className={styles.pistaColumn} data-coachmark="pistas">
          <div className={styles.pistaCard}>
            <div className={styles.pistaLabel}>PISTA {session.pistasReveladas} DE 3</div>
            <p className={styles.pistaTexto}>&ldquo;{pistaAtual}&rdquo;</p>
            <div className={styles.pistaProgresso} aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`${styles.pistaTraco} ${n <= session.pistasReveladas ? styles.pistaTracoAtivo : ''}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.hintBannerWrap}>
            <HintBanner
              onClick={session.revelarProximaPista}
              disabled={session.pistasReveladas >= 3 || session.status !== 'pendente'}
            >
              Próxima pista
            </HintBanner>
          </div>
        </div>

        <div className={styles.opcoesColumn} data-coachmark="palpites">
          <div className={styles.opcoesLabel} id="opcoes-label">
            ESCOLHA SEU PALPITE
          </div>
          <div className={styles.opcoesList} role="group" aria-labelledby="opcoes-label">
            {opcoes.map((especie) => (
              <RadioOption
                key={especie.id}
                label={especie.nome}
                status={statusDaOpcao(especie.id)}
                disabled={session.status !== 'pendente'}
                onSelect={() => handleSelect(especie.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <ResultPopup
        open={session.status === 'acerto'}
        kind="acerto"
        titulo="Você acertou!"
        seloTexto={
          tentativaDoAcerto === 1
            ? `COM ${session.pistasReveladas} ${session.pistasReveladas === 1 ? 'PISTA' : 'PISTAS'} · SEM ERROS`
            : 'NA 2ª TENTATIVA'
        }
        corpo={getCuriosidade(especieAtual, biomaAtual)}
        primaryLabel={session.ehUltimoDesafio() ? 'Ver resultado' : 'Próximo desafio'}
        onPrimary={handleAvancar}
        secondaryLabel="Ver a ficha completa"
        onSecondary={() => setFichaAberta(true)}
      >
        <SpeciesTeaser especie={especieAtual} />
      </ResultPopup>

      <ResultPopup
        open={session.status === 'erro' && session.tentativasRestantes > 0}
        kind="erro"
        titulo="Não é essa"
        seloTexto={`VOCÊ ESCOLHEU: ${escolhidaErrada?.nome.toUpperCase() ?? ''}`}
        corpo={escolhidaErrada ? `${escolhidaErrada.nome}: ${getCuriosidade(escolhidaErrada, escolhidaErrada.biomas[0])}` : ''}
        primaryLabel="Tentar novamente"
        onPrimary={session.tentarNovamente}
        secondaryLabel="Revelar a resposta"
        onSecondary={session.revelarResposta}
      >
        <HintBanner fullWidth>Resta 1 tentativa neste desafio</HintBanner>
      </ResultPopup>

      <ResultPopup
        open={session.status === 'erro' && session.tentativasRestantes === 0}
        kind="erro"
        titulo="Não foi dessa vez"
        seloTexto={`RESPOSTA: ${especieAtual.nome.toUpperCase()}`}
        corpo={getCuriosidade(especieAtual, biomaAtual)}
        primaryLabel={session.ehUltimoDesafio() ? 'Ver resultado' : 'Próximo desafio'}
        onPrimary={handleAvancar}
      >
        <SpeciesTeaser especie={especieAtual} />
      </ResultPopup>

      <Overlay
        open={fichaAberta}
        onClose={() => setFichaAberta(false)}
        ariaLabel={`Ficha de ${especieAtual.nome}`}
        maxWidthDesktop={360}
      >
        <div className={styles.fichaModalInner}>
          <div className={styles.fichaCloseRow}>
            <CircleIconButton aria-label="Fechar ficha" onClick={() => setFichaAberta(false)}>
              ✕
            </CircleIconButton>
          </div>
          <SpeciesFlipCard especie={especieAtual} biomaContexto={biomaAtual} />
        </div>
      </Overlay>

      {coachmarksAtivos && (
        <Coachmarks
          onFinish={() => {
            setCoachmarksAtivos(false);
            progress.concluirTutorial();
          }}
        />
      )}
    </div>
  );
}
