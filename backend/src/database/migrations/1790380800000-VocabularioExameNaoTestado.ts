import { MigrationInterface, QueryRunner } from 'typeorm';

// =====================================================================================
// ATENÇÃO — MIGRATION DE MÃO ÚNICA. O down() NÃO REVERTE: ele ABORTA, de propósito.
//
// Esta é a primeira migration do projeto que REESCREVE DADO CLÍNICO (as anteriores só
// criavam estrutura). Reverter a conversão é impossível sem perder informação e sem
// inventar resultado de exame. Três motivos, todos verificados no banco, não deduzidos:
//
//   1. NÃO HÁ COMO SABER O QUE O up() CONVERTEU. Depois do deploy, registro novo nasce
//      enum. Um `"positivo"` que o up() criou a partir de `true` e um `"positivo"` que o
//      oncologista digitou na semana seguinte são o MESMO BYTE. A migration não grava
//      procedência, então um down() trataria os dois igual — não seria o inverso do up(),
//      seria "re-tipar tudo para booleano", que é outra operação.
//
//   2. `nao_testado` NÃO TEM EQUIVALENTE BOOLEANO — e o que acontece com ele é o pior
//      caso deste arquivo. Um down() não teria para onde mandá-lo e o deixaria gravado
//      como a string "nao_testado". Com o corpus revertido para booleano, o motor faz
//      `eqv(a, b)` = `Boolean(a) === b` (app/index.html:1429 e semaforo.js:14): e
//      `Boolean("nao_testado")` é TRUE, porque string não-vazia é truthy. Ou seja:
//
//          regra `eq [pdl1_pos, true]`  + valor "nao_testado"  ->  VERDADEIRO  (🟢)
//
//      Todo exame NUNCA PEDIDO passaria a ser lido como POSITIVO. Um paciente sem PD-L1
//      feito apareceria como PD-L1 positivo e a imunoterapia nasceria verde. É o inverso
//      exato do que esta rodada corrigiu, é silencioso, e atinge MUITA linha: como
//      `nao_testado` é a PRIMEIRA opção do enum, ele é o default da tela — todo save
//      posterior ao deploy grava `nao_testado` nos campos que o médico não tocou.
//
//   3. Os 5 enums da leva 2 (her2/rh/brca em mama, braf em melanoma, her2 em esôfago) não
//      são tocados pelo up() — só ganharam a opção `nao_testado` no corpus. Um down() do
//      corpus tiraria essa opção do domínio e deixaria os `nao_testado` já gravados fora
//      do domínio, sem nenhuma migration cuidando deles.
//
// A REDE DE SEGURANÇA É O BRANCH DO NEON, NÃO O down(). Antes de subir o backend, crie um
// branch do Neon a partir da produção: é um clique, e dá o ponto de retorno EXATO do banco
// inteiro, sem ambiguidade de procedência e sem perder `nao_testado`. Reverter = apontar a
// aplicação de volta para aquele branch e republicar o corpus antigo. Ver a seção de deploy
// em PORTAO-VERIFICACAO.md.
// =====================================================================================

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

  // MÃO ÚNICA — ver o bloco no topo do arquivo. Este down() aborta em vez de reverter.
  //
  // Um down() que "funciona" aqui é pior que nenhum: ele roda sem erro, parece ter
  // desfeito, e deixa todo exame não pedido sendo lido como POSITIVO (motivo 2 lá em cima).
  // Falhar alto é o comportamento correto — quem precisa voltar usa o branch do Neon.
  public async down(): Promise<void> {
    throw new Error(
      'VocabularioExameNaoTestado1790380800000: migration de MÃO ÚNICA — down() não é suportado.\n' +
      '  Reverter em SQL é impossível sem perder informação:\n' +
      '    • "positivo" convertido pelo up() é indistinguível de "positivo" digitado depois do deploy;\n' +
      '    • "nao_testado" não tem equivalente booleano e, com o corpus antigo, passaria a ser lido\n' +
      '      como POSITIVO (Boolean("nao_testado") === true) — todo exame não pedido viraria 🟢.\n' +
      '  Para voltar: aponte a aplicação para o BRANCH do Neon criado antes do deploy e republique\n' +
      '  o corpus anterior. Ver a seção de deploy em PORTAO-VERIFICACAO.md.',
    );
  }
}
