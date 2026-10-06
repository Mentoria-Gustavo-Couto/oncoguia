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
    const legado = [];
    for (const r of linhas) for (const [k, v] of Object.entries(r.clin || {})) {
      if (v === null || v === undefined || v === '') continue;
      if (convertidos.has(k) && typeof v === 'boolean') { legado.push(`${r.onde} #${r.id} (${r.tumor}): ${k}=${v} — booleano do vocabulário antigo`); continue; }
      const dom = dominio[`${r.tumor}|${k}`];
      if (dom && !dom.has(String(v))) legado.push(`${r.onde} #${r.id} (${r.tumor}): ${k}=${JSON.stringify(v)} — fora do domínio`);
    }
    ok(`S6 ★ nenhum clínico gravado no vocabulário antigo (${linhas.length} linhas em pacientes.valores_estaveis + selecoes_protocolo.dados_clinicos) — viraria 🔴 silencioso`, legado.length === 0, legado.slice(0, 5).join(' | '));
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
