import { useParams } from 'react-router-dom';

export function ChallengePage() {
  const { mecanica } = useParams<{ mecanica: string }>();
  return (
    <div style={{ padding: 24 }}>
      <h1>Desafio: {mecanica}</h1>
      <p>Em construção.</p>
    </div>
  );
}
