-- =====================================================================================
-- DIAGNÓSTICO DE PRODUÇÃO — consultas 4 a 7, sobre a TERCEIRA coluna de clínico.
--
-- Companheiro de scripts/diagnostico-vocabulario-prod.sql (consultas 1 a 3). Aquele
-- arquivo varre as DUAS colunas que a migration 1790380800000 converte:
--     pacientes.valores_estaveis  ·  selecoes_protocolo.dados_clinicos
-- Este varre a que ficou fora de tudo:
--     avaliacoes.snapshot_campos
--
-- POR QUE ESTA COLUNA IMPORTA MAIS QUE AS OUTRAS DUAS. É a que a TELA lê primeiro.
-- app/index.html:2631 (seedClinDoSeguimento):
--     const base = (d.ultima_avaliacao && d.ultima_avaliacao.snapshot_campos)
--                  || d.valores_estaveis || {};
--     p.clin = {...base};
-- e renderProtos() calcula o semáforo com classificarPrim(r, p.tumor, p.clin). Logo, para
-- todo paciente COM avaliação, o clínico que pinta o semáforo vem daqui — e não de
-- valores_estaveis, que é o que as consultas 1 a 3 medem.
--
-- E o que está gravado aqui não é o que o médico respondeu: snapshot_campos é escrito por
-- clinValues() (app/index.html:4176 e :5394), que MATERIALIZA o primDefault de TODOS os
-- campos primitivos do tumor. Antes da Fase 2a isso congelava, em cada avaliação salva:
--   · `false` nos 15 biomarcadores booleanos          -> consultas 4 e 6
--   · `opcoes[0]` nos 5 enums de exame da leva 2       -> consultas 5 e 7
--
-- A migration NÃO toca esta coluna, e está certo que não toque: snapshot_campos é registro
-- de AUDITORIA — é a fotografia do que o médico viu naquele dia. Reescrevê-la falsificaria
-- o prontuário. O defeito não é o dado histórico; é a tela usar um registro de auditoria
-- como estado clínico corrente.
--
-- SOMENTE LEITURA. Nenhum UPDATE, nenhum DELETE. Pode rodar em produção a qualquer hora.
--
-- Ordem de uso:
--   6 primeiro  — é o número que libera ou trava o deploy do backend.
--   7 em seguida — dimensiona o verde espúrio que SOBREVIVE ao deploy.
--   4 e 5       — o detalhe nominal, para saber de quem se trata.
-- =====================================================================================


-- =====================================================================================
-- 6) O NÚMERO QUE TRAVA OU LIBERA O DEPLOY — booleano do vocabulário antigo no snapshot.
--
-- Cada valor contado aqui é um 🔴 SILENCIOSO depois do deploy: `false` comparado contra
-- `eq "positivo"` dá falso, e nada converte isto (a migration cobre as outras duas
-- colunas). Provado em dev com o interpretador compilado: com `cldn18_2_positivo=false` o
-- zolbetuximabe dá VERMELHO; com o campo ausente dá AMARELO, que é o correto.
--
-- ZERO = o 🔴 silencioso não existe em produção e o deploy do backend pode seguir.
-- > ZERO = pare. A correção recomendada NÃO é estender a migration (reescreveria registro
--          de auditoria e voltaria a exigir branch do Neon): é sanear na SEMENTE —
--          seedClinDoSeguimento/iniciarReaval descartam valor fora do domínio atual do
--          campo, o valor vira undefined, o primDefault devolve `nao_testado`, dá 🟡. O
--          snapshot histórico fica intacto e a trilha continua mostrando o que foi visto.
-- =====================================================================================
WITH campos(campo) AS (
  VALUES ('pdl1_cps1'),('pdl1_pos'),('pdl1_alto'),('msi_alto'),('mutacao_brca'),
         ('mutacao_brca_germinativa'),('alteracao_fgfr'),('cldn18_2_positivo'),
         ('fusao_ntrk'),('sstr_positivo'),('ras_wt'),('braf_wt')
)
SELECT count(*)                           AS valores_no_vocabulario_antigo,
       count(DISTINCT a.id)               AS avaliacoes_afetadas,
       count(DISTINCT a.paciente_id)      AS pacientes_afetados,
       (SELECT count(DISTINCT paciente_id) FROM avaliacoes) AS pacientes_com_avaliacao,
       (SELECT count(*) FROM pacientes)   AS pacientes_no_total
  FROM avaliacoes a
  JOIN campos c ON a.snapshot_campos ? c.campo
 WHERE a.snapshot_campos IS NOT NULL
   AND jsonb_typeof(a.snapshot_campos -> c.campo) = 'boolean';


-- =====================================================================================
-- 7) O TAMANHO DO VERDE QUE SOBREVIVE AO DEPLOY — enums da leva 2 parados exatamente no
--    valor que era o default da tela.
--
-- A leva 2 (her2/rh/brca em mama, braf em melanoma, her2 em esôfago) trocou o DOMÍNIO
-- (entrou `nao_testado` na frente) mas não as regras. Em quem já tinha avaliação, o
-- snapshot congelou o default ANTIGO como se fosse resultado de exame — e esse valor está
-- dentro do domínio novo, então a migration não o toca e NEM DEVERIA: "positivo" posto
-- pelo default é o MESMO BYTE que "positivo" escolhido pelo médico. É o argumento nº 1 do
-- cabeçalho da migration, agora virado contra ela.
--
-- O QUE ESTA CONSULTA NÃO FAZ, e é preciso dizer antes de ler o número: ela NÃO distingue
-- default de digitado. Ninguém distingue — a informação não existe no banco. Um `rh` que o
-- oncologista marcou "positivo" de verdade conta igual a um que a tela preencheu sozinha.
-- O número é um TETO: "no máximo isto está contaminado".
--
-- O que ela responde, e é a pergunta que importa: É UM PACIENTE OU SÃO TODOS.
--
-- DEFAULT VELHO É POR (TUMOR, CAMPO), NÃO POR CAMPO — e isto já custou um erro de leitura
-- nesta rodada. `her2` existe em mama E em esôfago com listas diferentes:
--     mama/her2  ['positivo','negativo','baixa_expressao']  -> default velho 'positivo'
--     esofago-estomago/her2  ['negativo','positivo']         -> default velho 'negativo'
-- Indexar só pelo nome do campo marca o esôfago errado nas duas direções. Os valores
-- abaixo saíram de `git show 37c7367~1:backend/data/evidencia.json`, não de memória.
-- =====================================================================================
WITH defaults(tumor, campo, default_antigo) AS (
  VALUES ('mama',             'her2', 'positivo'),
         ('mama',             'rh',   'positivo'),
         ('mama',             'brca', 'selvagem'),
         ('melanoma',         'braf', 'selvagem'),
         ('esofago-estomago', 'her2', 'negativo')
),
ultima AS (
  SELECT DISTINCT ON (a.paciente_id) a.id, a.paciente_id
    FROM avaliacoes a
   ORDER BY a.paciente_id, a.data DESC, a.id DESC
)
SELECT d.tumor,
       d.campo,
       d.default_antigo,
       count(*)                                        AS avaliacoes_no_default_antigo,
       count(DISTINCT a.paciente_id)                   AS pacientes,
       count(*) FILTER (WHERE u.id IS NOT NULL)        AS semeiam_a_tela_hoje,
       min(a.data)::date                               AS primeira,
       max(a.data)::date                               AS ultima_data,
       -- denominador, para "um paciente ou todos" ser respondível sem segunda consulta
       (SELECT count(DISTINCT p2.id) FROM pacientes p2
         WHERE p2.tumor = d.tumor)                     AS pacientes_do_tumor,
       (SELECT count(DISTINCT a2.paciente_id) FROM avaliacoes a2
          JOIN pacientes p3 ON p3.id = a2.paciente_id
         WHERE p3.tumor = d.tumor)                     AS pacientes_do_tumor_com_avaliacao
  FROM avaliacoes a
  JOIN pacientes p ON p.id = a.paciente_id
  JOIN defaults d  ON d.tumor = p.tumor AND a.snapshot_campos ? d.campo
  LEFT JOIN ultima u ON u.id = a.id
 WHERE a.snapshot_campos IS NOT NULL
   AND a.snapshot_campos ->> d.campo = d.default_antigo
   -- Hoje, em produção, TODA avaliação é anterior ao deploy — a Fase 2a não subiu. Depois
   -- do deploy, descomente a linha abaixo com a data/hora real para separar o legado do
   -- que foi gravado já com `nao_testado` disponível na tela.
   -- AND a.data < TIMESTAMP '2026-10-07 00:00:00'
 GROUP BY d.tumor, d.campo, d.default_antigo
 ORDER BY pacientes DESC, avaliacoes_no_default_antigo DESC;


-- =====================================================================================
-- 4) DETALHE NOMINAL — booleano do vocabulário antigo, linha por linha.
--    `semeia_a_tela = true` é a última avaliação do paciente, logo a que vira p.clin. As
--    outras são histórico e só aparecem nos chips da trilha.
-- =====================================================================================
WITH campos(campo, se_true, se_false) AS (
  VALUES
    ('pdl1_cps1','positivo','negativo'),
    ('pdl1_pos','positivo','negativo'),
    ('pdl1_alto','positivo','negativo'),
    ('msi_alto','positivo','negativo'),
    ('mutacao_brca','positivo','negativo'),
    ('mutacao_brca_germinativa','positivo','negativo'),
    ('alteracao_fgfr','positivo','negativo'),
    ('cldn18_2_positivo','positivo','negativo'),
    ('fusao_ntrk','positivo','negativo'),
    ('sstr_positivo','positivo','negativo'),
    -- *_wt: true significa WILD-TYPE, não "positivo"
    ('ras_wt','selvagem','mutado'),
    ('braf_wt','selvagem','mutado')
),
ultima AS (
  SELECT DISTINCT ON (a.paciente_id) a.id
    FROM avaliacoes a
   ORDER BY a.paciente_id, a.data DESC, a.id DESC
)
SELECT 'avaliacoes.snapshot_campos'          AS origem,
       a.id                                  AS avaliacao_id,
       a.paciente_id,
       p.tumor,
       p.nome,
       a.data::date,
       a.regimen_id,
       a.semaforo                             AS semaforo_gravado,
       c.campo,
       a.snapshot_campos -> c.campo           AS valor_hoje,
       CASE WHEN a.snapshot_campos -> c.campo = 'true'::jsonb  THEN c.se_true
            WHEN a.snapshot_campos -> c.campo = 'false'::jsonb THEN c.se_false
       END                                    AS equivalente_no_dominio_novo,
       (u.id IS NOT NULL)                     AS semeia_a_tela
  FROM avaliacoes a
  JOIN pacientes p ON p.id = a.paciente_id
  JOIN campos c ON a.snapshot_campos ? c.campo
  LEFT JOIN ultima u ON u.id = a.id
 WHERE a.snapshot_campos IS NOT NULL
   AND jsonb_typeof(a.snapshot_campos -> c.campo) = 'boolean'
 ORDER BY semeia_a_tela DESC, p.tumor, a.paciente_id, a.id, c.campo;


-- =====================================================================================
-- 5) DETALHE NOMINAL — enums da leva 2, com o default velho indexado por (tumor, campo).
--    `igual_ao_default` false NÃO é bom sinal nem mau: significa apenas que ali houve
--    escolha fora do default, o que é a única evidência indireta de que alguém respondeu.
-- =====================================================================================
WITH defaults(tumor, campo, default_antigo) AS (
  VALUES ('mama',             'her2', 'positivo'),
         ('mama',             'rh',   'positivo'),
         ('mama',             'brca', 'selvagem'),
         ('melanoma',         'braf', 'selvagem'),
         ('esofago-estomago', 'her2', 'negativo')
),
ultima AS (
  SELECT DISTINCT ON (a.paciente_id) a.id
    FROM avaliacoes a
   ORDER BY a.paciente_id, a.data DESC, a.id DESC
)
SELECT a.id                                   AS avaliacao_id,
       a.paciente_id,
       p.tumor,
       p.nome,
       a.data::date,
       d.campo,
       a.snapshot_campos -> d.campo            AS valor_gravado,
       d.default_antigo                        AS era_o_default_da_tela,
       (a.snapshot_campos ->> d.campo) = d.default_antigo AS igual_ao_default,
       (u.id IS NOT NULL)                      AS semeia_a_tela
  FROM avaliacoes a
  JOIN pacientes p ON p.id = a.paciente_id
  JOIN defaults d  ON d.tumor = p.tumor AND a.snapshot_campos ? d.campo
  LEFT JOIN ultima u ON u.id = a.id
 WHERE a.snapshot_campos IS NOT NULL
   AND a.snapshot_campos ->> d.campo IS DISTINCT FROM 'nao_testado'
 ORDER BY semeia_a_tela DESC, igual_ao_default DESC, p.tumor, a.paciente_id, a.id;
