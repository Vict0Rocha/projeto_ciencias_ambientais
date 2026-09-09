# `features/challenge/`

As 3 mecânicas de jogo, mais o HUD compartilhado.

| Arquivo/pasta | O quê |
|---|---|
| `ChallengeHeader.tsx` | Header compartilhado pelas 3 mecânicas: voltar, título, contador ("DESAFIO n DE N" ou "n LIGAÇÕES FEITAS"), barra de progresso, tentativas (`AttemptDots` — omitido se `tentativasRestantes` não for passado, caso da Rede da Vida e da tela de resumo), chip de bioma, som. |
| `SessionSummary.tsx` | Painel "Partida concluída" (acertos, estrelas totais, uma frase, botão "Voltar ao Modo Livre") — usado por `quem-sou-eu/` e `funcao-natureza/` no fim da partida. Equivalente ao que a Rede da Vida já fazia sozinha na fase `concluido`; existe como componente à parte porque as duas mecânicas de múltipla escolha compartilham o mesmo formato de resumo (vem do `sessionStore`), então extrair evitou duplicar o painel duas vezes. |
| `quem-sou-eu/QuemSouEuPage.tsx` | Usa `sessionStore`. Pistas progressivas + lista de opções. No último desafio, o popup de resultado dá lugar a `SessionSummary` em vez de navegar direto pro Modo Livre. |
| `funcao-natureza/FuncaoNaturezaPage.tsx` | Usa `sessionStore` (mesmo store, `mecanica: 'funcao'`). Sem pistas — mostra a espécie (`SpeciesShowcase`) e pergunta a função. Mesmo fim de partida via `SessionSummary`. |
| `rede-da-vida/RedeDaVidaPage.tsx` + `RedeGraph.tsx` | Usa `redeStore` (store dedicado — ver `src/store/README.md`). `RedeGraph.tsx` é o grafo em SVG puro (nós focáveis por teclado, `role="button"`/`aria-label` em cada nó). Fim de partida é inline na própria página (fase `concluido`), não usa `SessionSummary` — o placar é um `estrelas: 0-3` único (a rede toda), não uma soma por desafio. |
| `ChallengePage.tsx` | Fallback genérico da rota `/desafio/:mecanica` — só é renderizado se nenhuma das 3 rotas específicas acima bater. Não é uma tela de verdade, é rede de segurança. |

O popup de resultado (acerto/erro/revelação) é o `ResultPopup` em `src/design-system/components/` — compartilhado por Quem Sou Eu e Função na Natureza. A Rede da Vida não usa `ResultPopup` (o formato do resultado — placar de ligações, cascata — é diferente demais); ela tem seus próprios painéis inline dentro de `RedeDaVidaPage.tsx`.

## Fim de partida (Modo Livre)

As 3 mecânicas terminam a partida com um painel de resumo em vez de voltar ao Modo Livre em silêncio — Rede da Vida sempre teve isso (fase `concluido`); Quem Sou Eu e Função na Natureza usam `SessionSummary`. Em ambos os casos o `store` só é limpo (`encerrarSessao`/`encerrarPartida`) no clique do botão "Voltar ao Modo Livre" do resumo, não antes — enquanto o resumo está na tela, os números ainda vêm do estado da partida que acabou de terminar.

## Padrão de uma mecânica de múltipla escolha

Se for adicionar uma mecânica nova parecida com Quem Sou Eu/Função na Natureza: reaproveite `sessionStore.iniciarPartida(mecanica, sujeitos, resolverCorreta, opcoesPool, opcoesQtd)` — não crie um store novo a menos que a interação fuja do padrão pergunta→opções→2 tentativas (foi o caso da Rede da Vida).
