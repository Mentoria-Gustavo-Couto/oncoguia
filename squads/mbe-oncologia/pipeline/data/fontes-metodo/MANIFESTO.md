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
| a′ | Corrigendum to GRADE guidelines 6 | (idem) | *J Clin Epidemiol* 2021;137:265 | [10.1016/j.jclinepi.2021.04.014](https://doi.org/10.1016/j.jclinepi.2021.04.014) · PMID 34174652 | 2026-10-06 | © Elsevier | **PDF não obtido** (editora devolve 403 ao bot) e **pedido ENCERRADO POR IRRELEVÂNCIA em 2026-10-07**, por decisão da direção: o conteúdo da correção já estava conferido por duas vias independentes e registrado em `grade-guidelines-6-imprecisao.md` §correção, e o que ela corrige é limiar de **desfecho contínuo** (400 → 800 por grupo), que não toca regime nosso. Não é pendência. |
| b | GRADE Handbook for grading quality of evidence and strength of recommendations | Schünemann H, Brożek J, Guyatt G, Oxman A (eds.) | The GRADE Working Group, atualizado em outubro de 2013 | <https://gdt.gradepro.org/app/handbook/handbook.html> | 2026-10-06 | © The GRADE Working Group — sem licença aberta declarada na página | **obtido**, HTML integral (566 kB) → `grade-handbook-2013.html`, extrato em `grade-handbook-certeza.md` |
| b′ | GRADE Book (substitui o Handbook desde 2024) | GRADE Working Group | <https://book.gradepro.org/> | capítulo de imprecisão: `/guideline/imprecision` | 2026-10-06 | não declarada | **não obtido** — a página é aplicação JavaScript e não devolve texto a fetch. O próprio Handbook avisa: *"Section 5.2 has been updated in the new GRADE Book"*. **Pedido à direção** (ver `PEDIDOS-DE-FONTE.md`). |
| c | Stopping Randomized Trials Early for Benefit and Estimation of Treatment Effects: Systematic Review and Meta-regression Analysis | Bassler D, Briel M, Montori VM, Lane M, Glasziou P, Zhou Q, Heels-Ansdell D, Walter SD, Guyatt GH, *et al.* | *JAMA* 2010;303(12):1180–1187 | [10.1001/jama.2010.310](https://doi.org/10.1001/jama.2010.310) | 2026-10-06 | © 2010 American Medical Association | **OBTIDO 2026-10-07** (fornecido pela direção, pedido 4 — antes disso o paywall da JAMA barrava; Unpaywall `is_oa=false`), 9 p., md5 `9ae28895dc31ddc6874f404960fa6220` → `bassler-2010-jama-interrupcao-precoce.pdf`. Extrato em `bassler-2010-interrupcao-precoce.md`, agora com o **corpo**: Comment, Table 2 (meta-regressão) e a legenda da Figura 3. É a fonte da **C4**. |
| d | Diretrizes metodológicas: Sistema GRADE — manual de graduação da qualidade da evidência e força de recomendação para tomada de decisão em saúde | Ministério da Saúde, Secretaria de Ciência, Tecnologia e Insumos Estratégicos, Departamento de Ciência e Tecnologia | Brasília-DF, 2014 | <https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/sistema-grade.pdf> · espelho BVS/MS | 2026-10-06 | **CC BY-NC-SA 4.0** — *"É permitida a reprodução parcial ou total desta obra, desde que citada a fonte"* | **obtido**, 1,4 MB → `ms-conitec-2014-sistema-grade.pdf`, extrato em `ms-conitec-sistema-grade.md` |

### Encontrados nesta rodada e não previstos no pedido

Os dois entram porque **atualizam exatamente o domínio em disputa** (imprecisão) e porque o
próprio Handbook declara a sua seção 5.2 superada. Ignorá-los seria repetir o defeito que esta
rodada corrige: aplicar regra por leitura parcial.

| # | documento | publicação | DOI | licença | estado |
|---|---|---|---|---|---|
| e | GRADE Guidance 34: update on rating imprecision using a minimally contextualized approach | *J Clin Epidemiol* 2022;150:216–224 | [10.1016/j.jclinepi.2022.07.014](https://doi.org/10.1016/j.jclinepi.2022.07.014) · PMID 35934265 | **CC BY** no site da editora | **OBTIDO 2026-10-07** (fornecido pela direção, pedido 1 — antes disso a Elsevier devolvia 403 ao bot, apesar da licença aberta), 9 p., md5 `0e66e3622d4d4b32124f705e01eb977b` → `zeng-2022-grade-guidance-34-imprecisao.pdf`. Extrato em `grade-guidance-34-imprecisao.md`, agora com Boxes 1–5, §4.1–4.3 e Discussion. É a fonte da **R4.g**. **Appendix A (Examples 1–7) é suplementar e NÃO está no PDF** — não bloqueia nada: o critério está no corpo. |
| f | GRADE guidance 35: update on rating imprecision for assessing contextualized certainty of evidence and making decisions | *J Clin Epidemiol* 2022;150:225–242 | [10.1016/j.jclinepi.2022.07.015](https://doi.org/10.1016/j.jclinepi.2022.07.015) | CC BY (repositório institucional AUB) | **obtido**, 24 p., md5 `9b3b44e14282f6a6f1aac26cd13cffd1` → `schunemann-2022-grade-guidance-35.pdf`. Não usado como `fonte` de nenhuma regra nesta rodada — fica adquirido para a rodada de limiares. **2026-10-07:** a direção enviou um `artigo_2` que era esta mesma Guidance 35, idêntica por md5 à cópia já em mão — **ignorado, nada mudou**. A conferência de identidade é a da direção; o arquivo não foi adicionado à pasta, então não há segunda cópia para comparar aqui. |

## Conferência

Cada PDF foi aberto e a primeira página lida para confirmar título, periódico, volume e ano
antes de ser nomeado — nenhum nome foi atribuído por semelhança de nome de arquivo. O
`grade-handbook-2013.html` foi conferido pela árvore de seções (5.2.4 Imprecision, 5.3.1 Large
magnitude of an effect, 6.1.1 Strong recommendation), que é o que as regras citam.

**Os dois PDFs que chegaram em 2026-10-07 passaram pela mesma conferência, antes de qualquer
frase ser citada deles:**

| arquivo | o que a 1ª página diz | confere com a linha do manifesto? |
|---|---|---|
| `zeng-2022-grade-guidance-34-imprecisao.pdf` | "GRADE GUIDANCE SERIES" · título integral · "Journal of Clinical Epidemiology 150 (2022) 216e224" · "Accepted 25 July 2022; Published online 4 August 2022" · primeiro autor Linan Zeng | sim — (e) |
| `bassler-2010-jama-interrupcao-precoce.pdf` | título integral · "JAMA. 2010;303(12):1180-1187 (doi:10.1001/jama.2010.310)" · "Dirk Bassler; Matthias Briel; Victor M. Montori; et al." | sim — (c) |

Os dois são de 9 páginas e os md5 estão na linha de cada um. Nenhum é cópia de outro documento
desta pasta: os cinco md5 de PDF são distintos.

**Glifo, e só glifo:** os PDFs da Elsevier e da JAMA servem travessão e sinais de desigualdade como
letras e símbolos de desenho (`216e224`, `30e50%`, `nulldrating`, `⬍`). Os extratos normalizam esses
glifos para `–`, `—`, `<` e declaram a normalização no próprio cabeçalho. Nenhuma palavra foi
alterada — a disciplina da frase literal continua valendo ao pé da letra.

## O que falta

Ver `PEDIDOS-DE-FONTE.md` nesta pasta. Em **2026-10-07** a lista caiu de 4 para **1**:

- **(e) Guidance 34** e **(c) Bassler 2010** — **chegaram** (pedidos 1 e 4). São as duas que
  importavam para a imprecisão e para a C4.
- **(a′) corrigendum de guidelines 6** — **encerrado por irrelevância**, não pendente: conteúdo já
  conferido em duas vias, e corrige limiar de desfecho contínuo, que não toca regime nosso.
- **(b′) capítulo de imprecisão do GRADE Book** — **único aberto.** É a versão corrente do que o
  Handbook declara superado. Não bloqueia a R4.g (que a Guidance 34 já sustenta por inteiro); pode
  mexer no que hoje está suspenso por falta de campo no esquema.

Nenhum dos quatro mudou regra classificada como **TEM FONTE**. Dos dois que chegaram, o saldo está
no registro da task: **uma** regra nova com fonte (`R4.g`), **três** que continuam suspensas por
dependerem de dado que o schema 2 não grava, e a **C4** com fonte de corpo em vez de abstract.
