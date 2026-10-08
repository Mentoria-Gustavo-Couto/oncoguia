# Backlog — pendências registradas (OncoGuia)

Itens deixados **explicitamente em aberto** no código, com o gancho já no lugar. Cada um
diz o que falta, quem decide e onde está o gancho. Pendência registrada é pendência que
alguém pode fechar; pendência implícita vira dado inventado.

---

## 1. Listas de exames de reestadiamento por tumor (guia SADT)

**Estado:** gancho no lugar, devolvendo vazio de propósito.

- **Gancho:** `examesReestadiamento(tumor)` em `app/index.html` — hoje `return []`.
- **Onde aparece:** botão **Gerar guia SADT** no item de reestadiamento da trilha do
  paciente — hoje a guia TISS SP/SADT, bloco *Procedimentos ou Itens Assistenciais
  Solicitados* (campos 24–28). Com o gancho vazio, a guia abre com as **5 linhas do
  formulário oficial** em branco e o médico **digita os exames na hora** (o código TUSS ao
  lado é opcional e também digitado). O fluxo está completo e funcionando assim — a lista
  por tumor é conveniência, não pré-requisito.
- **O que falta:** as listas de exames por tumor (ex.: mama → TC de tórax/abdome, cintilografia
  óssea…) precisam ser **definidas pelo oncologista de referência na Revisão clínica**, do
  mesmo jeito que o resto da camada clínica: informação assinada por humano, não derivada
  por agente.
- **Por que NÃO foi feito agora:** escrever essas listas aqui seria protocolo escrito à mão
  dentro da app — exatamente o que este projeto não faz (tudo vem do corpus do squad ou da
  Revisão clínica). Um agente sugerindo "exames de rotina" é palpite com cara de protocolo.
- **Como fechar quando houver decisão clínica:** persistir as listas na camada de revisão
  (uma decisão por tumor, como os pareceres em `revisoes`), expor no payload que a app já
  carrega e trocar o corpo do gancho pela leitura desse dado. Nenhuma outra parte da guia
  muda: `abrirSADT()` já usa o retorno do gancho para pré-preencher as linhas de
  `SADT.proc` (descrição + quantidade 1), respeitando o limite de 5 do formulário. **O
  código TUSS continua fora do gancho** — ele não é decisão clínica e a app não o gera;
  virá da tabela da operadora ou da mão do humano.

**Portão:** o check `R14 gancho examesReestadiamento(tumor) devolve vazio (pendência
registrada)` em `scripts/portao-retorno.js` falha no dia em que alguém preencher isso à mão
sem passar pela Revisão clínica — é o alarme desta pendência.

---

## 3. ~~`/evidencia` guardado por whitelist literal, não por "qualquer autenticado"~~ — FECHADO

Fechado em 2026-09-14, na mudança de backend do perfil **secretaria** — exatamente o "próximo
perfil novo" que a pendência previa. `backend/src/auth/corpus.guard.ts` (`CorpusGuard`):
whitelist literal `['oncologista','revisor','auditor','gestor','admin']` no
`EvidenciaController`, com o comentário combinado (*corpus é público interno por decisão;
perfil novo entra conscientemente*). A secretaria é o primeiro perfil que **não** entra —
decisão tomada, não herdada. Efeito para os cinco: inalterado.

**Portão:** `scripts/portao-secretaria.js`, checks `E0` (secretaria → 403) e `E1` (os cinco
perfis → 200, **afirmativo**: a lista completa é a intenção, e um sumiço acidental de perfil
da whitelist falha aqui, não em produção).

---

## 2. ~~Tipo "Autorização" na trilha do paciente~~ — FECHADO

Fechado no merge das duas features (2026-09-02). A trilha traz os três tipos: `avaliacao`,
`retorno` e `autorizacao`. A decisão do auditor entra como item próprio **no dia em que foi
decidida** (quase nunca o dia da seleção), com selo ⏳/✅/⛔ e o parecer; a solicitação em si
viaja no item da avaliação, que é onde ela nasceu. Ordenação inalterada: dia → instante do
registro → id → tipo.

---

## 4. Quatro campos de exame declarados sem regra que os leia (Rodada B / Fase 2a)

**Estado:** campos no vocabulário, formulário mostrando, **nenhuma regra referenciando**.

A pergunta aqui **não é "pode apagar?"** — é **"falta regra?"**. Os quatro foram declarados
por alguém que tinha um critério clínico em mente; o que não existe é a expressão de
elegibilidade que os usa. Apagar por silêncio apagaria a intenção junto, e é por isso que
eles não entraram nas 6 remoções limpas da Fase 2a (essas eram redundâncias comprovadas,
não intenções pendentes).

Quem decide: **oncologista de referência**, junto com a Fase 2b.

| Campo | Tumor | Pergunta ao revisor |
|---|---|---|
| `clcr` — Clearance de creatinina | mama | Entra em alguma elegibilidade (ex.: piso de função renal para platina/capecitabina), ou é só insumo de dose e deve sair do formulário de elegibilidade? |
| `metastase_visceral` | próstata | É o critério de **alto volume** (CHAARTED) que separa quem recebe docetaxel na mCSPC? Se sim, qual a definição que vale aqui — e em quais regimes ela entra? |
| `assintomatico_ou_pouco_sintomatico` | próstata | É o critério de abiraterona **pré-quimioterapia** (COU-AA-302)? Em qual(is) regime(s) ele deveria aparecer como inclusão? |
| `contraindicacao_bleomicina` | testículo | Deveria **excluir** BEP/PEB (ex.: disfunção pulmonar) e abrir o caminho de VIP/EP? Em quais regimes, e como exclusão ou como inclusão do alternativo? |

**Gancho:** os quatro estão em `campos_primitivos` do RUN_ATIVO e aparecem no formulário.
Fechar = escrever a `elegibilidade.regra` (ou `criterios[].expr`) que os lê, no próximo
lote de intake, e o check `[4] campos órfãos` do Portão A passa a cobri-los de verdade.
Se a resposta for "não falta regra, o campo não serve", aí sim vira remoção — e aí o
check **S7** do `portao-semaforo` ganha mais quatro nomes.

**Relacionado:** `histologia_salivar` (cabeça e pescoço) é o mesmo caso, com um agravante:
foi criado no lote 4 **com `rotulos` e `indeterminado` completos** — o campo mais bem curado
do corpus — e os 3 regimes de glândula salivar não o referenciam. Não entrou na remoção
porque `scripts/portao-lote4.js` o afirma (checks L1 e L3): removê-lo quebra aquele portão.

---

## 5. O −2 de imprecisão não alcança HR — 38 de 50 blocos descobertos (rodada do método)

**Decidido em 2026-10-07 pelo revisor metodológico:** a `R4.g` **não** se estende a HR.

A regra que a Guidance 34 destravou (razão entre os limites do IC de 95% acima de 2,5 para
OR ou 3 para RR ⇒ considerar −2) foi derivada de simulação para **desfecho dicotômico**, em
meta-análise em rede (guidelines 33, referência [12] da Guidance 34). Razão de risco
**instantâneo** não está nessa derivação. Aplicá-la a HR seria tirar o número de onde foi
deduzido e usá-lo onde não foi — o mesmo movimento que aposentou a convenção de "efeito
grande". Ver a regra (c) do `CLAUDE.md`.

**O tamanho da lacuna, medido:** dos 50 blocos schema 2 das quatro ondas, **38 usam HR**, 2
usam diferença absoluta, 9 não têm bloco de efeito e **1** usa RR. A `R4.g` alcança esse 1 —
que não cruza o limiar (razão 1,23). Hoje a regra não protege nenhum bloco real do corpus.

**Procurado e não encontrado** (2026-10-07, escopo declarado): `hazard` aparece **zero** vezes
em GRADE guidelines 6, **zero** na Guidance 34 e **zero** na Guidance 35; a Guidance 35
organiza o domínio em dois baldes e nenhum é tempo-até-evento (§4.2 dicotômico, §4.3
contínuo). A série numerada posterior, varrida no Crossref (J Clin Epidemiol desde 08/2022):
36 inconsistência · **37 imprecisão em acurácia de teste** · 38 dose-resposta · 39
ADOLOPMENT · 40 EtD ambiental · 44 randomizados e não-randomizados — nenhuma trata HR. Busca
ampla no Europe PMC devolve milhares de *aplicações* do GRADE a desfecho de tempo até evento
e nenhuma *guidance* sobre como graduar imprecisão nele. Não é prova de inexistência; é o
alcance da busca, declarado.

**Quem fecha:** ninguém do squad pode fechar escrevendo um limiar — seria órfão, e a regra
estrutural o barra. Fecha de dois modos: (a) aparecer guidance GRADE de tempo-até-evento, e
aí a regra se escreve com frase literal; (b) o revisor metodológico decidir converter HR em
medida que a fonte cobre, com fonte para a conversão. Até então, **o −2 de imprecisão é
inaplicável a 38 dos 50 blocos, e isso está nomeado em vez de disfarçado.**

## 6. `piloto-renal` falha o check [8] do Portão A — falha PRÉ-EXISTENTE, com dono

**Sintoma:** `python3 squads/mbe-oncologia/verificar_dados.py
squads/mbe-oncologia/output/2026-09-17-rederivacao-grade/piloto-renal` devolve
`✗ FALHA: por-tumor DIVERGE do agregado publicado (fonte dupla inconsistente) (10)` — os 10
regimes da onda. As outras três ondas (1, 2, 3) passam.

**Não é regressão, e isto foi verificado, não suposto:** a mesma falha aparece rodando a
versão de `verificar_dados.py` de `HEAD` (`git show HEAD:… > tmp.py`) contra o mesmo
diretório. Conferido em 2026-10-07, ao acrescentar a `R4.g`. Registrado aqui para não virar
folclore do tipo "o piloto-renal sempre falha, ignore" — que é como um defeito real se
esconde atrás de uma falha conhecida.

**Causa provável, NÃO confirmada:** o piloto renal foi a primeira onda de re-derivação e
nunca foi promovido ao agregado publicado; o check [8] compara por-tumor contra o agregado do
RUN_ATIVO, e o renal publicado é legado schema 1. Se for isso, a falha é o check medindo uma
comparação que não faz sentido para esta onda — e a correção é o check declarar escopo (regra
(a) do `CLAUDE.md`: dizer ONDE olhou e contra o quê), não silenciar a onda.

**Quem decide:** quem mantém o Portão A. Duas saídas legítimas: (a) o [8] reconhecer onda de
re-derivação não publicada e reportar SKIP com o motivo impresso; (b) promover o piloto ao
agregado, se for essa a intenção. **Não** é saída aceitável adicionar o piloto a uma lista de
exceções sem dizer por quê — isso é a fotografia que a regra (b) proíbe.
