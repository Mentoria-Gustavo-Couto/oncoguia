# PEDIDOS DE ARTIGO — lista única, ordenada por impacto (4 ondas, 50 regimes)

**Data:** 2026-09-18 · **Protocolo:** PDF em `squads/mbe-oncologia/pipeline/data/artigos-fornecidos/<PMID>.pdf`; repescagem transcreve com
`fonte_transcricao = pdf_fornecido_revisor` + `proveniencia = "PDF fornecido pelo revisor metodológico, conferido contra DOI <x>"`, como passo
próprio após as ondas. Histórico por onda em `_PEDIDOS-por-onda-historico.md`.

**Atualização 2026-10-05 — repescagem.** Chegaram 19 PDFs; a coluna **estado** registra o que cada
pedido virou. As colunas originais (**o que falta**, **impacto**) são de 2026-09-18 e ficam como
estavam, para histórico — onde a repescagem contradiz a previsão, quem vale é a coluna estado.
Transcrições, frases literais e a lista das linhas do referendo que ficam desatualizadas estão em
`ADENDO-ARTIGOS.md`. Nada foi aplicado aos JSON das ondas nem promovido.

**Impacto** = o que muda de valor se o artigo abrir. **Só PDF** = sem abstract na escada (carta/suplemento); os demais são textos completos
cujo abstract já foi lido — o que falta é a contagem de eventos/IC. Os itens de **DECISÃO** (qual ensaio sustenta o regime) não são pedidos de
artigo: estão no REFERENDO-CLINICO §3 e só depois viram busca.

| ordem | regime | artigo | DOI · PMID | o que falta | impacto | estado (repescagem 2026-10-05) |
|---|---|---|---|---|---|---|
| 1 | `gastrico-met-her2-trastuzumabe-qt` | ToGA (Lancet 2010) | 10.1016/S0140-6736(10)61121-X · 20728210 | contagem de óbitos por braço (dedução dá ≥ 292; limiar 300) | **1B → 1A** (padrão HER2 — o de maior uso na lista) | **RESOLVIDO** 05/10 — 349 óbitos (167+182, fig. 2A). OIS atingido → **1B → 1A** (firme) |
| 2 | `gastrico-met-her2-pembro-tras-qt` | KEYNOTE-811 análise final — **carta NEJM 2024** | 10.1056/nejmc2408121 · 39282917 | **só PDF**: SG final | **2C → 1B** se SG significativa (hoje C por substituto + interina) | **RESOLVIDO COM RESSALVA** 05/10 — veio o resumo ESMO 2024 (1400O), não a carta. SG final HR 0,80 (0,67–0,94). **2C → 1A** se resumo servir de fonte; **2C** se não. Carta NEJM **continua pedida** |
| 3 | `renal-adj-pembrolizumab` | KEYNOTE-564, 57 m (NEJM 2024) | 10.1056/nejmoa2312695 · 38631003 | nº de eventos de SLD por braço | **1B → 1A** se ≥ 300 (ou por M1) | **NÃO VEIO** 05/10 — segue pedido; maior alavancagem em aberto |
| 4 | `gastrico-adj-crt-5fu-lv` | INT0116 (Smalley 2012) | 10.1200/JCO.2011.36.7136 · 22585691 | nº de óbitos por braço (texto PMC sem taxas) | **1B → 1A** | **RESOLVIDO** 05/10 — 438 óbitos (209+229, fig. 2A). OIS atingido → **1B → 1A** (firme) |
| 5 | `retal-neoadj-crt-capecitabina` | Hofheinz 2012 (Lancet Oncol) | 10.1016/S1470-2045(12)70116-X · 22503032 | HR/IC de SG e SLD (abstract só tem taxas por braço) | **indet. → B/A** — único indeterminado que o artigo resolve sozinho | **RESOLVIDO COM RESSALVA** 05/10 — SG HR 1,50 (1,00–2,28), 93 óbitos; SLD HR 1,4 (1,02–2,02). **Sai de indeterminado**; letra em aberto (M14: imprecisão em ensaio de NI) |
| 6 | `renal-met-intalto-axitinibe-pembrolizumabe` | KEYNOTE-426, 43 m (Eur Urol 2023) | 10.1016/j.eururo.2023.06.006 · 37500340 | contagem de óbitos por braço | **1B → 1A** | **RESOLVIDO** 05/10 — veio o seguimento de **5 anos** (Nat Med 2025), que por C4 **substitui**: 550 óbitos (270+280), HR 0,84 (0,71–0,99) → **1B → 1A** (firme). Troca de referência: M10 |
| 7 | `eso-neoadj-crt-carbo-paclitaxel` | CROSS 10 anos (JCO 2021) | 10.1200/jco.20.03614 · 33891478 | contagem de óbitos (dedução ≈ 251) | **1B → 1A** só se M1 relaxar o IC sup (RRR já é 30%) — senão nada | **CONTAGEM RESOLVIDA** 05/10 — 261 óbitos (117+144), ainda < 300. Valor **depende de M1**: 1B (IC sup ≤ 0,85) / 1A (≤ 0,90). Caso-teste da convenção |
| 8 | `retal-tnt-folfirinox` | PRODIGE 23, 7 anos (Ann Oncol 2024) | 10.1016/j.annonc.2024.06.019 · 38986769 | HR de SG/SLD e N por braço (abstract só tem RMST) | 1B → 1B/1A (depende do HR) | **PARCIAL** 05/10 — N 461 (231/230) e 98 eventos de SG transcritos; **o HR não existe no documento** (autores recusam por riscos não proporcionais e usam RMST). Valor **inalterado 1B**. Abre M15 |
| 9 | `gastrico-zolbetuximabe-nao-incorporado` | SPOTLIGHT (Lancet 2023) | 10.1016/S0140-6736(23)00620-7 · 37068504 | nº de óbitos / medianas de SG — ou a SG final (ASCO 2024, não indexada) | 2B → 2A (direção contra mantida) | **RESOLVIDO COM ACHADO** 05/10 — 326 óbitos (149+177); mas a análise de SG é **interina**, não final (o card registra "final"). Valor **depende de M6**: 2B / 2A. SG final (396 óbitos) **passa a ser pedida** |
| 10 | `crc-met-aflibercepte-nao-incorporado` | VELOUR primária (JCO 2012) | 10.1200/jco.2012.42.8201 · 22949147 | N e óbitos por braço | 2B → 2A (contra mantida) | **PARCIAL** 05/10 — veio o artigo de **subgrupos** (Eur J Cancer), não a primária. N por braço sim (612/614), óbitos não. **Pedido continua aberto**. Com o N, C1 daria ≥ 613 e 2A — mas cruza publicações (M16) |
| 11 | `crc-met-regorafenibe-nao-incorporado` | CORRECT (Lancet 2013) | 10.1016/S0140-6736(12)61900-X · 23177514 | versão madura (não localizada) — ou M6 aceita a interina com ≥ 381 óbitos | 2B → 2A (contra mantida) | **NÃO RESOLVE SOZINHO** 05/10 — o PDF é a primária, que já era a fonte, como o manifesto diz. **Corrige a contagem: 432 óbitos** (o card deduzia ≥ 381). Valor **depende de M6**: 2B / 2A. Versão madura segue não localizada |
| 12 | `colo-qrt-io-keynote-a18` | KEYNOTE-A18 — análise final de SG (ainda não publicada) | — | quando sair; hoje 2ª interina | 1B → 1A (com M1) | **REABERTO E RESOLVIDO COM RESSALVA** 05/10 — a análise final existe (resumo ASCO 2025 LBA5504): OS HR 0,73 (0,57–0,94). **1B nos dois cenários**; o regime **sai da dependência de M1** (RRR 27% < 30%). Texto completo passa a ser pedido |
| 13 | `colon-adj-fluoropirimidina-stageII` | corpo mais recente para adjuvância em EII de alto risco (Cochrane CD005390 é de 2008, sem grau) | — | revisão com GRADE, se o revisor indicar | 1B → 1A se corpo alta | **NÃO RESOLVIDO** 05/10 — o ACCENT (JCO 2024) **não serve**, por dois motivos independentes: não declara certeza (C9 inaplicável) e responde outra pergunta (fluoropirimidina nos dois braços; achado negativo para oxaliplatina, HR 1,03). Corpo com GRADE **continua pedido** |
| 14 | `eso-def-crt-cisplatina-5fu` | meta-análise de QRT vs RT em esôfago (Cochrane Wong 2006 retirada; nenhuma na escada) | — | corpo, se o revisor indicar | 1B → 1A se corpo alta | **NÃO RESOLVIDO** 05/10 — os 2 PDFs são seminário narrativo e série retrospectiva de 130 pacientes. Nenhum é corpo de evidência. **Continua pedido** |

Sem pedido (dado completo ou juízo, não dado): FLOT4, CheckMate 577/649/025/9ER/214 int-alto, CLASSIC, NO16968, anti-EGFR (corpo), KEYNOTE-177,
SUNLIGHT, KEYNOTE-826, EMPOWER, GOG-240, TAGS, COUGAR-02/docetaxel (corpo), irinotecano (corpo), RTOG 85-01 (N pequeno), ASPEN (IC 80% por desenho),
DESTINY-Gastric01 e FOLFOXIRI (indiretas de juízo), pazopanibe (COMPARZ; SG final é carta), sunitinibe, ramucirumabe, bevacizumabe CRC/colo.

**Resolvidos pela calibração (não pedir mais):** CheckMate 214 ×2, 9ER, 025, METEOR, sunitinibe/IFN (C1/C4).

---

## Pedidos NOVOS abertos pela repescagem (2026-10-05)

Não estavam na lista de 2026-09-18. Ordenados por impacto, no mesmo critério.

| ordem | regime | artigo | o que falta | impacto |
|---|---|---|---|---|
| 15 | `gastrico-zolbetuximabe-nao-incorporado` | **SPOTLIGHT — SG final** (planejada para 396 óbitos; a publicada tem 326, e é interina) | análise final de SG | **2B → 2A sem depender de M6** |
| 16 | `colo-qrt-io-keynote-a18` | **KEYNOTE-A18 — texto completo da análise final** (hoje só o resumo ASCO 2025 LBA5504, sem DOI nem contagem de eventos) | publicação citável; nº de eventos de SG | mantém 1B, mas com fonte revisada por pares |

## Decisões de método que a repescagem abriu (vão ao revisor metodológico, não à busca)

Não são pedidos de artigo — nenhum artigo as resolve. Detalhe em `ADENDO-ARTIGOS.md` §4.

- **Estatuto de resumo de congresso como fonte do card** — decide os pedidos 2 e 12.
- **M14** — imprecisão em ensaio de **não inferioridade**: julgar contra o nulo ou contra a margem? (pedido 5)
- **M15** — efeito reportado **só como diferença de RMST**, com o HR recusado pelos autores (pedido 8)
- **M16** — **C1 cruzando publicações** do mesmo ensaio: N de uma, medianas de outra (pedido 10)

**Correção factual no REFERENDO-METODOLOGICO:** a justificativa de M6 cita "CORRECT: 381 óbitos".
São **432** (literal no texto; 381 era a dedução conservadora de C1). O argumento de M6 não muda.

