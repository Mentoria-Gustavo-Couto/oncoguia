import { MigrationInterface, QueryRunner } from 'typeorm';

// Rodada B / Fase 2a — a METADE GRAVADA da conversão "exame não pedido ⇒ 🟡".
//
// O corpus trocou 15 biomarcadores de booleano para enum (`true` -> "positivo"). O valor que
// já estava NO BANCO não se converte sozinho: uma biologia gravada com `pdl1_pos: true` passa
// a ser comparada contra `{"eq": ["pdl1_pos", "positivo"]}` e dá FALSO — o protocolo vira 🔴
// em silêncio, que é pior que o defeito que a rodada foi corrigir. Em DEV havia 3 pacientes
// nessa situação (ids 12 e 13), achados pelo check S6 do portao-semaforo.
//
// RODAR JUNTO COM O DEPLOY do corpus novo. Antes dele, o SELECT de diagnóstico está em
// PORTAO-VERIFICACAO.md (seção do portão do semáforo) — rode-o em produção para saber o
// tamanho do problema antes de aplicar.
//
// Onde o clínico mora, e por que são dois lugares:
//   pacientes.valores_estaveis      — a biologia travada (HER2, RH, BRCA, PD-L1...). É AQUI
//                                     que os campos convertidos vivem na prática.
//   selecoes_protocolo.dados_clinicos — a fotografia clínica do momento da seleção.
//
// Idempotente: só toca valor que ainda é booleano JSON. Rodar duas vezes não muda nada.

// campo -> [valor quando true, valor quando false]
const MAPA: Record<string, [string, string]> = {
  // polaridade normal: true = o achado está presente
  pdl1_cps1: ['positivo', 'negativo'],
  pdl1_pos: ['positivo', 'negativo'],
  pdl1_alto: ['positivo', 'negativo'],
  msi_alto: ['positivo', 'negativo'],
  mutacao_brca: ['positivo', 'negativo'],
  mutacao_brca_germinativa: ['positivo', 'negativo'],
  alteracao_fgfr: ['positivo', 'negativo'],
  cldn18_2_positivo: ['positivo', 'negativo'],
  fusao_ntrk: ['positivo', 'negativo'],
  sstr_positivo: ['positivo', 'negativo'],
  // campos *_wt: true significa WILD-TYPE, não "positivo". Traduzir para positivo/negativo
  // aqui inverteria a leitura do médico — e inverteria a elegibilidade junto.
  ras_wt: ['selvagem', 'mutado'],
  braf_wt: ['selvagem', 'mutado'],
};

const COLUNAS: Array<[string, string]> = [
  ['pacientes', 'valores_estaveis'],
  ['selecoes_protocolo', 'dados_clinicos'],
];

export class VocabularioExameNaoTestado1790380800000 implements MigrationInterface {
  name = 'VocabularioExameNaoTestado1790380800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    let total = 0;
    for (const [tabela, coluna] of COLUNAS) {
      for (const [campo, [seTrue, seFalse]] of Object.entries(MAPA)) {
        for (const [bool, texto] of [['true', seTrue], ['false', seFalse]] as const) {
          // Os ids saem de um SELECT, não do RETURNING: o driver do Neon não devolve as
          // linhas do UPDATE no formato que o `.length` leria, e um log que conta errado é
          // pior que nenhum — é ele que vai dizer, em produção, quantos pacientes mudaram.
          const alvos: Array<{ id: number }> = await queryRunner.query(
            `SELECT id FROM ${tabela}
              WHERE ${coluna} IS NOT NULL AND ${coluna}::jsonb -> $1 = $2::jsonb`,
            [campo, bool],
          );
          if (!alvos?.length) continue;
          await queryRunner.query(
            `UPDATE ${tabela}
                SET ${coluna} = jsonb_set(${coluna}::jsonb, $1, to_jsonb($2::text), false)
              WHERE ${coluna} IS NOT NULL AND ${coluna}::jsonb -> $3 = $4::jsonb`,
            [`{${campo}}`, texto, campo, bool],
          );
          total += alvos.length;
          console.log(`[VocabularioExameNaoTestado] ${tabela}.${coluna}.${campo}: ${bool} -> "${texto}" em ${alvos.length} linha(s) — id(s) ${alvos.map((x) => x.id).join(', ')}`);
        }
      }
    }
    console.log(`[VocabularioExameNaoTestado] total convertido: ${total} valor(es).`);
  }

  // Volta os tokens para booleano. Serve para desfazer o deploy junto com o corpus antigo —
  // o corpus e o banco têm de andar no mesmo vocabulário, nos dois sentidos.
  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [tabela, coluna] of COLUNAS) {
      for (const [campo, [seTrue, seFalse]] of Object.entries(MAPA)) {
        for (const [texto, bool] of [[seTrue, 'true'], [seFalse, 'false']] as const) {
          await queryRunner.query(
            `UPDATE ${tabela}
                SET ${coluna} = jsonb_set(${coluna}::jsonb, $1, $2::jsonb, false)
              WHERE ${coluna} IS NOT NULL
                AND ${coluna}::jsonb ->> $3 = $4`,
            [`{${campo}}`, bool, campo, texto],
          );
        }
      }
    }
  }
}
