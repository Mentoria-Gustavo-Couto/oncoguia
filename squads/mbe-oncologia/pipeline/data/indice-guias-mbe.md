# Índice dos guias MBE da direção — mapa campo → ficha

> **Renomeado em 2026-10-06.** Este arquivo se chamava `grade-handbook.md` e **não é** o GRADE
> Handbook: é o índice das fichas MBE da direção. O nome prometia uma fonte canônica e entregava um
> mapa interno — e foi sob essa confusão que limiares sem fonte circularam como se fossem GRADE. O
> Handbook de verdade está em `fontes-metodo/grade-handbook-certeza.md` (extrato literal) e
> `fontes-metodo/grade-handbook-2013.html` (integral, não versionado).
>
> Input declarado da task `agents/verificador-evidencia/tasks/rederivar-grade.md` (schema 2). Este
> arquivo é o **ponto de entrada operacional**: diz qual ficha consultar para preencher cada parte do
> bloco `grade`. Os 7 guias foram copiados de `~/Downloads/MBE` em 2026-09-17 e convertidos para
> markdown (cabeçalho de proveniência em cada um). Base comum: Guyatt et al., *Users' Guides to the
> Medical Literature*, 3ª ed.

## Hierarquia de fontes (obrigatória desde 2026-10-06)

1. **`fontes-metodo/`** — série GRADE guidelines/guidance + Handbook. É **de lá** que saem limiares e
   números. Em conflito com qualquer coisa deste índice ou das fichas, prevalece.
2. **Os 7 `guia-*.md` desta pasta** — operacionalização de apoio da direção.
3. **`fontes-metodo/ms-conitec-sistema-grade.md`** — vocabulário e legitimidade institucional,
   **nunca limiar**.
4. As fichas curtas `mbe-*.md` (resumos de 07-18) ficam como lembrete de bolso; em conflito, os guias
   prevalecem.

## Os 7 guias

| arquivo | papel | origem (.docx) |
|---|---|---|
| `guia-prompts-ebm-grade.md` | **base da task** — protocolo de execução do agente (PICO → RoB → GRADE passo-a-passo → output obrigatório) | Guia de Prompts Estruturados para Análise EBM e GRADE (3ª Edição) |
| `guia-grade-certeza.md` | regra-mestra da certeza: inicial − rebaixamentos + elevações, por desfecho | Relatório Técnico: Diretrizes GRADE para Graduação da Certeza da Evidência |
| `guia-grade-indiretas.md` | indireta (PICO): população, intervenção, comparador, desfecho substituto; NMA/transitividade | Relatório Técnico: Manejo de Evidências Indiretas no Sistema GRADE |
| `guia-grade-aplicabilidade.md` | indireta de população × protocolo; credibilidade de subgrupo; contexto local (SCRAP) | Guia Técnico: Avaliação de Aplicabilidade e Generalização de Evidências Clínicas |
| `guia-magnitude-precisao.md` | efeito (RR/ARR/NNT, IC) e imprecisão (limiar de importância, OIS, fragilidade). ⚠️ O §4 desta ficha traz "eventos < 300" como regra de rebaixamento **sem exceção**; a fonte canônica (`fontes-metodo/grade-guidelines-6-imprecisao.md`, Table 1) usa 300 como ponto em que o OIS **é atendido** com RRR 30%. Para imprecisão, vale a fonte | Manual Técnico: Interpretação de Magnitude, Precisão e Importância Clínica |
| `guia-revisoes-sistematicas.md` | meta-análise como desenho; inconsistência (I², Q, forest plot); viés de publicação | Relatório Técnico: Guia Metodológico para Apreciação Crítica de Revisões Sistemáticas e Meta-análises |
| `guia-dano-observacional.md` | observacional parte de Baixa; elevações; lado do dano na recomendação | Guia Técnico: Avaliação Crítica de Estudos Observacionais de Dano e Efeitos Adversos |

## Mapa: campo do schema 2 → guia (seção)

| campo do bloco `grade` | consulte | o que o guia decide |
|---|---|---|
| `desfecho_critico` (duro × substituto) | prompts §2 · indiretas §3 | classificação obrigatória *patient-important* × *surrogate*; substituto = indireta por natureza → **regra 2** (teto B sem SG) |
| `desenho.tipo` → certeza inicial | certeza §2 · dano §2/§5 · RS §1 | RCT/meta-análise de RCT parte de A; fase II / braço único / observacional parte de C → **regra 3** |
| `efeito` (medida, valor, ic95, eventos, transcrição) | magnitude §1–§2 · prompts §3 | priorizar efeito absoluto; precisão governada por nº de eventos; transcrever da fonte (**regra 7**) |
| `pivo` (sustenta? comparador padrão? primário positivo?) | indiretas §2.2–§2.3 · aplicabilidade §4 | intervenção ≠ regime ou comparador obsoleto = indireta; subgrupo *post-hoc* não sustenta forte → **regra 6** |
| `dominios.risco_vies` | prompts §3 · dano §3 · certeza §3.1 | sigilo de alocação, cegamento (pesa mais em desfecho subjetivo/SLP), ITT, perdas |
| `dominios.inconsistencia` | RS §2 · certeza §3.2 | heterogeneidade clínica × estatística; ensaio único não é "consistente" — é "sem contradição" |
| `dominios.indireta` | indiretas §2/§5 · aplicabilidade §2/§6 · certeza §3.3 | 4 cenários PICO; −1 sério / −2 muito sério; premissa de aplicabilidade salvo motivo convincente |
| `dominios.imprecisao` | **`fontes-metodo/grade-guidance-34-imprecisao.md`** (corrente) · `fontes-metodo/grade-guidelines-6-imprecisao.md` · magnitude §4 · certeza §3.4 | IC cruza limiar de decisão; amostra/eventos abaixo do **OIS calculado** (não um piso fixo); limites levam a recomendações opostas. Efeito relativo grande **aciona** o OIS, não dispensa → **regra 4** |
| `dominios.vies_publicacao` | RS §1.2/§3.1 · certeza §3.5 | busca exaustiva? funnel? financiamento? |
| `elevacoes[]` (só inicial C) | certeza §4 · dano §5 | +1 magnitude grande (RR > 2 ou < 0,5), +2 muito grande, +1 dose-resposta, +1 confusão oposta |
| `certeza` A/B/C/D | certeza §5 · magnitude §5 | definições; aritmética recalculada pelo Portão A; "rigor > selo do desenho" |
| `recomendacao` (força, direção, base) | prompts §8 · magnitude §3 · aplicabilidade §3/§5/§7 · dano §6 | balança benefício × dano; NNT ≈ NNH = marginal; valores; contexto local; **regra 5** (forte a favor exige MCBS ≥ 3 e incorporado) |
| `motivo_indeterminado` / justificativa | prompts §8 (nota de comunicação) · indiretas §6 | nunca "não há evidência": "estimativas incertas", nomear os degraus da escada que falharam |

## O que os guias **não** cobrem

- **Os limiares numéricos não vêm daqui.** Até 2026-10-06 esta seção dizia que "limite superior > 0,95;
  RRR ≥ 30%; MCBS ≥ 3" eram "operacionalizações do squad sobre o texto dos guias". Não eram: nenhum guia
  traz esses números. A triagem de 2026-10-06
  (`output/2026-10-06-metodo-com-fonte/RELATORIO-metodo-com-fonte.md`) classificou cada regra em
  TEM FONTE / CONTRADIZ A FONTE / ÓRFÃ, e **regra sem `fonte` não pode ser aplicada**. Limiar novo sai de
  `fontes-metodo/`, com a frase literal, ou não sai.
- A direção institucional (`recomendacao.direcao = contra` em não-incorporado) é política do OncoGuia, não
  GRADE: os guias dão a balança benefício × dano × custo × valores; quem fecha a direção é a instituição.
  Regra desse tipo leva `fonte.tipo: institucional` com o registro da decisão — e **nunca** pode fixar
  limiar metodológico.
- Diagnóstico (prompts §5) não tem uso no corpus atual.
