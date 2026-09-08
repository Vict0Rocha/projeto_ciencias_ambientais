# `design-system/`

Tokens visuais e componentes de UI puramente apresentacionais (sem lógica de jogo). Qualquer tela nova deve compor a partir daqui antes de escrever CSS solto.

## Tokens

- `tokens.css` — todas as variáveis: cores, tipografia (`--font-heading` Outfit, `--font-body` IBM Plex Sans, `--font-mono` IBM Plex Mono), escala de espaçamento, raios, sombras, breakpoint. Valores vêm de [`design_handoff_bio_triade/README.md`](../../../design_handoff_bio_triade/README.md) — não invente um valor novo sem checar lá primeiro (com uma exceção: alguns tokens de "erro/sucesso"/estados que não estavam explícitos na tabela do handoff foram extraídos direto do HTML dos protótipos — estão comentados no arquivo).
- `global.css` — reset, import de fontes (Google Fonts), foco de teclado (`:focus-visible`), `prefers-reduced-motion`.
- Cores de bioma e de status de conservação **não** estão em `tokens.css` — vêm do próprio `especies.json` (`especiesRepository.getBioma()` / `getStatusConservacao()`) pra não duplicar fonte de verdade. `BiomaChip` e `StatusBadge` já fazem essa ponte.

## Componentes (`components/`)

| Componente | Uso |
|---|---|
| `Button` | Botão de ação. Variantes `primary`/`secondary`/`accent`, tamanhos `md`/`lg`. `min-height: 44px` embutido. |
| `CircleIconButton` | Botão circular de ícone (voltar, som) |
| `Pill` | Pílula genérica de fundo/cor customizáveis. Tamanhos `md`/`sm` |
| `StatusBadge` | `Pill` pré-preenchido com cor/texto do status de conservação (dado, não hardcoded) |
| `BiomaChip` | `Pill` pré-preenchido com cor/nome do bioma; aceita `suffix` (ex.: "· FASE 7", só usado se/quando a Jornada existir) |
| `ProgressBar` | Barra de progresso genérica |
| `AttemptDots` | Quadradinhos de tentativas restantes (HUD) |
| `StarRating` | 0–3 estrelas (glifo de texto) |
| `RadioOption` | Item de lista selecionável (usado nas listas de palpite/opções) — estados `idle`/`correct`/`incorrect` |
| `HintBanner` | Pílula turquesa — usada tanto como botão ("Próxima pista") quanto como aviso estático ("Resta 1 tentativa") |
| `Overlay` | Primitivo de modal: bottom-sheet no mobile, centralizado no desktop (via `createPortal`). Base de tudo que abre por cima da tela. |
| `ResultPopup` | Popup de resultado (acerto/erro) compartilhado pelas 3 mecânicas — construído em cima de `Overlay` |

## Convenções

- CSS Modules (`Nome.module.css` ao lado de `Nome.tsx`), nunca styled-components/Tailwind.
- Breakpoint único: `@media (min-width: 900px)`. Tipografia/espaçamento grande usa `clamp()` em vez de dois valores fixos.
- Todo elemento interativo precisa de alvo de toque ≥44px e estado `:focus-visible` visível — se você suprimir o outline padrão (`outline: none`), tem que desenhar um substituto (ver `RedeGraph.module.css` pra um exemplo de foco customizado num `<svg>`).
