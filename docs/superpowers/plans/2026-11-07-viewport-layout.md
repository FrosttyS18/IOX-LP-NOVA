# Ajuste da landing page à viewport

Objetivo: preservar a composição aprovada e dimensionar as seções desktop pela largura e altura disponíveis, mantendo imagens completas e texto legível.

Arquivos: `styles.css` para regras responsivas; `index.html` para o agrupamento do título e as proporções das barras; `section-effects.js` para manter a porcentagem junto da barra animada; `README.md` para registrar comportamento e verificações. Dados e ações permanecem preservados.

- [x] Medir as oito seções em 1920×1080 e identificar dimensões fixas excessivas.
- [x] Aplicar títulos e imagens fluidos no desktop e remover expansão horizontal do comparativo, mantendo respiros verticais fixos de 80/96 px.
- [x] Ajustar formulário e chamada final sem limitar a altura do conteúdo nem esconder controles.
- [x] Conferir 1920×1080, 1920×900, 1440×900, 1366×768, 2560×1080, 768×1024, 430×932 e 390×844; corrigir quebras reais. Não ampliar o escopo para 320 px.
- [x] Verificar navegação, formulário, simulador, proporções das imagens e dimensionamento da transição circular após redimensionamento.

Critérios: imagens sem recorte; conteúdo do legado com título e imagem inteiros na viewport desktop; respiros independentes da altura da janela; porcentagens próximas às barras; título equilibrado em 1366 px; sem overflow horizontal; conteúdo cresce naturalmente com zoom, mensagens e números maiores. Não forçar a seção inteira a caber em uma tela nem adicionar rolagem interna às seções.
