---
task: "Re-derivar GRADE"
order: 1
input:
  - regimes: output/regimes-extraidos.json
  - framework: pipeline/data/grade-framework.md
  - certeza: pipeline/data/mbe-grade-certeza.md
  - indireta: pipeline/data/mbe-indirectness.md
  - imprecisao: pipeline/data/mbe-magnitude-precisao.md
  - fontes_metodo: pipeline/data/fontes-metodo/   # 1º NÍVEL: GRADE guidelines 6 + Guidance 34 + Handbook + Bassler + manual do MS. É de lá que sai limiar.
  - handbook: pipeline/data/indice-guias-mbe.md   # índice dos 7 guias MBE da direção (2026-09-17) — prevalece sobre as fichas mbe-*.md
  - protocolo: pipeline/data/guia-prompts-ebm-grade.md
  - fontes: pipeline/data/fontes-confiaveis.md
output:
  - veredito: output/verificacao-grade.json (bloco `grade` schema 2 por regime — ver "Output Format")
schema: 2
---

# Re-derivar GRADE (schema 2 — estruturado, por domínio)

Re-deriva, **por desfecho crítico e com a fonte aberta**, a **certeza da evidência** (A/B/C/D) e a
**recomendação** (força + direção) de cada regime, e confronta com o que o protocolo afirmou.

Esta versão substitui o campo livre `valor_rederivado` + frase por um bloco estruturado. A razão está
na auditoria de 2026-09-17 (`output/2026-09-17-auditoria-grade/RELATORIO-auditoria-grade.md`): sem
checklist obrigatório, 177/301 regimes viraram `1A` pelo atalho *"fase 3 + ganho de SG → 1A"*, sem
nenhum domínio de rebaixamento avaliado, e o número passou a ser lido como "qualidade do ensaio" em vez
de força/direção da recomendação (inclusive em regimes que a instituição **não** incorpora).

**Divisão de trabalho:** o modelo **preenche** o bloco; o Portão A (`verificar_dados.py`, check [11])
**barra** o que não fecha. Nenhuma das regras abaixo é "sugestão": um bloco que viola qualquer uma
não passa do portão e volta para o agente.

## A regra estrutural: toda regra de calibração tem `fonte` — e sem ela não se aplica

Em vigor desde **2026-10-06**. O motivo é um defeito concreto: a convenção de "efeito grande"
(RRR ≥ 30% e IC superior ≤ 0,85) foi **criada pelo squad**, foi **declarada nesta própria task** como
não canônica, e ainda assim governou a letra de cinco regimes por semanas. O defeito não foi a
declaração — foi que uma regra sem fonte **pôde ser aplicada**. Declarar convenção não é controle;
é um bilhete ao lado da alavanca.

Cada regra de calibração tem, no **registro de fontes** mais abaixo nesta task:

- `estado` — `APLICADA` ou `SUSPENSA`;
- `fonte.tipo` — `metodologica` ou `institucional`;
- `fonte.ref` — documento + seção (e DOI quando houver);
- `fonte.frase` — **a frase literal da fonte**. Parafrasear não vale: é a mesma disciplina da
  `efeito.transcricao`, aplicada ao método em vez de ao dado. Senão a gente troca uma invenção por
  outra mais bem escrita.

**`metodologica`** é a única que pode fixar limiar numérico, e exige frase literal de `fontes-metodo/`.
**`institucional`** cobre o que a fonte **atribui ao painel/instituição** (direção de recomendação,
política de incorporação, classificação de importância de desfecho): exige o registro da decisão — qual,
de quem, quando — e **nunca** pode fixar limiar metodológico. Essa separação existe porque sem ela a
etiqueta "institucional" vira a porta por onde o número inventado volta.

**Regra sem `fonte` não pode ser aplicada.** Não é "aplica e avisa", não é "aplica e marca para
referendo": **é não aplica.** Vai para `SUSPENSA`, e o valor gravado **fica como está** — que é a
posição conservadora, e também a única que não re-deriva nada por efeito colateral. Suspender nunca
reescreve um valor: só tira do portão o poder de decidir aquilo.

O Portão A **falha** (check [12]) se encontrar regra `APLICADA` sem `fonte`, ou se o código
(`verificar_dados.py`, `REGRAS_APLICADAS`) estiver cobrando uma regra marcada `SUSPENSA` aqui. O
registro e o código são conferidos um contra o outro — o portão não aceita a palavra de nenhum dos
dois isolada.

## Base metodológica (inputs declarados)

**Hierarquia, obrigatória desde 2026-10-06 — a ordem decide quem ganha no conflito:**

0. **`pipeline/data/fontes-metodo/`** — a série **GRADE guidelines/guidance** e o **Handbook**. É
   **daqui** que saem limiares e números, e **só** daqui. Cada arquivo carrega as frases literais
   citáveis: `grade-guidelines-6-imprecisao.md` (OIS, Table 1, fragilidade, interrupção precoce),
   `grade-guidance-34-imprecisao.md` (**atualização corrente** da imprecisão, 2022),
   `grade-handbook-certeza.md` (certeza inicial, elevações, força),
   `bassler-2010-interrupcao-precoce.md` (base empírica da interina),
   `ms-conitec-sistema-grade.md` (**3º nível**: vocabulário e legitimidade institucional, **nunca
   limiar**). O `MANIFESTO.md` diz o que está na mão e o `PEDIDOS-DE-FONTE.md` o que falta.
1. `pipeline/data/mbe-grade-certeza.md` — regra-mestra `certeza = inicial − rebaixamentos + elevações`,
   **por desfecho**, 5 domínios.
2. `pipeline/data/mbe-indirectness.md` — 4 cenários de indireta (população / intervenção / comparador /
   desfecho); **desfecho substituto é indireta**.
3. `pipeline/data/mbe-magnitude-precisao.md` — imprecisão: IC cruzando limiar, OIS; priorizar efeito
   absoluto; efeito frágil não sustenta "benefício substancial". ⚠️ Esta ficha (e o §4 de
   `guia-magnitude-precisao.md`) traz "eventos < 300" como rebaixamento **sem exceção**. A fonte
   canônica usa 300 de outro jeito — é o ponto em que o OIS **é atendido** com RRR 30%
   (`fontes-metodo/grade-guidelines-6-imprecisao.md`, Table 1). **Para imprecisão vale a fonte, não a
   ficha.**
4. `pipeline/data/indice-guias-mbe.md` — índice dos **7 guias MBE da direção** (2026-09-17), com o mapa
   *campo do schema 2 → guia/seção*. `guia-prompts-ebm-grade.md` é o protocolo de execução (PICO → RoB
   → GRADE passo-a-passo → output); `guia-grade-certeza`, `guia-grade-indiretas`,
   `guia-grade-aplicabilidade`, `guia-magnitude-precisao`, `guia-revisoes-sistematicas`,
   `guia-dano-observacional` são as fichas de consulta por domínio. **Em conflito, os guias prevalecem
   sobre as fichas `mbe-*.md`**, que ficam como lembrete de bolso.
5. `pipeline/data/fontes-confiaveis.md` — escada de APIs abertas (Crossref → Europe PMC → Unpaywall /
   OpenAlex → PubMed). É **a única** forma de abrir a fonte.

## Process

1. Para cada regime, resolver o **pivô** pela `referencia.doi`: Crossref confirma o DOI (título, ano,
   periódico) → Europe PMC (`DOI:<DOI>`, `resultType=core`) traz o `abstractText` e, se OA, o texto
   completo → Unpaywall/OpenAlex para versão OA de paywall → sem DOI, busca por termo e volta ao início.
2. **Transcrever, não lembrar.** Copiar do abstract/texto a frase que traz o desfecho crítico com
   N, HR (ou medida equivalente), IC 95% e, se houver, nº de eventos — para `efeito.transcricao`.
   Memória do modelo **nunca** é fonte. Fonte inacessível depois da escada inteira = `indeterminado`,
   sem exceção e sem "valor provável".
3. **Escolher o desfecho crítico** (o que o paciente valoriza e o protocolo usa para indicar o regime):
   SG quando demonstrada; senão o desfecho duro disponível (SLD/iDFS/SLE/SLR, controle local,
   mortalidade); senão o substituto (SLP/SLPr/ORR/RCp/MFS) — **declarado como substituto**
   (classificação obrigatória *patient-important* × *surrogate*: `guia-prompts-ebm-grade.md` §2;
   substituto é indireta por natureza: `guia-grade-indiretas.md` §3).
4. **Conferir se o pivô sustenta** o regime (bloco `pivo`): a intervenção do ensaio contém todos os
   `farmacos[]` do regime (escrever `pivo.intervencao` com a **mesma grafia** dos `farmacos[].nome` —
   o portão casa por substring normalizada, não por sinônimo); o comparador era o padrão da época (e é, ou não, padrão atual); o desfecho
   primário foi positivo. Ensaio negativo no primário, comparação de esquemas usada como "vs padrão",
   ou fármaco do regime ausente do braço experimental = **pivô não sustenta** — declarar, não contornar.
5. **Avaliar os 5 domínios**, cada um com nota `0 | -1 | -2` **e uma frase** (`por`) — inclusive quando
   a nota é 0 (dizer *por que* não rebaixou é parte do veredito). Desenho define a certeza inicial;
   a certeza final é aritmética (o portão recalcula). Passo-a-passo em `guia-prompts-ebm-grade.md` §7
   (baseline → domínios com justificativa específica → **elevação só quando não houve rebaixamento** →
   síntese); critério de cada domínio no mapa do `indice-guias-mbe.md`.
6. **Recomendação**: força (`forte` | `condicional`) e direção (`a_favor` | `contra`) a partir de
   benefício × dano, certeza, magnitude (ESMO-MCBS já derivado no eixo vizinho), valores/custo **e a
   decisão institucional** — regime não incorporado tem direção `contra` por definição (a instituição
   não o recomenda), com `base` dizendo o motivo. Balança benefício-risco + valores:
   `guia-prompts-ebm-grade.md` §8; NNT ≈ NNH = intervenção marginal, nunca `forte`:
   `guia-magnitude-precisao.md` §3.
7. `status` como antes: `concorda` **só** com `afirmado_protocolo != null` e valor batendo; `diverge`
   quando afirmado e não bate; `re_derivado` quando o protocolo não graduou; `indeterminado` quando a
   escada falhou ou a fonte não traz o efeito.
8. Gerar `valor_rederivado` **derivado** (`1`/`2` + letra) só para compatibilidade com a tela e o
   `content_hash`; nunca preenchê-lo antes de fechar certeza e força.
9. Salvar o JSON.

## As 7 regras determinísticas (o portão barra)

> **Leia o registro de fontes antes da tabela.** Depois da triagem de 2026-10-06, partes das regras 1,
> 3, 4, 5 e 9 estão **SUSPENSAS** — não é que estejam frouxas, é que não têm fonte e por isso o portão
> não as cobra mais. A coluna "fonte" aponta a entrada do registro; a tabela abaixo descreve a regra
> **como ela é aplicada hoje**.

| # | regra | o que o portão faz | fonte |
|---|---|---|---|
| 1 | **Certeza `A`** exige: desenho que parte de A (RCT / meta-análise de RCT) **e** desfecho crítico duro **e** IC exclui nulo a 95% **e** todos os 5 domínios em 0. ~~**e** (eventos ≥ 300 **ou** efeito grande)~~ — **SUSPENSO em 2026-10-06**: o piso de 300 eventos e a dispensa por "efeito grande" (RRR ≥ 30%, IC sup ≤ 0,85) **contradizem a fonte** e saíram do portão. O OIS não é constante: é cálculo sobre taxa de evento no controle e RRR escolhida, e efeito relativo grande **aciona** o OIS em vez de dispensá-lo. Enquanto a regra nova não vier com fonte, o portão **não decide suficiência de precisão pelo número de eventos** — quem decide é o campo `dominios.imprecisao` preenchido pelo agente, e o portão lista a exposição no WARN | FALHA se `certeza=A` sem qualquer uma das 4 que restaram; WARN nominal por regime em `A` com `eventos < 300` ou `eventos` ausente | R1 · **R1.d SUSPENSA** |
| 2 | **Substituto sem SG** (SLP/SLPr/ORR/RCp/MFS/TTP/DoR como desfecho crítico) → `indireta ≤ −1` e **teto B**. **C8:** em cenário **curativo** (adjuvância, neoadjuvância, localmente avançado/QRT definitiva, localizado) **SLD/iDFS/SLE/SLR/controle local são desfecho crítico DURO**, não substituto — primário aceito por agência; esperar SG leva uma década. Em doença **metastática** só SG/mortalidade são duros, e declarar SLD/iDFS num regime metastático é FALHA. Exceção só declarada em `substituto_excecao` (`crossover_documentado` \| `substituto_validado_no_tumor`) com `por` — e o portão lista todas as exceções para o referendo | FALHA se teto violado sem exceção; WARN nominal com exceção | R2 · **C8 institucional, referendo pendente** |
| 3 | **RCT parte de A independente da fase** (C5) — fase II randomizado cai por imprecisão quando o domínio justificar. **Braço único / basket / observacional** → inicial **C**; sobe só por `elevacoes` e **só quando nenhum domínio foi rebaixado**. ~~**nunca A**~~ — **SUSPENSO**: a fonte diz o contrário (elevação de +2 por efeito muito grande leva observacional de Baixa a **Alta**, e o manual do MS é explícito: "o nível de evidência deve ser considerado alto, mesmo caso a evidência tenha origem a partir de estudos observacionais") | FALHA se `B`/`A` de desenho inicial C sem `elevacoes`; FALHA se há elevação com domínio rebaixado; WARN nominal se desenho inicial C fecha em `A` | R3 · **R3.c SUSPENSA** · R3.d |
| 4 | **Imprecisão automática** (−1): IC de 95% que **não exclui o nulo**; IC reportado **abaixo** de 95% (a exclusão do nulo *a 95%* não está demonstrada na fonte — C3); diferença absoluta com IC incluindo 0; **análise interina sem versão mais madura** (C4). ~~limite superior > 0,95 / inferior < 1,05~~ e ~~eventos < 300 sem efeito grande~~ e o **−2 automático** (eventos < 300 + IC não exclui o nulo) estão **SUSPENSOS**: o colchão de 0,95 não existe em fonte nenhuma, o piso de 300 inverte a Table 1 de guidelines 6, e o −2 da fonte exige "very few events **e** IC incluindo benefício **e** dano apreciáveis nas escalas relativa **e** absoluta" — coisa que o schema 2 hoje nem grava | FALHA se `imprecisao` acima do mínimo que restou; WARN nominal com a lista de eventos < 300 e de IC encostado no nulo (0,95–1,0), para o referendo ver a exposição sem o portão decidir | R4.a · R4.b · R4.c · **R4.d, R4.e, R4.f SUSPENSAS** |
| 5 | **Força `forte` a favor** exige: ESMO-MCBS ≥ 3 (escala paliativa) ou A/B (curativa) — ou MCBS `n/a` com `recomendacao.sem_mcbs_por` — **e** regime incorporado. **Não incorporado → `direcao = contra`** (forte ou condicional). ~~certeza ≥ B~~ — **SUSPENSO**: a fonte **contradiz** esse piso. O Handbook diz que "strong recommendations can result from low or even very low confidence in effect estimates" e o manual do MS traz as 5 situações-modelo do Quadro 12, a primeira delas sendo "baixa qualidade de evidência sugere benefício numa situação de risco de vida" — que é oncologia na prática | FALHA em combinação fora do que restou; WARN nominal por `forte` com certeza C/D, para o revisor dizer se é uma das situações-modelo | R5.b (institucional) · R5.c (institucional) · **R5.a SUSPENSA** |
| 6 | **Pivô tem de sustentar**: `pivo.intervencao` ⊇ `farmacos[]` do regime, `comparador_padrao_epoca = true`, `primario_positivo = true`. Se não sustenta: `pivo_nao_sustenta = true`, certeza ≤ B, e a recomendação não pode ser `forte a_favor` até trocar a referência. Comparador obsoleto (`comparador_padrao_atual = false`) rebaixa **só quando muda a decisão de hoje** (C2): declarar `comparador_muda_decisao` e dizer por quê em `pivo.por` (ex.: vs IFN-α em 1ª linha — ninguém escolhe contra IFN em 2026 → rebaixa; everolimo em 2ª linha pós-TKI, indicação idêntica → não) | FALHA se algum `farmacos[].nome` não aparece em `pivo.intervencao` (exceto `intervencao_nao_cobre` com `indireta ≤ −1`), se `sustenta` contradiz os 3 campos, se pivô não sustenta com `certeza=A` / `forte a_favor`, se comparador obsoleto sem `comparador_muda_decisao`, ou se `muda_decisao=true` com `indireta=0` | R6.a · R6.b · R6.c |
| 7 | **Efeito transcrito**: `efeito.transcricao` é frase literal da fonte e contém `valor`, `ic95[0]`, `ic95[1]` e `ic_nivel` quando ≠ 95 (aceita `.`, `,` ou `·`); `fonte_transcricao` é um degrau da escada. **Eventos** (C1): em algarismo na transcrição **ou** deduzidos do publicado (N × taxa, medianas atingidas, tabela) com o cálculo em `eventos_por = "deduzido de <x>"` — rebaixar porque o número não estava escrito é avaliar a redação, não a evidência. Sem transcrição → `status = indeterminado` | FALHA se não indeterminado e a transcrição falta / não contém os números; FALHA se `eventos` não está na transcrição e `eventos_por` não começa com "deduzido de" | regra de **procedência**, não de calibração — não fixa limiar, logo fora da exigência de `fonte` |

Regras de forma que acompanham (também no portão): 5 domínios sempre presentes, nota ∈ {0, −1, −2},
`por` não vazio; `certeza` = aritmética (inicial + Σ notas + Σ elevações, piso D); `elevacoes` só quando
a inicial é C **e nenhum domínio foi rebaixado** (prompts §7, passo 3); `valor_rederivado` = número+letra
derivado de `recomendacao.forca` + `certeza`;
`fonte` é o DOI do regime (trocar referência = `pivo.referencia_proposta` + WARN, decisão do revisor).

## Calibração de 2026-09-17 (decisões da direção após o piloto renal)

| # | decisão | razão | onde vive |
|---|---|---|---|
| C1 | eventos dedutíveis **contam** (`efeito.eventos` numérico + `eventos_por: "deduzido de <cálculo>"`) | se o número se deduz do publicado, o dado existe; rebaixar pela redação do artigo é avaliar o texto, não a evidência | regra 7; portão lista cada dedução no WARN |
| C2 | comparador obsoleto rebaixa **só quando muda a decisão de hoje** (`pivo.comparador_muda_decisao` + porquê) | comparador que era padrão na época e segue referência não leva segunda punição | regra 6 |
| C3 | IC além de 95% **não rebaixa por si**; IC **abaixo** de 95% rebaixa, porque a exclusão do nulo *a 95%* não está demonstrada (`ic_nivel` é fato da fonte) | não é invenção, é consequência: o critério da fonte é literalmente "the 95% CI excludes 1.0" — um IC de 99,8% que exclui o nulo já exclui a 95%; um de 80% não demonstra nada a 95% | regra 4 → **R4.b, TEM FONTE** |
| C4 | usar sempre a **publicação mais madura do mesmo estudo** (`pivo.referencia_atualizada {doi, por}` — a `fonte` do veredito passa a ser ela); se só há interina, `efeito.analise = interina` → −1 obrigatório | atualizar a versão do mesmo estudo não é trocar de estudo | regras 4 e 6 |
| C5 | fase II randomizado: **ortodoxo** — RCT parte de A e cai por imprecisão (−2 quando cumpre os critérios da ficha) | substitui o "fase II parte de C" da fundação | regra 3 e 4 |
| C6 | direção clínica controversa fica **`pendente_revisor`** (Portão C), o método não decide | mérito clínico é do revisor | `recomendacao.direcao` |
| C9 | quando o valor depende de um **corpo de evidência** (Cochrane / meta-análise / RS que sustenta o regime), a revisão entra como `pivo.referencia_corpo {doi, tipo, comparacao, certeza_declarada, por}`: o `efeito` é o agregado da revisão, `desenho.tipo = meta_analise_rct`, a `fonte` passa a ser a revisão, e a certeza é avaliada sobre ela — **nunca acima da que a revisão declara** (~~revisão sem grau → teto B~~ — o **teto B** está **SUSPENSO**: é número sem fonte; a deferência à certeza declarada continua). Corpo **alegado** no texto sem `referencia_corpo` continua rebaixando (A é FALHA; abaixo, WARN) | resolve "classe agregada no Cochrane vs ensaio único" e os limítrofes 05/15 da auditoria — onde o valor está certo mas a fonte registrada não prova | regras 1, 6 e 7 |
| C8 | em cenário curativo, SLD/iDFS/SLE/SLR/controle local são desfecho crítico **duro**; regra 2 (teto B) vale para SLP/ORR em doença metastática | é o desfecho primário aceito por agência em adjuvância; esperar SG leva uma década; tratar como substituto rebaixaria em bloco os 46 regimes adjuvantes. **Reclassificado em 2026-10-06 como `fonte.tipo: institucional`**: a fonte atribui ao painel a classificação de importância de desfecho ("Guideline developers will also make a preliminary classification of the importance of the outcomes", Handbook §3.1) — logo é decisão legítima **de painel**, não derivação de método. Só que o painel aqui foi o squad, não o oncologista: **continua APLICADA** (suspendê-la rebaixaria 46 regimes, o que seria re-derivar) e o **referendo é a pendência aberta** | regra 2; portão barra desfecho curativo em regime metastático |
| ~~—~~ | ~~limiar de "efeito grande" (RRR ≥ 30% e IC sup ≤ 0,85) mantido como convenção do squad, sujeito a referendo~~ **APOSENTADO em 2026-10-06** | não era "não canônico": era **contrário à fonte**, e em dois níveis. (i) "Efeito grande" é mecanismo de **ELEVAÇÃO de evidência observacional**, com números próprios (RR > 2 ou < 0,5 para +1; > 5 ou < 0,2 para +2) — foi emprestado para dispensar um rebaixamento em ensaio **randomizado**: duas máquinas diferentes. (ii) A fonte diz o **oposto** do que a convenção fazia: efeito grande com poucos eventos é motivo de **cautela** ("warrant caution", Handbook §5.2.4.1), é o caso-exemplo de **fragilidade** (guidelines 6, Box 3: RRR 59%, IC sup 0,41, 20 eventos → "violates common sense"), e na atualização de 2022 **aciona** o OIS em vez de dispensá-lo | regra 1 e regra 4 → **R1.d / R4.e SUSPENSAS** |
| C7 | referências propostas entram como **adicionais** (`pivo.referencias_adicionais[] {doi, papel}`), nunca substituem | só a versão madura do mesmo estudo (C4) substitui | regra 6 |

## Fonte de cada regra de calibração

Registro criado em **2026-10-06**. É **lido pelo Portão A** (check [12]), então o formato é fixo: um
bloco `### <id> — <nome>` por regra, com exatamente as linhas `- estado:`, `- fonte.tipo:`,
`- fonte.ref:` e `- fonte.frase:`. `fonte.frase` fica em **uma linha**, entre aspas, mesmo que longa —
é citação literal e quebrar linha estraga a conferência.

`estado: APLICADA` exige `fonte.tipo` ∈ {`metodologica`, `institucional`} e `fonte.frase` não vazia.
`estado: SUSPENSA` exige `contradiz:` ou `fonte.tipo: nenhuma`. Todo id em
`verificar_dados.py:REGRAS_APLICADAS` tem de estar `APLICADA` aqui, e nenhum id `SUSPENSA` pode
aparecer lá.

Documentos citados em `fonte.ref` estão em `pipeline/data/fontes-metodo/`; as frases foram conferidas
contra o arquivo lá, não contra memória.

### R1.a — certeza A exige desenho que parte de A
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.3 (grade-handbook-certeza.md); MS/CONITEC §4.6 (ms-conitec-sistema-grade.md)
- fonte.frase: "Using the GRADE framework, body of evidence from observational studies is initially classified as low quality evidence (i.e. permitting low confidence in the estimated effect)."

### R1.b — certeza A exige desfecho crítico duro
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §3.4 (grade-handbook-certeza.md)
- fonte.frase: "The necessity to substitute the surrogate may ultimately lead to rating down the quality of the evidence because of the indirectness."

### R1.c — certeza A exige IC de 95% que exclui o nulo
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE guidelines 6 §11 (grade-guidelines-6-imprecisao.md); Handbook §5.2.4.2
- fonte.frase: "If the criterion is met, and the 95% CI around an effect excludes 1.0 (i.e., the results show a statistically significant difference), there is no need to rate down for imprecision."

### R1.d — certeza A exige eventos ≥ 300 ou efeito grande (RRR ≥ 30%, IC sup ≤ 0,85)
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: GRADE guidelines 6, abstract — "An exception to this rule occurs when an effect is large, and consideration of CIs alone suggests a robust effect, but the total sample size is not large and the number of events is small. Under these circumstances, one should consider rating down for imprecision." A fonte nomeia EXATAMENTE a configuração da convenção e manda CONSIDERAR REBAIXAR; o squad dispensava. Somam-se: Table 1 — "300 | 30 | Will meet threshold" (300 eventos é onde o OIS É ATENDIDO com RRR 30%, não um piso de punição); e Handbook §5.3 — "Consideration of factors reducing quality of evidence must precede consideration of reasons for rating it up."
- nota: o número 30% tem procedência, mas de outra função — guidelines 6 §8: "We have suggested using RRRs of 20% to 30% for calculating OIS." É insumo do cálculo do OIS, não limiar de dispensa. O 0,85 não tem procedência nenhuma.

### R1.e — certeza A exige os 5 domínios em 0
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: guia-grade-certeza §5; GRADE Handbook §5.4
- fonte.frase: "Qualidade Final = Qualidade Inicial - Rebaixamento + Elevação"

### R2 — desfecho substituto sem SG rebaixa indireta e limita a certeza
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §3.4 e §5.2.3 (grade-handbook-certeza.md); MS/CONITEC §4.3
- fonte.frase: "Em geral, desfechos substitutos implicam em redução do nível de evidência. Todavia, caso o desfecho avaliado seja fortemente ligado à ocorrência de desfechos importantes aos pacientes, podemos considerar não reduzir a qualidade da evidência."
- nota: a fonte admite −2 ("Uso de desfechos substitutos" é exemplo de "muito sério" em guia-grade-certeza §3.3); o −1 do squad é a ponta branda da faixa. A segunda frase é o que autoriza `substituto_excecao`.

### C8 — em cenário curativo, SLD/iDFS/SLE/SLR/controle local são desfecho duro
- estado: APLICADA
- fonte.tipo: institucional
- fonte.ref: calibração C8 da direção, 2026-09-17 (output/2026-09-17-rederivacao-grade/) — amparada em GRADE Handbook §3.1, que atribui a classificação ao painel
- fonte.frase: "Guideline developers will also make a preliminary classification of the importance of the outcomes."
- nota: REFERENDO PENDENTE. O painel que fez essa classificação foi o squad, não o oncologista. Continua APLICADA porque suspendê-la rebaixaria em bloco os 46 regimes de cenário curativo — ou seja, re-derivaria por efeito colateral. É a única `institucional` do registro com pendência de quem decide.

### R3.a — RCT parte de A independente da fase
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.1.1; guia-grade-certeza §2; MS/CONITEC §4.6
- fonte.frase: "Ensaios Clínicos Randomizados (RCTs) | Alta | O processo de randomização protege contra vieses de seleção e confusão."
- nota: a fonte classifica pelo **desenho** e não lista fase como modificador. Não há frase que diga "independente da fase" porque não há frase que faça a distinção.

### R3.b — braço único / basket / observacional / série de casos partem de C
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.3 (grade-handbook-certeza.md)
- fonte.frase: "There are times, however, when we have high confidence in the estimate of effect from observational studies (including cohort, case-control, before-after, time series studies, etc.) and to non-randomized experimental studies (e.g. quasi-randomized and non-randomized controlled trials)."

### R3.c — desenho de inicial C nunca chega a A
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: GRADE Handbook Table 5.9 — "Very large | RR* >5 or <0.2 | may increase 2 levels" (Baixa +2 = Alta); e MS/CONITEC §4.6.1 — "o nível de evidência deve ser considerado alto, mesmo caso a evidência tenha origem a partir de estudos observacionais."

### R3.d — elevação só quando nenhum domínio foi rebaixado
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.3 (grade-handbook-certeza.md); MS/CONITEC §4.7
- fonte.frase: "Consideration of factors reducing quality of evidence must precede consideration of reasons for rating it up."
- nota: a fonte diz "should only rarely be made if serious limitations are present" — desencorajamento, não proibição. O FALHA do portão é **mais estrito** que a fonte, e por ser mais estrito é conservador: não cria certeza que a fonte não daria.

### R3.e — elevações só quando a certeza inicial é C
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.3 (nota final); MS/CONITEC §4.7
- fonte.frase: "Although it is theoretically possible to rate up results from randomized control trials, we have yet to find a compelling example of such an instance."

### R4.a — IC de 95% que não exclui o nulo rebaixa imprecisão
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.2.4.2 (grade-handbook-certeza.md)
- fonte.frase: "If OIS criterion is met, and the 95% CI overlaps no effect (i.e. CI includes RR of 1.0) rate down for imprecision if the CI fails to exclude important benefit or important harm."

### R4.b — IC reportado abaixo de 95% rebaixa (exclusão a 95% não demonstrada)
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE guidelines 6 §11 e abstract (grade-guidelines-6-imprecisao.md)
- fonte.frase: "If the 95% CI excludes a relative risk (RR) of 1.0, and the total number of events or patients exceeds the OIS criterion, precision is adequate."
- nota: o critério da fonte é enunciado **no IC de 95%**. Um IC de 80% que exclui o nulo não demonstra a condição; um de 99,8% que exclui o nulo a demonstra com folga. É consequência do enunciado, não limiar novo — e é o que a C3 diz.

### R4.c — diferença absoluta com IC incluindo 0 rebaixa
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE guidelines 6 §14; Handbook §5.2.4.2 (desfecho contínuo)
- fonte.frase: "Whether you will rate down for imprecision is dependent on the choice of the difference (Δ) you wish to detect and the resulting sample size required."
- nota: para medida de diferença o nulo é 0; a frase sustenta a leitura por limiar, e incluir o nulo é o caso mínimo.

### R4.d — colchão de 0,95 / 1,05 no limite do IC
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: nenhuma fonte fixa 0,95 nem 1,05. É ÓRFÃ pura. O único número da fonte nessa vizinhança tem outra função — guidelines 6 abstract: "If the 95% CI includes appreciable benefit or harm (we suggest an RR of under 0.75 or over 1.25 as a rough guide) rating down for imprecision may be appropriate even if OIS criteria are met." — e serve para IC que **atravessa** o nulo, não para IC que o exclui raspando.

### R4.e — eventos < 300 sem efeito grande rebaixa imprecisão
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: GRADE guidelines 6 Table 1 lê ao contrário — "300 | 30 | Will meet threshold"; e §8: "if the total number of patients included in a systematic review is less than the number of patients generated by a conventional sample size calculation for a single adequately powered trial, consider the rating down for imprecision" (o OIS é CÁLCULO, não constante). Guidance 34 (2022): "When the CI does not cross the threshold(s) and the relative effect is large, one should implement the optimal information size (OIS) approach."

### R4.f — imprecisão muito séria (−2) por eventos < 300 e IC que não exclui o nulo
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: GRADE guidelines 6 §13 exige mais e outra coisa — "When there are very few events and CIs around both relative and absolute estimates of effect that include both appreciable benefit and appreciable harm, systematic reviewers and guideline developers should consider rating down the quality of evidence by two levels." São três condições (poucos eventos **e** benefício apreciável **e** dano apreciável, nas escalas relativa **e** absoluta); o squad guardava duas, com um número inventado no lugar de "very few" (os exemplos da fonte são 11 pacientes e 20 eventos) e "não exclui o nulo" no lugar de "inclui benefício e dano apreciáveis". O schema 2 hoje não grava o IC absoluto nem o limiar, então a regra correta é inexprimível sem mudar o esquema.

### C4 — análise interina sem versão mais madura rebaixa
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE guidelines 6 §7 (grade-guidelines-6-imprecisao.md); Bassler 2010 (bassler-2010-interrupcao-precoce.md), que é a referência [5] daquele §7
- fonte.frase: "Simulation studies and empirical evidence suggest that trials stopped early for benefit overestimate treatment effects."
- nota: DOMÍNIO EM DISPUTA, registrado para o referendo. O squad pendura em `imprecisao`; o manual do MS lista "Interrupção precoce do estudo por benefício" no Quadro 6, item 5 — **limitações do estudo** (risco de viés). As duas leituras têm fonte; o que não tem fonte é contar duas vezes. Fica em `imprecisao` nesta rodada porque mudar o domínio mexeria em valor.

### R5.a — força forte exige certeza ≥ B
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: GRADE Handbook §1.2 — "strong recommendations can result from low or even very low confidence in effect estimates"; e MS/CONITEC Quadro 12, "Situações-modelo na qual uma recomendação forte pode ser indicada a despeito de baixa ou muito baixa confiança em estimativas efetivas", cuja situação 1 é "Quando baixa qualidade de evidência sugere benefício numa situação de risco de vida."

### R5.b — forte a favor exige ESMO-MCBS ≥ 3 (paliativo) ou A/B (curativo)
- estado: APLICADA
- fonte.tipo: institucional
- fonte.ref: decisão D3 da auditoria de 2026-09-17 (output/2026-09-17-auditoria-grade/RELATORIO-auditoria-grade.md, linha "D3 | limiar de força forte")
- fonte.frase: "D3 | limiar de força forte | MCBS ≥ 3 paliativo / ≥ B curativo [recomendado] · só certeza ≥ B"
- nota: legítima como política, porque a fonte põe magnitude de benefício e valores na balança da força sem fixar número — MS/CONITEC §1, princípio 3: o decisor "deve obrigatoriamente ponderar os benefícios, riscos, ônus e custos". O **número** 3 é escolha da instituição, e é por isso que precisa ser `institucional` e não `metodologica`. A metade "só certeza ≥ B" da mesma linha D3 está SUSPENSA como R5.a: decisão institucional não pode contrariar a fonte, só preencher o que ela deixa em aberto.

### R5.c — regime não incorporado tem direção contra
- estado: APLICADA
- fonte.tipo: institucional
- fonte.ref: decisão D4 da auditoria de 2026-09-17 (output/2026-09-17-auditoria-grade/RELATORIO-auditoria-grade.md)
- fonte.frase: "D4 | regime não-incorporado | força sempre `contra` [recomendado] · manter força \"vs comparador\" + campo separado de decisão institucional"

### R6.a — a intervenção do pivô contém todos os fármacos do regime
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: GRADE Handbook §5.2.3; guia-grade-certeza §3.3
- fonte.frase: "Ocorre quando há discrepâncias entre a evidência disponível e a pergunta clínica real em termos de População, Intervenção, Comparador ou Desfecho."

### R6.b — comparador obsoleto rebaixa só quando muda a decisão de hoje
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: guia-grade-certeza §3.3; GRADE Handbook §5.2.3
- fonte.frase: "-1 (Sério): Diferenças menores na população ou no comparador utilizado (ex: placebo quando o padrão de cuidado é um fármaco ativo)."
- nota: "muda a decisão de hoje" é a operacionalização de "a pergunta clínica real" — a indireta é definida contra a pergunta atual, não contra a de 2013.

### R6.c — o desfecho primário do pivô tem de ser positivo
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: MS/CONITEC Quadro 6, item 4 (ms-conitec-sistema-grade.md)
- fonte.frase: "4 – Relato seletivo de desfechos: Relato incompleto ou ausente de alguns desfechos com base nos resultados."
- nota: DOMÍNIO EM DISPUTA, menor. Na fonte isto é **risco de viés**; no squad vive no bloco `pivo` com efeito sobre a certeza. Registrado, não movido nesta rodada.

### C9.a — a certeza nunca fica acima da que a revisão declara
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: MS/CONITEC §1 (princípio 1 da MBE); guia-grade-certeza §1
- fonte.frase: "Necessidade de Sumários Sistemáticos: A tomada de decisão clínica deve ser baseada na totalidade da evidência disponível, idealmente por meio de revisões sistemáticas e metanálises, para mitigar o risco de conclusões enviesadas por estudos isolados ou não representativos."
- nota: é deferência, não limiar — por isso sobrevive.

### C9.b — revisão sem grau declarado tem teto B
- estado: SUSPENSA
- fonte.tipo: nenhuma
- fonte.ref: —
- fonte.frase: —
- contradiz: nenhuma fonte fixa esse teto. ÓRFÃ. Uma revisão sem GRADE declarado não é, por isso, evidência moderada: a certeza se avalia sobre o corpo, pelos 5 domínios, como em qualquer outro caso.

### F1 — a certeza é a aritmética dos domínios, com piso D
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: guia-grade-certeza §5; GRADE Handbook §5.4
- fonte.frase: "Qualidade Final = Qualidade Inicial - Rebaixamento + Elevação"

### F2 — cinco domínios presentes, nota em {0, −1, −2}, com `por` não vazio
- estado: APLICADA
- fonte.tipo: metodologica
- fonte.ref: guia-grade-certeza §3; GRADE Handbook §5.2
- fonte.frase: "A certeza da evidência é rebaixada quando há limitações sérias (-1 nível) ou muito sérias (-2 níveis) nos dados coletados para um desfecho."

## Regras órfãs e contrárias à fonte — lista fechada desta rodada

Nenhuma delas pode ser aplicada. Nenhuma delas reescreve valor gravado. Todas esperam decisão humana,
e a de imprecisão espera **documento** antes de decisão (pedidos 1 e 2 em
`pipeline/data/fontes-metodo/PEDIDOS-DE-FONTE.md`).

| id | o que era | por que caiu | o que é preciso para repor |
|---|---|---|---|
| R1.d | eventos ≥ 300 **ou** efeito grande para certeza A | contrária à fonte, em dois níveis (empréstimo do mecanismo de elevação + inversão da Table 1) | texto completo da Guidance 34 e do capítulo do GRADE Book; depois, um campo de **limiar** e o **IC absoluto** no schema 2 |
| R4.d | colchão de 0,95 / 1,05 | órfã pura | decidir se o squad quer o limiar de benefício apreciável da fonte (RR 0,75 / 1,25) — que é outra coisa — ou nada |
| R4.e | eventos < 300 sem efeito grande → −1 | contrária à fonte (OIS é cálculo, não constante) | mesma dependência de R1.d; o OIS precisa de taxa de evento no **controle**, que o schema 2 não grava |
| R4.f | eventos < 300 + IC não exclui nulo → −2 | contrária à fonte (faltam duas das três condições) | IC do efeito **absoluto** e limiar de benefício/dano apreciável no schema 2 |
| R3.c | desenho de inicial C nunca chega a A | contrária à fonte (Table 5.9 permite +2; o MS diz "deve ser considerado alto") | nada além de aceitar a fonte; na prática o corpus não tem caso, então é correção de letra |
| R5.a | força forte exige certeza ≥ B | contrária à fonte (Handbook §1.2 e Quadro 12 do MS) | decidir se o OncoGuia adota as 5 situações-modelo do Quadro 12 como a porta de exceção |
| C9.b | revisão sem grau → teto B | órfã pura | nada: avaliar os 5 domínios sobre o corpo resolve sem limiar novo |

## Output Format

```json
{
  "regimen_id": "pancreas-met-nabpac-gem-nao-incorporado",
  "eixo": "a qualidade da evidência e a força da recomendação",
  "schema": 2,
  "status": "re_derivado",
  "afirmado_protocolo": null,

  "desfecho_critico": "SG",
  "desenho": {
    "tipo": "rct_fase3",
    "cegamento": "aberto",
    "n": 861,
    "descricao": "MPACT — nab-paclitaxel + gemcitabina vs gemcitabina, fase 3 aberto, 861 pacientes"
  },
  "efeito": {
    "medida": "HR",
    "valor": 0.72,
    "ic95": [0.62, 0.83],
    "sentido_beneficio": "menor",
    "eventos": null,
    "eventos_por": null,
    "analise": "final",
    "transcricao": "The median overall survival was 8.5 months in the nab-paclitaxel-gemcitabine group as compared with 6.7 months in the gemcitabine group (hazard ratio for death, 0.72; 95% confidence interval [CI], 0.62 to 0.83; P<0.001).",
    "fonte_transcricao": "europepmc_abstract"
  },
  "pivo": {
    "intervencao": ["nab-paclitaxel", "gemcitabina"],
    "comparador": "gemcitabina",
    "comparador_padrao_epoca": true,
    "comparador_padrao_atual": false,
    "comparador_muda_decisao": true,
    "primario_positivo": true,
    "sustenta": true,
    "por": "braço experimental = regime; gemcitabina era o padrão em 2013; primário (SG) positivo; hoje a escolha é vs FOLFIRINOX, não vs gem — comparador muda a decisão (C2)",
    "referencias_adicionais": []
  },
  "dominios": {
    "risco_vies":      {"nota": 0,  "por": "aberto, mas desfecho crítico duro (SG) — cegamento não afeta"},
    "inconsistencia":  {"nota": 0,  "por": "ensaio único, sem contradição posterior"},
    "indireta":        {"nota": -1, "por": "comparador (gem isolada) não é mais padrão atual — FOLFIRINOX/mFOLFIRINOX"},
    "imprecisao":      {"nota": 0,  "por": "IC 0,62–0,83 exclui nulo com folga; efeito grande (RRR 28%) e N=861"},
    "vies_publicacao": {"nota": 0,  "por": "registro prévio; sem sinal"}
  },
  "elevacoes": [],
  "certeza": "B",
  "substituto_excecao": null,
  "pivo_nao_sustenta": false,
  "recomendacao": {
    "forca": "condicional",
    "direcao": "contra",
    "base": "não incorporado: preferência institucional por FOLFIRINOX; padrão para inelegíveis a FOLFIRINOX",
    "sem_mcbs_por": null
  },
  "valor_rederivado": "2B",
  "justificativa": "RCT fase 3 aberto, SG HR 0,72 (0,62–0,83), N=861; −1 indireta pelo comparador (gemcitabina isolada não é padrão atual). Não incorporado → condicional contra.",
  "fonte": "https://doi.org/10.1056/NEJMoa1304369",
  "motivo_indeterminado": null
}
```

### Vocabulários fechados

- `desfecho_critico`: **duros** `SG` · `mortalidade` · `SLD` · `iDFS` · `SLE` · `SLR` · `controle_local`;
  **substitutos** `SLP` · `SLPr` · `ORR` · `RCp` · `MFS` · `TTP` · `DoR` · `outro_substituto`.
- `desenho.tipo`: parte de **A** → `rct_fase3` · `rct_fase2_3` · `rct_fase2` · `meta_analise_rct`; parte de **C** →
  `fase2_braco_unico` · `basket` · `observacional` · `serie_casos`.
- `efeito.analise`: `final` · `atualizada` · `interina` (interina sem versão madura → imprecisão ≤ −1, C4).
- `efeito.eventos_por`: "transcrito" ou `"deduzido de <cálculo sobre números da fonte>"` (C1).
- `pivo.comparador_muda_decisao`: obrigatório quando `comparador_padrao_atual = false` (C2).
- `pivo.referencia_atualizada`: `{doi, pmid, por}` — versão madura do mesmo estudo (C4); `pivo.referencias_adicionais`: `[{doi, papel}]` (C7).
- `pivo.referencia_corpo`: `{doi, tipo: cochrane|meta_analise|revisao_sistematica, comparacao, certeza_declarada: alta|moderada|baixa|muito_baixa|null, por}` (C9) — com ela, `efeito` = estimativa agregada transcrita do abstract da revisão e `desenho.tipo = meta_analise_rct`.
- `desenho.cegamento`: `duplo_cego` · `aberto` · `nao_informado`.
- `efeito.medida`: `HR` · `RR` · `OR` · `diferenca_absoluta` · `diferenca_medianas`;
  `efeito.sentido_beneficio`: `menor` · `maior`.
- `efeito.fonte_transcricao`: `europepmc_abstract` · `europepmc_fulltext` · `pmc_fulltext` (manuscrito de
  autor em `ncbi.nlm.nih.gov/pmc/articles/<PMCID>/` — funciona quando o `fullTextXML` do Europe PMC dá 500) ·
  `pubmed_abstract` · `oa_pdf` · `crossref_abstract` · `pdf_fornecido_revisor` (ver "Fonte inacessível").
- `efeito.ic_nivel`: nível do IC **como a fonte reporta** (omitir = 95). Fase II com IC 80%, interinas com
  98,89%/99,8% são fatos da fonte, não falhas: transcrever o nível; < 95 força `imprecisao ≤ −1` e barra A;
  > 95 é conservador (IC mais largo que o de 95%) e o portão usa os limites como estão.
- `dominios.*.nota`: `0` · `-1` · `-2`.
- `elevacoes[].tipo`: `magnitude_grande` (+1) · `magnitude_muito_grande` (+2) · `dose_resposta` (+1) ·
  `confusao_oposta` (+1) — cada um com `por`.
- `certeza`: `A` · `B` · `C` · `D`.
- `substituto_excecao.tipo`: `crossover_documentado` · `substituto_validado_no_tumor` (+ `por`).
- `recomendacao.forca`: `forte` · `condicional`; `recomendacao.direcao`: `a_favor` · `contra` · `pendente_revisor` (C6).
- `status`: `concorda` · `diverge` · `re_derivado` · `indeterminado`.

### Fonte inacessível — protocolo (adendo da direção, 2026-09-17)

1. O abstract do Europe PMC costuma bastar (N, HR, IC, desfecho primário). Texto completo só quando o
   abstract não traz eventos/IC — ordem: `fullTextXML` → página PMC do manuscrito de autor → Unpaywall/
   OpenAlex (`url_for_pdf`; editores como NEJM/Wiley devolvem 403 ao bot — é o esperado).
2. Se nem assim o dado essencial aparecer: `status = indeterminado`, `motivo_indeterminado` começa com
   `fonte_inacessivel:` e nomeia o que falta; e o item entra em **`PEDIDOS-DE-ARTIGO.md` no run**
   (regime · estudo · DOI/PMID · o que falta: texto completo? tabela de eventos? IC?). Um bloco que
   **fechou em B só por falta de eventos/IC 95%** também entra na lista, marcado *upgrade* — não trava
   a tabela, mas a repescagem pode subir a certeza.
3. PDFs fornecidos pela direção ficam em **`pipeline/data/artigos-fornecidos/<PMID>.pdf`**. PDF fornecido é
   fonte legítima: `fonte_transcricao = pdf_fornecido_revisor` + `efeito.proveniencia = "PDF fornecido pelo
   revisor metodológico, conferido contra DOI <x>"` (o portão exige a frase e lista no WARN).
4. A repescagem dos fornecidos é passo próprio, **depois** do piloto principal.

### Caso `indeterminado`

Nota de comunicação (`guia-prompts-ebm-grade.md` §8): **nunca** escrever "não há evidência". Usar
"estimativas de efeito são incertas" / "a evidência atual garante muito baixa confiança", e
`motivo_indeterminado` nomeia os degraus da escada que falharam.

```json
{ "regimen_id": "…", "schema": 2, "status": "indeterminado",
  "motivo_indeterminado": "Europe PMC sem abstract para o DOI; Unpaywall is_oa=false; OpenAlex sem oa_url; PubMed efetch sem resultado",
  "desfecho_critico": null, "desenho": null, "efeito": null, "pivo": null, "dominios": null,
  "certeza": null, "recomendacao": null, "valor_rederivado": null,
  "justificativa": "Estimativas de efeito são incertas: fonte inacessível pela escada inteira — sem efeito transcrito não há certeza a derivar.",
  "fonte": "https://doi.org/…" }
```

## Veto Conditions

- Marcar `concorda` quando `afirmado_protocolo == null` → proibido: sem afirmação não há confronto; o status é `re_derivado`.
- Preencher `efeito` de memória, de diretriz, de revisão narrativa ou do próprio protocolo → proibido: `transcricao` é frase da fonte primária, obtida pela escada de APIs nesta execução.
- Marcar `indeterminado`/"inacessível" sem ter percorrido a escada inteira (Crossref → Europe PMC → Unpaywall/OpenAlex → PubMed) → proibido; e `motivo_indeterminado` tem de nomear os degraus que falharam.
- Inventar valor, IC ou nº de eventos quando a API não retornar → proibido (é `indeterminado`).
- Escrever `certeza` que não é a aritmética dos domínios → proibido (o portão recalcula).
- Domínio com nota 0 e `por` vazio → proibido: "não rebaixei" também se justifica.
- `forte a_favor` em regime não incorporado, ou com MCBS 1–2, ou com certeza C/D → proibido (regra 5).
- Trocar o DOI da referência por conta própria → proibido: propor em `pivo.referencia_proposta` e deixar o revisor decidir; a `fonte` do veredito continua sendo o DOI do regime.
- Citar como `fonte` um DOI que não resolve no Crossref → proibido.
- "Fase 3 + ganho de SG → 1A" sem os 5 domínios avaliados → proibido: é exatamente o atalho que esta versão existe para fechar.
