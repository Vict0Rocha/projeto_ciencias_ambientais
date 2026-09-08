# `store/`

Estado global via Zustand. Três stores, cada um com uma responsabilidade clara — não misture estado entre eles.

| Store | Persiste? | Responsabilidade |
|---|---|---|
| `sessionStore.ts` | Não (em memória) | Uma partida do Modo Livre nas mecânicas de **múltipla escolha** (Quem Sou Eu? e Função na Natureza). Genérico o bastante pra cobrir as duas: `desafios` guarda o "sujeito" de cada rodada (sempre um id de espécie); `respostasCorretas` guarda a resposta certa já resolvida no namespace certo (a própria espécie, em Quem Sou Eu; a função dela, em Função na Natureza) — resolvida por uma função `resolverCorreta` passada em `iniciarPartida()`. `opcoesAtuais` são sorteadas a cada desafio a partir de `opcoesPool`. |
| `redeStore.ts` | Não (em memória) | Sessão da Rede da Vida — **store separado** porque a interação (grafo, não pergunta-de-múltipla-escolha) é fundamentalmente diferente. Máquina de fases: `montagem` (jogador liga nós) → `confirmado` (mostra acertos/erros + estrelas) → `eventos` (percorre os eventos do bioma sorteado, cascata animada) → `concluido`. `iniciarPartida()` sorteia o bioma sozinho (Modo Livre não escolhe bioma). |
| `progressStore.ts` | **Sim** — `localStorage`, chave `bio-triade/progresso` | Único estado que sobrevive a um refresh: `especiesDescobertas` (alimenta a Coleção), `somLigado`, `tutorialConcluido`/`reverTutorial` (controla o onboarding — ver [`../features/onboarding/README.md`](../features/onboarding/README.md) pra entender a ordem em que cada componente muda esse flag), `fasesConcluidas`/`estrelasPorFase` (chave é um `faseId` — só faz sentido quando o Modo Jornada existir; hoje nada escreve nesses campos, já que o Modo Livre não tem fase). |

## Por que Rede da Vida tem store próprio

`sessionStore` assume um ciclo pergunta→resposta→próxima. A Rede da Vida não tem "pergunta" nem "tentativas" da mesma forma (é montar um grafo inteiro e depois observar eventos) — forçar isso dentro do `sessionStore` exigiria campos opcionais/`null` demais e ramificações condicionais em todo lugar. Dois stores pequenos e coesos venceram um store genérico demais.
