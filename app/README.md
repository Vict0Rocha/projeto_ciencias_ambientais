# Bio Tríade — app

Implementação em produção do jogo. Ver [`../README.md`](../README.md) para o panorama do repositório e [`../design_handoff_bio_triade/README.md`](../design_handoff_bio_triade/README.md) para a especificação de design/regras (fonte de verdade — este app deve seguir aquele documento, não o contrário).

## Rodar localmente

```bash
npm install
npm run dev      # servidor de dev (Vite), http://localhost:5173
npm run build    # type-check (tsc -b) + build de produção
```

## Stack

React + TypeScript + Vite · Zustand (estado) · react-router-dom · CSS Modules (sem framework de CSS) · d3-force (layout do grafo da Rede da Vida).

Decisão de arquitetura chave: **cada tela é um componente único responsivo** (CSS com breakpoint em 900px), não um par mobile/desktop duplicado como nos protótipos `.dc.html` do handoff.

## Estrutura de `src/`

| Pasta | O quê | README |
|---|---|---|
| `data/` | `especies.json` — cópia fiel do handoff, fonte única de conteúdo científico | — |
| `domain/` | Lógica pura (sem React): acesso a dados, pontuação, layout de grafo | [`src/domain/README.md`](src/domain/README.md) |
| `store/` | Estado global (Zustand) | [`src/store/README.md`](src/store/README.md) |
| `design-system/` | Tokens visuais + componentes de UI reutilizáveis | [`src/design-system/README.md`](src/design-system/README.md) |
| `features/` | Uma pasta por tela/fluxo do jogo | [`src/features/README.md`](src/features/README.md) |
| `app/` | `App.tsx` (raiz) + `router.tsx` (rotas) | — |

## Status (2026-09-08)

### ✅ Pronto e testado (mobile + desktop, no navegador)
- As 3 mecânicas de jogo: Quem Sou Eu?, Função na Natureza, Rede da Vida
- Modo Livre (escolha só o modo — sem escolha de bioma; perguntas sorteadas sem repetir na partida)
- Telas estruturais: Tela Inicial, Coleção, Sobre o Jogo
- Ficha educativa (carta com flip), persistência de progresso (coleção descoberta, som)
- Onboarding em 3 passos (tela cheia no mobile, modal no desktop) + coachmarks com spotlight na
  primeira fase de Quem Sou Eu; botão "Rever tutorial" na tela Sobre — ver
  [`src/features/onboarding/README.md`](src/features/onboarding/README.md)
- Efeitos sonoros de acerto/erro nas 3 mecânicas, sintetizados via Web Audio API (sem arquivo de
  áudio, ver `src/domain/sound.ts`) — o toggle de som agora liga/desliga áudio de verdade
- Alt-text definitivo das 17 fotos de espécie (escrito olhando cada foto real, ver
  `FOTO_ALT_TEXT` em `src/domain/especiesRepository.ts`)
- Tela de fim de partida ("Partida concluída" — acertos, estrelas, botão pro Modo Livre) em
  Quem Sou Eu e Função na Natureza, mesmo padrão que a Rede da Vida já tinha — antes disso o
  botão do último desafio ("Ver resultado") não mostrava nada, só voltava em silêncio. Ver
  `src/features/challenge/SessionSummary.tsx` e a seção "Fim de partida" em
  [`src/features/challenge/README.md`](src/features/challenge/README.md)

### 🔜 Falta
- (nada pendente no momento — próximo item a definir com o usuário)

### ⏸️ Em espera — não mexer sem confirmar com o usuário antes
- **Modo Jornada** — rota `/jornada` é só um placeholder. Existe um rascunho de estrutura em `src/domain/journeyConfig.ts`, mas ele **não está conectado a nada** e pode não refletir como a Jornada será de fato implementada. Não crie telas nem conecte esse arquivo a stores/rotas sem alinhar antes.

### 🚫 Combinado não fazer (por ora)
- Modal de pausa/ajustes
- Tela "Para Professores" (o link foi removido da navegação)

### 📋 Pendências que não são código
- Itens `"revisar": true` em `especies.json` (relações/eventos sem validação de especialista)
- Créditos/licença das fotos em `public/img/` e `public/uploads/`

## Deploy

Configurado para Vercel via [`vercel.json`](../vercel.json) na raiz do repositório (build/output
apontando pra dentro de `app/`, já que o projeto Vite não fica na raiz do repo; inclui rewrite de
SPA pra `index.html`, necessário porque as rotas são client-side via `react-router-dom`). Sem
variáveis de ambiente — o app é 100% estático, sem chamada de rede.

## Convenções

- **Responsividade**: um único breakpoint em 900px (`--breakpoint-desktop` em `tokens.css`, mas é só documentação — o valor literal `900px` é repetido em cada `@media`). Textos grandes usam `clamp()` em vez de saltar de um tamanho fixo pro outro.
- **Estilo**: CSS Modules por componente/tela (`Nome.module.css` ao lado de `Nome.tsx`). Cores/tipografia/espaçamento sempre via variável de `design-system/tokens.css`, nunca hex/px soltos.
- **Alvo de toque**: nunca abaixo de 44px (regra explícita do handoff).
- **Sem dependência de rede**: `especies.json` é carregado uma vez e indexado; nenhuma chamada HTTP é feita pelo app.
