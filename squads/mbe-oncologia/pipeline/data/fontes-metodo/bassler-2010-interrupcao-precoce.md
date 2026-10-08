<!-- Extrato de fonte canônica. Bassler D, Briel M, Montori VM, Lane M, Glasziou P, Zhou Q,
     Heels-Ansdell D, Walter SD, Guyatt GH, et al. "Stopping Randomized Trials Early for Benefit
     and Estimation of Treatment Effects: Systematic Review and Meta-regression Analysis."
     JAMA 2010;303(12):1180–1187. DOI 10.1001/jama.2010.310. © 2010 American Medical Association.

     ESTADO: TEXTO COMPLETO NA MÃO desde 2026-10-07 (PDF fornecido pela direção, pedido 4).
     Arquivo: bassler-2010-jama-interrupcao-precoce.pdf — 9 páginas, md5
     9ae28895dc31ddc6874f404960fa6220. Confirmado pela primeira página antes de ser citado: é a
     reimpressão JAMA com o título completo, "JAMA. 2010;303(12):1180-1187
     (doi:10.1001/jama.2010.310)" e a autoria "Dirk Bassler; Matthias Briel; Victor M. Montori;
     et al.". Até 2026-10-06 este arquivo tinha só o abstract público.

     NORMALIZAÇÃO DE GLIFO, e nada além disso: o PDF serve os sinais de menor e maior como "⬍" e
     "⬎"; nas transcrições abaixo viraram "<" e ">". Nenhuma palavra foi alterada.

     A primeira página traz a linha de template "Correction / Contact me if this article is
     corrected." — é formulário do site da JAMA, não aviso de errata. Nenhuma correção consta. -->

# Fonte (c) — Bassler 2010: interrupção precoce por benefício

**Papel na hierarquia:** base **empírica** do rebaixamento por análise interina (regra C4 do squad).
É a referência **[5]** de GRADE guidelines 6 §7 — não é fonte paralela: é exatamente a evidência que
a guidance cita quando diz que ensaio interrompido superestima efeito.

**Estado:** texto completo. O que o abstract dava era a direção; o corpo dá a **meta-regressão** —
qual variável prediz o viés e qual não prediz — e é isso que o referendo metodológico pedia.

## Citação

Bassler D, Briel M, Montori VM, Lane M, Glasziou P, Zhou Q, Heels-Ansdell D, Walter SD,
Guyatt GH, *et al.* **Stopping Randomized Trials Early for Benefit and Estimation of Treatment
Effects: Systematic Review and Meta-regression Analysis.** *JAMA.* 2010;303(12):1180–1187.
DOI [10.1001/jama.2010.310](https://doi.org/10.1001/jama.2010.310).

Escopo analisado: **91 ensaios truncados** e **424 ensaios não truncados** correspondentes, sobre
**63 perguntas** de pesquisa.

## 1. Frases literais do abstract (mantidas do extrato anterior)

Resultados:

> "the pooled ratio of relative risks in truncated RCTs vs matching nontruncated RCTs was 0.71
> (95% confidence interval, 0.65-0.77)"

> "large differences in treatment effect size between truncated and nontruncated RCTs (ratio of
> relative risks <0.75) occurred with truncated RCTs having fewer than 500 events"

> "the pooled effects of the nontruncated RCTs failed to demonstrate significant benefit"
> — em 39 das 63 perguntas (62%).

Conclusões:

> "Truncated RCTs were associated with greater effect sizes than RCTs not stopped early. This
> difference was independent of the presence of statistical stopping rules and was greatest in
> smaller studies."

## 2. Corpo — Comment, "Summary of Findings" (o que o abstract não dava)

> "In this empirical study including 91 truncated RCTs and 424 matching nontruncated RCTs addressing
> 63 questions, we found that truncated RCTs provide biased estimates of effects on the outcome that
> precipitated early stopping."

> "This implies that, for instance, if the RR from the nontruncated RCTs was 0.8 (a 20% relative risk
> reduction), the RR from the truncated RCTs would be on average approximately 0.57 (a 43% relative
> risk reduction, more than double the estimate of benefit)."

> "Nontruncated RCTs with no evidence of benefit—ie, with an RR of 1.0—would on average be associated
> with a 29% relative risk reduction in truncated RCTs addressing the same question."

> "This heterogeneity could be partially explained by the total number of outcome events in the
> truncated RCTs, with larger differences between truncated and nontruncated RCTs in studies with a
> smaller number of events."

> "**The methodological quality and the presence of a statistical stopping rule failed to predict the
> observed difference in the treatment effect.**"

A última é a frase operativa para a C4 e vem do corpo, não do abstract: ela fecha a porta ao
argumento "mas o ensaio tinha regra de parada pré-especificada, então o efeito é confiável".

## 3. Corpo — Resultados da meta-regressão

> "In the univariable models, both the number of events (P<.001) and the presence of a statistical
> stopping rule (P=.02) were significant. When we included both variables in the model, only the
> number of events remained significant (P <.001)."

> "The results from the multilevel meta-regression confirmed significant interactions between the
> combined variable (truncated vs nontruncated RCT) and the number of events (P<.001)."

> "The multilevel meta-regression analysis using the entire data set demonstrated that neither
> concealment of allocation (P=.96) nor blinding (P=.32) were significant predictors of the
> differences in treatment effect size."

**Table 2** — *Meta-regression Model Investigating the Predictors of the Log[Ratio of Relative
Risks]*, com `log[ratio of relative risks]` como variável dependente, sobre as 63 perguntas:

| variável independente | β (IC 95%) univariável | P | R² | β (IC 95%) multivariável | P | R² |
|---|---|---|---|---|---|---|
| Stopping rule | 0,14 (0,02 a 0,27) | ,02 | 0,08 | 0,07 (−0,05 a 0,19) | ,24 | — |
| Additional No. of events in the truncated RCT (unit = 100 events) | 0,02 (0,01 a 0,03) | <,001 | 0,23 | 0,02 (0,01 a 0,02) | ,001 | 0,24 |

Nota **c** da Table 2, transcrição literal:

> "Given a mean ratio of 0.71, the addition of each 100, 500, 1000, or 1714 events to the truncated
> RCT would result in a new ratio of 0.72, 0.78, 0.87, or 1.00, respectively."

Ou seja: pelo modelo, o viés só desaparece (razão = 1,00) com **+1.714 eventos**.

## 4. Corpo — Figura 3, legenda integral (o gradiente por número de eventos)

> "The size of each bubble is proportional to the magnitude of the inverse of the variance of the
> ratio of RR in the log scale. The dashed line indicates a ratio of RR of 0.71; the dotted line, a
> ratio of RR of 1.00. The shaded areas numbered 1 through 3 correspond to different degrees of
> overestimates of effect (ratios of RRs, 0.05-0.5; 0.5-0.75; 0.75-1.00): in area 1, very large
> overestimation (ratio of RR, 0.37; 95% confidence interval [CI], 0.31-0.44; P<.001) occurred in
> truncated trials with fewer than 200 events. In area 2, large overestimation (ratio of RR, 0.65;
> 95% CI, 0.56-0.77; P<.001) occurred in truncated trials stopped between 200 and 500 events. In
> area 3, truncated trials with more than 500 events led to moderate overestimation (ratio of RR,
> 0.88; 95% CI, 0.80-0.96; P=.003)."

| área | eventos no ensaio truncado | razão de RR (IC 95%) | P |
|---|---|---|---|
| 1 | < 200 | 0,37 (0,31–0,44) | <,001 |
| 2 | 200 a 500 | 0,65 (0,56–0,77) | <,001 |
| 3 | > 500 | 0,88 (0,80–0,96) | ,003 |

Note que até a área 3 — mais de 500 eventos — ainda superestima, e de forma estatisticamente
significativa. Não há faixa de eventos em que o viés desapareça nos dados.

## 5. Corpo — limites que os autores declaram

> "Our literature search, while extensive, missed some truncated RCTs. Assessment of the 2488 RCTs
> included in the systematic reviews revealed 22 additional truncated RCTs not initially identified.
> Whether results would differ in other unidentified truncated RCTs remains speculative."

> "We found substantial heterogeneity in our analysis of the pooled ratio of RRs for truncated vs
> nontruncated RCTs, suggesting that differences between truncated and nontruncated RCT effects will
> differ across study questions."

E a resposta dos autores à objeção de que parada precoce não prova viés no caso particular:

> "We support this statement; unfortunately, neither do we know that the stopped-early result is
> close to the truth. Our findings suggest that often it is not."

## 6. O que isto sustenta — e, principalmente, o que NÃO sustenta

**Sustenta** (C4, "interina rebaixa"), agora em primeira mão: há base empírica para tratar análise
interina sem versão mais madura como motivo de rebaixamento, e a base é maior do que o abstract
mostrava — a regra de parada pré-especificada **não** prediz o viés no modelo multivariável
(P=,24), e a qualidade metodológica também não.

**Sustenta** o perfil que a rodada vinha observando: a magnitude do viés é maior em estudo menor, e
o gradiente por eventos é monotônico (áreas 1→3).

**NÃO sustenta — e esta é a parte que precisa estar escrita, porque é a tentação desta rodada:**

- **Nenhum limiar de eventos para regra do squad.** As áreas 1/2/3 (200 e 500 eventos) são faixas
  descritivas de um gráfico de dispersão, não critério GRADE. Converter "razão de RR 0,37 abaixo de
  200 eventos" em "−2 níveis abaixo de 200 eventos" seria **exatamente** o mecanismo que criou a
  convenção aposentada: um número plausível tirado de uma fonte real, com uma função que a fonte não
  lhe dá. Bassler mede **viés de estimativa**; quantos níveis o GRADE rebaixa é decisão de uma
  *guidance*, não de um estudo empírico. Para fixar limiar de eventos seria preciso uma guidance que
  o fixasse — e nenhuma das fontes de 1º nível desta pasta o faz.
- **Nenhum limiar de "efeito grande"**, nenhum piso de eventos, e nenhuma dispensa de rebaixamento.
- **Não decide o domínio.** O artigo é sobre estimativa de efeito, não sobre onde o GRADE pendura a
  penalidade. O manual do MS lista interrupção precoce no Quadro 6, item 5 — **limitações do estudo**
  (risco de viés), não imprecisão. Ver `ms-conitec-sistema-grade.md`. As duas leituras têm fonte; o
  que não tem fonte é contar duas vezes. Disputa registrada para o referendo, não movida aqui.
