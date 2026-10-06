# Método com fonte — triagem das regras de calibração do eixo GRADE

**Data:** 2026-10-06 · **Escopo:** método. Nenhum regime foi re-derivado, nenhum valor foi reescrito,
o corpus e o `RUN_ATIVO` não foram tocados, os referendos em curso seguem como estavam e a página do
Drummond não foi aberta.

---

## 1. O que esta rodada corrigiu

A convenção de "efeito grande" (RRR ≥ 30% com limite superior do IC ≤ 0,85) foi criada pelo squad,
declarada na própria task como não canônica, e ainda assim governou a letra de regimes por semanas.

A hipótese de trabalho era que o defeito era de classe, não de caso. **Confirmada, e pior do que o
enunciado:** a convenção não preencheu uma lacuna da fonte. Ela decidiu, no sentido contrário, um caso
que a fonte já tinha decidido — **no abstract**, na segunda frase:

> "An exception to this rule occurs when an effect is large, and consideration of CIs alone suggests a
> robust effect, but the total sample size is not large and the number of events is small. **Under
> these circumstances, one should consider rating down for imprecision.**"
> — Guyatt *et al.*, GRADE guidelines 6, *J Clin Epidemiol* 2011;64:1283–1293

Efeito grande + IC aparentemente robusto + amostra pequena + poucos eventos é, para a fonte, a
**exceção que manda considerar rebaixar**. Era exatamente a configuração em que o squad dispensava o
rebaixamento. Ninguém precisava de um limiar novo: bastava ler até o fim do abstract.

Isso muda a natureza do achado. O problema não é que a regra era "não canônica" — é que ela era
**contrária à fonte**, e a declaração de não-canonicidade funcionou como anestésico: deu a sensação de
controle que tornou a leitura desnecessária.

---

## 2. Os três baldes

Classificadas **29 regras**: as 7 do Portão A decompostas em cláusulas (uma regra composta esconde uma
cláusula órfã dentro de uma sustentada), C1–C9, D3/D4, e as regras de forma. Fecham em
**22 + 5 + 2**. A R3.c é órfã **e** contrária à fonte; contei no balde 2, que é o mais grave.

**22 APLICADAS · 7 SUSPENSAS.** Registro completo, com a frase literal de cada uma, em
`agents/verificador-evidencia/tasks/rederivar-grade.md`, seção "Fonte de cada regra de calibração".

### Balde 1 — TEM FONTE (22)

| id | regra | documento · seção | tipo |
|---|---|---|---|
| R1.a | certeza A exige desenho que parte de A | Handbook §5.3; MS §4.6 | metodológica |
| R1.b | certeza A exige desfecho crítico duro | Handbook §3.4 | metodológica |
| R1.c | certeza A exige IC de 95% que exclui o nulo | guidelines 6 §11; Handbook §5.2.4.2 | metodológica |
| R1.e | certeza A exige os 5 domínios em 0 | guia-grade-certeza §5; Handbook §5.4 | metodológica |
| R2 | substituto sem SG rebaixa indireta e limita a certeza | Handbook §3.4/§5.2.3; MS §4.3 | metodológica |
| R3.a | RCT parte de A independente da fase | Handbook §5.1.1; MS §4.6 | metodológica |
| R3.b | braço único/basket/observacional partem de C | Handbook §5.3 | metodológica |
| R3.d | elevação só quando nenhum domínio foi rebaixado | Handbook §5.3; MS §4.7 | metodológica |
| R3.e | elevações só quando a inicial é C | Handbook §5.3, nota final | metodológica |
| R4.a | IC de 95% que não exclui o nulo rebaixa | Handbook §5.2.4.2 | metodológica |
| R4.b | IC reportado abaixo de 95% rebaixa (C3) | guidelines 6 §11 e abstract | metodológica |
| R4.c | diferença absoluta com IC incluindo 0 rebaixa | guidelines 6 §14 | metodológica |
| C4 | análise interina sem versão madura rebaixa | guidelines 6 §7 + Bassler 2010 | metodológica |
| R6.a | intervenção do pivô ⊇ fármacos do regime | Handbook §5.2.3 | metodológica |
| R6.b | comparador obsoleto rebaixa só se muda a decisão (C2) | guia-grade-certeza §3.3 | metodológica |
| R6.c | primário do pivô tem de ser positivo | MS Quadro 6, item 4 | metodológica |
| C9.a | certeza nunca acima da que a revisão declara | MS §1, princípio 1 | metodológica |
| F1 | certeza = aritmética dos domínios, piso D | guia-grade-certeza §5 | metodológica |
| F2 | 5 domínios, nota em {0,−1,−2}, `por` não vazio | guia-grade-certeza §3 | metodológica |
| C8 | desfecho curativo (SLD/iDFS/…) é duro | Handbook §3.1 + decisão C8 da direção | **institucional** |
| R5.b | forte a favor exige MCBS ≥ 3 / A-B | decisão D3 da auditoria 2026-09-17 | **institucional** |
| R5.c | não incorporado → direção contra | decisão D4 da auditoria 2026-09-17 | **institucional** |

**Nota sobre `institucional`.** A exigência de "frase literal da fonte" não pode ser aplicada
cegamente a toda regra, ou D4, R5.b e C8 caem — e o protocolo para de funcionar por excesso de rigor,
não por falta. A fonte **atribui** essas decisões ao painel/instituição: a balança benefício × dano ×
custo × valores é do decisor (MS §1, princípio 3), e a classificação de importância de desfecho é do
painel ("Guideline developers will also make a preliminary classification of the importance of the
outcomes", Handbook §3.1). Então criei dois tipos de `fonte`:

- `metodologica` — **única** que pode fixar limiar numérico; exige frase literal de `fontes-metodo/`;
- `institucional` — exige o **registro da decisão** (qual, de quem, quando) e **nunca** pode fixar
  limiar metodológico.

Essa separação é o que impede a etiqueta "institucional" de virar a porta por onde o número inventado
volta. Sem ela, "efeito grande ≥ 30% é decisão institucional" passaria.

### Balde 2 — CONTRADIZ A FONTE (5 regras, em 4 blocos)

#### R1.d / R4.e — o piso de 300 eventos e a dispensa por "efeito grande"

| o que o squad dizia | o que a fonte diz |
|---|---|
| "eventos < 300 → rebaixa por imprecisão" | **Table 1** de guidelines 6: `300 \| 30 \| Will meet threshold`. 300 eventos é o ponto em que o OIS **é atendido** com RRR 30%. Com RRR 30%, 200 eventos já bastam para risco de controle ≥ 25%. A tabela é régua de **suficiência**, não limiar de punição. |
| "efeito grande dispensa o rebaixamento" | **Abstract**: a mesma configuração é "an exception to this rule (…) one should consider rating down for imprecision". **Handbook §5.2.4.1**: "Large treatment effects in the presence of small sample sizes, even in RCTs, may be because of prognostic imbalance and **warrant caution**". **Guidance 34 (2022)**: "When the CI does not cross the threshold(s) and the relative effect is large, one should **implement** the optimal information size (OIS) approach." |
| "o OIS é um piso fixo" | §8: o OIS é **calculado** a partir da taxa de evento no **controle** e da RRR escolhida — dado que o schema 2 **não grava**. "if the best estimate of control event rate was 0.2 and one specifies an RRR of 25%, the OIS is approximately 2,000 patients." |
| a exceção ao OIS é efeito grande | §9: a exceção é **taxa de evento muito baixa com amostra muito grande** (≥ 2.000, talvez 4.000 pacientes), julgada pelo IC do efeito **absoluto**. |

E o caso-exemplo da fonte é uma refutação ponto a ponto. Box 3, "An example of fragility": RR com IC
**0,02–0,41** (RRR mínima plausível de 59% — muito além dos 30%/0,85 do squad), 20 eventos. A fonte
conclui: *"concluding that an RRR less than 59% is implausible on the basis of only 20 events violates
common sense"*. O squad teria chamado isso de precisão adequada.

Procedência dos dois números, para o registro: o **30%** existe na fonte, com outra função — "We have
suggested using RRRs of 20% to 30% for calculating OIS", insumo do cálculo do OIS. O **0,85** não tem
procedência nenhuma. O que havia era um eco distorcido da Table 1: a convenção acertou a relação
(RRR maior → menos eventos necessários) e a codificou como dispensa arbitrária em vez da régua que a
fonte é.

#### R3.c — "desenho de inicial C nunca chega a A"

Handbook, Table 5.9: efeito muito grande (RR > 5 ou < 0,2) "may increase 2 levels". Baixa + 2 = Alta.
E o manual do MS, §4.6.1, é explícito: *"o nível de evidência deve ser considerado alto, mesmo caso a
evidência tenha origem a partir de estudos observacionais."* Regra restritiva, sem caso no corpus —
correção de letra, não de valor.

#### R5.a — "força forte exige certeza ≥ B"

Handbook §1.2: *"strong recommendations can result from low or even very low confidence in effect
estimates."* E o manual do MS traz o **Quadro 12**, "Situações-modelo na qual uma recomendação forte
pode ser indicada a despeito de baixa ou muito baixa confiança em estimativas efetivas", com 5
condições. A primeira — *"Quando baixa qualidade de evidência sugere benefício numa situação de risco
de vida"* — é oncologia na prática, não exceção exótica.

#### R4.f — "−2 por eventos < 300 e IC que não exclui o nulo"

A fonte (§13) exige **três** condições, não duas: *"when there are very few events **and** CIs around
both relative **and** absolute estimates of effect that include both appreciable benefit **and**
appreciable harm"*. O squad trocou "very few events" por um número inventado (os exemplos da fonte são
**11 pacientes** e **20 eventos** — duas ordens de magnitude abaixo de 300) e "inclui benefício e dano
apreciáveis" por "não exclui o nulo", que é mais fácil de satisfazer. A regra correta é hoje
**inexprimível**: o schema 2 não grava o IC do efeito absoluto nem o limiar de importância.

### Balde 3 — ÓRFÃ (2)

| id | o que era | situação |
|---|---|---|
| R4.d | colchão de 0,95 / 1,05 no limite do IC | Nenhuma fonte fixa 0,95 nem 1,05. Órfã pura. O único número da fonte na vizinhança tem outra função: *"we suggest an RR of under 0.75 or over 1.25 as a rough guide"* para **benefício ou dano apreciável**, e serve a IC que **atravessa** o nulo, não a IC que o exclui raspando. |
| C9.b | revisão sem grau declarado → teto B | Órfã pura. Revisão sem GRADE declarado não é, por isso, evidência moderada: a certeza se avalia sobre o corpo pelos 5 domínios. A deferência à certeza **declarada** (C9.a) tem fonte e continua. |

### Fora do escopo da triagem

**Regra 7** (efeito transcrito) e **C1** (eventos dedutíveis) são regras de **procedência**, não de
calibração: não fixam limiar, estabelecem exigência probatória. **C6** (direção controversa →
`pendente_revisor`) e **C7** (referências adicionais) são de fluxo. Nenhuma entra na exigência de
`fonte`, e isso está dito no registro para ninguém "consertar" depois.

---

## 3. As duas suspeitas de partida: confirmadas, com uma correção

### (i) `guia-magnitude-precisao.md` §4 — CONFIRMADA

A terceira regra, literal: *"**Monitoramento de Eventos:** Rebaixe a certeza se o número total de
eventos acumulados for inferior a 300 (critério de estabilidade para desfechos dicotômicos)."* Sem
exceção para efeito grande, como suspeitado. A cláusula "sem efeito grande" da regra 4 do portão era
**enxerto** — não estava na ficha nem na fonte.

Correção à conclusão: a convenção cai, **mas a ficha também não se sustenta**. O "< 300 sem exceção"
da ficha é tão contrário à fonte quanto o enxerto, só em outra direção: inventa um piso onde a fonte
tem uma régua calculada. Não houve um lado certo nessa disputa. Por isso R4.e foi suspensa inteira, em
vez de "voltar ao que a ficha dizia" — que era a saída óbvia e estaria errada.

### (ii) `grade-framework.md` — CONFIRMADA

*"**Eleva** (observacional): efeito grande, gradiente dose-resposta, confundidores que reduziriam o
efeito."* E a fonte é mais explícita: Handbook §5.3.1 fala de *"body of evidence from observational
studies **not downgraded for any of the 5 factors**"*, e a Table 5.9 dá os números próprios do
mecanismo (RR > 2 ou < 0,5 para +1; > 5 ou < 0,2 para +2).

O empréstimo é indevido, e **em dois eixos**, não um:

1. **Lado errado da máquina.** Mecanismo de elevar evidência observacional usado para dispensar
   rebaixamento em RCT.
2. **Ordem proibida.** Handbook §5.3: *"Consideration of factors reducing quality of evidence **must
   precede** consideration of reasons for rating it up."* Elevação nunca cancela rebaixamento — ela só
   existe depois que nenhum rebaixamento se aplica. A convenção usava o mecanismo justamente **para**
   cancelar um. E o manual do MS §4.7 fecha: *"é desaconselhado elevar o nível de evidência devido à
   magnitude de efeito grande quando temos medidas de efeito imprecisas."*

Acrescento o que não estava na suspeita: o número também está errado **por folga**. RRR ≥ 30%
equivale a RR ≤ 0,70; o limiar da fonte para "grande" é RR < 0,5. A convenção era mais permissiva que
o critério que imitava, além de estar no eixo errado.

### Uma correção ao que o pedido afirmava sobre o manual do MS

O pedido dizia que o manual "não fixa número nenhum" e "não cita tamanho ótimo de informação, não
trata de interrupção precoce". Conferido na fonte, isso está parcialmente errado:

- **Menciona** tamanho ótimo da informação (§4.4) — sem calcular nenhum;
- **Trata** de interrupção precoce (Quadro 6, item 5) — como **limitação do estudo**, não imprecisão;
- **Fixa números** para grande magnitude de efeito (§4.6.1): RR > 2 / < 0,5 e RR > 5 / < 0,2.

A proibição continua valendo, **pelo motivo certo**: no domínio da imprecisão ele é conceitual e não
fixa limiar — então não pode sustentar um. Mas a formulação "não contém número nenhum" é falsa, e se
tivesse entrado na task como está, criaria a próxima pendência: alguém encontraria o RR > 2 lá e
concluiria que a proibição era desonesta. Está escrito no extrato
(`fontes-metodo/ms-conitec-sistema-grade.md`) com as duas coisas.

E há um achado útil nisso: o único limiar numérico de "efeito grande" que a fonte **institucional**
fixa não é o do squad, e está no mecanismo de elevação. O manual do MS, que o squad tinha em mãos,
continha a refutação.

### Duas disputas de domínio, registradas e não movidas

Não resolvi, porque mover domínio muda valor:

- **C4 (interrupção precoce).** O squad pendura em `imprecisao`; guidelines 6 discute em §7 (razão pela
  qual o IC engana); o manual do MS lista em **limitações do estudo** (risco de viés). As duas leituras
  têm fonte — o que não tem fonte é contar a penalidade **duas vezes**.
- **R6.c (primário positivo).** Na fonte é relato seletivo de desfechos → risco de viés. No squad vive
  no bloco `pivo`, com efeito sobre a certeza.

---

## 4. A regra estrutural e como o portão passou a cobrá-la

Cada regra tem `estado`, `fonte.tipo`, `fonte.ref` e `fonte.frase` (literal). **Regra sem `fonte` não
se aplica** — não é "aplica e avisa", não é "aplica e marca para referendo".

**Check [12] do Portão A** (novo, em `verificar_dados.py`) lê o registro da task e confere nos **dois
sentidos** contra a lista `REGRAS_APLICADAS` do código:

- toda regra que o código cobra está `APLICADA`, com `fonte.ref` e frase literal → senão **FALHA**;
- nenhuma regra marcada `SUSPENSA` está sendo cobrada → senão **FALHA**.

Nenhum lado vale sozinho. A task sem o código é promessa; o código sem a task é exatamente a situação
que criou a convenção. O [12] é check de **método**: roda mesmo quando não há bloco schema 2 no lote
— e no `RUN_ATIVO` de hoje não há, o que significa que um check de lote não pegaria nada.

Testado com 6 casos negativos, todos barrados como deviam: código cobrando regra suspensa; regra
aplicada com `fonte.frase` vazia; regra cobrada e ausente do registro; `fonte.tipo` inventado;
`SUSPENSA` sem dizer por que caiu; seção de registro removida da task.

### Suspender não reescreve valor

Isto importa e foi o cuidado central da implementação. Suspender significa **tirar do portão o poder
de decidir aquilo** — não recalcular nada. Como todas as cláusulas suspensas eram restritivas (geravam
FALHA), suspendê-las só pode **reduzir** falhas, nunca criar. Conferido: as quatro ondas de
re-derivação passavam antes e passam depois, sem FALHA nova.

A exceção que exigiu decisão foi **C8**. Suspendê-la transformaria SLD/iDFS em substituto nos 46
regimes de cenário curativo e dispararia o teto B em bloco — ou seja, **re-derivaria por efeito
colateral**, que esta rodada proíbe. Reclassifiquei como `institucional` (a fonte atribui a
classificação de importância de desfecho ao painel) e mantive **APLICADA**, com a pendência nomeada:
o painel que fez essa classificação foi o squad, não o oncologista. É a única `institucional` do
registro com referendo pendente. (O alcance — "46 regimes adjuvantes" — é o número declarado na própria
calibração C8 de 2026-09-17; não o recontei nesta rodada.)

No lugar do poder de decidir, o portão agora grava **exposição**: WARN nominal por regime onde o valor
dependia da convenção. Em vez de o portão escolher, o referendo vê.

### Exposição medida — exatamente 5 regimes

Reconstruí a convenção aposentada em código e apliquei aos blocos schema 2 para medir de quem a letra
dependia de fato:

| regime | onda | eventos | HR (IC 95%) | o que dependia |
|---|---|---|---|---|
| `renal-met-intalto-ipilimumabe-nivolumabe` | piloto-renal | — | 0,69 (0,59–0,81) | certeza **A** |
| `gastrico-tas102-nao-rotineiro` | onda-1 | 254 | 0,69 (0,56–0,85) | certeza **A** + imprecisão 0 |
| `crc-met-pembrolizumabe-msi` | onda-2 | 153 | 0,60 (0,45–0,79) | certeza **A** + imprecisão 0 |
| `crc-met-tas-bevacizumab` | onda-2 | 246 | 0,61 (0,49–0,77) | certeza **A** + imprecisão 0 |
| `colo-met-1l-pembrolizumabe-qt-cps1` | onda-3 | 274 | 0,60 (0,49–0,74) | certeza **A** + imprecisão 0 |

**Cinco** — o número do enunciado confere. Um sexto regime em `A` com eventos ausentes
(`crc-met-anti-egfr`) **não** dependia da convenção: passava por corpo de evidência Cochrane com
certeza declarada alta (C9).

Nenhuma dessas letras foi alterada. Todas estão em ondas **em referendo**, nenhuma publicada: o
`RUN_ATIVO` (`2026-09-17-intake-revisao-4/v1`) não tem bloco schema 2 — os 304 regimes publicados são
legado. **A convenção nunca chegou à tela.** Isso não a torna menos grave: ela estava a um referendo de
distância, e o referendo não tinha como pegá-la, porque a task declarava a convenção como se declarar
bastasse.

Note o padrão nas cinco linhas: eventos entre 153 e 274, HR entre 0,60 e 0,69, IC superior entre 0,74
e 0,85. É literalmente o perfil que o abstract de guidelines 6 nomeia como exceção que manda
**considerar rebaixar**, e que Bassler 2010 associa a ensaio interrompido cedo ("greatest in smaller
studies"; diferença grande com menos de 500 eventos). Não é coincidência de cinco casos: é a
assinatura do viés que a regra da fonte existe para conter.

---

## 5. Aquisição — `pipeline/data/fontes-metodo/`

PDFs no `.gitignore`; versionados o `MANIFESTO.md`, o `PEDIDOS-DE-FONTE.md` e os `.md` de extrato com
as **frases literais** citadas como `fonte`. Texto integral de editora não entra no repositório —
mesmo argumento de `artigos-fornecidos/` e de `squads/**/fontes/*`.

| # | documento | licença | estado |
|---|---|---|---|
| a | GRADE guidelines 6 (Guyatt 2011, DOI 10.1016/j.jclinepi.2011.01.012) | © Elsevier | **obtido**, 18 p. |
| b | GRADE Handbook (Schünemann *et al.*, out. 2013) | © GRADE WG, sem licença aberta | **obtido**, HTML integral |
| d | Diretrizes metodológicas: Sistema GRADE (MS, 2014) | **CC BY-NC-SA 4.0** | **obtido**, 1,4 MB |
| f | GRADE guidance 35 (2022, DOI …07.015) | CC BY (repositório AUB) | **obtido**, 24 p. — adquirido, não usado como `fonte` nesta rodada |

Todas as citações foram conferidas contra o arquivo baixado, e cada citação (título, autores, volume,
páginas, ano) contra o **Crossref**. A lista de autores da Guidance 34 foi conferida antes de entrar
no manifesto — era correta, mas eu a tinha escrito de memória, que nesta rodada não conta como fonte.

### Não conseguido (4) — pedidos em `fontes-metodo/PEDIDOS-DE-FONTE.md`

| # | o que falta | por que bloqueou | o que tenho |
|---|---|---|---|
| 1 | **Texto completo da GRADE Guidance 34** (2022;150:216–224, DOI …07.014) | Elsevier devolve **403** ao bot — **apesar de o Unpaywall e o OpenAlex reportarem CC BY**. Sem cópia em repositório. | **abstract integral** (Europe PMC), que já contém a frase operativa |
| 2 | **Capítulo de imprecisão do GRADE Book** (`book.gradepro.org/guideline/imprecision`) | Aplicação JavaScript; responde 200 com o invólucro, sem texto | nada |
| 3 | **PDF do corrigendum de guidelines 6** (2021;137:265) | Elsevier 403 | **conteúdo da correção conferido em duas vias independentes** (registro editorial; blog oficial da U.S. GRADE Network) |
| 4 | **PDF do Bassler 2010** (*JAMA* 2010;303:1180–7) | Paywall JAMA; Unpaywall `is_oa=false` | abstract (Resultados e Conclusões integrais) |

Que a escada funciona está provado pelo vizinho: a **Guidance 35** (DOI consecutivo) tem cópia
institucional aberta na AUB e **foi** obtida. O bloqueio é por item, não por método.

**Nenhum dos quatro enfraquece uma regra do balde 1.** Dois (1 e 2) são **pré-requisito para escrever
o substituto** das órfãs de imprecisão — e é por isso que o pedido não é opcional.

### A errata pedida: encontrada, e o alcance importa

Corrigendum de **2021;137:265**, DOI 10.1016/j.jclinepi.2021.04.014 — dez anos depois do artigo. Ele
corrige **um limiar**: o cálculo de amostra para desfecho **contínuo** passa de "approximately 400
(200 per group)" para **800 (400 por grupo)** (α 0,05, β 0,20, efeito de 0,2 DP).

Duas consequências:

1. **Não muda nada no corpus de hoje.** O eixo é dominado por HR/medidas de razão; a correção é de
   desfecho contínuo. Não toca o OIS em eventos, a Table 1, nem a exceção dos 2.000/4.000 pacientes.
   A instrução do pedido ("se houver correção de limiar, é ela que vale") está cumprida e o efeito
   prático é zero — o que é um resultado, não uma decepção.
2. **O Handbook de 2013 ainda reproduz o número errado.** Quem seguir a ficha de 2º nível para
   desfecho contínuo usará 400. Está anotado no extrato, e é um exemplo limpo de por que a hierarquia
   é ordenada: a atualização chega primeiro à fonte, depois (ou nunca) às fichas.

### Fontes novas que o pedido não previu, e por que entraram

O Handbook declara, no cabeçalho da própria seção de imprecisão: *"Section 5.2 has been updated in the
new GRADE Book"*. Ignorar isso seria repetir o defeito desta rodada — aplicar método por leitura
parcial. Então busquei a atualização e achei duas: **Guidance 34** (2022, imprecisão, abordagem
minimamente contextualizada) e **Guidance 35** (2022, certeza contextualizada).

A Guidance 34 **endurece** o que já estava caído, e vale registrar o que ela muda para a frente: o
critério primário passa a ser o IC do efeito **absoluto** contra limiares, e revisão sistemática e
diretriz passam a ser **alinhadas** (guidelines 6 as tratava com critérios separados). O schema 2 hoje
só grava o IC relativo e não tem campo de limiar. **É buraco de esquema, não de valor** — registrado,
não corrigido aqui.

---

## 6. Revisão do agente — `verificador-evidencia.agent.md`

- **Hierarquia de fontes** explícita e ordenada (1º GRADE guidelines/guidance + Handbook → 2º fichas
  do Guyatt → 3º manual do MS, nunca limiar), com o conflito concreto já nomeado: onde a ficha
  discordar da fonte, a ficha perde.
- **Never Do**, três itens novos: criar limiar que a fonte não fixa mesmo declarando convenção;
  **emprestar mecanismo de um lado do GRADE para o outro**; citar o manual do MS para número que ele
  não contém.
- **Always Do**: citar a frase literal ao invocar regra de calibração; tratar regra sem `fonte` como
  não aplicável; e não confundir certeza baixa com recomendação fraca.
- **Quality Criteria**: nenhuma regra aplicada sem `fonte` com frase literal; nenhum limiar numérico
  fora de `fontes-metodo/`.
- **Vocabulary `imprecisão`**: era *"IC largo cruzando o efeito nulo"*. Agora são as **quatro** frentes
  — limiar de decisão clínica (critério primário), OIS (necessário e **calculado**), contagem de
  eventos e fragilidade, e limites que levam a recomendações opostas — com a exceção correta ao OIS
  (taxa de evento baixa + amostra ≥ 2.000, pelo IC **absoluto**), não "efeito grande".

### Outra coisa que estava com o nome errado

`pipeline/data/grade-handbook.md` **não era** o GRADE Handbook: era o índice das fichas MBE. O nome
prometia fonte canônica e entregava mapa interno — e foi debaixo dessa confusão que limiar sem fonte
circulou como se fosse GRADE. Renomeado para `indice-guias-mbe.md` (10 referências repontadas), com o
Handbook de verdade em `fontes-metodo/`. O relatório histórico da fundação
(`output/2026-09-17-rederivacao-grade/fundacao/`) ficou **intocado**: ele registra o que aquele run
dizia, e reescrevê-lo falsificaria o registro.

---

## 7. O que ficou aberto

Em ordem de quem destrava:

1. **Direção — fornecer os 4 documentos** de `PEDIDOS-DE-FONTE.md`. Sem os itens 1 e 2, as quatro
   órfãs de imprecisão continuam órfãs: tenho o suficiente para **derrubar** a convenção, não para
   **escrever** o substituto.
2. **Revisor metodológico — 7 decisões**, uma por regra suspensa (tabela "Regras órfãs e contrárias à
   fonte", no fim da task). Três não dependem de documento: **R3.c** e **C9.b** se resolvem aceitando a
   fonte, e **R5.a** depende de decidir se o OncoGuia adota as 5 situações-modelo do Quadro 12 como a
   porta de exceção para recomendação forte com certeza baixa.
3. **Revisor — referendar C8.** É a única `institucional` sem decisão de quem tem alçada, e sustenta os
   regimes de cenário curativo (46 adjuvantes, pelo número da calibração C8).
4. **Revisor — as duas disputas de domínio** (C4 em imprecisão × risco de viés; R6.c no bloco `pivo` ×
   risco de viés). O risco concreto é dupla contagem.
5. **Esquema — depois dos documentos.** O schema 2 não grava taxa de evento no controle, IC do efeito
   absoluto, nem limiar de importância. Sem esses três campos, a regra de imprecisão da fonte é
   inexprimível, e não só difícil.
6. **Cinco regimes com exposição declarada.** Nada a fazer até (1) e (2); o portão os lista a cada
   rodada e nenhum está publicado.

### Uma observação que não me pediram

A auditoria de 2026-09-17 fechou o atalho "fase 3 + SG → 1A" exigindo checklist. A convenção de "efeito
grande" entrou na **mesma** calibração de 2026-09-17 — ou seja, o checklist que corrigia a invenção
anterior já nasceu com uma invenção dentro, no mesmo dia e no mesmo documento. O mecanismo foi o mesmo
das duas vezes: um número
plausível entra como operacionalização, ninguém abre a fonte porque a planilha já tem a coluna
preenchida, e a estrutura dá à invenção a aparência de derivação. Checklist não substitui fonte — ele
só torna a ausência dela mais difícil de ver. O que o check [12] faz é diferente em espécie, não em
grau: ele não pede que alguém se lembre de conferir; ele **impede** a aplicação. É isso que o balde
"não aplica" compra, e é por isso que a opção "aplica e marca para referendo" tinha de ser recusada.

---

## Rastro

- `pipeline/data/fontes-metodo/` — 4 documentos obtidos, 5 extratos com frases literais, manifesto,
  pedidos
- `pipeline/data/indice-guias-mbe.md` — renomeado de `grade-handbook.md`, hierarquia declarada
- `agents/verificador-evidencia/tasks/rederivar-grade.md` — regra estrutural, registro de 29 regras,
  tabela de órfãs
- `agents/verificador-evidencia.agent.md` — hierarquia, anti-patterns, always-do, critérios,
  vocabulário de imprecisão
- `verificar_dados.py` — check [12]; R1.d/R3.c/R4.d/R4.e/R4.f/R5.a/C9.b suspensas; WARN de exposição
- `PORTAO-VERIFICACAO.md` — [11] e [12] documentados no Portão A
- `.gitignore` — PDFs de `fontes-metodo/`

Portão A: **passou**, 4 ondas de re-derivação e o `RUN_ATIVO`, sem FALHA nova.
Check [12]: 22 aplicadas com fonte e frase literal, 7 suspensas, **nenhuma em uso**.

**Portão C (mérito clínico) é do oncologista.** Nada aqui carimba mérito clínico — a rodada mexeu em
quem pode fixar um número e com base em quê, não em nenhuma conduta.
