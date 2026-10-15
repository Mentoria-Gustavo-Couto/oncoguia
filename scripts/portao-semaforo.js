// Portão do SEMÁFORO — Rodada B / Fase 2a.
//
// Portão AFIRMATIVO: não verifica que "nada quebrou", afirma uma propriedade.
// Para CADA campo declarado como exame/biomarcador, exame NÃO PEDIDO tem de produzir
// 🟡 — nunca 🟢 (o verde espúrio: regra que pede `eq false` e o default `false` da tela
// satisfazia) e nunca 🔴 (o vermelho espúrio: regra que pede `eq true`).
//
//   S1 intenção — a LISTA COMPLETA dos campos convertidos está no código (como o E1 do
//      portão da secretaria). Um campo que suma do corpus por acidente falha AQUI, não em
//      produção. Cada um tem de ser enum, com `nao_testado` PRIMEIRO (é o que faz o
//      primDefault da tela cair no indeterminado), `indeterminado` declarado e `rotulos`.
//   S2 vigilância — varre o corpus INTEIRO atrás de campo de EXAME sem `indeterminado`,
//      nos dois tipos: booleano de biomarcador, e enum cujo domínio é um resultado de exame
//      (positivo/negativo/selvagem/mutado...). Nos dois o default da tela assume um
//      resultado que ninguém mediu — `false` no booleano, `opcoes[0]` no enum. Campo novo
//      nessa situação falha o portão antes do deploy. As exceções conhecidas (duvidosos de
//      anatomopatológico + o que ficou para a Fase 2b) são explícitas.
//   S7 remoções — os 6 campos sem uso retirados na Fase 2a não podem reaparecer na tela.
//   S8 portão-fotografia — nenhum check de NENHUM portão pode justificar o esperado com
//      "comportamento existente"/"como está hoje". Portão é especificação, não fotografia:
//      o que descreve o sistema de hoje não consegue acusar o defeito de hoje. Regra (b)
//      do CLAUDE.md.
//   S3 ★ afirmativo — para cada (campo × regime que o referencia), resolve uma atribuição
//      DISCRIMINANTE do resto da regra (uma em que o exame é o que decide: 🟢 com um valor,
//      🔴 com outro) e então deixa o exame em branco: o veredito tem de ser 🟡. Exigir que
//      seja discriminante é o que impede dois falsos: passar vacuamente por ter deixado
//      tudo amarelo, e acusar um 🔴 que na verdade vinha de OUTRO campo da regra.
//   S4 ★ o par do colo de útero, nomeado: o MESMO exame não pedido não pode reprovar o
//      KEYNOTE-A18 e aprovar o GOG-169. É o teste que prova a correção.
//   S5 paridade — os mesmos casos nos DOIS interpretadores (app/index.html e o
//      backend/dist/evidencia/semaforo.js compilado). O portão vale para a tela e para o
//      servidor; se divergirem, o defeito é maior que o corrigido.
//   S9 ★ semente saneada — avaliacoes.snapshot_campos guarda o vocabulário antigo (é
//      registro de auditoria, a migration não o toca) e é ele que semeia a tela. Booleano
//      fora do domínio atual tem de sair das DUAS sementes (seedClinDoSeguimento e
//      iniciarReaval) sem 🔴 silencioso: `false` (ambíguo — era o default) como não
//      informado → 🟡; `true` (só sai de clique) traduzido pelo mapa da migration
//      1790380800000, com paridade app × migration; o snapshot fica intacto; e o
//      default antigo da leva 2, que está DENTRO do domínio, não é adivinhado. O descarte é
//      amarrado à declaração de `indeterminado`: campo sem ela guarda o valor (descartar o
//      mandaria a um default clínico). Sintético por classe + o registro legado real do
//      banco de dev, pelo caminho inteiro da tela.
//
// Somente leitura: nenhum POST sai do browser; nada é criado no banco.
// Uso: node scripts/portao-semaforo.js   (app 5173 e API 3005 no ar).
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { chromium } = require(path.join(ROOT, 'node_modules/playwright'));
const { loginNaTela, tokenApi } = require('./portao-credenciais');
const { exigirBancoDeDev } = require('./portao-banco');
const APP = process.env.PORTAO_APP || 'http://localhost:5173/index.html';
const API = process.env.PORTAO_API || 'http://localhost:3005/api';

// ---- S1: a intenção. Campos de EXAME que têm de carregar o token indeterminado. ----
// Leva 1 — biomarcador BOOLEANO -> enum (o default `false` da tela virava "negativo").
const CONVERTIDOS = [
  ['bexiga', 'alteracao_fgfr'], ['cabeca-pescoco', 'pdl1_cps1'], ['colo-utero', 'pdl1_cps1'],
  ['colorretal', 'ras_wt'], ['colorretal', 'braf_wt'], ['colorretal', 'msi_alto'],
  ['endometrio', 'msi_alto'], ['esofago-estomago', 'cldn18_2_positivo'],
  ['neuroendocrinos', 'sstr_positivo'], ['ovario', 'mutacao_brca'],
  ['pancreas', 'mutacao_brca_germinativa'], ['prostata', 'mutacao_brca'],
  ['pulmao-nsclc', 'pdl1_pos'], ['pulmao-nsclc', 'pdl1_alto'], ['sarcomas', 'fusao_ntrk'],
];
// Leva 2 — ENUM de exame (o default `opcoes[0]` da tela assumia um RESULTADO clínico:
// her2=positivo em mama fazia 14 regimes anti-HER2 nascerem verdes sem o exame).
const ENUMS_EXAME = [
  ['mama', 'her2'], ['mama', 'rh'], ['mama', 'brca'],
  ['melanoma', 'braf'], ['esofago-estomago', 'her2'],
];
// Já vinham corretos da decisão de 16/09 (drivers) e do lote 4 (salivar).
const JA_CORRETOS = [['pulmao-nsclc', 'egfr_status'], ['pulmao-nsclc', 'alk_status'],
  ['pulmao-nsclc', 'ros1_status'], ['cabeca-pescoco', 'histologia_salivar']];
const TODOS_EXAME = CONVERTIDOS.concat(ENUMS_EXAME);

// ---- S6: ONDE o clínico gravado mora. Escopo DECLARADO, e impresso quando o check passa.
// A primeira versão do S6 varria só a segunda coluna e por isso passou verde com 3 valores
// velhos na primeira — a biologia travada (HER2, RH, BRCA, PD-L1) mora em valores_estaveis.
const ESCOPO_S6 = ['pacientes.valores_estaveis', 'selecoes_protocolo.dados_clinicos'];

// ---- S7: campos removidos na Fase 2a (0 usos). Nenhum pode reaparecer na tela. ----
const REMOVIDOS = [
  ['bexiga', 'pdl1_positivo'], ['bexiga', 'inelegivel_platina'], ['mama', 'm'],
  ['renal', 'alto_risco_recidiva'], ['penis', 'alto_risco_pos_cirurgia'],
  ['testiculo', 'pos_orquiectomia'],
];

// ---- S2: booleanos que PARECEM biomarcador e seguem sem `indeterminado`, de propósito. ----
// Duvidosos (dado de anatomopatológico, que costuma vir no laudo padrão — "não consta" não é
// o mesmo que "não pedido") e os que a Fase 2a excluiu por serem decisão clínica. Vão ao
// revisor junto com a Fase 2b. Tirar um daqui sem converter o campo faz S2 falhar.
const EXCECOES = new Set([
  'invasao_linfovascular',        // mama, testículo — consta do laudo de ressecção
  'diferenciacao_sarcomatoide',   // renal — idem
  'nec_alto_grau',                // neuroendocrinos — grau/Ki-67, padrão do laudo
  'histologia_ccrcc',             // renal — subtipo histológico, padrão do laudo (9 regimes)
  'fragil_mgmt_metilado',         // glioblastoma — composto: fragilidade clínica + MGMT
  'cps1_ou_hpv_pos',              // cabeça e pescoço — composto: dois exames num campo
  'variante_neuroendocrina', 'variante_agressiva', 'histologia_pequenas_celulas', // próstata: Fase 2b
  // Enums de laudo/estadiamento/escore, fora pelo MESMO corte dos booleanos de patologia:
  'histologia', 'grau', 'grau_nuclear', 'estadio_pt', 'estadio_pn', 'estadio_t',
  'child_pugh', 'risco_igcccg', 'risco_imdc',
]);
const PADRAO_BIOMARCADOR = /^(pdl1|msi|brca|ras|braf|her2|alk|egfr|ros1|ntrk|fgfr|cldn|sstr|mgmt|mutacao|fusao|alteracao|histologia|variante|invasao_linfo|diferenciacao|nec_)/;

const R = [];
const ok = (n, c, x) => { R.push([c, n, x]); console.log((c ? 'PASS' : 'FAIL') + '  ' + n + (x ? '  [' + String(x).slice(0, 220) + ']' : '')); };
const req = async (rota, tk) => { const r = await fetch(API + rota, { headers: { Authorization: 'Bearer ' + tk } }); return { status: r.status, body: await r.json().catch(() => null) }; };

// Candidatos de valor para resolver "o resto da regra satisfeito". Um campo NUMÉRICO não
// tem domínio enumerável: os candidatos saem das constantes com que a própria regra o
// compara (c-1, c, c+1), que é o suficiente para cair dos dois lados de qualquer limiar.
// Sem isso, campo numérico ficava sempre vazio → a regra inteira ficava indeterminada e o
// par parecia "não-discriminante" quando na verdade era o portão que não sabia preenchê-lo.
function candidatos(spec, nums) {
  if (!spec) return [true, false];
  const ind = new Set((spec.indeterminado || []).map(String));
  if (spec.tipo === 'boolean') return [true, false];
  if (Array.isArray(spec.opcoes) && spec.opcoes.length) return spec.opcoes.filter(o => !ind.has(String(o)));
  const cs = [...(nums || [])];
  if (!cs.length) return [];
  const out = new Set();
  cs.forEach(c => { out.add(c - 1); out.add(c); out.add(c + 1); });
  return [...out];
}
// Devolve os campos da regra e, por campo, as constantes numéricas comparadas com ele.
function camposDaRegra(node, crit, out, seen, nums) {
  if (!node || typeof node !== 'object') return;
  const k = Object.keys(node)[0], v = node[k];
  if (k === 'and' || k === 'or') v.forEach(c => camposDaRegra(c, crit, out, seen, nums));
  else if (k === 'not') camposDaRegra(v, crit, out, seen, nums);
  else if (k === 'ref') { if (!seen.has(v) && crit[v]) { seen.add(v); camposDaRegra(crit[v], crit, out, seen, nums); } }
  else if (['eq','ne','gt','gte','lt','lte','in'].includes(k)) {
    out.add(v[0]);
    const vals = Array.isArray(v[1]) ? v[1] : [v[1]];
    vals.forEach(x => { if (typeof x === 'number') { if (!nums[v[0]]) nums[v[0]] = new Set(); nums[v[0]].add(x); } });
  }
}

(async () => {
  await exigirBancoDeDev('semáforo — exame não pedido ⇒ 🟡 (Rodada B / Fase 2a)');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const escritas = [], errs = [];
  try {
    const tkRev = await tokenApi(API, 'revisor');
    const ev = await req('/evidencia', tkRev);
    const CP = ev.body.campos_primitivos, REGS = ev.body.regimes;
    const RUN_ATIVO = require('fs').readFileSync(path.join(ROOT, 'squads/mbe-oncologia/RUN_ATIVO'), 'utf8').trim().split('\n').pop().trim();
    ok(`S0 /evidencia serve o RUN_ATIVO (${RUN_ATIVO})`, ev.status === 200 && ev.body._source.path.includes(RUN_ATIVO), `${REGS.length} regimes · ${ev.body._source.path}`);

    // ---------- S1 intenção ----------
    let s1 = [];
    for (const [t, campo] of TODOS_EXAME.concat(JA_CORRETOS)) {
      const s = (CP[t] || []).find(x => x.campo === campo);
      if (!s) { s1.push(`${t}/${campo}: AUSENTE do corpus`); continue; }
      if (s.tipo !== 'enum') s1.push(`${t}/${campo}: tipo=${s.tipo}, esperado enum`);
      else if (String(s.opcoes[0]) !== 'nao_testado' && !(s.indeterminado || []).includes(String(s.opcoes[0]))) s1.push(`${t}/${campo}: 1ª opção=${s.opcoes[0]} não é o token indeterminado (o default da tela não cai no 🟡)`);
      if (!(s.indeterminado || []).length) s1.push(`${t}/${campo}: sem `+'`indeterminado`');
      if (!s.rotulos) s1.push(`${t}/${campo}: sem `+'`rotulos`');
    }
    ok(`S1 ★ lista de intenção: ${CONVERTIDOS.length} booleanos convertidos + ${ENUMS_EXAME.length} enums de exame + ${JA_CORRETOS.length} já corretos — todos enum, token indeterminado em 1ª opção, indeterminado e rotulos declarados`, s1.length === 0, s1.slice(0, 3).join(' | '));

    // ---------- S2 vigilância ----------
    const suspeitos = [];
    // Um campo de exame sem `indeterminado` é defeito em QUALQUER tipo: no booleano o
    // default da tela é `false`, no enum é `opcoes[0]` — os dois assumem um resultado que
    // ninguém mediu. Por isso a varredura cobre os dois tipos.
    const TOKENS_RESULTADO = /^(positivo|negativo|selvagem|mutado|mutado_germinativo|baixa_expressao|instavel|estavel)$/;
    for (const t of Object.keys(CP)) for (const s of CP[t]) {
      if (EXCECOES.has(s.campo)) continue;
      const nomeSuspeito = PADRAO_BIOMARCADOR.test(s.campo);
      if (s.tipo === 'boolean') { if (nomeSuspeito) suspeitos.push(`${t}/${s.campo} (booleano)`); continue; }
      if (s.tipo !== 'enum' || (s.indeterminado || []).length) continue;
      // enum cujo DOMÍNIO é um resultado de exame (positivo/negativo/selvagem/mutado...)
      const opts = (s.opcoes || []).map(String);
      if (opts.some(o => TOKENS_RESULTADO.test(o))) suspeitos.push(`${t}/${s.campo} (enum ${opts.join('|')})`);
    }
    ok('S2 ★ nenhum campo de exame NOVO sem `indeterminado` — booleano de biomarcador ou enum cujo domínio é resultado de exame (campo novo nessa situação falha aqui, antes do deploy)', suspeitos.length === 0, suspeitos.join(', '));

    // ---------- S7 remoções ----------
    const ressuscitados = REMOVIDOS.filter(([t, c]) => (CP[t] || []).some(s => s.campo === c));
    ok(`S7 ★ os ${REMOVIDOS.length} campos removidos na Fase 2a não voltaram ao formulário`, ressuscitados.length === 0, ressuscitados.map(x => x.join('/')).join(', '));

    // ---------- browser ----------
    const ctx = await browser.newContext(); const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 160)));
    page.on('dialog', d => d.accept());
    await page.addInitScript(a => { window.ONCOGUIA_API_BASE = a; }, API);
    await page.goto(APP);
    await loginNaTela(page, 'oncologista');
    await page.waitForSelector('#nav a', { timeout: 25000 });
    const leituras = [];
    page.on('request', r => { const m = r.method(); if (!['GET','HEAD','OPTIONS'].includes(m)) escritas.push(m + ' ' + r.url()); else if (r.url().startsWith(API)) leituras.push(r.url().slice(API.length)); });

    // veredito da APP para um conjunto de valores (com os defaults da tela aplicados)
    const vereditoApp = (rid, t, over) => page.evaluate(([rid, t, over]) => {
      const r = REGIMES.find(x => x.regimen_id === rid);
      const vals = clinValues(t, over);                       // <- primDefault da tela entra aqui
      const res = evalExpr(r.elegibilidade.regra, vals, CRIT_EXPR_POR_TUMOR[t] || {}, primByCampo(t));
      return { v: res === true ? 'verde' : res === false ? 'vermelho' : 'amarelo', vals };
    }, [rid, t, over]);

    const { classificarRegra } = require(path.join(ROOT, 'backend/dist/evidencia/semaforo.js'));
    const vereditoSrv = (rid, t, vals) => {
      const reg = REGS.find(r => r.regimen_id === rid);
      const primMap = {}; (CP[t] || []).forEach(s => primMap[s.campo] = s);
      const crit = {}, labels = {};
      REGS.filter(r => r.tumor === t).forEach(r => (r.elegibilidade.criterios || []).forEach(c => { if (!(c.id in crit)) { crit[c.id] = c.expr; labels[c.id] = c.label; } }));
      const sem = classificarRegra(reg.elegibilidade.regra, vals, crit, primMap, labels).semaforo;
      return sem === 'elegivel' ? 'verde' : sem === 'inelegivel' ? 'vermelho' : 'amarelo';
    };

    // ---------- S3 afirmativo ----------
    const falhasAmarelo = [], falhasVacuo = [], falhasParidade = [];
    const pares = [];   // (tumor, campo, regime, atribuição discriminante) — o S9 planta sobre eles
    let casos = 0;
    for (const [t, campo] of TODOS_EXAME) {
      const spec = (CP[t] || []).find(x => x.campo === campo);
      const crit = {}; REGS.filter(r => r.tumor === t).forEach(r => (r.elegibilidade.criterios || []).forEach(c => { if (!(c.id in crit)) crit[c.id] = c.expr; }));
      const alvos = REGS.filter(r => r.tumor === t && JSON.stringify(r.elegibilidade).includes(`"${campo}"`));
      for (const reg of alvos) {
        const set = new Set(), nums = {}; camposDaRegra(reg.elegibilidade.regra, crit, set, new Set(), nums);
        const outros = [...set].filter(c => c !== campo);
        const primMap = {}; (CP[t] || []).forEach(s => primMap[s.campo] = s);
        // resolve: procura atribuição dos OUTROS campos que deixa a regra decidida com o exame preenchido
        // A atribuição tem de ser DISCRIMINANTE: com o exame preenchido de um jeito a regra
        // decide de um jeito, e do outro decide de outro. Sem isso o portão aceitaria um
        // 🔴 causado por OUTRO campo (ex.: histologia errada) e concluiria, falsamente, que
        // o exame em branco "pintou vermelho" — quando o vermelho nem dependia dele.
        let achou = null;
        const listas = outros.map(c => candidatos(primMap[c], nums[c]));
        const combos = listas.reduce((a, l) => a * Math.max(l.length, 1), 1);
        if (combos > 4000) { continue; }
        for (let n = 0; n < combos && !achou; n++) {
          let rest = n; const over = {};
          for (let i = 0; i < outros.length; i++) { const l = listas[i]; if (!l.length) continue; over[outros[i]] = l[rest % l.length]; rest = Math.floor(rest / l.length); }
          const vistos = [];
          for (const val of candidatos(spec, nums[campo])) {
            const r = await vereditoApp(reg.regimen_id, t, { ...over, [campo]: val });
            vistos.push([val, r.v]);
          }
          const decididos = vistos.filter(([, v]) => v !== 'amarelo');
          const distintos = new Set(decididos.map(([, v]) => v));
          if (decididos.length >= 2 && distintos.size >= 2) achou = { over, vistos };
        }
        if (!achou) { falhasVacuo.push(`${t}/${campo}/${reg.regimen_id}: nenhuma atribuição em que o exame seja o que decide (🟢 com um valor e 🔴 com outro)`); continue; }
        // agora: MESMA atribuição, exame EM BRANCO (default da tela)
        const semExame = await vereditoApp(reg.regimen_id, t, achou.over);
        casos++;
        pares.push({ t, campo, rid: reg.regimen_id, over: achou.over });   // reusado no S9
        if (semExame.v !== 'amarelo') falhasAmarelo.push(`${t}/${campo}/${reg.regimen_id}: exame em branco deu ${semExame.v.toUpperCase()} (devia ser amarelo)`);
        const srv = vereditoSrv(reg.regimen_id, t, semExame.vals);
        if (srv !== semExame.v) falhasParidade.push(`${reg.regimen_id}: app=${semExame.v} srv=${srv}`);
      }
    }
    ok(`S3 ★ exame não pedido ⇒ 🟡 em ${casos} pares (campo × regime) — nunca 🟢, nunca 🔴`, falhasAmarelo.length === 0, falhasAmarelo.slice(0, 4).join(' | '));
    ok("S3 não-vácuo: em todos os pares existe atribuição em que o EXAME é o que decide — 🟢 com um valor, 🔴 com outro", falhasVacuo.length === 0, falhasVacuo.slice(0, 3).join(' | '));
    ok(`S5 ★ paridade app × semaforo.ts nos mesmos ${casos} casos`, falhasParidade.length === 0, falhasParidade.slice(0, 3).join(' | '));

    // ---------- S4 o par do colo de útero ----------
    const A18 = 'colo-qrt-io-keynote-a18', GOG = 'colo-met-1l-qt-cps-neg';
    const vA18 = await vereditoApp(A18, 'colo-utero', { tumor: 'colo_utero', estadio_iii_iv_locavancado: true });
    const vGOG = await vereditoApp(GOG, 'colo-utero', { tumor: 'colo_utero', metastatico: true });
    ok('S4 ★ par do colo de útero: PD-L1 não pedido deixa KEYNOTE-A18 em 🟡 (antes: 🔴 por presunção de negativo)', vA18.v === 'amarelo', `A18=${vA18.v}`);
    ok('S4 ★ par do colo de útero: o MESMO exame não pedido deixa GOG-169 em 🟡 (antes: 🟢 — o verde espúrio)', vGOG.v === 'amarelo', `GOG-169=${vGOG.v}`);
    ok('S4 ★ com o exame feito o par volta a discriminar: CPS positivo → A18 🟢 e GOG-169 🔴; CPS negativo → o inverso',
      (await vereditoApp(A18, 'colo-utero', { tumor: 'colo_utero', estadio_iii_iv_locavancado: true, pdl1_cps1: 'positivo' })).v === 'verde'
      && (await vereditoApp(GOG, 'colo-utero', { tumor: 'colo_utero', metastatico: true, pdl1_cps1: 'positivo' })).v === 'vermelho'
      && (await vereditoApp(GOG, 'colo-utero', { tumor: 'colo_utero', metastatico: true, pdl1_cps1: 'negativo' })).v === 'verde');

    // ---------- S6 dado já gravado ----------
    // A conversão troca o DOMÍNIO do campo: onde se gravava `true`, grava-se "positivo".
    // Uma seleção antiga com booleano nesses campos não vira amarelo — vira VERMELHO em
    // silêncio (`true` ≠ "positivo"), que é pior que o defeito corrigido. Aqui isso é
    // verificado no banco de DEV; em produção tem de ser conferido ANTES do deploy.
    // Driver do próprio projeto: @neondatabase/serverless (WebSocket/HTTP na 443). `pg`
    // cru não serve — a 5432 é bloqueada nesta rede, como diz data-source.ts.
    //
    // O clínico mora em DOIS lugares, e o que importa aqui é o PRIMEIRO: a biologia travada
    // (HER2, RH, BRCA, PD-L1...) vive em pacientes.valores_estaveis. Uma versão anterior
    // deste check varria só selecoes_protocolo e por isso deu "0 afetadas" quando havia 3.
    require(path.join(ROOT, 'backend/node_modules/dotenv')).config({ path: path.join(ROOT, 'backend/.env') });
    const { neon } = require(path.join(ROOT, 'backend/node_modules/@neondatabase/serverless'));
    const sql = neon(process.env.DATABASE_URL);
    const linhas = [
      ...(await sql`SELECT id, tumor, valores_estaveis AS clin, 'pacientes.valores_estaveis' AS onde FROM pacientes`),
      ...(await sql`SELECT id, tumor, dados_clinicos  AS clin, 'selecoes_protocolo.dados_clinicos' AS onde FROM selecoes_protocolo`),
    ];
    // Domínio por (tumor, campo) — `her2` existe em mama E em esôfago com opções diferentes,
    // então indexar só pelo nome do campo produz falso positivo.
    const dominio = {};
    for (const [t, c] of TODOS_EXAME) {
      const sp = (CP[t] || []).find(x => x.campo === c);
      if (sp) dominio[`${t}|${c}`] = new Set((sp.opcoes || []).map(String));
    }
    const convertidos = new Set(CONVERTIDOS.map(([, c]) => c));   // leva 1: trocou de TIPO
    // Valores de exame fora do domínio ATUAL num clínico gravado: [campo, valor, motivo].
    const foraDoDominio = (tumor, clin) => {
      const out = [];
      for (const [k, v] of Object.entries(clin || {})) {
        if (v === null || v === undefined || v === '') continue;
        if (convertidos.has(k) && typeof v === 'boolean') { out.push([k, v, 'booleano do vocabulário antigo']); continue; }
        const dom = dominio[`${tumor}|${k}`];
        if (dom && !dom.has(String(v))) out.push([k, v, 'fora do domínio']);
      }
      return out;
    };
    const legado = [];
    for (const r of linhas) for (const [k, v, motivo] of foraDoDominio(r.tumor, r.clin))
      legado.push(`${r.onde} #${r.id} (${r.tumor}): ${k}=${JSON.stringify(v)} — ${motivo}`);
    // Regra (a) do CLAUDE.md: check que passa diz ONDE olhou. O escopo vem contado POR
    // COLUNA, não num total agregado — foi exatamente um escopo errado (só
    // selecoes_protocolo) que fez este check passar verde quando havia 3 valores velhos
    // em pacientes.valores_estaveis. Com o escopo impresso, dá para conferir se ele está
    // olhando no lugar certo sem ler o código.
    const porColuna = {};
    for (const r of linhas) porColuna[r.onde] = (porColuna[r.onde] || 0) + 1;
    const escopo = ESCOPO_S6.map((c) => `${c}=${porColuna[c] ?? 0}`).join(' · ');
    const naoVarridas = Object.keys(porColuna).filter((c) => !ESCOPO_S6.includes(c));
    ok(`S6 ★ nenhum clínico gravado no vocabulário antigo — escopo varrido: ${escopo} (${linhas.length} linhas, ${Object.keys(dominio).length} campos de exame)`,
      legado.length === 0 && naoVarridas.length === 0,
      [...legado.slice(0, 5), ...naoVarridas.map((c) => `coluna fora do escopo declarado: ${c}`)].join(' | '));

    // ---------- S9 semente saneada ----------
    // A TERCEIRA coluna de clínico, avaliacoes.snapshot_campos, fica fora do S6 e da
    // migration de propósito: é registro de AUDITORIA (o que o médico viu naquele dia) e
    // continua guardando `false`/`true` nos booleanos convertidos. Mas é ela que semeia a
    // tela (seedClinDoSeguimento) e a reavaliação (iniciarReaval). Semeado cru, o booleano
    // dá 🔴 em silêncio (`false`/`true` contra `eq "positivo"`). Produção tem 4 valores
    // assim, todos em `mutacao_brca`: pac#85 (próstata) false ×2, pac#88 (ovário) TRUE ×2.
    //
    // As duas direções NÃO são simétricas, e é o próprio defeito original que diz por quê:
    // o primDefault materializava `false` em todo booleano não tocado, então `false` gravado
    // é ambíguo (default ou "negativo"?) e sai como não informado → `nao_testado` → 🟡. Já
    // `true` só pode ter vindo de alguém clicando — é resultado de exame registrado — e é
    // TRADUZIDO pelo mesmo mapa da migration 1790380800000 (positivo; selvagem nos *_wt).
    // Descartá-lo esconderia uma elegibilidade real (BRCA+ em ovário → olaparibe).
    // Tudo na leitura: o snapshot fica como estava.
    //
    // Sintético: por CLASSE — cada par (campo × regime) do S3 sobre os booleanos
    // convertidos, com o exame gravado como `true` e como `false`. Passa pelas duas
    // sementes REAIS da tela, num paciente que só existe na memória da página.
    const ehConvertido = new Set(CONVERTIDOS.map(([t, c]) => `${t}|${c}`));
    const sinteticos = pares.filter((x) => ehConvertido.has(`${x.t}|${x.campo}`));
    // O mapa sai do ARQUIVO da migration, não de uma cópia no portão: é contra ele que a
    // cópia da app é conferida, e um mapa duplicado aqui só provaria que duas cópias batem.
    const fonteMig = require('fs').readFileSync(path.join(ROOT, 'backend/src/database/migrations/1790380800000-VocabularioExameNaoTestado.ts'), 'utf8');
    const blocoMapa = fonteMig.slice(fonteMig.indexOf('const MAPA'), fonteMig.indexOf('};', fonteMig.indexOf('const MAPA')));
    const MAPA_MIG = {};
    for (const m of blocoMapa.matchAll(/(\w+):\s*\['(\w+)',\s*'(\w+)'\]/g)) MAPA_MIG[m[1]] = [m[2], m[3]];
    const semear = (t, rid, snap) => page.evaluate(([t, rid, snap]) => {
      const ID = -954;   // paciente de mentira, só na memória da página — nada vai ao servidor
      const d = { tumor: t, ultima_avaliacao: { id: -1, linha_tratamento: 1, snapshot_campos: snap } };
      const antes = JSON.stringify(snap);
      patients.push({ id: ID, nome: 'S9', tumor: t, clin: {} });
      try {
        seedClinDoSeguimento(ID, d);
        const p = patients.find((y) => y.id === ID);
        const reg = rid && REGIMES.find((r) => r.regimen_id === rid);
        const seg = reg ? classificarPrim(reg, t, p.clin).status : null;
        const segClin = { ...p.clin };
        PAC_DETAIL[ID] = d; iniciarReaval(ID);
        const rea = reg ? classificarPrim(reg, t, REAVAL.clin).status : null;
        return { seg, rea, segClin, reaClin: { ...REAVAL.clin }, intacto: JSON.stringify(d.ultima_avaliacao.snapshot_campos) === antes };
      } finally {
        REAVAL = null; delete PAC_DETAIL[ID]; delete EXP_UNLOCK[ID];
        const i = patients.findIndex((y) => y.id === ID); if (i >= 0) patients.splice(i, 1);
      }
    }, [t, rid, snap]);
    const SEM = { ok: 'verde', bad: 'vermelho', warn: 'amarelo' };

    // Paridade do mapa: a cópia da app (só a coluna `true`) contra o arquivo da migration.
    const mapaApp = await page.evaluate(() => (typeof TRUE_VOCAB_ANTIGO === 'undefined' ? null : TRUE_VOCAB_ANTIGO));
    const camposConv = new Set(CONVERTIDOS.map(([, c]) => c));   // 15 pares (tumor, campo), 12 nomes
    const divergeMapa = Object.keys(MAPA_MIG).length !== camposConv.size || ![...camposConv].every((c) => MAPA_MIG[c])
      ? [`migration com ${Object.keys(MAPA_MIG).length} campos lidos, esperado os ${camposConv.size} convertidos`] : [];
    if (!mapaApp) divergeMapa.push('app sem TRUE_VOCAB_ANTIGO');
    else for (const c of new Set([...Object.keys(MAPA_MIG), ...Object.keys(mapaApp)]))
      if ((MAPA_MIG[c] || [])[0] !== mapaApp[c]) divergeMapa.push(`${c}: migration=${(MAPA_MIG[c] || [])[0]} app=${mapaApp[c]}`);
    ok(`S9 ★ paridade do mapa \`true\` → domínio novo: app × migration 1790380800000 (${Object.keys(MAPA_MIG).length} campos lidos do arquivo da migration)`, divergeMapa.length === 0, divergeMapa.slice(0, 4).join(' | '));

    const falhasFalse = [], falhasTrue = [], cruVermelho = [], trueEscondido = [], alterados = [];
    let nTrue = 0, nFalse = 0, trueVerde = 0;
    for (const x of sinteticos) for (const v of [true, false]) {
      const snap = { ...x.over, [x.campo]: v };
      const cru = await vereditoApp(x.rid, x.t, snap);   // o que a tela pintava semeando o snapshot cru
      if (cru.v === 'vermelho') cruVermelho.push(`${x.t}/${x.campo}=${v}/${x.rid}`);
      const r = await semear(x.t, x.rid, snap);
      if (!r.intacto) alterados.push(`${x.t}/${x.campo}=${v}`);
      const id = `${x.t}/${x.campo}=${v}/${x.rid}`;
      if (v === false) {
        nFalse++;
        if (r.seg !== 'warn' || r.rea !== 'warn' || r.segClin[x.campo] !== undefined || r.reaClin[x.campo] !== undefined)
          falhasFalse.push(`${id}: seguimento=${SEM[r.seg]} reavaliação=${SEM[r.rea]} (devia ser amarelo, campo não informado)`);
        continue;
      }
      // true: o esperado é o veredito do MESMO resto de regra com o valor positivo do domínio.
      nTrue++;
      const alvo = (MAPA_MIG[x.campo] || [])[0];
      const esp = await vereditoApp(x.rid, x.t, { ...x.over, [x.campo]: alvo });
      if (esp.v !== 'amarelo') trueEscondido.push(`${id}: ${esp.v}`);   // descartar daria 🟡 — esconderia isto
      if (esp.v === 'verde') trueVerde++;
      if (r.segClin[x.campo] !== alvo || r.reaClin[x.campo] !== alvo || SEM[r.seg] !== esp.v || SEM[r.rea] !== esp.v)
        falhasTrue.push(`${id}: semente seguimento=${JSON.stringify(r.segClin[x.campo])}/${SEM[r.seg]} reavaliação=${JSON.stringify(r.reaClin[x.campo])}/${SEM[r.rea]} (devia ser ${alvo}/${esp.v})`);
    }
    const nPares = `${sinteticos.length} pares campo × regime dos ${CONVERTIDOS.length} booleanos convertidos`;
    ok(`S9 ★ \`false\` do vocabulário antigo ⇒ não informado ⇒ 🟡, nunca 🔴 — ${nFalse} casos (${nPares}), nas DUAS sementes: seedClinDoSeguimento e iniciarReaval`,
      nFalse > 0 && falhasFalse.length === 0, falhasFalse.slice(0, 4).join(' | '));
    ok(`S9 ★ \`true\` do vocabulário antigo ⇒ traduzido pelo mapa da migration ⇒ chega ao semáforo como o valor positivo do domínio — ${nTrue} casos (${nPares}), nas DUAS sementes`,
      nTrue > 0 && falhasTrue.length === 0, falhasTrue.slice(0, 4).join(' | '));
    ok(`S9 não-vácuo (false): o MESMO snapshot semeado cru pinta 🔴 em ${cruVermelho.length} dos ${nTrue + nFalse} casos — o defeito plantado existe`,
      cruVermelho.length > 0, cruVermelho.slice(0, 3).join(' | '));
    ok(`S9 não-vácuo (true): em ${trueEscondido.length} dos ${nTrue} casos o valor traduzido DECIDE o regime (${trueVerde} 🟢) — descartar o \`true\` daria 🟡 em todos eles`,
      nTrue > 0 && trueEscondido.length === nTrue, trueEscondido.slice(0, 3).join(' | '));
    ok('S9 registro de auditoria intacto: a semente não altera o snapshot da avaliação', alterados.length === 0, alterados.slice(0, 3).join(' | '));

    // Os dois pacientes de produção, pelo NOME do caso (consulta 4). O resto do clínico é o
    // que a regra pede satisfeito — o snapshot real deles não está em dev; o que se fixa aqui
    // é o veredito que o valor gravado tem de produzir, com todo o resto a favor.
    //   pac#88 ovário, mutacao_brca=true (aval 157 e 158): BRCA+ registrado por médico — os
    //     dois regimes de olaparibe de manutenção que leem o campo têm de seguir ELEGÍVEIS.
    //   pac#85 próstata, mutacao_brca=false (aval 152 e 155): ambíguo — 🟡, nunca 🔴.
    const nominais = [
      ['pac#88', 'ovario', 'ovario-manutencao-olaparibe-brca', { tumor: 'ovario_epitelial', resposta_platina: true, mutacao_brca: true }, 'ok'],
      ['pac#88', 'ovario', 'ovario-recidiva-manutencao-olaparibe-brca', { tumor: 'ovario_epitelial', recidiva_platina_sensivel: true, mutacao_brca: true }, 'ok'],
      ['pac#85', 'prostata', 'prostata-mcrpc-1l-parp-nao-incorporado', { metastatico: true, resistente_castracao: true, mutacao_brca: false }, 'warn'],
    ];
    const falhasNom = [], vistosNom = [];
    for (const [pac, t, rid, snap, esp] of nominais) {
      if (!REGS.some((r) => r.regimen_id === rid)) { falhasNom.push(`${pac} ${rid}: regime ausente do corpus`); continue; }
      const r = await semear(t, rid, snap);
      vistosNom.push(`${pac} ${rid}: ${SEM[r.seg]}/${SEM[r.rea]}`);
      if (r.seg !== esp || r.rea !== esp) falhasNom.push(`${pac} ${rid}: seguimento=${SEM[r.seg]} reavaliação=${SEM[r.rea]} (devia ser ${SEM[esp]})`);
    }
    ok('S9 ★ casos nominais de produção: pac#88 (ovário, BRCA true) segue 🟢 nos 2 regimes de olaparibe de manutenção; pac#85 (próstata, BRCA false) fica 🟡 no PARP — nas duas sementes',
      falhasNom.length === 0, (falhasNom.length ? falhasNom : vistosNom).join(' | '));

    // O saneamento descarta só o que está FORA do domínio. O default antigo da leva 2
    // (mama her2=positivo, rh=positivo, brca=selvagem) está DENTRO: "positivo" posto pelo
    // default é o mesmo byte que "positivo" digitado, e o banco não guarda a diferença. A
    // semente não pode tentar adivinhar — é pergunta clínica, resolvida no prontuário.
    const LEVA2_DEFAULT = { her2: 'positivo', rh: 'positivo', brca: 'selvagem' };
    const l2 = await semear('mama', null, { ...LEVA2_DEFAULT });
    const inferidos = Object.entries(LEVA2_DEFAULT).filter(([k, v]) => l2.segClin[k] !== v || l2.reaClin[k] !== v)
      .map(([k, v]) => `${k}: gravado ${v}, semente seguimento=${l2.segClin[k]} reavaliação=${l2.reaClin[k]}`);
    ok('S9 ★ não infere: enum da leva 2 parado no default antigo (mama her2=positivo, rh=positivo, brca=selvagem) passa intacto pelas duas sementes', inferidos.length === 0, inferidos.join(' | '));

    // O descarte é AMARRADO à declaração de indeterminado: só some o valor de campo cujo
    // vocabulário declara o token vazio E cujo default cai nele. Num campo sem essa
    // declaração, descartar mandaria o campo ao default — e o default dele é valor clínico
    // (bexiga/risco → "intermediario"): o 🔴 silencioso viraria um 🟢 ou 🔴 inventado. Ali o
    // valor gravado fica como está; o que fazer com ele não é decisão da semente.
    const semIndet = [];
    for (const t of Object.keys(CP).sort()) for (const s of CP[t]) {
      if ((s.indeterminado || []).length) continue;
      if (s.tipo === 'enum' && (s.opcoes || []).length && !semIndet.some((x) => x.tipo === 'enum'))
        semIndet.push({ t, campo: s.campo, tipo: 'enum', v: 'valor_aposentado', def: s.opcoes[0] });
      if (s.tipo === 'boolean' && !semIndet.some((x) => x.tipo === 'boolean'))
        semIndet.push({ t, campo: s.campo, tipo: 'boolean', v: 'positivo', def: false });
    }
    const descartados = [];
    for (const x of semIndet) {
      const r = await semear(x.t, null, { [x.campo]: x.v });
      if (r.segClin[x.campo] !== x.v || r.reaClin[x.campo] !== x.v)
        descartados.push(`${x.t}/${x.campo}=${JSON.stringify(x.v)}: seguimento=${JSON.stringify(r.segClin[x.campo])} reavaliação=${JSON.stringify(r.reaClin[x.campo])} (o default seria ${JSON.stringify(x.def)})`);
    }
    ok(`S9 ★ descarte amarrado ao indeterminado: campo SEM token indeterminado declarado guarda o valor fora do domínio nas duas sementes — ${semIndet.map((x) => `${x.t}/${x.campo} (${x.tipo}, default ${JSON.stringify(x.def)})`).join(', ')}`,
      semIndet.length === 2 && descartados.length === 0, descartados.join(' | '));

    // E o descarte segue a DECLARAÇÃO, não a lista dos 15 convertidos: um driver de pulmão
    // (indeterminado declarado na decisão de 16/09) com valor fora do domínio também sai.
    const [tDrv, cDrv] = JA_CORRETOS[0];
    const drv = await semear(tDrv, null, { [cDrv]: true });
    ok(`S9 ★ o descarte segue a declaração, não a lista: ${tDrv}/${cDrv}=true (fora dos 15 e do mapa da migration — o true não tem tradução; indeterminado declarado) sai das duas sementes como não informado`,
      drv.segClin[cDrv] === undefined && drv.reaClin[cDrv] === undefined, `seguimento=${JSON.stringify(drv.segClin[cDrv])} reavaliação=${JSON.stringify(drv.reaClin[cDrv])}`);

    // Real: o registro legado que existe no banco de DEV, pelo caminho inteiro da tela —
    // GET /pacientes/:id → seedClinDoSeguimento → semáforo, e Reavaliar → iniciarReaval.
    const snaps = await sql`
      SELECT a.id, a.paciente_id, p.tumor, a.snapshot_campos AS clin,
             a.id = (SELECT a2.id FROM avaliacoes a2 WHERE a2.paciente_id = a.paciente_id
                      ORDER BY a2.data DESC, a2.id DESC LIMIT 1) AS ultima
        FROM avaliacoes a JOIN pacientes p ON p.id = a.paciente_id`;
    const legSnap = [];
    for (const a of snaps) for (const [k, v] of foraDoDominio(a.tumor, a.clin)) legSnap.push({ aval: a.id, pid: a.paciente_id, tumor: a.tumor, campo: k, v, ultima: a.ultima });
    const semeiam = legSnap.filter((x) => x.ultima);
    const falhasReal = [], mudancas = [];
    for (const x of semeiam) {
      const r = await page.evaluate(async ([x]) => {
        const p0 = patients.find((y) => y.id === x.pid);
        if (!p0) return { fora: true };
        await carregarDetalhe(x.pid);
        const p = patients.find((y) => y.id === x.pid), d = PAC_DETAIL[x.pid];
        if (!d) return { semDetalhe: true };   // GET /pacientes/:id falhou (429 do rate limit, p.ex.)
        const segVal = p.clin[x.campo];
        const intacto = !!(d && d.ultima_avaliacao && d.ultima_avaliacao.snapshot_campos[x.campo] === x.v);
        // Regimes do tumor que leem o campo: veredito com a semente vs. com o valor cru de volta.
        const mud = [];
        REGIMES.filter((r) => r.tumor === x.tumor && JSON.stringify(r.elegibilidade || {}).includes(`"${x.campo}"`)).forEach((r) => {
          const san = classificarPrim(r, x.tumor, p.clin).status;
          const cru = classificarPrim(r, x.tumor, { ...p.clin, [x.campo]: x.v }).status;
          if (san !== cru) mud.push([r.regimen_id, cru, san]);
        });
        const nReg = REGIMES.filter((r) => r.tumor === x.tumor && JSON.stringify(r.elegibilidade || {}).includes(`"${x.campo}"`)).length;
        iniciarReaval(x.pid);
        const reaVal = REAVAL && REAVAL.clin[x.campo];
        REAVAL = null;
        return { segVal, reaVal, intacto, mud, nReg };
      }, [x]);
      const id = `pac#${x.pid} aval#${x.aval} (${x.tumor}) ${x.campo}=${JSON.stringify(x.v)}`;
      if (r.fora) { falhasReal.push(`${id}: paciente fora da lista do perfil de teste — o caminho da tela não foi exercitado`); continue; }
      if (r.semDetalhe) { falhasReal.push(`${id}: GET /pacientes/${x.pid} falhou na tela — o caminho não foi exercitado`); continue; }
      // true traduzido pelo mapa da migration; o resto (false, ou true sem tradução) sai vazio.
      const espReal = x.v === true && MAPA_MIG[x.campo] ? MAPA_MIG[x.campo][0] : undefined;
      if (r.segVal !== espReal) falhasReal.push(`${id}: seguimento semeou ${JSON.stringify(r.segVal)} (devia ${JSON.stringify(espReal)})`);
      if (r.reaVal !== espReal) falhasReal.push(`${id}: reavaliação semeou ${JSON.stringify(r.reaVal)} (devia ${JSON.stringify(espReal)})`);
      if (!r.intacto) falhasReal.push(`${id}: o snapshot servido não traz mais o valor gravado`);
      if (espReal === undefined) r.mud.filter(([, , san]) => san !== 'warn').forEach(([rid, cru, san]) => falhasReal.push(`${id}: ${rid} ${SEM[cru]}→${SEM[san]} (devia ir a amarelo)`));
      mudancas.push(r.mud.length
        ? `${id}: ${r.mud.map(([rid, cru, san]) => `${rid} ${SEM[cru]}→${SEM[san]}`).join(', ')}`
        : `${id}: campo vira não testado, nenhum veredito muda (o resto do clínico já decide os ${r.nReg} regime(s) que leem o campo)`);
    }
    ok(`S9 ★ registro real de dev — escopo varrido: avaliacoes.snapshot_campos=${snaps.length} linhas, ${legSnap.length} valor(es) fora do domínio, ${semeiam.length} na última avaliação (a que semeia a tela): cada um sai das duas sementes como o mapa manda (false → não informado, e o que muda vai a 🟡; true → valor positivo do domínio)`,
      semeiam.length > 0 && falhasReal.length === 0,
      (semeiam.length ? [...falhasReal.slice(0, 4), ...(falhasReal.length ? [] : mudancas.slice(0, 6))] : ['nenhum registro legado na última avaliação em dev — o check real ficou VÁCUO (a classe segue coberta pelo sintético)']).join(' | '));

    // ---------- S8 portão-fotografia ----------
    // Regra (b) do CLAUDE.md: portão afirma o que DEVERIA ser verdade, nunca o que É.
    // Um check cuja justificativa diz "comportamento existente" parou de ser especificação
    // e virou fotografia: ele defende o defeito contra quem tentar corrigi-lo. Foi o caso do
    // L2 do portao-lote4, que afirmava "CPS não marcado = 🔴 (booleano default false —
    // comportamento existente do simulador)" — exatamente o defeito que esta rodada corrigiu.
    // Varredura manual pega o caso; este check pega a CLASSE, inclusive em portão futuro.
    const FRASES = [
      /comportamento\s+(existente|atual|de\s+hoje)/i,
      /como\s+(est[áa]|funciona)\s+hoje/i,
      /comportamento\s+j[áa]\s+existente/i,
      /mant[ée]m\s+o\s+comportamento\s+(atual|existente)/i,
      /(por|pra|para)\s+enquanto\s+[ée]\s+assim/i,
    ];
    const fs2 = require('fs');
    const dirPortoes = path.join(ROOT, 'scripts');
    const fotografias = [];
    for (const arq of fs2.readdirSync(dirPortoes).filter((f) => /^portao-.*\.js$/.test(f))) {
      const linhas2 = fs2.readFileSync(path.join(dirPortoes, arq), 'utf8').split('\n');
      linhas2.forEach((l, i) => {
        if (!/\bok\s*\(/.test(l)) return;                 // só o RÓTULO de um check
        // Dispensa explícita e auditável: a linha do próprio S8 CITA as frases que procura.
        // O sentinel é visível no diff — usá-lo para calar um achado de verdade aparece na
        // revisão, que é o ponto de ser um comentário e não uma regex esperta.
        if (/s8:ignore/.test(l)) return;
        const m = l.match(/ok\s*\(\s*(`[^`]*`|'[^']*'|"[^"]*")/);
        if (!m) return;
        if (FRASES.some((re) => re.test(m[1]))) fotografias.push(`${arq}:${i + 1} ${m[1].slice(0, 110)}`);
      });
    }
    const nPortoes = fs2.readdirSync(dirPortoes).filter((f) => /^portao-.*\.js$/.test(f)).length;
    ok(`S8 ★ nenhum portão justifica o esperado com o comportamento de hoje — escopo varrido: scripts/portao-*.js (${nPortoes} arquivos, ${FRASES.length} expressões)`, // s8:ignore
      fotografias.length === 0, fotografias.slice(0, 3).join(' | '));

    // Leituras contadas: a API limita 60 req/min por IP, e duas rodadas seguidas do portão
    // já estouraram esse teto (429 no console). O número diz quanto do teto cada rodada gasta.
    ok('Z somente leitura: nenhum POST/PUT/PATCH/DELETE saiu do browser', escritas.length === 0, escritas[0] || `${leituras.length} leitura(s) da API depois do login`);
    ok('Z console limpo', errs.length === 0, errs[0] || '');
    await ctx.close();
  } catch (e) {
    ok('EXCEÇÃO no portão', false, e.stack || e.message);
  } finally { await browser.close(); }
  const fails = R.filter(r => !r[0]).length;
  console.log(`\n${R.length - fails}/${R.length} checks passaram${fails ? ` — ${fails} FALHA(S)` : ' — portão OK'}`);
  process.exit(fails ? 1 : 0);
})();
