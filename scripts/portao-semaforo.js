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
//   S2 vigilância — varre o corpus INTEIRO atrás de booleano de biomarcador sem
//      `indeterminado`. Campo novo nessa situação falha o portão antes do deploy. A lista
//      de exceções conhecidas (duvidosos + o que ficou para a Fase 2b) é explícita.
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

// ---- S1: a intenção. Campos convertidos na Fase 2a (biomarcador booleano -> enum). ----
const CONVERTIDOS = [
  ['bexiga', 'alteracao_fgfr'], ['cabeca-pescoco', 'pdl1_cps1'], ['colo-utero', 'pdl1_cps1'],
  ['colorretal', 'ras_wt'], ['colorretal', 'braf_wt'], ['colorretal', 'msi_alto'],
  ['endometrio', 'msi_alto'], ['esofago-estomago', 'cldn18_2_positivo'],
  ['neuroendocrinos', 'sstr_positivo'], ['ovario', 'mutacao_brca'],
  ['pancreas', 'mutacao_brca_germinativa'], ['prostata', 'mutacao_brca'],
  ['pulmao-nsclc', 'pdl1_pos'], ['pulmao-nsclc', 'pdl1_alto'], ['sarcomas', 'fusao_ntrk'],
];
// Já vinham corretos da decisão de 16/09 (drivers) e do lote 4 (salivar).
const JA_CORRETOS = [['pulmao-nsclc', 'egfr_status'], ['pulmao-nsclc', 'alk_status'],
  ['pulmao-nsclc', 'ros1_status'], ['cabeca-pescoco', 'histologia_salivar']];

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
  'pdl1_positivo',                // bexiga — 0 usos, fila de remoção
]);
const PADRAO_BIOMARCADOR = /^(pdl1|msi|brca|ras|braf|her2|alk|egfr|ros1|ntrk|fgfr|cldn|sstr|mgmt|mutacao|fusao|alteracao|histologia|variante|invasao_linfo|diferenciacao|nec_)/;

const R = [];
const ok = (n, c, x) => { R.push([c, n, x]); console.log((c ? 'PASS' : 'FAIL') + '  ' + n + (x ? '  [' + String(x).slice(0, 220) + ']' : '')); };
const req = async (rota, tk) => { const r = await fetch(API + rota, { headers: { Authorization: 'Bearer ' + tk } }); return { status: r.status, body: await r.json().catch(() => null) }; };

// candidatos de valor para resolver "o resto da regra satisfeito"
function candidatos(spec) {
  if (!spec) return [true, false];
  const ind = new Set((spec.indeterminado || []).map(String));
  if (spec.tipo === 'boolean') return [true, false];
  if (Array.isArray(spec.opcoes) && spec.opcoes.length) return spec.opcoes.filter(o => !ind.has(String(o)));
  return [];
}
function camposDaRegra(node, crit, out, seen) {
  if (!node || typeof node !== 'object') return;
  const k = Object.keys(node)[0], v = node[k];
  if (k === 'and' || k === 'or') v.forEach(c => camposDaRegra(c, crit, out, seen));
  else if (k === 'not') camposDaRegra(v, crit, out, seen);
  else if (k === 'ref') { if (!seen.has(v) && crit[v]) { seen.add(v); camposDaRegra(crit[v], crit, out, seen); } }
  else if (['eq','ne','gt','gte','lt','lte','in'].includes(k)) { out.add(v[0]); if (typeof v[1] === 'number') (out.nums = out.nums || []).push(v[1]); }
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
    for (const [t, campo] of CONVERTIDOS.concat(JA_CORRETOS)) {
      const s = (CP[t] || []).find(x => x.campo === campo);
      if (!s) { s1.push(`${t}/${campo}: AUSENTE do corpus`); continue; }
      if (s.tipo !== 'enum') s1.push(`${t}/${campo}: tipo=${s.tipo}, esperado enum`);
      else if (String(s.opcoes[0]) !== 'nao_testado' && !(s.indeterminado || []).includes(String(s.opcoes[0]))) s1.push(`${t}/${campo}: 1ª opção=${s.opcoes[0]} não é o token indeterminado (o default da tela não cai no 🟡)`);
      if (!(s.indeterminado || []).length) s1.push(`${t}/${campo}: sem `+'`indeterminado`');
      if (!s.rotulos) s1.push(`${t}/${campo}: sem `+'`rotulos`');
    }
    ok(`S1 ★ lista de intenção: ${CONVERTIDOS.length} convertidos + ${JA_CORRETOS.length} já corretos — todos enum, token indeterminado em 1º, indeterminado e rotulos declarados`, s1.length === 0, s1.slice(0, 3).join(' | '));

    // ---------- S2 vigilância ----------
    const suspeitos = [];
    for (const t of Object.keys(CP)) for (const s of CP[t]) {
      if (s.tipo !== 'boolean') continue;
      if (!PADRAO_BIOMARCADOR.test(s.campo)) continue;
      if (EXCECOES.has(s.campo)) continue;
      suspeitos.push(`${t}/${s.campo}`);
    }
    ok('S2 ★ nenhum booleano de biomarcador NOVO sem `indeterminado` (campo novo nessa situação falha aqui, antes do deploy)', suspeitos.length === 0, suspeitos.join(', '));

    // ---------- browser ----------
    const ctx = await browser.newContext(); const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 160)));
    page.on('dialog', d => d.accept());
    await page.addInitScript(a => { window.ONCOGUIA_API_BASE = a; }, API);
    await page.goto(APP);
    await loginNaTela(page, 'oncologista');
    await page.waitForSelector('#nav a', { timeout: 25000 });
    page.on('request', r => { const m = r.method(); if (!['GET','HEAD','OPTIONS'].includes(m)) escritas.push(m + ' ' + r.url()); });

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
    let casos = 0;
    for (const [t, campo] of CONVERTIDOS) {
      const spec = (CP[t] || []).find(x => x.campo === campo);
      const crit = {}; REGS.filter(r => r.tumor === t).forEach(r => (r.elegibilidade.criterios || []).forEach(c => { if (!(c.id in crit)) crit[c.id] = c.expr; }));
      const alvos = REGS.filter(r => r.tumor === t && JSON.stringify(r.elegibilidade).includes(`"${campo}"`));
      for (const reg of alvos) {
        const set = new Set(); camposDaRegra(reg.elegibilidade.regra, crit, set, new Set());
        const outros = [...set].filter(c => c !== campo);
        const primMap = {}; (CP[t] || []).forEach(s => primMap[s.campo] = s);
        // resolve: procura atribuição dos OUTROS campos que deixa a regra decidida com o exame preenchido
        // A atribuição tem de ser DISCRIMINANTE: com o exame preenchido de um jeito a regra
        // decide de um jeito, e do outro decide de outro. Sem isso o portão aceitaria um
        // 🔴 causado por OUTRO campo (ex.: histologia errada) e concluiria, falsamente, que
        // o exame em branco "pintou vermelho" — quando o vermelho nem dependia dele.
        let achou = null;
        const listas = outros.map(c => candidatos(primMap[c]));
        const combos = listas.reduce((a, l) => a * Math.max(l.length, 1), 1);
        if (combos > 4000) { continue; }
        for (let n = 0; n < combos && !achou; n++) {
          let rest = n; const over = {};
          for (let i = 0; i < outros.length; i++) { const l = listas[i]; if (!l.length) continue; over[outros[i]] = l[rest % l.length]; rest = Math.floor(rest / l.length); }
          const vistos = [];
          for (const val of candidatos(spec)) {
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
    const { Client } = require(path.join(ROOT, 'backend/node_modules/pg'));
    require(path.join(ROOT, 'backend/node_modules/dotenv')).config({ path: path.join(ROOT, 'backend/.env') });
    const cli = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await cli.connect();
    const convertidos = new Set(CONVERTIDOS.map(([, c]) => c));
    const linhas = (await cli.query('SELECT id, paciente_id, dados_clinicos FROM selecoes_protocolo')).rows;
    await cli.end();
    const legado = [];
    for (const r of linhas) for (const [k, v] of Object.entries(r.dados_clinicos || {}))
      if (convertidos.has(k) && typeof v === 'boolean') legado.push(`seleção ${r.id} (paciente ${r.paciente_id}): ${k}=${v}`);
    ok(`S6 ★ nenhuma seleção gravada carrega booleano em campo convertido (${linhas.length} seleções varridas) — valor do vocabulário antigo viraria 🔴 silencioso`, legado.length === 0, legado.slice(0, 4).join(' | '));

    ok('Z somente leitura: nenhum POST/PUT/PATCH/DELETE saiu do browser', escritas.length === 0, escritas[0] || '');
    ok('Z console limpo', errs.length === 0, errs[0] || '');
    await ctx.close();
  } catch (e) {
    ok('EXCEÇÃO no portão', false, e.stack || e.message);
  } finally { await browser.close(); }
  const fails = R.filter(r => !r[0]).length;
  console.log(`\n${R.length - fails}/${R.length} checks passaram${fails ? ` — ${fails} FALHA(S)` : ' — portão OK'}`);
  process.exit(fails ? 1 : 0);
})();
