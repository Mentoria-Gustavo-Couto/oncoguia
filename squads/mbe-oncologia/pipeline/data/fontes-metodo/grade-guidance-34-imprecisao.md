<!-- Extrato de fonte canônica. Zeng L, Brignardello-Petersen R, Hultcrantz M, Mustafa RA, Murad MH,
     Iorio A, Traversy G, Akl EA, Mayer M, Schünemann HJ, Guyatt GH, for the GRADE Working Group.
     "GRADE Guidance 34: update on rating imprecision using a minimally contextualized approach."
     J Clin Epidemiol 2022;150:216–224. DOI 10.1016/j.jclinepi.2022.07.014. PMID 35934265.
     Acesso em 2026-10-06. Licença CC BY no site da editora, mas o PDF não foi obtido (Elsevier
     devolve 403 ao bot). O abstract abaixo é integral, transcrito do Europe PMC (resultType=core)
     e conferido contra o Crossref. PDF pedido à direção: ver PEDIDOS-DE-FONTE.md. -->

# Fonte (e) — GRADE Guidance 34: atualização da imprecisão (2022)

**Papel na hierarquia:** 1º nível, e **posterior** a guidelines 6 (2011) no mesmo domínio. Não
estava no pedido desta rodada; entrou porque o Handbook declara a própria seção de imprecisão
superada e porque esta é a atualização oficial exatamente da regra em disputa.

**Estado:** só o **abstract**. Ele já contém a frase operativa, e ela é suficiente para
**derrubar** a convenção do squad — mas **não** é suficiente para *escrever o substituto*. A
rodada de limiares precisa do texto completo (Table 1 e os cenários de −2/−3 estão no corpo).

## Abstract integral (transcrição literal, Europe PMC)

> **Objectives**
> The aim of this study is to provide updated guidance on when The Grading of Recommendations
> Assessment, Development and Evaluation (GRADE) users should consider rating down more than one
> level for imprecision using a minimally contextualized approach.
>
> **Study design and setting**
> Based on the first GRADE guidance addressing imprecision rating in 2011, a project group within
> the GRADE Working Group conducted iterative discussions and presentations at GRADE Working Group
> meetings to produce this guidance.
>
> **Results**
> GRADE suggests aligning imprecision criterion for systematic reviews and guidelines using the
> approach that relies on thresholds and confidence intervals (CI) of absolute effects as a primary
> criterion for imprecision rating (i.e., CI approach). Based on the CI approach, when a CI
> appreciably crosses the threshold(s) of interest, one should consider rating down two or three
> levels. **When the CI does not cross the threshold(s) and the relative effect is large, one should
> implement the optimal information size (OIS) approach. If the sample size of the meta-analysis is
> far less than the OIS, one should consider rating down more than one level for imprecision.**
>
> **Conclusion**
> GRADE provides updated guidance for imprecision rating in a minimally contextualized approach,
> with a focus on the circumstances in which one should seriously consider rating down two or three
> levels for imprecision.

## Por que esta frase é decisiva

A convenção do squad dizia: *efeito grande dispensa o rebaixamento por imprecisão.*

A atualização oficial diz o contrário, na mesma situação: **IC que não atravessa o limiar + efeito
relativo grande é precisamente o gatilho para APLICAR o OIS** — e amostra muito abaixo do OIS pede
rebaixar **mais de um nível**, não zero.

Nas três fontes de 1º nível o movimento é o mesmo e a convenção do squad é o inverso dele:

| fonte | o que diz sobre efeito grande + poucos eventos |
|---|---|
| guidelines 6 (2011), Box 3 | é o caso-exemplo de **fragilidade**; a conclusão da fonte é desconfiar |
| Handbook (2013), §5.2.4.1 | "may be because of prognostic imbalance and **warrant caution**" |
| Guidance 34 (2022) | efeito relativo grande **aciona** o OIS; longe do OIS, rebaixar **mais** de um nível |

## Mudança de eixo que a rodada de limiares vai ter de absorver

A Guidance 34 move o critério primário para o **IC do efeito ABSOLUTO contra limiares**
("thresholds and confidence intervals (CI) of absolute effects as a primary criterion"), e
**alinha** revisão sistemática e diretriz, que guidelines 6 tratava com critérios separados. O
schema 2 do eixo `grade` hoje só grava `efeito.ic95` da medida relativa (HR/RR/OR) e não tem campo
de limiar. Isso é um buraco de **esquema**, não de valor — está registrado como pendência no
relatório desta rodada, não corrigido aqui.
