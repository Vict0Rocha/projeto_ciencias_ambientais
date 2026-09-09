import { useEffect, useRef } from 'react';
import { Button } from '../../design-system/components/Button';
import styles from './SessionSummary.module.css';

export interface SessionSummaryProps {
  totalDesafios: number;
  acertos: number;
  estrelas: number;
  mensagem: string;
  onContinuar: () => void;
}

/**
 * Tela de fechamento de uma partida do Modo Livre nas mecânicas de múltipla escolha
 * (Quem Sou Eu / Função na Natureza) — equivalente ao painel "Partida concluída" que
 * a Rede da Vida já tem na fase `concluido`. Sem isso, o botão "Ver resultado" do
 * último desafio não levava a lugar nenhum (só encerrava a sessão e voltava pro
 * Modo Livre em silêncio).
 */
export function SessionSummary({ totalDesafios, acertos, estrelas, mensagem, onContinuar }: SessionSummaryProps) {
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.painel}>
        <h2 className={styles.titulo} ref={tituloRef} tabIndex={-1}>
          Partida concluída
        </h2>
        <div className={styles.placar}>
          <span>
            <strong>{acertos}</strong> de {totalDesafios} acertos
          </span>
          <span>
            <strong>★ {estrelas}</strong> estrelas
          </span>
        </div>
        <p className={styles.texto}>{mensagem}</p>
        <Button variant="primary" fullWidth onClick={onContinuar}>
          Voltar ao Modo Livre
        </Button>
      </div>
    </div>
  );
}
