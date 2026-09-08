# `features/onboarding/`

Dois componentes independentes, ambos overlays via `createPortal` (fora do fluxo normal de rota):

| Componente | O quê | Onde é montado |
|---|---|---|
| `OnboardingWelcome.tsx` | Boas-vindas em 3 passos — tela cheia no mobile, modal de 720px sobre fundo escurecido (3 fotos de bioma) no desktop | `home/HomePage.tsx` |
| `Coachmarks.tsx` | Tour de spotlight (3 dicas) sobre a tela **real** de Quem Sou Eu — mede a posição verdadeira dos elementos via `getBoundingClientRect()`, não usa coordenadas fixas | `challenge/quem-sou-eu/QuemSouEuPage.tsx` |

## Como o spotlight funciona

`Coachmarks` procura no DOM `[data-coachmark="<seletor>"]` (atributo colocado nos elementos reais que devem ser destacados — hoje em `QuemSouEuPage.tsx` nas colunas de pista/palpites e em `ChallengeHeader.tsx` no bloco de progresso/tentativas). Mede o retângulo real do alvo, dá scroll até ele ficar visível (`scrollIntoView`, respeita `prefers-reduced-motion`) e desenha 4 "bandas" escuras ao redor dele (mesma técnica do protótipo `.dc.html` — canto superior/inferior/esquerda/direita cobrindo tudo exceto o retângulo do alvo) + uma borda lima decorativa. Reage a resize/scroll pra manter o recorte alinhado. Se quiser destacar um elemento novo, só adicionar o atributo `data-coachmark="algumNome"` nele e um passo em `PASSOS` com esse seletor.

## A dança do `tutorialConcluido`

`progressStore` só tem **um** booleano (`tutorialConcluido`) pros dois componentes acima. A ordem em que ele muda é intencional e não é óbvia lendo cada componente isolado:

1. `OnboardingWelcome` **nunca** chama `concluirTutorial()`. Terminar os 3 passos (ou "Pular") só fecha a tela de boas-vindas e deixa quem montou o componente decidir a navegação seguinte (`HomePage` manda pro Modo Livre).
2. `Coachmarks` é quem chama `concluirTutorial()`, e só no fim (3ª dica ou "Pular dicas"). É o **último** passo do tutorial inteiro — por isso o flag só vira `true` ali.
3. Consequência: se o aluno fechar as boas-vindas mas nunca chegar a jogar "Quem sou eu?" antes de voltar pra Home, `tutorialConcluido` continua `false` e a tela de boas-vindas aparece de novo. Aceito de propósito — é a única forma de "lembrar que o tutorial não terminou" sem inventar um segundo campo persistido. Ver [`../../store/README.md`](../../store/README.md).
4. `HomePage` e `QuemSouEuPage` capturam `!tutorialConcluido` num `useState` **lazy** (só lido no primeiro render) — não em `useProgressStore(s => s.tutorialConcluido)` direto — porque `Coachmarks.onFinish` chama `concluirTutorial()` e isso não pode fechar o próprio overlay que está chamando (o fechamento já acontece via `setState` local, no mesmo clique).

"Rever tutorial" (botão em `about/AboutPage.tsx`) só chama `reverTutorial()` (volta `tutorialConcluido` pra `false`) e navega pra `/`. `HomePage` remonta do zero e lê o flag de novo — não precisa de nenhum caso especial.

## Pendências

- Nenhuma — testado ao vivo (mobile e desktop) cobrindo: os 3 passos, voltar, pular, Esc, as 3 dicas, pular dicas, Esc, e o botão "Rever tutorial".
