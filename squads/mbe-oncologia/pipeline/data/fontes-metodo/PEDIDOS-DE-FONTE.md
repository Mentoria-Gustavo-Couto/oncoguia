# Pedidos de fonte de método — 2026-10-06

Mesmo papel que `output/2026-09-17-rederivacao-grade/PEDIDOS-DE-ARTIGO.md` tem para o dado: aqui
é o que faltou para **fechar o método**. Os quatro itens abaixo foram procurados pela escada
inteira (Crossref → Europe PMC → Unpaywall → OpenAlex → repositório institucional → site do
editor com UA de navegador) e não vieram.

Nenhum deles enfraquece uma regra classificada como **TEM FONTE**. Dois deles (1 e 2) são
pré-requisito para **escrever** o limiar que vai substituir a convenção aposentada — por isso o
pedido não é opcional: sem eles, as órfãs de imprecisão continuam órfãs.

| # | o que falta | citação | por que é necessário | o que já está na mão |
|---|---|---|---|---|
| 1 | **Texto completo da GRADE Guidance 34** | Zeng L *et al.*, *J Clin Epidemiol* 2022;150:216–224 · DOI 10.1016/j.jclinepi.2022.07.014 · PMID 35934265 | É a atualização oficial do domínio de imprecisão e já **derruba** a convenção do squad pelo abstract. Mas o critério substituto (abordagem por IC do efeito **absoluto** contra limiares, e os cenários de −2/−3) está no **corpo**, com tabela. Sem ele não há como escrever a regra nova. | abstract integral (Europe PMC), em `grade-guidance-34-imprecisao.md` |
| 2 | **Capítulo de imprecisão do GRADE Book** | <https://book.gradepro.org/guideline/imprecision> | O Handbook declara a própria seção 5.2 superada por este capítulo. É a versão corrente do que o squad usa como 1º nível. | nada — a página é aplicação JavaScript e não devolve texto a `fetch`; precisa de navegador ou exportação |
| 3 | **PDF do corrigendum de guidelines 6** | *J Clin Epidemiol* 2021;137:265 · DOI 10.1016/j.jclinepi.2021.04.014 | Fecha a trilha documental da única correção de limiar conhecida (400 → 800 por grupo, desfecho **contínuo**). | conteúdo da correção conferido em duas vias independentes (registro editorial do corrigendum; blog oficial da U.S. GRADE Network, 2021-08) e registrado em `grade-guidelines-6-imprecisao.md` §correção. **O conteúdo está conferido; o documento não está na mão.** |
| 4 | **PDF do Bassler 2010** | *JAMA* 2010;303(12):1180–1187 · DOI 10.1001/jama.2010.310 | Hoje a C4 se sustenta no abstract + na citação dentro de guidelines 6 §7 (ref. [5]). Para o referendo metodológico ler a meta-regressão (a dependência do viés com o nº de eventos) é preciso o corpo. | abstract (Resultados e Conclusões integrais), em `bassler-2010-interrupcao-precoce.md` |

## Por onde tentei

- **1 e 3:** `jclinepi.com` e `sciencedirect.com` devolvem **403** a `curl`/`WebFetch`, inclusive
  para o item 1, que o Unpaywall e o OpenAlex reportam como **CC BY**. É o comportamento esperado
  (mesma situação que o protocolo da task já descreve para NEJM/Wiley). Não há cópia em repositório:
  o OpenAlex só lista editora + PubMed. Para a **Guidance 35** (vizinha, DOI …07.015) existe cópia
  institucional aberta na AUB e ela **foi** obtida — é o que mostra que o problema é o item, não a
  escada.
- **2:** `book.gradepro.org` responde 200 com o invólucro da aplicação; nenhum texto de capítulo.
- **4:** `jamanetwork.com` serve o abstract e barra o PDF; Unpaywall `is_oa=false`, OpenAlex sem
  `oa_url`.

## Como entregar

Mesmo protocolo de `pipeline/data/artigos-fornecidos/`: PDF no disco, nome descritivo, linha no
`MANIFESTO.md` desta pasta com o que o arquivo é de fato. PDF fornecido pela direção é fonte
legítima de 1º nível — o que **não** é legítimo é escrever o limiar antes de ele chegar.
