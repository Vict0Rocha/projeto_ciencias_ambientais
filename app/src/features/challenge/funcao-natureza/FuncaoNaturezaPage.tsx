import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../../store/sessionStore';
import { useProgressStore } from '../../../store/progressStore';
import { getEspecieById, getFuncao } from '../../../domain/especiesRepository';
import type { FuncaoId } from '../../../domain/types';
import { MAX_TENTATIVAS } from '../../../domain/scoring';
import { ChallengeHeader } from '../ChallengeHeader';
import { RadioOption, type RadioOptionStatus } from '../../../design-system/components/RadioOption';
import { ResultPopup } from '../../../design-system/components/ResultPopup';
import { Overlay } from '../../../design-system/components/Overlay';
import { CircleIconButton } from '../../../design-system/components/CircleIconButton';
import { SpeciesShowcase } from '../../species-sheet/SpeciesShowcase';
import { SpeciesTeaser } from '../../species-sheet/SpeciesTeaser';
import { SpeciesFlipCard } from '../../species-sheet/SpeciesFlipCard';
import styles from './FuncaoNaturezaPage.module.css';

export function FuncaoNaturezaPage() {
  const navigate = useNavigate();
  const session = useSessionStore();
  const progress = useProgressStore();
  const [fichaAberta, setFichaAberta] = useState(false);

  const especieAtualId = session.desafioAtualId();
  const especieAtual = especieAtualId ? getEspecieById(especieAtualId) : undefined;
  const funcaoCorretaId = session.respostaCorretaAtual();

  const opcoes = useMemo(
    () =>
      session.opcoesAtuais
        .map((id) => getFuncao(id as FuncaoId))
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

  if (session.mecanica !== 'funcao' || !especieAtual || !funcaoCorretaId) {
    return (
      <div style={{ padding: 24 }}>
        <p>Nenhum desafio de "Função na Natureza" ativo no momento.</p>
        <Link to="/modo-livre">Ir para o Modo Livre</Link>
      </div>
    );
  }

  const biomaAtual = especieAtual.biomas[0];

  function handleSelect(idEscolhido: string) {
    if (session.status !== 'pendente') return;
    session.responder(idEscolhido);
  }

  function handleAvancar() {
    if (session.ehUltimoDesafio()) {
      session.encerrarSessao();
      navigate('/modo-livre');
    } else {
      session.avancarParaProximoDesafio();
    }
  }

  function statusDaOpcao(funcaoId: string): RadioOptionStatus {
    if (session.status === 'pendente') {
      return funcaoId === session.respostaErradaAnterior ? 'incorrect' : 'idle';
    }
    if (funcaoId === session.respostaCorretaAtual()) return 'correct';
    if (funcaoId === session.respostaEscolhida) return 'incorrect';
    return 'idle';
  }

  const tentativaDoAcerto = session.tentativasRestantes === MAX_TENTATIVAS ? 1 : 2;
  const funcaoCorreta = getFuncao(funcaoCorretaId as FuncaoId);
  const funcaoEscolhidaErrada = session.respostaEscolhida ? getFuncao(session.respostaEscolhida as FuncaoId) : undefined;

  return (
    <div className={styles.page}>
      <ChallengeHeader
        titulo="Função na Natureza"
        contadorLabel={`ESPÉCIE ${session.desafioAtualIndex + 1} DE ${session.desafios.length}`}
        progressPercent={((session.desafioAtualIndex + 1) / session.desafios.length) * 100}
        tentativasRestantes={session.tentativasRestantes}
        bioma={biomaAtual}
        somLigado={progress.somLigado}
        onToggleSom={progress.alternarSom}
        onBack={() => navigate(-1)}
      />

      <div className={styles.body}>
        <div className={styles.speciesColumn}>
          <SpeciesShowcase especie={especieAtual} />
        </div>

        <div className={styles.opcoesColumn}>
          <h2 className={styles.pergunta} id="opcoes-label">
            Qual é a função desta espécie na natureza?
          </h2>
          <div className={styles.opcoesList} role="group" aria-labelledby="opcoes-label">
            {opcoes.map((funcao) => (
              <RadioOption
                key={funcao.id}
                label={funcao.nome}
                status={statusDaOpcao(funcao.id)}
                disabled={session.status !== 'pendente'}
                onSelect={() => handleSelect(funcao.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <ResultPopup
        open={session.status === 'acerto'}
        kind="acerto"
        titulo="Isso mesmo!"
        seloTexto={tentativaDoAcerto === 1 ? '1ª TENTATIVA' : 'NA 2ª TENTATIVA'}
        corpo={funcaoCorreta.descricao}
        primaryLabel={session.ehUltimoDesafio() ? 'Ver resultado' : 'Próxima espécie'}
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
        seloTexto={`VOCÊ ESCOLHEU: ${funcaoEscolhidaErrada?.nome.toUpperCase() ?? ''}`}
        corpo={funcaoEscolhidaErrada ? `${funcaoEscolhidaErrada.nome}: ${funcaoEscolhidaErrada.descricao}` : ''}
        primaryLabel="Tentar novamente"
        onPrimary={session.tentarNovamente}
        secondaryLabel="Revelar a resposta"
        onSecondary={session.revelarResposta}
      />

      <ResultPopup
        open={session.status === 'erro' && session.tentativasRestantes === 0}
        kind="erro"
        titulo="Não foi dessa vez"
        seloTexto={`RESPOSTA: ${funcaoCorreta.nome.toUpperCase()}`}
        corpo={funcaoCorreta.descricao}
        primaryLabel={session.ehUltimoDesafio() ? 'Ver resultado' : 'Próxima espécie'}
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
    </div>
  );
}
