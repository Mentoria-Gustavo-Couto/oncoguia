# Pedidos de fonte de método — abertos em 2026-10-06, atualizados em 2026-10-07

Mesmo papel que `output/2026-09-17-rederivacao-grade/PEDIDOS-DE-ARTIGO.md` tem para o dado: aqui
é o que faltou para **fechar o método**. Os quatro itens originais foram procurados pela escada
inteira (Crossref → Europe PMC → Unpaywall → OpenAlex → repositório institucional → site do
editor com UA de navegador) e não vieram por ela.

**Estado em 2026-10-07: 1 aberto de 4.** Dois chegaram pela direção, um foi encerrado por
irrelevância. Nenhum dos quatro enfraquecia regra classificada como **TEM FONTE**.

| # | o que era | estado | saldo |
|---|---|---|---|
| 1 | Texto completo da GRADE Guidance 34 | **ATENDIDO 2026-10-07** | sustenta a `R4.g` nova; mantém `R1.d`/`R4.e` suspensas por falta de campo no esquema |
| 2 | Capítulo de imprecisão do GRADE Book | **ABERTO** — único | não bloqueia nenhuma regra hoje |
| 3 | PDF do corrigendum de guidelines 6 | **ENCERRADO POR IRRELEVÂNCIA 2026-10-07** | nenhum — não é pendência |
| 4 | PDF do Bassler 2010 | **ATENDIDO 2026-10-07** | dá corpo à `C4`, em vez de abstract |

---

## 1 — Texto completo da GRADE Guidance 34 · ATENDIDO

Zeng L *et al.*, *J Clin Epidemiol* 2022;150:216–224 · DOI 10.1016/j.jclinepi.2022.07.014 ·
PMID 35934265.

Entregue pela direção em **2026-10-07** como `zeng-2022-grade-guidance-34-imprecisao.pdf` (9 p.,
md5 `0e66e3622d4d4b32124f705e01eb977b`), conferido pela primeira página antes de ser citado.
Extrato com as frases literais em `grade-guidance-34-imprecisao.md`.

**O que o pedido esperava e o que realmente havia.** O pedido dizia que o critério substituto
estava "no corpo, com tabela". A Guidance 34 **não tem tabela nenhuma** — tem Boxes 1 a 5 e
Figuras 1 a 8; a "Table 1" era de *guidelines 6*, outro documento. O critério está nas Boxes, e o
pedido foi atendido.

**O que ele destravou — uma regra, não quatro.** A Box 5, circunstância 1, é operável com o que o
schema 2 já grava (`efeito.medida` e `efeito.ic95`): razão entre o limite superior e o inferior do
IC acima de 2,5 (OR) ou 3 (RR) manda considerar rebaixar dois níveis. Virou **`R4.g`**, `APLICADA`,
`metodologica`, com frase literal.

**O que ele NÃO destravou, e o motivo é de esquema, não de documento.** O critério *primário* da
fonte é a abordagem por IC do efeito **absoluto** contra limiares (Boxes 1 e 4), e a via alternativa
é o **cálculo** do OIS a partir da taxa de evento no controle e da RRR. O schema 2 não grava
nenhum dos três — IC absoluto, limiar/MID, taxa de evento no controle. Então `R1.d`, `R4.e` e
`R4.d` continuam suspensas, agora com o motivo em primeira mão.

**Não está no PDF:** o Appendix A (Examples 1–7) é suplementar e só existe online. Não bloqueia
nada — ilustra o critério, não o define. Se a rodada de limiares quiser os cálculos trabalhados,
é um pedido novo e pequeno, não uma pendência desta.

## 2 — Capítulo de imprecisão do GRADE Book · ABERTO

<https://book.gradepro.org/guideline/imprecision>

O Handbook declara a própria seção 5.2 superada por este capítulo, e é a versão corrente do que o
squad usa como 1º nível. **Nada na mão:** a página é aplicação JavaScript e não devolve texto a
`fetch`; precisa de navegador ou exportação.

**O que mudou na urgência depois de 2026-10-07:** caiu. A Guidance 34 sustenta a `R4.g` por
inteiro, sem depender deste capítulo. O que ainda pode mexer aqui é o que hoje está suspenso por
falta de campo no esquema — e mesmo isso provavelmente pede mudança de esquema, não só de leitura.
Continua valendo pedir; deixou de ser bloqueio.

## 3 — PDF do corrigendum de guidelines 6 · ENCERRADO POR IRRELEVÂNCIA

*J Clin Epidemiol* 2021;137:265 · DOI 10.1016/j.jclinepi.2021.04.014.

**Encerrado em 2026-10-07 por decisão da direção**, e o encerramento tem dois fundamentos, não um:

1. O **conteúdo** da correção já estava conferido por duas vias independentes (registro editorial
   do corrigendum; blog oficial da U.S. GRADE Network, 2021-08) e registrado em
   `grade-guidelines-6-imprecisao.md` §correção.
2. O **alcance** não toca regime nosso: a correção é de limiar de **desfecho contínuo** (400 → 800
   por grupo). Dos 50 blocos schema 2 do corpus, 2 usam medida de diferença, e nenhuma regra
   aplicada depende desse limiar.

Registrado aqui como **encerrado**, não como pendente — a diferença importa: pendência que não é
pendência contamina a leitura da lista e faz a única que falta parecer uma de quatro.

## 4 — PDF do Bassler 2010 · ATENDIDO

*JAMA* 2010;303(12):1180–1187 · DOI 10.1001/jama.2010.310.

Entregue pela direção em **2026-10-07** como `bassler-2010-jama-interrupcao-precoce.pdf` (9 p.,
md5 `9ae28895dc31ddc6874f404960fa6220`), conferido pela primeira página. Extrato em
`bassler-2010-interrupcao-precoce.md`, agora com o corpo.

**O que o corpo deu que o abstract não dava:** a meta-regressão. Table 2 mostra que, no modelo
multivariável, a **regra de parada estatística deixa de ser significativa** (β 0,07; IC −0,05 a
0,19; P=,24) e só o **número de eventos** permanece (β 0,02 por 100 eventos; P=,001) — e a nota da
tabela quantifica: o viés só desaparece com +1.714 eventos. A legenda da Figura 3 dá o gradiente
em três faixas (< 200 eventos: razão de RR 0,37; 200–500: 0,65; > 500: 0,88, todas significativas).

A `C4` continua `APLICADA` e passou a citar o **corpo** em vez do abstract.

**O que o corpo NÃO autoriza, e está escrito no extrato porque é a tentação óbvia:** as faixas de
200 e 500 eventos são descrição de um gráfico de dispersão, não critério GRADE. Transformá-las em
limiar de rebaixamento seria repetir o mecanismo que criou a convenção aposentada — número real,
tirado de fonte real, com função que a fonte não lhe dá. Bassler mede viés de estimativa; quantos
níveis o GRADE rebaixa é matéria de *guidance*.

---

## Chegou e não era pedido

**`artigo_2` = GRADE Guidance 35.** A direção enviou em 2026-10-07 um arquivo que era a Guidance 35
(DOI …07.015), idêntica por md5 à cópia que esta pasta já tinha desde 2026-10-06 —
**ignorado, nada mudou.** A conferência de identidade é a da direção: o arquivo não foi adicionado
à pasta, então não há segunda cópia aqui para comparar. A Guidance 35 segue adquirida e sem ser
`fonte` de nenhuma regra, reservada para a rodada de limiares (é o companion paper que a própria
Guidance 34 cita como referência [14] para os três níveis).

Isto **não** fecha o pedido 2: o que falta ali é o capítulo do GRADE Book, que é outro documento.

## Por onde se tentou, antes de a direção fornecer

- **1 e 3:** `jclinepi.com` e `sciencedirect.com` devolvem **403** a `curl`/`WebFetch`, inclusive
  para o item 1, que o Unpaywall e o OpenAlex reportam como **CC BY**. Sem cópia em repositório. Para
  a **Guidance 35** (vizinha, DOI …07.015) existe cópia institucional aberta na AUB e ela **foi**
  obtida — é o que mostra que o problema era o item, não a escada.
- **2:** `book.gradepro.org` responde 200 com o invólucro da aplicação; nenhum texto de capítulo.
- **4:** `jamanetwork.com` serve o abstract e barra o PDF; Unpaywall `is_oa=false`, OpenAlex sem
  `oa_url`.

## Como entregar o que falta

Mesmo protocolo de `pipeline/data/artigos-fornecidos/`: arquivo no disco, nome descritivo, linha no
`MANIFESTO.md` desta pasta com o que o arquivo é de fato, e conferência pela primeira página antes
de qualquer citação. Documento fornecido pela direção é fonte legítima de 1º nível — o que **não**
é legítimo é escrever o limiar antes de ele chegar.
