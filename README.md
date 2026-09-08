# Bio Tríade

Serious game educativo (web) sobre biodiversidade, funções ecológicas e efeitos em cascata da perda de espécies nos biomas de Mato Grosso: Amazônia, Cerrado e Pantanal. Público-alvo: alunos do Ensino Médio (15–18 anos).

## Estrutura deste repositório

| Pasta | Conteúdo |
|---|---|
| [`app/`](app/README.md) | **Implementação real** — React + Vite + TypeScript. É aqui que o trabalho acontece. Comece por `app/README.md`. |
| [`design_handoff_bio_triade/`](design_handoff_bio_triade/README.md) | Material de handoff de design original: protótipos `.dc.html` (alta fidelidade, não são código de produção), `especies.json` fonte, screenshots. **Fonte de verdade** para regras de jogo, tokens visuais e conteúdo científico — leia o README dessa pasta antes de mudar qualquer regra de UI/gameplay em `app/`. |
| `rascunho/` | Rascunhos antigos do cliente (pré-handoff). Não faz parte do projeto ativo, ignorado pelo git. |

## Por onde começar

- Quer rodar ou mexer no jogo? → [`app/README.md`](app/README.md)
- Quer saber uma regra de jogo, cor, medida ou de onde vem um dado científico? → [`design_handoff_bio_triade/README.md`](design_handoff_bio_triade/README.md) e `design_handoff_bio_triade/especies.json`
- Quer saber o que já foi implementado e o que falta? → seção "Status" em `app/README.md`

## Regra importante

Todo conteúdo científico (nomes, funções ecológicas, ameaças, relações, eventos) vem exclusivamente de `design_handoff_bio_triade/especies.json`, copiado sem alterações para `app/src/data/especies.json`. Nunca invente ou edite dado científico direto no código do app — mudanças de conteúdo entram pelo `especies.json`.
