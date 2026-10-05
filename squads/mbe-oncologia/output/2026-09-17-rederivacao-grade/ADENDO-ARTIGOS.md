# ADENDO — repescagem dos artigos fornecidos (19 PDFs, entrega de 2026-10-05)

**Para:** revisor metodológico (direção) e revisor clínico (Drummond) · **Data:** 2026-10-05
**O que é:** o resultado da transcrição dos 19 PDFs entregues em
`squads/mbe-oncologia/pipeline/data/artigos-fornecidos/`, contra os 14 pedidos de
`PEDIDOS-DE-ARTIGO.md`. Toda frase citada aqui foi transcrita **literalmente** do PDF.
**O que NÃO é:** não reescreve o `REFERENDO-CLINICO.md`, não regenera a página, não toca no
`_tabela_clinica.md`, não promove `RUN_ATIVO`, não grava parecer. Nada do que está aqui foi
aplicado aos JSON das ondas.

**Marcação de toda transcrição desta rodada:** `fonte_transcricao = pdf_fornecido_revisor`,
`proveniencia = "PDF fornecido pelo revisor metodológico, conferido contra DOI <x>"`.

**Conferência de DOI:** os 10 PDFs que entraram como fonte tiveram o DOI impresso conferido
contra o DOI registrado no card. **Nenhuma divergência do tipo Glimelius.** A única troca de
DOI é a do KEYNOTE-426, e é troca por C4 (versão mais madura), registrada como tal — §5.

---

## 1. Uma linha por pedido

| # | regime | linha do referendo | estado | efeito no valor |
|---|---|---|---|---|
| 1 | `gastrico-met-her2-trastuzumabe-qt` | **24** | **resolvido** | **1B → 1A** (firme) |
| 2 | `gastrico-met-her2-pembro-tras-qt` | **25** | resolvido **com ressalva** — veio resumo de congresso, não a carta ao NEJM | **2C → 1A** se resumo servir de fonte; **2C** se não |
| 3 | `renal-adj-pembrolizumab` | 1 | **não resolvido** — o artigo não veio | 1B inalterado |
| 4 | `gastrico-adj-crt-5fu-lv` | **16** | **resolvido** | **1B → 1A** (firme) |
| 5 | `retal-neoadj-crt-capecitabina` | **30** | resolvido **com ressalva** — o HR existe, mas abre juízo novo | **sai de indeterminado**; letra em aberto (§4, M14) |
| 6 | `renal-met-intalto-axitinibe-pembrolizumabe` | **6** | **resolvido** | **1B → 1A** (firme) |
| 7 | `eso-neoadj-crt-carbo-paclitaxel` | **12** | **resolvido na contagem**, mas o valor depende de M1 | **1B** (M1 atual) / **1A** (M1 com IC sup ≤ 0,90) |
| 8 | `retal-tnt-folfirinox` | 32 | **parcial** — N e eventos sim; **o HR não existe no documento** | 1B inalterado |
| 9 | `gastrico-zolbetuximabe-nao-incorporado` | **29** | **resolvido na contagem, com achado** — a análise de SG é **interina**, não final | **2B** (M6 atual) / **2A** (M6 recomendado) |
| 10 | `crc-met-aflibercepte-nao-incorporado` | 41 | **parcial** — N por braço sim, óbitos não | **2B**; **2A** se C1 puder cruzar publicações (§4, M16) |
| 11 | `crc-met-regorafenibe-nao-incorporado` | 42 | **não resolve sozinho** (como o manifesto diz); **corrige a contagem** | **2B** (M6 atual) / **2A** (M6 recomendado) |
| 12 | `colo-qrt-io-keynote-a18` | 45 | resolvido **com ressalva** — resumo de congresso | **1B nos dois cenários**; sai da dependência de M1 |
| 13 | `colon-adj-fluoropirimidina-stageII` | 33 | **não resolvido** — C9 **não aplicável** (§3) | 1B inalterado |
| 14 | `eso-def-crt-cisplatina-5fu` | 13 | **não resolvido** — nenhum dos PDFs é corpo de evidência | 1B inalterado |

**Placar da repescagem:** 4 resolvidos firmes · 4 resolvidos com ressalva ou dependentes de
regra em aberto · 3 parciais · 3 não resolvidos.

---

## 2. Antes → depois, só dos regimes que mudam de valor

### 2.1 Mudanças FIRMES (não dependem de nenhuma regra em aberto)

#### Linha 24 — `gastrico-met-her2-trastuzumabe-qt` · ToGA · **1B → 1A**

Pedido: contagem de óbitos por braço. O card deduzia **≥ 292** (C1, limite inferior), 8 abaixo
do limiar de 300. A contagem real está na figura 2A:

> `Trastuzumab plus chemotherapy  167   13·8   0·74 (0·60–0·91)  0·0046`
> `Chemotherapy alone  182   11·1`
> — Bang et al., *Lancet* 2010;376:687–97, figura 2A

Corroborado no texto: *"With approximately 75% of the information (349 events)"*.

**167 + 182 = 349 óbitos ≥ 300.** OIS atingido; IC 0,60–0,91 exclui o nulo → imprecisão **0** →
certeza **A**. Resolve M5 exatamente como a recomendação previa ("aceitar a dedução como está e
resolver pelo texto completo"): a dedução estava certa e era conservadora por 57 eventos.
DOI conferido: `10.1016/S0140-6736(10)61121-X` = DOI do card. ✓

#### Linha 16 — `gastrico-adj-crt-5fu-lv` · INT0116 (Smalley 2012) · **1B → 1A**

Pedido: nº de óbitos por braço. O card tinha `eventos: null` e imprecisão −1 por "óbitos não
transcritos nem dedutíveis". A figura 2A traz:

> `FU + leucovorin + RT  282  209  35`
> `Observation  277  229  27`
> — Smalley et al., *JCO* 2012;30:2327–33, figura 2A (colunas n · Events · Median)

**209 + 229 = 438 óbitos ≥ 300.** IC 1,10–1,60 exclui o nulo → imprecisão **0** → certeza **A**.
Observação: o motivo adicional do −1 era "RRR 24% < 30%" — esse critério é da convenção de
efeito grande (M1), que **só se aplica quando o OIS não é atingido**. Com 438 eventos ele sai de
cena. DOI conferido: `10.1200/JCO.2011.36.7136` = DOI do card. ✓

#### Linha 6 — `renal-met-intalto-axitinibe-pembrolizumabe` · KEYNOTE-426 · **1B → 1A**

Veio o seguimento de **5 anos** (2025), mais maduro que os 43 meses pedidos → **C4 substitui**.

> *"By the data cutoff date, 550 participants in the intention-to-treat population had died,
> including 270 of 432 participants (62.5%) in the pembrolizumab plus axitinib arm and 280 of
> 429 participants (65.3%) in the sunitinib arm. The median OS was 47.2 months in the
> pembrolizumab plus axitinib arm and 40.8 months in the sunitinib arm (hazard ratio: 0.84; 95%
> confidence interval: 0.71–0.99)."*
> — Rini et al., *Nat Med* 2025;31:3475–3484, p. 3476

**550 óbitos ≥ 300**; IC 0,71–0,99 exclui o nulo → imprecisão **0** → certeza **A**.

**Ressalva (dado, não juízo):** o seguimento de 5 anos é atualização descritiva final
(*"this exploratory analysis"* refere-se ao cálculo do seguimento mediano de 67,2 meses; a
eficácia é reportada como *"the final clinical data after 5 years of follow-up"*). É o mesmo
estatuto da atualização de 43 meses que o card já usava — C4 contempla.

**Troca de referência (M10)** — ver §5.

#### Linha 30 — `retal-neoadj-crt-capecitabina` · Hofheinz 2012 · **sai de indeterminado**

O motivo registrado do indeterminado era: *"o abstract … traz só taxas por braço, sem HR nem IC
da diferença: não há efeito transcritível (regra 7)"*. O texto completo traz os dois:

> *"5-year overall survival in the capecitabine group was non-inferior to that in the
> fluorouracil group (76% [95% CI 67–82] in the capecitabine group vs 67% [58–74] in the
> fluorouracil group, non-inferiority p=0·0004; figure 4; hazard ratio [HR] for fluorouracil vs
> capecitabine 1·5 [95% CI 1·00–2·28]). An exploratory, post-hoc test for superiority in 5-year
> overall survival was in favour of capecitabine (p=0·05)."*
>
> *"DFS was better in the capecitabine group than in the fluorouracil group (HR 1·4 [95% CI
> 1·02–2·02]; log-rank p=0·035; figure 6)."*
>
> Óbitos (figura 5, linha "Overall"): `392   55/195   38/197   1·50 (1·00–2·28)`
> — Hofheinz et al., *Lancet Oncol* 2012;13:579–88

**O que é firme:** `pivo_nao_sustenta` cai — a fonte registrada **passa a conter** efeito com IC.
A linha 30 do referendo ("virou indeterminado") está desatualizada em qualquer leitura.

**O que NÃO é firme — a letra.** Três coisas abrem juízo e nenhuma é minha:
- **93 óbitos** (55 + 38) — muito abaixo do OIS de 300.
- **O IC de SG toca o nulo** (1,00–2,28). O de SLD não (1,02–2,02).
- **É ensaio de não inferioridade**, e a NI foi atingida com folga (p=0,0004, margem de 12,5%).
  O domínio de imprecisão do GRADE julga contra o **nulo**; num ensaio de NI a pergunta é contra
  a **margem**. O squad não tem regra escrita para isso → **M14** (§4).
- **População mista:** 231 do estrato adjuvante e 161 do neoadjuvante; o regime é o neoadjuvante.
  O subgrupo neoadjuvante tem HR 1,28 (0,69–2,37). Candidato a −1 de indireta.

Leituras possíveis: **1B** (−1 imprecisão só), **2C** (−1 imprecisão −1 indireta), **2D**
(−2 imprecisão −1 indireta). **Não derivei nenhuma.** Vai para o revisor metodológico.
DOI conferido: `10.1016/S1470-2045(12)70116-X` = DOI do card. ✓

### 2.2 Mudanças que DEPENDEM de regra em aberto — os dois resultados

#### Linha 12 — `eso-neoadj-crt-carbo-paclitaxel` · CROSS 10 anos · **depende de M1**

> *"On December 31, 2018, 117 of 178 patients in the chemoradiotherapy-surgery arm and 144 of 188
> patients in the surgery arm had died. Patients in the chemoradiotherapy-surgery arm had better
> overall survival than patients in the surgery arm (hazard ratio [HR], 0.70; 95% CI, 0.55 to
> 0.89; P = .004)"*
> — Eyck et al., *JCO* 2021;39:1995–2004

**117 + 144 = 261 óbitos** (o card deduzia ≈ 251 — dedução conservadora por 10 eventos, de novo
na direção certa). **261 < 300: o OIS continua não atingido.** A contagem não decide nada
sozinha, exatamente como o pedido previa. Decide a convenção de efeito grande:

| | RRR | IC sup | M1 como está (≤ 0,85) | M1 recomendado (≤ 0,90) |
|---|---|---|---|---|
| CROSS | 30% | 0,89 | não aplica → **1B** | aplica → **1A** |

DOI conferido: `10.1200/JCO.20.03614` = DOI do card. ✓

#### Linha 29 — `gastrico-zolbetuximabe-nao-incorporado` · SPOTLIGHT · **achado: a SG é interina**

Pedido: nº de óbitos. Vieram, e com eles um achado que **corrige o card**:

> *"By the interim analysis, 326 (58%) of 565 patients had died: 149 (53%) of 283 patients in the
> zolbetuximab group versus 177 (63%) of 282 patients in the placebo group. Zolbetuximab
> treatment showed a significant reduction in the risk of death versus placebo (HR 0·75, 95% CI
> 0·60–0·94; p=0·0053 [prespecified criteria for superiority based on number of events,
> p=0·0135])."*
>
> *"An interim analysis of overall survival was planned at the final progression-free survival
> analysis, and a final analysis of overall survival was planned after 396 deaths"*
> — Shitara et al., *Lancet* 2023;401:1655–68

**O card registra `analise: "final"`. É interina.** O abstract não dizia; o texto diz. Isso
muda o eixo da pergunta:

- **326 óbitos ≥ 300** e IC 0,60–0,94 exclui o nulo → o −1 que o card tinha ("óbitos não
  dedutíveis") **cai**.
- Mas a análise é **interina pré-especificada que cruzou o limiar** (p=0,0053 < 0,0135) → entra
  **C4/M6**, que o card não aplicava porque não sabia.

| | M6 como está (interina = −1) | M6 recomendado (não penalizar interina pré-especificada que cruzou o limiar com ≥ 300 eventos) |
|---|---|---|
| SPOTLIGHT | **2B** | **2A** |

O valor exibido é o mesmo de hoje sob M6 atual — **mas o motivo registrado está errado** e
precisa ser corrigido independentemente da decisão. Direção **contra** mantida nos dois casos.
DOI conferido: `10.1016/S0140-6736(23)00620-7` = DOI do card. ✓

#### Linha 42 — `crc-met-regorafenibe-nao-incorporado` · CORRECT · **depende de M6 (como o manifesto diz)**

O PDF é a publicação primária, que já era a fonte. **Não resolve sozinho.** Mas corrige um número
que o referendo metodológico usa como argumento:

> *"At the second planned interim analysis, after 432 deaths, the HR for overall survival was 0·77
> for regorafenib versus placebo (95% CI 0·64–0·94; p=0·0052; figure 2A), which crossed the
> prespecified overall survival efficacy boundary."*
> — Grothey et al., *Lancet* 2013;381:303–12

**São 432 óbitos, não ≥ 381.** O card deduzia ≥ 381 por C1; o texto do REFERENDO-METODOLOGICO
escreve "(CORRECT: 381 óbitos)" na justificativa de M6. **O argumento de M6 não muda** (432 ≥ 300
tanto quanto 381), mas o número citado deve ser corrigido para o literal.

| | M6 como está | M6 recomendado |
|---|---|---|
| CORRECT | **2B** | **2A** |

DOI conferido: `10.1016/S0140-6736(12)61900-X` = DOI do card. ✓

#### Linha 25 — `gastrico-met-her2-pembro-tras-qt` · KEYNOTE-811 · **depende da decisão sobre resumo de congresso**

Veio o resumo do ESMO 2024 (1400O), **não** a carta ao NEJM (PMID 39282917) que o pedido pedia.
Traz a SG final:

> *"At final analysis, OS was significantly improved with pembro + SOC (median 20.0 vs 16.8 mo;
> HR 0.80; 95% CI, 0.67-0.94; p=0.0040 [less than prespecified boundary 0.0201) vs pbo + SOC. In
> pts with PD-L1 CPS ≥1, median OS was 20.1 vs 15.7 mo (HR 0.79; 95% CI, 0.66-0.95)."*
>
> *"A total of 698 pts were randomized (350 to pembro + SOC; 348 to pbo + SOC). Median follow-up
> was 50.2 mo."*
> — Janjigian et al., *Ann Oncol* 2024;35(S2):S877, resumo 1400O · DOI `10.1016/j.annonc.2024.08.1466`

**`proveniencia` desta transcrição: resumo de congresso (ESMO 2024), não publicação revisada por
pares.** Não decidi se serve como fonte do card — é do revisor metodológico. Os dois cenários:

| | fonte do card | desfecho crítico | indireta | imprecisão | valor |
|---|---|---|---|---|---|
| **A — resumo aceito** | resumo ESMO 2024 | **SG** (demonstrada) | **0** (deixa de ser substituto) | **0** (análise final; medianas 20,0 e 16,8 atingidas nos dois braços → C1 dá ≥ 349 óbitos ≥ 300; IC 0,67–0,94 exclui o nulo) | **A** → **1A** |
| **B — resumo recusado** | Lancet 2023 (3ª interina) | SLP | −1 (substituto) | −1 (C4 interina) | **2C** — como está |

Observação de método para o cenário B: o motivo registrado hoje diz *"análise interina sem versão
madura transcritível (C4)"*. A versão madura **passou a existir** (ainda que como resumo) — a
frase fica factualmente desatualizada mesmo se a decisão for recusar o resumo. E o texto completo
da Lancet 2023 agora dá os eventos que faltavam: *"Only 415 (75%) of 551 death events occurred"*.

**Nota sobre a força em A:** derivei a **certeza** (A). A **força** (forte vs condicional) segue a
regra do squad para regime incorporado com SG demonstrada — não é um juízo meu, mas confira.

#### Linha 45 — `colo-qrt-io-keynote-a18` · análise final · **valor igual nos dois cenários**

O pedido 12 dava a análise final como "ainda não publicada". Ela existe, como resumo oral do
ASCO 2025 (LBA5504):

> *"1060 pts were randomized to pembro + CCRT (n=529) or pbo + CCRT (n=531). At the
> protocol-specified FA (Jan 7, 2025, data cutoff), median follow-up was 41.9 mo"*
>
> Tabela, coluna *Final Analysis 07JAN25*: OS mediana `NR (NR-NR)` nos dois braços; 36-mo OS
> 81.8% vs 74.4%; **OS HR 0.73 (0.57-0.94)**. PFS HR 0.72 (0.59-0.87).
> — Duska et al., *J Clin Oncol* 2025;43(suppl 17):LBA5504 (ASCO 2025)

| | fonte do card | C4 interina | imprecisão | valor |
|---|---|---|---|---|
| **A — resumo aceito** | resumo ASCO 2025 | **não aplica** (é final) | **−1** — medianas de SG **não atingidas** nos dois braços → C1 não deduz; sem contagem de eventos no resumo; RRR 27% **< 30%**, logo M1 não socorre em nenhum limiar | **1B** |
| **B — resumo recusado** | Lancet 2024 (2ª interina) | −1 | — | **1B** — como está |

**O valor não muda em nenhum cenário** — a linha 45 do referendo continua válida. Mas há um efeito
colateral que interessa ao referendo metodológico: no cenário A o A18 **sai da lista de regimes
que dependem de M1** (o HR final 0,73 tem RRR 27%, abaixo do piso de 30% que M1 mantém nas duas
versões; o HR 0,67 da 2ª interina tinha RRR 33%). M1 passa a decidir **3** regimes, não 4.

### 2.3 Transcrições que NÃO mudam o valor (mas preenchem campo vazio)

#### Linha 32 — `retal-tnt-folfirinox` · PRODIGE 23 · **o HR não existe no documento**

O pedido pedia "HR de SG/SLD e N por braço". Vieram o N e os eventos; **o HR não vem — e o
documento diz por quê:**

> *"Evidence of non-proportional hazards was observed for DFS (P = 0.0152), MFS (P = 0.009), and
> OS (P = 0.10). Therefore, as recommended by experts, the RMST methodology was used to overcome
> the limitations of proportional hazards modeling."*
>
> *"A total of 461 patients were recruited by 35 French centers and randomly assigned to either
> the neoadjuvant chemotherapy group (n = 231) or the standard-of-care group (n = 230)"*
>
> *"DFS events were reported in 155/461 patients (33.6%) with 72/231 (31.2%) in the neoadjuvant
> chemotherapy group and 83/230 (36.1%) in the standard-of-care group."*
>
> *"For the OS analysis, 98 events were observed"*
> — Conroy et al., *Ann Oncol* 2024;35:873–881

Pela regra ("se a frase não existir no documento, o item é abortado"), **a parte do HR do pedido 8
é não resolvida — e definitivamente, não por falta de acesso.** O que muda:

- `desenho.n`: `null` → **461** (231 / 230)
- `efeito.eventos`: `null` → **98** (SG, total; não reportado por braço)
- a nota de imprecisão *"óbitos < 300 certamente … e N não transcrito"* passa de suposição a
  **fato transcrito**: 98 << 300.
- **Valor inalterado: 1B.** A linha 32 do referendo continua válida.

**Mas abre uma pergunta de método (M15, §4):** o HR de SLD **existe**, na publicação **primária**:
> *"3-year disease-free survival rates were 76% (95% CI 69–81) in the neoadjuvant chemotherapy
> group and 69% (62–74) in the standard-of-care group (stratified hazard ratio 0·69, 95% CI
> 0·49–0·97; p=0·034)"* — Conroy et al., *Lancet Oncol* 2021;22:702–715

C4 manda usar a versão madura, e a versão madura **recusa o HR por violação de riscos
proporcionais**. Preferir o HR da primária seria escolher a medida enviesada que os próprios
autores descartaram. Como o squad gradua um efeito que só existe como diferença de RMST é
decisão de método, não minha.

#### Linha 41 — `crc-met-aflibercepte-nao-incorporado` · VELOUR · **N sim, óbitos não**

O PDF é o artigo de **subgrupos** (*Eur J Cancer*), não a primária (*JCO* 2012). **O pedido 10
continua aberto para os óbitos.** Mas — e aqui o manifesto está ligeiramente errado, ver §6 — o
artigo **traz o N por braço do ensaio inteiro**:

> *"Between November 2007 and March 2010, 1226 [patients were randomised to receive FOLFIRI with]
> either aflibercept (612 patients) or placebo (614 patients)."*
> Tabela de subgrupos, linha `All patients`: `1226   0.817 (0.713 to 0.937)`
> — Ruff et al., *Eur J Cancer* 2014;50:320–331 · DOI `10.1016/j.ejca.2013.09.013`

Com o N por braço, a dedução C1 **passa a ser possível** (as medianas de SG — 13,50 e 12,06 meses
— estão atingidas nos dois braços, e já estão transcritas no card a partir da primária):
≥ 50% de 612 + ≥ 50% de 614 = **≥ 613 óbitos ≥ 300**. O −1 de imprecisão cairia → **2A**.

**Não apliquei.** O motivo é que essa dedução **cruza duas publicações** (N de uma, medianas de
outra), e C1 não diz se isso vale. É decisão de método → **M16** (§4).

| | valor |
|---|---|
| C1 restrita a uma publicação | **2B** — como está |
| C1 aceita cruzar publicações do mesmo ensaio | **2A** |

---

## 3. Os pedidos que o material **não** resolve

| # | regime | por quê |
|---|---|---|
| 3 | `renal-adj-pembrolizumab` | **O artigo não veio.** KEYNOTE-564, 57 meses (*NEJM* 2024, PMID 38631003). Continua sendo o pedido de maior alavancagem em aberto: decide a linha 1 e depende de M1. |
| 10 | `crc-met-aflibercepte-nao-incorporado` | Veio o artigo de subgrupos, não a primária (*JCO* 2012, PMID **22949147**). **Não usei os subgrupos no lugar da primária.** Falta a contagem de óbitos por braço. |
| 13 | `colon-adj-fluoropirimidina-stageII` | **Dois motivos independentes, qualquer um basta.** (a) **C9 não é aplicável**: o documento **não declara certeza nenhuma** — é análise agrupada de dados individuais de MOSAIC e C-07, não revisão sistemática com GRADE, e C9 limita a certeza ao que a revisão declara. Não havendo declaração, não há teto a aplicar. (b) **Mais decisivo: responde outra pergunta.** O regime é fluoropirimidina adjuvante em EII; o ACCENT testa **acrescentar oxaliplatina à fluoropirimidina** — a fluoropirimidina está nos **dois braços**, exatamente o padrão que tornou `gastrico-met-2l-paclitaxel` indeterminado (RAINBOW). E o achado é **negativo**: *"No OS benefit of adjuvant oxaliplatin was found in high-risk stage II CC"* (HR 1.03, 95% CI 0.82–1.29 para EII). O card segue no Cochrane CD005390 e no 1B. |
| 14 | `eso-def-crt-cisplatina-5fu` | **Nenhum dos dois PDFs é corpo de evidência**, como o manifesto diz e eu confirmei: `esofago-seminario-lancet-2017.pdf` é **Seminar** (narrativo — a própria caixa "Search strategy and selection criteria" diz que há *"more references than this Seminar has room for"*); `esofago-neoadj-vs-definitiva-strahlenther-2018.pdf` declara-se *"This retrospective, single-institutional study"* com 130 pacientes. **Não forcei.** O pedido 14 continua aberto. |

---

## 4. Regras em aberto — nada foi antecipado

Nenhum valor neste adendo foi derivado como se **M1**, **M2** ou **M6** estivessem aceitos. Onde
dependia, estão os dois resultados (§2.2).

**Efeito da repescagem sobre as regras que já estavam na mesa:**

| regra | antes da repescagem | depois |
|---|---|---|
| **M1** (efeito grande) | decidia 4 regimes com RRR ≥ 30% e IC sup 0,87–0,91 | decide **3** — o KEYNOTE-A18 sai (HR final 0,73, RRR 27% < 30% nos dois limiares). **CROSS continua sendo o caso-teste**: IC sup 0,89, decidido por 0,01. |
| **M5** (eventos deduzidos) | ToGA ficava B por ≥ 292 | **resolvido pelo texto, como a recomendação mandava.** As três deduções conferidas nesta rodada (ToGA ≥ 292 → 349; CROSS ≈ 251 → 261; CORRECT ≥ 381 → 432) erraram **todas para baixo**. C1 é conservadora, como anunciado. |
| **M6** (interina sem versão madura) | 4 regimes dependiam | **5** — SPOTLIGHT entra (a SG é interina, não final). E o número de M6 muda: CORRECT tem **432** óbitos, não 381. |
| **M10** (referência corrigida) | 9 indeterminados + 14 C4 + 6 C9 | **+1 troca concreta** (KEYNOTE-426) e **+2 possíveis** (KEYNOTE-811 e A18, se resumo de congresso for aceito). §5. |

**Três itens novos, propostos por esta repescagem:**

| # | item | o que está em jogo | regimes |
|---|---|---|---|
| **M14** | **Imprecisão em ensaio de não inferioridade** — o domínio julga contra o nulo ou contra a margem de NI? | Hofheinz atingiu NI com p=0,0004 contra margem de 12,5%, mas o IC de SG toca o nulo (1,00–2,28) com 93 óbitos. Julgado contra o nulo, é −1 ou −2; julgado contra a margem, a pergunta do ensaio foi respondida. | 1 agora (linha 30). Há outros NI no corpus (REAL-2, NO16968, X-ACT, JCOG0505) que entram nas ondas seguintes. |
| **M15** | **Efeito reportado só como diferença de RMST** — como graduar quando os autores **recusam** o HR por riscos não proporcionais | PRODIGE 23 maduro usa RMST por decisão explícita; o HR existe só na primária, que C4 manda não usar. O schema tem `medida: "diferenca_absoluta"`, mas a convenção de efeito grande e o OIS são pensados para HR. | 1 agora (linha 32); RMST é cada vez mais comum em curativo. |
| **M16** | **C1 cruzando publicações do mesmo ensaio** — vale deduzir eventos com o N de uma publicação e as medianas de outra? | VELOUR: N por braço no artigo de subgrupos (612/614), medianas na primária (13,50 / 12,06). Juntos dão ≥ 613 óbitos e levam 2B → 2A. Separados, não dão nada. | 1 agora (linha 41); o padrão repete sempre que o N vive na primária e o desfecho numa atualização. |

---

## 5. Troca de referência (M10) — o que precisa ser registrado ao promover

Uma troca firme, duas condicionais. **Nenhuma foi aplicada** — M10 é decisão de modelo de dados e
está fora desta rodada.

| regime | `referencia.doi` hoje | `referencia_atualizada` | `referencia.historico[]` | regra |
|---|---|---|---|---|
| `renal-met-intalto-axitinibe-pembrolizumabe` | `10.1016/j.eururo.2023.06.006` | **`10.1038/s41591-025-03867-5`** | `10.1016/j.eururo.2023.06.006` | **C4** — firme |
| `gastrico-met-her2-pembro-tras-qt` | `10.1016/S0140-6736(23)02033-0` | `10.1016/j.annonc.2024.08.1466` | `10.1016/S0140-6736(23)02033-0` | C4 — **só no cenário A** |
| `colo-qrt-io-keynote-a18` | `10.1016/s0140-6736(24)01808-7` | resumo ASCO 2025 LBA5504 (sem DOI próprio) | `10.1016/s0140-6736(24)01808-7` | C4 — **só no cenário A**; nota: o resumo **não tem DOI**, o que é por si um argumento de método |

---

## 6. QUAIS DAS 50 LINHAS DO REFERENDO FICAM DESATUALIZADAS

**Este é o entregável que decide se o Drummond precisa de complemento ou se dá para esperar.**

### 6.1 Firmes — a linha está errada hoje, não depende de nenhuma decisão (**4 linhas**)

| linha | id | diz hoje | passa a | o que o revisor clínico perde se marcar a linha como está |
|---|---|---|---|---|
| **6** | `renal-met-intalto-axitinibe-pembrolizumabe` | 1A → **1B** · "certeza A→B" | 1A → **1A** · "mesmo valor" | marca "concordo" com um **rebaixamento que não existe mais** |
| **16** | `gastrico-adj-crt-5fu-lv` | 1A → **1B** · "certeza A→B" | 1A → **1A** · "mesmo valor" | idem |
| **24** | `gastrico-met-her2-trastuzumabe-qt` | 1A → **1B** · "certeza A→B" | 1A → **1A** · "mesmo valor" | idem — e é o regime de maior uso da lista (padrão HER2) |
| **30** | `retal-neoadj-crt-capecitabina` | 1A → **indet.** · "o pivô registrado não traz efeito" | **deixa de ser indeterminado** (letra em aberto, §2.1) | marca "concordo" com um indeterminado cujo **motivo deixou de valer**; e a seção 3 lhe pede uma DECISÃO ("☐ aguardar texto completo") que **já foi respondida** |

**As três primeiras são da mesma espécie:** o referendo pede ao clínico que concorde com
"certeza A→B", e os três rebaixamentos caíram pelo mesmo motivo (a contagem real de óbitos
atingiu o OIS). São exatamente as três que o pedido previa como "1B → 1A". **Nenhuma muda a
conduta clínica** — o regime continua forte e a favor; o que muda é a letra.

### 6.2 Condicionais — ficam desatualizadas **se** a regra for decidida assim (**5 linhas**)

| linha | id | diz hoje | fica desatualizada se | passa a |
|---|---|---|---|---|
| **12** | `eso-neoadj-crt-carbo-paclitaxel` | 1A → **1B** | **M1** afrouxar o IC sup para ≤ 0,90 | 1A → **1A** |
| **25** | `gastrico-met-her2-pembro-tras-qt` | 1A → **2C** | resumo de congresso **servir** de fonte | 1A → **1A** (salto de 3 letras e volta à força forte) |
| **29** | `gastrico-zolbetuximabe-nao-incorporado` | 1A → **2B** | **M6** não penalizar interina pré-especificada | 1A → **2A** |
| **42** | `crc-met-regorafenibe-nao-incorporado` | 1A → **2B** | **M6** idem | 1A → **2A** |
| **41** | `crc-met-aflibercepte-nao-incorporado` | 1A → **2B** | **M16** aceitar C1 cruzando publicações | 1A → **2A** |

Nas quatro últimas a **direção contra** se mantém — o que muda é a letra, não a recomendação.

### 6.3 Linhas cujo **motivo** muda, mas o **valor** não (**3 linhas**)

O clínico pode marcá-las como estão; o texto da coluna "domínio decisivo" é que fica impreciso.

| linha | id | valor | o que fica impreciso |
|---|---|---|---|
| **29** | `gastrico-zolbetuximabe-nao-incorporado` | 2B sob M6 atual | motivo registrado diz "óbitos não dedutíveis"; são **326**, e o −1 passa a ser pela **interina** |
| **32** | `retal-tnt-folfirinox` | 1B | "N não transcrito" vira fato: **461 (231/230), 98 eventos de SG**; e o HR **não existe por decisão dos autores** |
| **45** | `colo-qrt-io-keynote-a18` | 1B | fonte pode passar à análise final; **sai da dependência de M1** |

### 6.4 Recomendação operacional

**Não interrompa o Drummond.** 4 linhas firmes em 50 (8%), todas na mesma direção — **um
rebaixamento a menos**, nunca um a mais — e nenhuma delas muda conduta: os três regimes de 6.2
continuam **forte · a favor**, e a linha 30 sai de "indeterminado" para "tem valor". O erro de
marcar "concordo" numa linha de 6.1 é marcar concordância com um rebaixamento que vai ser
revertido — custo baixo, e corrigível sem refazer a sessão.

**O que fazer quando ele terminar:** entregar um complemento de **uma página** com as 4 linhas de
6.1 e as 3 notas de 6.3, para rebate. As 5 linhas de 6.2 **não** devem ir ao clínico antes de a
direção decidir M1, M6 e o estatuto de resumo de congresso — mandá-las agora é pedir que ele
concorde duas vezes com a mesma linha.

**Se a sessão dele for ser longa** (dias, não horas), o cálculo inverte: as 4 linhas de 6.1 são
baratas de corrigir **antes** de ele chegar nelas. Linhas 6, 16 e 24 estão nos blocos renal e
esôfago-estômago — início da tabela.

---

## 7. O que continua faltando — próxima rodada de pedidos

Ordenado por impacto, como a lista original.

| ordem | regime | o que falta | DOI · PMID | impacto |
|---|---|---|---|---|
| 1 | `renal-adj-pembrolizumab` (linha 1) | **KEYNOTE-564, 57 meses** — nº de eventos de SLD por braço. Não veio nesta entrega. | `10.1056/nejmoa2312695` · **38631003** | **1B → 1A** se ≥ 300 (ou por M1). Único pedido original que ficou sem nenhum material. |
| 2 | `crc-met-aflibercepte-nao-incorporado` (linha 41) | **VELOUR primária** — contagem de óbitos por braço. O N (612/614) já veio pelos subgrupos. | `10.1200/jco.2012.42.8201` · **22949147** | **2B → 2A** direto, sem depender de M16 |
| 3 | `gastrico-met-her2-pembro-tras-qt` (linha 25) | **Carta ao NEJM** com a SG final — torna a decisão sobre resumo de congresso desnecessária | `10.1056/nejmc2408121` · **39282917** | **2C → 1A** sem ressalva de proveniência |
| 4 | `colo-qrt-io-keynote-a18` (linha 45) | **Publicação de texto completo** da análise final (o resumo ASCO não tem DOI nem contagem de eventos) | — | mantém 1B, mas com fonte citável |
| 5 | `eso-def-crt-cisplatina-5fu` (linha 13) | **Corpo de evidência** para QRT definitiva de esôfago. A Cochrane Wong 2006 foi retirada; nenhum dos 2 PDFs serve. | — | 1B → 1A se corpo alta. **Precisa de indicação do revisor** — não há candidato. |
| 6 | `colon-adj-fluoropirimidina-stageII` (linha 33) | **Corpo com GRADE** para fluoropirimidina vs observação em EII de alto risco. O ACCENT não serve (§3). A Cochrane CD005390 é de 2008 e não gradua. | — | 1B → 1A se corpo alta. **Precisa de indicação do revisor.** |
| 7 | `gastrico-met-zolbetuximabe` (linha 29) | **SG final do SPOTLIGHT** (prevista para 396 óbitos; a publicada tem 326) — dispensa M6 | — | 2B → 2A sem depender de regra |
| 8 | `crc-met-regorafenibe-nao-incorporado` (linha 42) | **Versão madura do CORRECT** — segue não localizada, como o manifesto diz | — | 2B → 2A sem depender de M6 |

**Decisões de método que não são pedido de artigo** (vão ao revisor metodológico, não à busca):
M1 · M6 · **estatuto de resumo de congresso como fonte** · **M14** (NI e imprecisão) · **M15**
(RMST) · **M16** (C1 cruzando publicações).

---

## 8. Divergência com o MANIFESTO.md

Uma, pequena, e registrada aqui como manda o protocolo.

O manifesto diz do `velour-subgrupos-ejc-2014-NAO-E-A-PRIMARIA.pdf`:
> *"Não traz N e óbitos por braço do ensaio inteiro."*

**O N por braço do ensaio inteiro está lá** — *"1226 [randomised to] either aflibercept (612
patients) or placebo (614 patients)"*, repetido na linha `All patients` das tabelas de subgrupo.
O que não está são os **óbitos** por braço. A conclusão do manifesto (**o pedido 10 continua
aberto**) permanece correta — a divergência é só na extensão do que falta, e tem consequência:
com o N, a dedução C1 passa a ser possível em princípio (§2.3, M16).

**Tudo o mais do manifesto conferiu**, incluindo os quatro arquivos cujo nome não diz o que são, e
incluindo os três documentos de apoio que eu verifiquei não serem corpo de evidência (§3).
