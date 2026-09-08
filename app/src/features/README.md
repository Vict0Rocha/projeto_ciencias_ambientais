# `features/`

Uma pasta por tela/fluxo do jogo. Convenção: `NomeDaTela.tsx` + `NomeDaTela.module.css` juntos na pasta; a pasta é registrada como rota em `src/app/router.tsx`.

| Pasta | Tela | Status |
|---|---|---|
| `home/` | Tela Inicial | ✅ pronto |
| `free-mode/` | Modo Livre — escolha de mecânica (sem escolha de bioma), inicia a partida nos stores certos | ✅ pronto |
| `challenge/` | As 3 mecânicas de jogo + header/HUD compartilhado — ver [`challenge/README.md`](challenge/README.md) | ✅ pronto |
| `species-sheet/` | Componentes de exibição de espécie reusados pelas outras features — ver [`species-sheet/README.md`](species-sheet/README.md) | ✅ pronto |
| `collection/` | Coleção (busca, filtro por bioma, abre a ficha) | ✅ pronto |
| `about/` | Sobre o Jogo (inclui o botão "Rever tutorial") | ✅ pronto |
| `onboarding/` | Boas-vindas em 3 passos + coachmarks da primeira fase — ver [`onboarding/README.md`](onboarding/README.md) | ✅ pronto |
| `journey/` | Mapa da Jornada | ⏸️ **placeholder só** — não implementar sem confirmar com o usuário (ver `app/README.md` e `domain/journeyConfig.ts`) |
