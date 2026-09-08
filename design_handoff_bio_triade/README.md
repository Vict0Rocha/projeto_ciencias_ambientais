# Handoff: Bio Tríade — serious game de biodiversidade (Amazônia · Cerrado · Pantanal)

## Overview

Bio Tríade é um jogo educativo web (serious game) para alunos do Ensino Médio sobre biodiversidade, funções ecológicas e efeitos em cascata da perda de espécies nos três biomas de Mato Grosso: Amazônia, Cerrado e Pantanal.

O jogador percorre desafios em três mecânicas — **Quem Sou Eu?**, **Função na Natureza** e **Rede da Vida** — em dois modos de acesso: **Jornada** (progressão guiada, fases desbloqueáveis) e **Modo Livre** (escolhe bioma, mecânica e dificuldade). Todo o conteúdo científico vem de um arquivo único (`especies.json`), para que espécies, relações e eventos possam ser adicionados sem tocar no código das telas.

Público: alunos 15–18 anos, em celular e em laboratório de informática. Uso pedagógico: professor projeta ou distribui em atividade de sala.

## About the Design Files

Os arquivos `.dc.html` deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento pretendidos. **Não são código de produção para copiar.**

A tarefa é **recriar estas telas no ambiente do codebase de destino** (React, Vue, Svelte, etc.), usando os padrões e bibliotecas já estabelecidos lá. Se ainda não existe codebase, escolha o stack mais adequado ao projeto (sugestão para este caso: React + Vite + TypeScript, estado local com Zustand ou Context, persistência em `localStorage`; nenhuma dependência de backend é necessária no MVP) e implemente as telas ali.

Notas técnicas sobre os protótipos:
- Estilos são **inline** e algumas telas trazem lógica mínima (flip de carta, toggles de exibição). Isso é resultado do formato de protótipo — no app real, use o sistema de estilos do codebase (CSS Modules, Tailwind, styled-components, o que já existir).
- Cada arquivo mostra **várias telas lado a lado**, em molduras de celular (390×844) e de navegador (1280×800), com etiquetas como `A · ACERTO`, `B · ERRO`. Essas molduras e etiquetas são andaime de apresentação: **não** faça parte da UI.
- Onde aparece um retângulo cinza com a palavra `FOTO`, é um placeholder de imagem. As fotos reais estão em `img/` e `uploads/` (ver **Assets**).

## Fidelity

**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, raios, sombras e estados estão definidos e devem ser reproduzidos fielmente. As medidas listadas abaixo são as usadas nos protótipos, em CSS px.

Duas exceções, de baixa fidelidade e que precisam de decisão de implementação:
1. **Grafo da Rede da Vida** — os protótipos mostram o grafo como nós posicionados manualmente. No app, o layout dos nós deve ser calculado (força/radial) a partir de `redes[].nos` e `redes[].relacoes`.
2. **Modal de pausa/ajustes** — não foi desenhado. Ver **Pendências**.

---

## Design Tokens

### Cores

| Token | Hex | Uso |
|---|---|---|
| `bg/desk` | `#e9eee8` | fundo da página de galeria (não é UI do app) |
| `bg/app` | `#f4fcf4` | fundo padrão de todas as telas do app |
| `surface` | `#ffffff` | cartões, botões secundários, campos |
| `surface/sunken` | `#eef3ed` | placeholder de imagem, trilhas, chips neutros |
| `ink` | `#18341c` | texto principal, também fundo escuro de painéis |
| `ink/body` | `#2c4630` | parágrafos longos |
| `ink/body-2` | `#3d5c41` | parágrafos secundários |
| `ink/muted` | `#5c7a60` | rótulos mono, legendas |
| `ink/muted-2` | `#7b917d` | placeholders, texto em campo vazio |
| `ink/on-dark-muted` | `#8fb08b` | rótulos mono sobre fundo escuro |
| `ink/on-dark` | `#dcecd8` / `#e4efe1` / `#b6d0b2` | texto e links sobre fundo escuro |
| `border` | `#dde8da` | borda padrão de cartão/botão (1 ou 1.5px) |
| `border/soft` | `#e2ebe0` | divisores internos |
| `border/cool` | `#dbe6d8` | borda de cartões grandes |
| `border/strong` | `#cbdccb` | borda de botão circular |
| `dark/deep` | `#12290f` | moldura de celular, fundo mais escuro |
| `dark/panel` | `#18341c` | painel de pista, barras de app escuras |
| `dark/panel-2` | `#21421f` | bloco interno sobre `dark/panel` |
| `accent/lime` | `#74ac1c` | acerto, progresso, foco, estados ativos |
| `error/ink` | `#c8362b` | borda e texto de erro |
| `error/bg` | `#fdeceb` | fundo de resposta errada |
| `bioma/amazonia` | `#14532d` | faixa e chips da Amazônia |
| `bioma/cerrado` | `#b0562c` | faixa e chips do Cerrado |
| `bioma/pantanal` | `#1f8f8a` | faixa e chips do Pantanal |

Status de conservação (par fundo/texto, definidos em `especies.json → statusConservacao`):

| id | rótulo | bg | ink |
|---|---|---|---|
| `lc` | Pouco Preocupante | `#DFF0D8` | `#2C5C30` |
| `nt` | Quase Ameaçada | `#F6E7BD` | `#5C4405` |
| `vu` | Vulnerável | `#E6A723` | `#3D2A00` |
| `en` | Em Perigo | `#FDECEB` | `#8C1F16` |
| `ne` | Não Avaliada | `#EEF3ED` | `#47614A` |

### Tipografia

Três famílias, via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Outfit** (600/700/800) — títulos, nomes de espécie, texto de pista, botões de destaque. Sempre com `letter-spacing` negativo nos tamanhos grandes.
- **IBM Plex Sans** (400/500/600) — corpo de texto, listas, descrições. É a fonte do `body`.
- **IBM Plex Mono** (400/500) — rótulos curtos em caixa alta com `letter-spacing` positivo (`PISTA 1 DE 3`, `TENTATIVAS`, `FUNÇÃO ECOLÓGICA`).

Escala usada (font-size / weight / line-height / letter-spacing):

| Papel | Desktop | Mobile |
|---|---|---|
| Título de página (galeria) | Outfit 34 / 700 / 1.05 / −1px | — |
| Título de tela | Outfit 26 / 700 / 1.0 / −0.6px | Outfit 19–21 / 700 / 1.1 / −0.4px |
| Título de onboarding | — | Outfit 31 / 700 / 1.1 / −1px |
| Texto da pista | Outfit 32 / 600 / 1.28 / −0.5px | Outfit 23 / 600 / 1.3 / −0.3px |
| Nome de espécie em carta | Outfit 15–17 / 700 / 1.2 | Outfit 15 / 700 / 1.2 |
| Corpo | Plex Sans 15 / 400 / 1.65 | Plex Sans 14–16 / 400 / 1.6 |
| Corpo secundário | Plex Sans 13–14 / 400 / 1.6 | Plex Sans 13 / 400 / 1.5 |
| Rótulo mono grande | Plex Mono 11 / 400 / +1.2px | Plex Mono 10 / 400 / +1.1–1.4px |
| Rótulo mono pequeno | Plex Mono 10 / 400 / +1.1px | Plex Mono 9 / 400 / +1.1px |
| Wordmark "BIO TRÍADE" | Outfit 13 / 700 / +1.6px, caixa alta | Outfit 11–12 / 700 / +1.4px |

Parágrafos usam `text-wrap: pretty`.

### Espaçamento

Escala efetiva (px): **2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 34, 38, 44, 46, 56**. Padrões:
- `gap` de lista vertical de opções: 9px (mobile) / 10px (desktop)
- `gap` de grade de cartas: 16px (mobile) / 20px (desktop)
- padding de tela mobile: `22px` lateral; desktop: `38–56px`
- padding de cartão: `15–20px` (mobile) / `20–24px` (desktop)
- padding do painel de pista: `24px 22px 20px` (mobile) / `34px 32px 30px` (desktop)

**Sempre use flex/grid com `gap`** — nenhum espaçamento depende de margens entre irmãos.

### Raios

`2px` (quadradinho de HUD) · `3px` · `12px` · `14px` · `16px` · `18px` (botão de opção) · `20px` (cartão) · `22px` (carta de espécie mobile) · `24px` (painel de pista mobile) · `28px` (painel de pista desktop, cartão grande) · `42px` (tela dentro da moldura) · `54px` (moldura de celular) · `50%` (botão circular 40–44px) · `100px` (pílulas e chips).

### Sombras

- Moldura de celular: `0 30px 60px -30px rgba(18,41,15,0.6)`
- Cartão de navegador: `0 30px 60px -34px rgba(18,41,15,0.45)`
- Cartas e botões da UI **não** têm sombra em repouso — a hierarquia vem de borda + fundo.

### Bordas e estados

- Botão/cartão em repouso: `1.5px solid #dde8da` sobre `#ffffff`
- Hover de carta/botão: `border-color: #74ac1c`
- Selecionado/ativo: fundo `#18341c`, texto `#f4fcf4`, sem borda
- Acerto: borda `#74ac1c` + fundo `#ffffff`, marca `#74ac1c`
- Erro: borda `#c8362b` + fundo `#fdeceb`
- Botão circular (voltar, som): 42–44px, `1.5px solid #cbdccb`, fundo branco, ícone `#18341c`

### Dimensões de referência

- Mobile: **390×844** (moldura 414px de largura, padding 12px, raio 54px)
- Desktop: **1280×800**
- Alvos de toque nunca abaixo de 44px de altura

---

## Regras do jogo (implementar exatamente assim)

### Tentativas — **2 por desafio**

Cada desafio dá **duas tentativas**. O HUD mostra dois quadradinhos de 11px (mobile) / 12px (desktop), raio 3px:
- disponível: `#74ac1c`
- gasto: `#d5e2d3`

Fluxo: primeiro erro → o quadrado da direita apaga, a opção errada fica em estado de erro (`#fdeceb` / `#c8362b`), aparece a mensagem "Não foi essa. Resta **1 tentativa** neste desafio." e o jogador escolhe de novo. Segundo erro → revela a resposta correta com a ficha educativa completa, e o desafio conta como não pontuado (0 estrelas). Não há terceira tentativa em nenhuma mecânica.

### Pistas — 3 por espécie em "Quem Sou Eu?"

`especies[].pistas` traz 3 ou mais frases. A primeira é exibida ao entrar; o botão "Próxima pista" revela as seguintes, até o limite de 3. O HUD mostra `PISTA n DE 3` e três traços de progresso. **Pedir pista não consome tentativa**, mas reduz a estrela máxima do desafio (ver Pontuação).

### Pontuação — estrelas, não pontos

Por desafio:
- 3 estrelas: acertou na primeira tentativa, sem pedir pista extra
- 2 estrelas: acertou na primeira tentativa usando 2 ou 3 pistas
- 1 estrela: acertou na segunda tentativa
- 0 estrelas: errou as duas tentativas

Uma fase soma as estrelas dos seus desafios. A fase é considerada concluída ao terminar todos os desafios, mesmo com 0 estrelas — a progressão nunca fica travada por desempenho.

### Modo Jornada

12 fases, 4 níveis de compreensão, na ordem: **identificação → função ecológica → interdependência → impacto e extinção**. As fases são agrupadas por bioma (Amazônia → Cerrado → Pantanal). Uma fase desbloqueia a seguinte ao ser concluída. Cada fase tem 5 desafios (`DESAFIO n DE 5`) — exceto fases de Rede da Vida, medidas por ligações feitas (`n LIGAÇÕES FEITAS`).

Estado mostrado no cabeçalho: `6 de 12 fases concluídas · 17 estrelas`.

### Modo Livre

Tudo liberado, sem progressão. O jogador escolhe: **bioma** (3 cartões com foto), **mecânica** (3 opções) e **dificuldade** (3 opções). Nenhuma combinação fica bloqueada.

### Mecânicas

1. **Quem Sou Eu?** — pistas + 4 opções de espécie em lista vertical. Acerto abre a ficha educativa.
2. **Função na Natureza** — mostra a espécie (`ESPÉCIE n DE 8`) e o jogador escolhe entre as funções de `funcoes[]`. Mesmas 2 tentativas.
3. **Rede da Vida** — o jogador liga espécies num grafo (`redes[].relacoes`), e depois um evento ambiental (`redes[].eventos`) remove ou reduz uma espécie: o app anima a cascata (`evento.cascata[]`), marcando cada alvo com `declinio` (seta para baixo, `#c8362b`) ou `aumento` (seta para cima, `#e6a723`), e exibe `evento.explicacao` ao final.

---

## Screens / Views

As telas estão distribuídas nos quatro arquivos `.dc.html`. Cada arquivo mostra mobile e desktop da mesma tela.

### `Tutorial Primeiro Acesso.dc.html`

**1. Onboarding (3 passos)** — `PASSO n DE 3`, com foto de bioma no topo (mobile: imagem sangrada de ~300px de altura com wordmark em pílula `rgba(18,41,15,0.72)` sobreposta), título Outfit 31/700, parágrafo, e no rodapé três traços de progresso (ativo `#18341c`, inativo `#d5e2d3`) + botão primário `#18341c` de altura 52px, raio 100px. Botão "Pular" em texto, `#5c7a60`, canto superior direito.

Copy dos passos: (1) "Descubra quem vive ali" — pistas e ficha; (2) "Cada espécie tem um papel" — predador, polinizador, dispersor, produtor; (3) "Tudo está conectado" — Rede da Vida e efeito cascata.

**2. Coachmarks no primeiro desafio** — a tela de jogo real com overlay `rgba(18,41,15,.72)`, um recorte destacando o painel de pista e um cartão de dica (`DICA 1 DE 3`) em `#f4fcf4`, raio 22px, com contador e botão "Entendi". Três dicas: painel de pista, botão de próxima pista, lista de palpites.

### `Bio Tríade.dc.html` — telas de jogo + referência do design system

**3. Referência de fundamentos** (não é tela do app): paleta, tipografia, componentes, exemplo do registro de espécie. Controlada pelo prop `showDesignSystem` — ignore na implementação.

**4. Tela inicial** — barra superior com wordmark + navegação (`Jornada`, `Modo Livre`, `Coleção`, `Sobre`); hero com foto de bioma, título Outfit, dois botões (primário "Começar a jornada" em `#18341c`; secundário branco com borda "Explorar no modo livre"); legenda de biomas em chips coloridos; link "Para professores".

**5. Quem Sou Eu? — estado inicial** — cabeçalho com botão voltar, `DESAFIO 2 DE 5`, barra de progresso 7px (trilha `#d5e2d3`, preenchimento `#74ac1c`), HUD `TENTATIVAS` com 2 quadradinhos, chip de bioma/fase. Painel escuro `#18341c` raio 24/28px com `PISTA 1 DE 3` e a frase em Outfit 23/32px entre aspas curvas. Botão "Próxima pista" com borda. Rótulo `ESCOLHA SEU PALPITE` e 4 botões de opção (branco, borda 1.5px `#dde8da`, raio 18px, padding 18px 20px, com um marcador circular de 26px à esquerda).

No desktop a mesma tela é dividida: coluna de pista de 456px à esquerda, lista de palpites à direita.

**6. Quem Sou Eu? — acerto (A)** — a opção correta ganha borda `#74ac1c` e marca de verificação; abaixo, a **ficha educativa** desliza: painel `#18341c` com foto da espécie, nome, nome científico em itálico, chip de status, e blocos rotulados em mono (`BIOMAS`, `ALIMENTAÇÃO`, `FUNÇÃO ECOLÓGICA`, `AMEAÇAS`), mais o bloco `CONEXÕES ECOLÓGICAS` em `#21421f` com pílulas `#74ac1c` das espécies conectadas e a curiosidade ao final. Botão "Continuar".

**7. Quem Sou Eu? — erro (B)** — opção errada em `#fdeceb` / borda `#c8362b`, um quadradinho de tentativa apagado, mensagem "Resta 1 tentativa neste desafio", lista permanece clicável.

**8. Função na Natureza** — `ESPÉCIE n DE 8`, carta da espécie com foto no topo (faixa de 6–7px na cor do bioma), e as funções como botões-alvo. Estados de acerto/erro idênticos aos da mecânica anterior.

**9. Rede da Vida — montagem** — grafo com nós circulares (espécie = foto circular com anel na cor do bioma; recurso = círculo `#eef3ed` com rótulo), arestas com rótulo do tipo de relação (`preda`, `dispersa`, `poliniza`…), contador `n LIGAÇÕES FEITAS`.

**10. Rede da Vida — evento e cascata** — cartão do evento (título, cenário), nós impactados marcados, setas de efeito, e ao final o painel de explicação.

**11. Ficha educativa avulsa** — a mesma ficha da tela 6, acessível pela Coleção; no protótipo há uma versão com flip de carta (`flipped` no estado) mostrando frente (foto + nome) e verso (dados).

### `Jornada e Modo Livre.dc.html`

**12. Mapa da Jornada** — trilha vertical de fases: círculo de 44–52px por fase (concluída `#74ac1c` com estrelas embaixo; atual `#18341c` com anel; bloqueada `#eef3ed` com cadeado `#7b917d`), agrupadas por bioma com etiqueta mono na cor do bioma (`CERRADO · FASE 7`). Painel lateral de 330px "PRÓXIMA FASE" com nome da mecânica, descrição e botão de início. Cabeçalho: "Sua Jornada · 6 de 12 fases concluídas · 17 estrelas".

**13. Modo Livre** — três cartões de bioma com foto sangrada, gradiente inferior `rgba(18,41,15,…)`, nome Outfit 21/700 branco e lista de espécies em 12px `#e4efe1`; marca de seleção circular `#74ac1c` no canto. Abaixo, seletor de mecânica e de dificuldade em pílulas, e botão "Começar".

### `Coleção de Espécies.dc.html`

**14. Coleção** — busca em pílula, filtros de bioma em pílulas com quadradinho colorido, e as cartas agrupadas por bioma em grade `repeat(auto-fill, minmax(172px,1fr))`, gap 20px. Carta: faixa de 7px na cor do bioma, foto com raio 14px e margem 11px, nome Outfit e nome científico em 11px `#7b917d`; hover muda a borda para `#74ac1c`. Contador de coleção no cabeçalho.

### `Sobre o Jogo.dc.html`

**15. Sobre** — texto explicativo do projeto, bloco `COMO O JOGO ENSINA` com as três mecânicas em cartões, e `OS BIOMAS DO JOGO` com as três fotos e uma linha de descrição cada.

---

## Interactions & Behavior

- **Navegação**: barra superior no desktop; no mobile, botão voltar circular no cabeçalho de cada tela. Transição entre telas do jogo: fade + deslocamento de 8px, 220ms `cubic-bezier(.2,.7,.2,1)`.
- **Escolher um palpite**: clique aplica imediatamente o estado de acerto/erro; sem etapa de confirmação.
- **Revelar pista**: o painel escuro cresce em altura com transição de 200ms; o texto novo entra com fade.
- **Ficha educativa**: entra de baixo para cima, 280ms, e recebe foco para leitores de tela.
- **Cascata na Rede da Vida**: os alvos são marcados em sequência, 400ms de intervalo entre cada um, para que o aluno acompanhe a propagação; a explicação aparece depois do último.
- **Hover** (só em ponteiro fino): borda `#74ac1c` em cartas e botões; botões de texto escurecem de `#5c7a60` para `#18341c`.
- **Foco de teclado**: anel `2px #74ac1c` com offset de 2px. Toda a lista de palpites deve ser navegável por Tab e acionável por Enter/Espaço.
- **Som**: botão de alternância no cabeçalho (ícone em botão circular). O protótipo mostra apenas o estado "ligado".
- **Estado de carregamento**: as fotos entram com fade de 200ms sobre o placeholder `#eef3ed`.
- **Erro de carga de dados**: cartão branco centralizado com mensagem e botão "Tentar de novo" (não desenhado; siga os padrões de cartão).
- **Responsivo**: abaixo de 900px, use o layout mobile (coluna única, pista acima dos palpites); acima, o layout de duas colunas com a coluna de pista fixa em 456px. Nada de largura fixa fora das molduras de demonstração.
- **Redução de movimento**: respeite `prefers-reduced-motion` — sem deslocamentos, apenas troca de estado.

## State Management

Estado por sessão de jogo:
- `mecanica`: `'quem_sou_eu' | 'funcao' | 'rede'`
- `bioma`: id do bioma
- `dificuldade`: `'facil' | 'medio' | 'dificil'`
- `desafios[]` e `desafioAtual` (índice)
- `pistasReveladas`: 1–3
- `tentativasRestantes`: **2 → 1 → 0**
- `resposta`: `{ escolhida, correta, status: 'pendente'|'acerto'|'erro' }`
- `estrelasDoDesafio`: 0–3, calculado na resolução

Estado persistente (localStorage, chave própria do app):
- `tutorialConcluido: boolean`
- `fasesConcluidas: string[]` e `estrelasPorFase: Record<string, number>`
- `especiesDescobertas: string[]` (ids numéricos das cartas) — alimenta o contador da Coleção
- `somLigado: boolean`

Dados: carregue `especies.json` uma vez e indexe por `id`. Nenhuma chamada de rede é necessária.

## Modelo de dados — `especies.json`

Fonte única de conteúdo. Estrutura de topo: `versao`, `atualizadoEm`, `observacao`, `biomas[]`, `statusConservacao[]`, `funcoes[]`, `recursos[]`, `tiposRelacao[]`, `especies[]`, `redes[]`.

**IDs das cartas são numéricos** (string de 3 dígitos), agrupados por bioma: **1xx Amazônia, 2xx Cerrado, 3xx Pantanal**. A onça-pintada, presente em dois biomas, é `103`. Chaves textuais (`amazonia`, `predador`, `vu`, `peixes`, `preda`) seguem existindo para biomas, funções, status, recursos e tipos de relação — esses **não são cartas**.

Mapa atual:

| id | espécie | id | espécie | id | espécie |
|---|---|---|---|---|---|
| 101 | Harpia | 201 | Lobo-guará | 301 | Tuiuiú |
| 102 | Boto-cor-de-rosa | 202 | Tamanduá-bandeira | 302 | Ariranha |
| 103 | Onça-pintada | 203 | Tatu-canastra | 303 | Jacaré-do-pantanal |
| 104 | Macaco-aranha | 204 | Pequi | 304 | Capivara |
| 105 | Castanheira-do-pará | 205 | Seriema | 305 | Beija-flor-tesoura |
| 106 | Mamangava | 206 | Morcego-polinizador | | |

Registro de espécie:

```json
{
  "id": "103",
  "nome": "Onça-pintada",
  "nomeCientifico": "Panthera onca",
  "biomas": ["amazonia", "pantanal"],
  "funcao": "predador",
  "alimentacao": "…",
  "funcaoEcologica": "…",
  "status": "nt",
  "ameacas": ["Desmatamento", "Caça"],
  "curiosidade": "…",
  "curiosidadePorBioma": { "pantanal": "…" },
  "pistas": ["…", "…", "…"],
  "conexoes": ["…"],
  "foto": "img/onca-pintada.jpg"
}
```

- `pistas` alimenta "Quem Sou Eu?" (use as 3 primeiras; ordem do arquivo é a ordem de revelação).
- `conexoes` são frases em linguagem natural, para exibição na ficha. **As relações estruturadas do grafo estão só em `redes[]`** — não derive o grafo de `conexoes`.
- `curiosidadePorBioma` sobrepõe `curiosidade` quando o desafio acontece naquele bioma.

Rede por bioma:

```json
{
  "bioma": "amazonia",
  "nos": ["101", "102", "103", "104", "105", "106", "peixes"],
  "relacoes": [
    { "de": "101", "tipo": "preda", "para": "104", "fonte": "ficha" },
    { "de": "106", "tipo": "poliniza", "para": "105", "revisar": true }
  ],
  "eventos": [
    {
      "id": "amz_desmatamento",
      "titulo": "Desmatamento",
      "cenario": "…",
      "impactoDireto": ["105"],
      "cascata": [
        { "alvo": "104", "efeito": "declinio", "porque": "…" }
      ],
      "explicacao": "…"
    }
  ]
}
```

`nos` mistura ids de carta (numéricos) e ids de recurso (`peixes`, `solo`, `flores_nativas` — de `recursos[]`), porque recursos aparecem no grafo mas não são cartas colecionáveis. Ao resolver um nó: se casa com regex `^\d{3}$`, busque em `especies`; senão, em `recursos`.

`"revisar": true` marca relações e eventos que ainda **não foram validados por especialista** — são propostas do design. Trate como conteúdo provisório e mantenha a marca no arquivo até que um revisor confirme. `"fonte": "ficha"` indica que a relação vem do texto da própria espécie.

## Assets

Fotos reais, já no pacote:

- `img/` — 17 fotos de espécie, nomeadas pelo nome comum com hífens (`onca-pintada.jpg`, `beija-flor-tesoura.jpg`…). São os arquivos referenciados no campo `foto` de cada espécie.
- `uploads/amazonia.jpg`, `uploads/cerrado.jpg`, `uploads/pantanal.jpg` — fotos de paisagem dos três biomas, usadas no onboarding, na tela inicial, no Modo Livre e no Sobre.
- `uploads/rascunho da interface 01.jpeg`, `uploads/rescunho da interface.jpeg` — rascunhos originais do cliente, contexto histórico.

**Créditos e licenças das fotos precisam ser confirmados antes de publicar** — foram fornecidas pelo cliente sem metadados de licença.

Ícones: os protótipos usam glifos de texto (`←`, `⌕`, `✓`) e um triângulo SVG como marca. Substitua por um set de ícones do codebase; o triângulo do wordmark é: `<polygon points="10,0 20,18 0,18">` em viewBox `0 0 20 18`.

Fontes: Outfit, IBM Plex Sans e IBM Plex Mono (Google Fonts, licença OFL). Self-host se o app precisar funcionar offline.

## Pendências (decisões que faltam)

1. **Modal de pausa/ajustes** — não desenhado: som, reiniciar fase, sair. Precisa de design antes da implementação.
2. **Tela "Para Professores"** — o link existe na tela inicial, a tela não. Escopo pendente com o cliente.
3. **Layout do grafo** — algoritmo a definir (ver Fidelity).
4. **Revisão científica** — todos os itens `"revisar": true` em `especies.json`.
5. **Acessibilidade** — os textos alternativos das fotos de espécie ainda não foram escritos; as fotos de bioma já têm `alt` nos protótipos.

## Screenshots

`screenshots/` traz cada tela capturada dos protótipos, em ordem de leitura. As etiquetas visíveis nas imagens (`01 Tela Inicial — Mobile`, `A · ACERTO`, `B · ERRO`) e as molduras de celular/navegador são andaime de apresentação, não UI.

| Arquivo | Tela |
|---|---|
| `01-tela-inicial-mobile.png` | Tela inicial, mobile |
| `02-tela-inicial-desktop.png` | Tela inicial, desktop |
| `03-carta-frente-verso.png` | Carta de espécie: frente e verso |
| `04-quem-sou-eu-mobile.png` | Quem Sou Eu?, mobile |
| `05-quem-sou-eu-desktop.png` | Quem Sou Eu?, desktop |
| `06-quem-sou-eu-resultado.png` | Popup de acerto (A) e de erro (B) |
| `07-funcao-na-natureza-mobile.png` | Função na Natureza, mobile |
| `08-funcao-na-natureza-desktop.png` | Função na Natureza, desktop |
| `09-rede-da-vida-mobile.png` | Rede da Vida, mobile |
| `10-rede-da-vida-desktop.png` | Rede da Vida, desktop |
| `11-jornada-mobile.png` | Mapa da Jornada, mobile |
| `12-jornada-desktop.png` | Mapa da Jornada, desktop |
| `13-modo-livre-mobile.png` | Modo Livre, mobile |
| `14-modo-livre-desktop.png` | Modo Livre, desktop |
| `15-colecao-desktop.png` | Coleção, desktop |
| `16-colecao-mobile.png` | Coleção, mobile |
| `17-onboarding-mobile.png` | Boas-vindas em 3 passos, mobile |
| `18-coachmarks-mobile.png` | Dicas na primeira fase, mobile |
| `19-onboarding-desktop.png` | Boas-vindas, desktop (modal) |
| `20-sobre-desktop.png` | Sobre o jogo |

As capturas são referência visual; **as medidas e cores autoritativas são as deste README e dos arquivos `.dc.html`**, não pixels medidos na imagem.

## Files

Nesta pasta:

| Arquivo | Conteúdo |
|---|---|
| `Bio Tríade.dc.html` | telas de jogo (Quem Sou Eu?, Função na Natureza, Rede da Vida), ficha educativa, tela inicial e referência do design system |
| `Jornada e Modo Livre.dc.html` | mapa da jornada e seleção do modo livre |
| `Coleção de Espécies.dc.html` | coleção/álbum de cartas |
| `Tutorial Primeiro Acesso.dc.html` | onboarding em 3 passos e coachmarks |
| `Sobre o Jogo.dc.html` | tela sobre o projeto |
| `especies.json` | conteúdo científico completo: espécies, redes, eventos |
| `support.js` | runtime necessário para abrir os `.dc.html` no navegador — não é código do app |
| `img/`, `uploads/` | fotos |
| `screenshots/` | capturas de todas as telas (ver acima) |
| `uploads/Descrição do jogo.txt` | briefing original do projeto |
| `uploads/Design System & Estrutura de Telas.txt` | notas do cliente sobre design system e estrutura de telas |

Para ver os protótipos, abra qualquer `.dc.html` num navegador (precisa ser servido por HTTP — `python3 -m http.server` na raiz desta pasta resolve).
