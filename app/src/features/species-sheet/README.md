# `features/species-sheet/`

Três componentes de exibição de espécie, com nomes parecidos e usos diferentes — não confundir:

| Componente | Onde aparece | Formato |
|---|---|---|
| `SpeciesFlipCard` | Modal "Ver a ficha completa" (Quem Sou Eu, Função na Natureza) e ao clicar num card da Coleção | Carta com flip 3D — frente (foto+nome+status) e verso (biomas, alimentação, função ecológica, ameaças, conexões ecológicas, curiosidade). É **a** ficha educativa completa. |
| `SpeciesTeaser` | Dentro do `ResultPopup`, quando o desafio é resolvido (acerto ou revelação de erro) | Card compacto horizontal (foto pequena + nome + status + bioma). Deliberadamente pequeno — foi reduzido a pedido do usuário por estar grande demais no popup. |
| `SpeciesShowcase` | Tela principal de Função na Natureza | Card vertical médio (foto maior + nome + status + bioma). A espécie fica visível o tempo todo nessa mecânica (diferente de Quem Sou Eu, onde ela é escondida), por isso o tratamento é mais parecido com uma "carta em jogo" do que com um teaser de resultado. |

Todos os três leem `getFotoAltText`/`getCuriosidade`/etc. de `src/domain/especiesRepository.ts` — nenhum tem texto ou dado hardcoded.

`CONEXÕES ECOLÓGICAS` no verso do `SpeciesFlipCard` é uma lista das frases reais de `especie.conexoes` (texto livre no `especies.json`). Os protótipos `.dc.html` mostravam isso como uma árvore de pílulas ligadas por id — **não replique isso**: essa versão do design usava um formato antigo de dado (`conexoes` como array de ids); o `especies.json` atual usa frases, e o próprio README do handoff confirma que `conexoes` é só texto pra exibição, não uma estrutura de grafo (o grafo de verdade está em `redes[]`).
