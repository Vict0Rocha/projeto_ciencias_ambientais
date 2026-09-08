# `features/challenge/`

As 3 mecânicas de jogo, mais o HUD compartilhado.

| Arquivo/pasta | O quê |
|---|---|
| `ChallengeHeader.tsx` | Header compartilhado pelas 3 mecânicas: voltar, título, contador ("DESAFIO n DE N" ou "n LIGAÇÕES FEITAS"), barra de progresso, tentativas (`AttemptDots` — omitido se `tentativasRestantes` não for passado, caso da Rede da Vida), chip de bioma, som. |
| `quem-sou-eu/QuemSouEuPage.tsx` | Usa `sessionStore`. Pistas progressivas + lista de opções. |
| `funcao-natureza/FuncaoNaturezaPage.tsx` | Usa `sessionStore` (mesmo store, `mecanica: 'funcao'`). Sem pistas — mostra a espécie (`SpeciesShowcase`) e pergunta a função. |
| `rede-da-vida/RedeDaVidaPage.tsx` + `RedeGraph.tsx` | Usa `redeStore` (store dedicado — ver `src/store/README.md`). `RedeGraph.tsx` é o grafo em SVG puro (nós focáveis por teclado, `role="button"`/`aria-label` em cada nó). |
| `ChallengePage.tsx` | Fallback genérico da rota `/desafio/:mecanica` — só é renderizado se nenhuma das 3 rotas específicas acima bater. Não é uma tela de verdade, é rede de segurança. |

O popup de resultado (acerto/erro/revelação) é o `ResultPopup` em `src/design-system/components/` — compartilhado por Quem Sou Eu e Função na Natureza. A Rede da Vida não usa `ResultPopup` (o formato do resultado — placar de ligações, cascata — é diferente demais); ela tem seus próprios painéis inline dentro de `RedeDaVidaPage.tsx`.

## Padrão de uma mecânica de múltipla escolha

Se for adicionar uma mecânica nova parecida com Quem Sou Eu/Função na Natureza: reaproveite `sessionStore.iniciarPartida(mecanica, sujeitos, resolverCorreta, opcoesPool, opcoesQtd)` — não crie um store novo a menos que a interação fuja do padrão pergunta→opções→2 tentativas (foi o caso da Rede da Vida).
