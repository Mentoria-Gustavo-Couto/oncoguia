# Manifesto das fontes de MÉTODO — canônicas do GRADE

Esta pasta guarda as fontes **canônicas** de onde saem os limiares do eixo `grade`: a série
GRADE guidelines/guidance, o GRADE Handbook, a base empírica da interrupção precoce e o manual
institucional do Ministério da Saúde. Ela existe porque, até 2026-10-06, nenhuma regra de
calibração do squad apontava para um documento — e uma convenção criada pelo próprio squad
("efeito grande" = RRR ≥ 30% com IC sup ≤ 0,85) governou a letra de cinco regimes por semanas.

**Diferença em relação a `pipeline/data/guia-*.md`:** aqueles são as **fichas MBE da direção**
(conversão de `.docx` de 2026-09-17, base declarada Guyatt, *Users' Guides*, 3ª ed.). São
operacionalização de apoio. O que está aqui é a fonte primária do método — e **em conflito, o
que vale é esta pasta**. A hierarquia está escrita em
`agents/verificador-evidencia.agent.md` ("Hierarquia de fontes").

## Versionamento

Mesma regra dos artigos de `artigos-fornecidos/` e das `fontes/` das ondas: **o texto integral
não entra no repositório**; o que se versiona é este manifesto e, por documento, um `.md` com
as **frases literais** que sustentam cada regra (é a mesma disciplina da `efeito.transcricao`,
aplicada ao método em vez de ao dado). Exceção: o manual do MS é **CC BY-NC-SA 4.0** e autoriza
reprodução — mesmo assim só as seções usadas entram, para o arquivo continuar legível.

Regra no `.gitignore`: `squads/mbe-oncologia/pipeline/data/fontes-metodo/*` com exceção de
`MANIFESTO.md` e dos `*.md` de extrato.

## Os documentos

| # | documento | autores / editores | publicação | DOI / URL | acesso | licença | estado |
|---|---|---|---|---|---|---|---|
| a | GRADE guidelines 6. Rating the quality of evidence — imprecision | Guyatt GH, Oxman AD, Kunz R, Brozek J, Alonso-Coello P, Rind D, Devereaux PJ, Montori VM, Freyschuss B, Vist G, Jaeschke R, Williams JW Jr, Murad MH, Sinclair D, Falck-Ytter Y, Meerpohl J, Whittington C, Thorlund K, Andrews J, Schünemann HJ | *J Clin Epidemiol* 2011;64(12):1283–1293 | [10.1016/j.jclinepi.2011.01.012](https://doi.org/10.1016/j.jclinepi.2011.01.012) · PMID 21839614 | 2026-10-06 | © 2011 Elsevier Inc. — todos os direitos reservados (cópia OA de repositório de curso) | **obtido**, 18 p. → `guyatt-2011-grade-guidelines-6-imprecision.pdf`, extrato em `grade-guidelines-6-imprecisao.md` |
| a′ | Corrigendum to GRADE guidelines 6 | (idem) | *J Clin Epidemiol* 2021;137:265 | [10.1016/j.jclinepi.2021.04.014](https://doi.org/10.1016/j.jclinepi.2021.04.014) · PMID 34174652 | 2026-10-06 | © Elsevier | **PDF não obtido** (editora devolve 403 ao bot). Conteúdo da correção conferido por duas vias independentes e registrado em `grade-guidelines-6-imprecisao.md` §correção. **PDF pedido à direção.** |
| b | GRADE Handbook for grading quality of evidence and strength of recommendations | Schünemann H, Brożek J, Guyatt G, Oxman A (eds.) | The GRADE Working Group, atualizado em outubro de 2013 | <https://gdt.gradepro.org/app/handbook/handbook.html> | 2026-10-06 | © The GRADE Working Group — sem licença aberta declarada na página | **obtido**, HTML integral (566 kB) → `grade-handbook-2013.html`, extrato em `grade-handbook-certeza.md` |
| b′ | GRADE Book (substitui o Handbook desde 2024) | GRADE Working Group | <https://book.gradepro.org/> | capítulo de imprecisão: `/guideline/imprecision` | 2026-10-06 | não declarada | **não obtido** — a página é aplicação JavaScript e não devolve texto a fetch. O próprio Handbook avisa: *"Section 5.2 has been updated in the new GRADE Book"*. **Pedido à direção** (ver `PEDIDOS-DE-FONTE.md`). |
| c | Stopping Randomized Trials Early for Benefit and Estimation of Treatment Effects: Systematic Review and Meta-regression Analysis | Bassler D, Briel M, Montori VM, Lane M, Glasziou P, Zhou Q, Heels-Ansdell D, Walter SD, Guyatt GH, *et al.* | *JAMA* 2010;303(12):1180–1187 | [10.1001/jama.2010.310](https://doi.org/10.1001/jama.2010.310) | 2026-10-06 | © 2010 American Medical Association | **PDF não obtido** (paywall JAMA; Unpaywall `is_oa=false`). Título, citação, Resultados e Conclusões transcritos do abstract público em `bassler-2010-interrupcao-precoce.md`. **PDF pedido à direção.** |
| d | Diretrizes metodológicas: Sistema GRADE — manual de graduação da qualidade da evidência e força de recomendação para tomada de decisão em saúde | Ministério da Saúde, Secretaria de Ciência, Tecnologia e Insumos Estratégicos, Departamento de Ciência e Tecnologia | Brasília-DF, 2014 | <https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/sistema-grade.pdf> · espelho BVS/MS | 2026-10-06 | **CC BY-NC-SA 4.0** — *"É permitida a reprodução parcial ou total desta obra, desde que citada a fonte"* | **obtido**, 1,4 MB → `ms-conitec-2014-sistema-grade.pdf`, extrato em `ms-conitec-sistema-grade.md` |

### Encontrados nesta rodada e não previstos no pedido

Os dois entram porque **atualizam exatamente o domínio em disputa** (imprecisão) e porque o
próprio Handbook declara a sua seção 5.2 superada. Ignorá-los seria repetir o defeito que esta
rodada corrige: aplicar regra por leitura parcial.

| # | documento | publicação | DOI | licença | estado |
|---|---|---|---|---|---|
| e | GRADE Guidance 34: update on rating imprecision using a minimally contextualized approach | *J Clin Epidemiol* 2022;150:216–224 | [10.1016/j.jclinepi.2022.07.014](https://doi.org/10.1016/j.jclinepi.2022.07.014) · PMID 35934265 | **CC BY** no site da editora | **PDF não obtido** (Elsevier 403 ao bot, apesar da licença aberta). Abstract integral transcrito do Europe PMC em `grade-guidance-34-imprecisao.md` — e ele já contém a frase operativa. **PDF pedido à direção.** |
| f | GRADE guidance 35: update on rating imprecision for assessing contextualized certainty of evidence and making decisions | *J Clin Epidemiol* 2022;150:225–242 | [10.1016/j.jclinepi.2022.07.015](https://doi.org/10.1016/j.jclinepi.2022.07.015) | CC BY (repositório institucional AUB) | **obtido**, 24 p. → `schunemann-2022-grade-guidance-35.pdf`. Não usado como `fonte` de nenhuma regra nesta rodada — fica adquirido para a rodada de limiares. |

## Conferência

Cada PDF foi aberto e a primeira página lida para confirmar título, periódico, volume e ano
antes de ser nomeado — nenhum nome foi atribuído por semelhança de nome de arquivo. O
`grade-handbook-2013.html` foi conferido pela árvore de seções (5.2.4 Imprecision, 5.3.1 Large
magnitude of an effect, 6.1.1 Strong recommendation), que é o que as regras citam.

## O que falta

Ver `PEDIDOS-DE-FONTE.md` nesta pasta: 4 documentos (a′, b′, c, e). Nenhum deles muda uma regra
que esta rodada classificou como **TEM FONTE**; dois deles (b′, e) podem endurecer regras que
esta rodada classificou como órfãs, e é por isso que o pedido existe.
