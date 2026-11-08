# Landing page Grupo IOX

Landing page em HTML, CSS e JavaScript, com os elementos fornecidos pelo cliente e fonte Plus Jakarta Sans hospedada localmente. Sem bibliotecas de aplicação.

Implementado: hero, seção de estilo de vida, histórico do IOX 90, comparação de rendimentos de 2025, simulador histórico funcional, seção branca "Construa o seu legado", formulário de contato, chamada final e rodapé. A faixa da hero tem loop contínuo com duas sequências idênticas; cópias adicionais cobrem telas largas. Os cards flutuam suavemente e reagem ao mouse. A preferência por movimento reduzido desativa os efeitos e mantém a faixa rolável.

## Formulário

Campos e fluxo da LP de origem, conferidos em 07/11/2026: https://codex-iox-90-v1.grupoiox.pages.dev/iox-90/#conversa.

- `#contato` é o destino dos botões da hero, da segunda seção e da chamada final.
- Validação de nome, e-mail, telefone, faixa de investimento, qualificação e consentimento.
- A origem não envia nem armazena leads. Após validar, orienta o contato por `contato@iox.com.vc`. Esse comportamento foi mantido e a tela informa que os dados não foram enviados.
- A integração com um destino real de recebimento ainda precisa ser definida. Nenhum servidor, CRM ou envio foi adicionado.
- Sem JavaScript, o botão fica desabilitado e um contato por e-mail é exibido; os dados não são colocados na URL.
- A lista de faixas tem apresentação própria, seleção por mouse/teclado, Escape, Home/End e validação obrigatória. O campo nativo permanece como origem do valor. Checkbox e rádios preservam a semântica e o foco pelo teclado.

## Ajustes visuais e movimento

- O cabeçalho acompanha a rolagem no desktop e no celular. Os destinos dos links reservam espaço para a barra fixa.
- O botão de tema aparece ao lado do contato acima de 1000 px; no celular e no tablet, fica à direita do logo no rodapé. A escolha entre escuro e claro fica salva localmente; o padrão continua escuro. A troca revela a página inteira com um círculo partindo do botão acionado em 750 ms, usando View Transitions. Com movimento reduzido ou sem suporte à API, a mudança é imediata. Fotos e símbolo metálico preservam suas cores.
- No desktop, imagens e títulos usam limites de largura e altura da viewport, mantendo a proporção das imagens. O conteúdo do legado ocupa até 88% da altura disponível; a seção pode crescer além de uma tela.
- Os respiros verticais não diminuem com a altura da janela: 96 px por lado no desktop amplo e 80 px até 1750 px de largura. Tablet e celular mantêm os espaçamentos próprios. Não há zoom, escala ou desfoque aplicado à página inteira.
- Conferência responsiva final: 1920×1080, 1920×900, 2560×1080, 1440×900, 1366×768, 768×1024, 430×932 e 390×844, sem overflow horizontal. A revisão mobile considera larguras a partir de 390 px; as regras existentes abaixo disso foram preservadas.
- O título do comparativo equilibra a primeira frase e permite que a frase em semibold ocupe uma linha no desktop intermediário. As porcentagens acompanham a ponta das barras durante a animação, com intervalo de 18 px no desktop, 16 px no tablet e 12 px no celular.
- Comparativo de 2025, fontes e aviso do simulador compactados; imagem da segunda seção menor, mantendo proporções e transparência.
- Formulário e simulador usam a mesma superfície neutra e borda discreta dos cards. Os campos do formulário têm bordas ainda mais suaves, e o envio usa o botão arredondado do site.
- Fontes definidas anteriormente em 20 px reduzidas para 16 px, incluindo textos do comparativo, rótulos e porcentagens das barras, botões e resultados do simulador. Os respiros entre seções foram preservados. Intervalo entre formulário e chamada final reduzido.
- Barras e porcentagens animam uma vez quando o comparativo entra na tela, mantendo os valores finais acessíveis.
- Os títulos entram uma vez, com subida de 20 px e fade. O título da hero anima ao carregar a página durante 1400 ms, com progressão gradual e sem depender de scroll. Os demais títulos usam 600 ms e aguardam o scroll e uma margem de 120 px dentro da tela antes de animar. Sem desfoque, mudanças de tamanho ou alteração do layout. Sem JavaScript, na impressão ou com movimento reduzido, permanecem visíveis.
- O texto histórico do card da terceira seção usa 20 px no desktop, com tamanhos próprios mantidos no tablet e celular.
- A seção do legado começa preta e recebe branco por Circular Reveal: um círculo de borda definida cresce do centro do topo até cobrir os cantos da seção. O scroll dispara o preenchimento quando o topo da seção chega aos primeiros 80 px da tela (ou 8% da altura em telas menores), no início da leitura. O preenchimento dura 400 ms e termina mesmo se a rolagem parar. O título muda de contraste na área atravessada pelo círculo. Ao subir de volta pelo ponto de entrada, o círculo recolhe em 400 ms. Uma tolerância de 24 px evita alternância por pequenos movimentos na fronteira. Nenhuma das transições pausa pela metade.
- Movimento reduzido mantém as informações finais visíveis e, no tema escuro, a seção branca sem animação.
- No tema claro, a seção do legado inverte o mesmo efeito: começa clara, o círculo preenche de preto ao chegar e recolhe ao subir. O título mantém contraste durante a passagem; com movimento reduzido, a seção fica preta sem animação.
- Rodapé compactado com texto legal em 14 px, inclusive no celular.

## Simulador

Código e dados públicos de origem: https://codex-iox-90-v1.grupoiox.pages.dev/iox-90/ (consultados em 07/11/2026).

- `historical-series.js`: arquivo original preservado, com os quatro pontos de cada série e precisão anterior ao arredondamento.
- `simulator.js`: código completo do simulador extraído de `app.js`, com seu auxiliar de limitação e preferência de movimento locais. Preserva controles, validação de R$ 25 mil a R$ 100 milhões, formatação, desenho/animação do gráfico e atualização responsiva. O visual foi adaptado ao novo layout; acima de R$ 500 mil, os resultados usam linhas para acomodar números maiores.
- Nenhum envio de dados é feito pelo simulador; os cálculos ocorrem no navegador.
- Verificação dos cálculos: `node --test tests/simulator.test.mjs`.

## Prévia local

Sirva esta pasta com um servidor HTTP estático. O arquivo de entrada é `index.html`.

## Publicação no Cloudflare Pages

- A raiz pública contém `robots.txt`, `sitemap.xml` e `llms.txt`. O sitemap XML lista apenas a URL principal; as seções são âncoras da mesma página. O build remove as cópias antigas `robot.txt`, `llm.txt` e `sitemap.txt` da saída local. Atualizar os endereços desses arquivos e o link canonical se o domínio público mudar.
- Conta: Wesley Frostty.
- Repositório: `FrosttyS18/IOX-LP-NOVA`, branch `main`.
- Projeto: `iox-lp-nova`.
- Comando de build: `node scripts/build.mjs`.
- Diretório de saída: `dist`.
- O build usa apenas Node.js e copia os arquivos públicos e assets. Documentação, testes, arquivos temporários e dados de Git não entram na pasta publicada.
- O formulário mantém o fluxo de orientação por e-mail documentado acima; não há recebimento de leads configurado.

## Próximas etapas

- Revisão visual de todas as seções, do formulário e do rodapé com o cliente.
- Definição e implementação do destino real de recebimento dos contatos.
- Conferência da versão publicada em celulares reais com o cliente.

## Arquivos

- `index.html`: conteúdo semântico das oito seções, cabeçalho e rodapé.
- `styles.css`: composição desktop, adaptações responsivas e acessibilidade.
- `theme.css` e `theme.js`: cabeçalho fixo, tema claro, preferência local e transição circular entre temas.
- `script.js`: cobertura do loop responsivo e movimento dos cards ao mouse.
- `contact.js`: validações e fluxo de orientação por e-mail do formulário.
- `form-controls.js`: modalidade de foco, lista de seleção acessível e sincronização com o formulário.
- `section-effects.js`: animação do comparativo e transição do legado vinculada ao scroll.
- `assets/`: imagens de origem fornecida e fontes locais.

Textos, alegações e números reproduzem o material fornecido; a implementação visual não verifica informações financeiras.
