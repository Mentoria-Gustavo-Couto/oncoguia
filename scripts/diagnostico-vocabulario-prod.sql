-- =====================================================================================
-- DIAGNÓSTICO DE PRODUÇÃO — Rodada B / Fase 2a ("exame não pedido ⇒ 🟡")
-- Rodar no console SQL do Neon, no branch de PRODUÇÃO, ANTES de qualquer deploy.
--
-- POR QUE: a Fase 2a trocou 15 biomarcadores de booleano para enum no corpus
-- (`true` passou a ser `"positivo"`). O valor que já está gravado NÃO se converte
-- sozinho. Uma biologia gravada com `pdl1_pos: true` passa a ser comparada contra
-- {"eq": ["pdl1_pos", "positivo"]} e dá FALSO: o protocolo vira 🔴 em silêncio —
-- pior que o defeito que a rodada foi corrigir.
--
-- Em DEV havia 3 valores nessa situação (pacientes 12 e 13), achados pelo check S6 do
-- portao-semaforo. Produção tem paciente real e quase certamente tem mais.
--
-- SOMENTE LEITURA. Não altera nada. A correção é a migration
-- 1790380800000-VocabularioExameNaoTestado, que roda sozinha no deploy do backend
-- (migrationsRun: true) — rode este SELECT antes para saber o tamanho do que ela vai mexer,
-- e rode de novo depois: a consulta 1 tem de voltar VAZIA.
--
-- O clínico mora em DOIS lugares, e o primeiro é o que importa:
--   pacientes.valores_estaveis        -> a biologia travada (é aqui que estes campos vivem)
--   selecoes_protocolo.dados_clinicos -> a fotografia clínica do momento da seleção
-- =====================================================================================

-- ---------------------------------------------------------------------------
-- 1) O QUE A MIGRATION VAI CONVERTER — valor booleano em campo que virou enum.
--    Cada linha destas é um 🔴 silencioso se o deploy sair sem a migration.
-- ---------------------------------------------------------------------------
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
linhas(origem, id, tumor, clin) AS (
  SELECT 'pacientes.valores_estaveis',        p.id, p.tumor, p.valores_estaveis::jsonb
    FROM pacientes p WHERE p.valores_estaveis IS NOT NULL
  UNION ALL
  SELECT 'selecoes_protocolo.dados_clinicos', s.id, s.tumor, s.dados_clinicos::jsonb
    FROM selecoes_protocolo s WHERE s.dados_clinicos IS NOT NULL
)
SELECT l.origem,
       l.id,
       l.tumor,
       c.campo,
       l.clin -> c.campo                                             AS valor_hoje,
       CASE WHEN l.clin -> c.campo = 'true'::jsonb  THEN c.se_true
            WHEN l.clin -> c.campo = 'false'::jsonb THEN c.se_false
       END                                                           AS virara
  FROM linhas l
  JOIN campos c ON l.clin ? c.campo
 WHERE jsonb_typeof(l.clin -> c.campo) = 'boolean'
 ORDER BY l.origem, l.tumor, l.id, c.campo;

-- ---------------------------------------------------------------------------
-- 2) RESUMO — quantos pacientes e quantos valores a migration vai tocar.
--    Use para dimensionar o aviso ao oncologista antes do deploy.
-- ---------------------------------------------------------------------------
WITH campos(campo) AS (
  VALUES ('pdl1_cps1'),('pdl1_pos'),('pdl1_alto'),('msi_alto'),('mutacao_brca'),
         ('mutacao_brca_germinativa'),('alteracao_fgfr'),('cldn18_2_positivo'),
         ('fusao_ntrk'),('sstr_positivo'),('ras_wt'),('braf_wt')
),
linhas(origem, id, tumor, clin) AS (
  SELECT 'pacientes.valores_estaveis',        p.id, p.tumor, p.valores_estaveis::jsonb
    FROM pacientes p WHERE p.valores_estaveis IS NOT NULL
  UNION ALL
  SELECT 'selecoes_protocolo.dados_clinicos', s.id, s.tumor, s.dados_clinicos::jsonb
    FROM selecoes_protocolo s WHERE s.dados_clinicos IS NOT NULL
)
SELECT l.origem,
       count(*)                AS valores_a_converter,
       count(DISTINCT l.id)    AS linhas_afetadas,
       count(DISTINCT l.tumor) AS tumores
  FROM linhas l
  JOIN campos c ON l.clin ? c.campo
 WHERE jsonb_typeof(l.clin -> c.campo) = 'boolean'
 GROUP BY l.origem;

-- ---------------------------------------------------------------------------
-- 3) VIZINHANÇA — campo de exame gravado com valor que NÃO está no domínio novo.
--    A migration NÃO mexe nestes. Serve para achar o que escapou: valor digitado
--    fora do vocabulário, ou sobra de uma rodada anterior.
--    COBERTURA: só os campos listados abaixo (os 15 da leva 1 + os 5 enums da leva 2
--    + os 3 drivers de 16/09). Campo APOSENTADO — que saiu do vocabulário por
--    completo, como `mutacao_acionavel` dos drivers — não aparece aqui, porque a
--    consulta compara contra um domínio e um campo aposentado não tem domínio.
--    Em DEV existe um caso assim (paciente 12), inofensivo: nenhuma regra o lê.
-- ---------------------------------------------------------------------------
WITH dominio(tumor, campo, validos) AS (
  VALUES
    -- leva 2: enums de exame que ganharam `nao_testado`
    ('mama','her2',             ARRAY['nao_testado','positivo','negativo','baixa_expressao']),
    ('mama','rh',               ARRAY['nao_testado','positivo','negativo']),
    ('mama','brca',             ARRAY['nao_testado','selvagem','mutado_germinativo']),
    ('melanoma','braf',         ARRAY['nao_testado','selvagem','mutado']),
    ('esofago-estomago','her2', ARRAY['nao_testado','negativo','positivo']),
    -- drivers de pulmão (decisão de 16/09, já corretos antes desta rodada)
    ('pulmao-nsclc','egfr_status', ARRAY['nao_testado','negativo','mutado_sensibilizante','mutado_exon20','mutado_outra']),
    ('pulmao-nsclc','alk_status',  ARRAY['nao_testado','negativo','rearranjado']),
    ('pulmao-nsclc','ros1_status', ARRAY['nao_testado','negativo','rearranjado']),
    -- leva 1: booleanos que viraram enum (depois da migration, só estes valores valem)
    ('colo-utero','pdl1_cps1',         ARRAY['nao_testado','negativo','positivo']),
    ('cabeca-pescoco','pdl1_cps1',     ARRAY['nao_testado','negativo','positivo']),
    ('pulmao-nsclc','pdl1_pos',        ARRAY['nao_testado','negativo','positivo']),
    ('pulmao-nsclc','pdl1_alto',       ARRAY['nao_testado','negativo','positivo']),
    ('colorretal','msi_alto',          ARRAY['nao_testado','negativo','positivo']),
    ('endometrio','msi_alto',          ARRAY['nao_testado','negativo','positivo']),
    ('ovario','mutacao_brca',          ARRAY['nao_testado','negativo','positivo']),
    ('prostata','mutacao_brca',        ARRAY['nao_testado','negativo','positivo']),
    ('pancreas','mutacao_brca_germinativa', ARRAY['nao_testado','negativo','positivo']),
    ('bexiga','alteracao_fgfr',        ARRAY['nao_testado','negativo','positivo']),
    ('esofago-estomago','cldn18_2_positivo', ARRAY['nao_testado','negativo','positivo']),
    ('sarcomas','fusao_ntrk',          ARRAY['nao_testado','negativo','positivo']),
    ('neuroendocrinos','sstr_positivo',ARRAY['nao_testado','negativo','positivo']),
    ('colorretal','ras_wt',            ARRAY['nao_testado','selvagem','mutado']),
    ('colorretal','braf_wt',           ARRAY['nao_testado','selvagem','mutado'])
),
linhas(origem, id, tumor, clin) AS (
  SELECT 'pacientes.valores_estaveis',        p.id, p.tumor, p.valores_estaveis::jsonb
    FROM pacientes p WHERE p.valores_estaveis IS NOT NULL
  UNION ALL
  SELECT 'selecoes_protocolo.dados_clinicos', s.id, s.tumor, s.dados_clinicos::jsonb
    FROM selecoes_protocolo s WHERE s.dados_clinicos IS NOT NULL
)
SELECT l.origem, l.id, l.tumor, d.campo,
       l.clin -> d.campo AS valor_gravado,
       d.validos         AS dominio_novo
  FROM linhas l
  JOIN dominio d ON d.tumor = l.tumor AND l.clin ? d.campo
 WHERE l.clin ->> d.campo <> ALL (d.validos)
 ORDER BY l.origem, l.tumor, l.id;
