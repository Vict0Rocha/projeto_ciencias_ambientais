# `domain/`

Lógica pura — nenhum arquivo aqui importa React. Tudo é testável isoladamente e é a única camada que lê `src/data/especies.json` diretamente.

| Arquivo | O quê |
|---|---|
| `types.ts` | Tipos TypeScript espelhando a forma do `especies.json` (`Especie`, `RedeBioma`, `RelacaoRede`, `EventoRede`, etc.) |
| `especiesRepository.ts` | Único ponto de acesso aos dados: indexa `especies.json` por id, expõe getters (`getEspecieById`, `getBioma`, `getStatusConservacao`, `getFuncao`, `getRedePorBioma`...), `resolveNoRede` (resolve um id do grafo pra espécie ou recurso — regex `^\d{3}$` decide qual), busca por nome (`buscarEspeciesPorNome`, ignora acento), e `getFotoAltText` (alt-text placeholder, ver pendência no README do app) |
| `scoring.ts` | Regra de estrelas do README do handoff: 2 tentativas por desafio, pistas reduzem a nota máxima. `calcularEstrelas(acertou, tentativaDoAcerto, pistasReveladas)` |
| `random.ts` | `shuffle()` — Fisher-Yates genérico, usado pra sortear a sequência de perguntas do Modo Livre e as opções erradas de cada desafio |
| `redeLayout.ts` | `calcularLayoutRede()` — calcula posições x/y dos nós do grafo da Rede da Vida via `d3-force` (simulação rodada uma vez, de forma síncrona, quando a partida começa — não é recalculada a cada render). Se o grafo aparecer com nós sobrepostos, o problema normalmente é aqui (posições iniciais precisam ficar espalhadas, não todas no centro — é uma armadilha conhecida do d3-force) |
| `journeyConfig.ts` | ⚠️ **Dormente.** Rascunho de estrutura do Modo Jornada (12 fases = 3 biomas × 4 níveis). Não é importado por nenhum store ou tela atualmente. Não conectar/expandir sem antes confirmar com o usuário como a Jornada deve funcionar — ver pendência em `app/README.md` |

## Convenção

Nada fora de `domain/` deve importar `../data/especies.json` diretamente — sempre passar por `especiesRepository.ts`, para manter um único ponto de indexação/normalização dos dados.
