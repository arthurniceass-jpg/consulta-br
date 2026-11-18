// Config do Ionic + parser do Angular em TODOS os .html (o padrão só reconhece *.component.html
// e quebra a indentação dos blocos @if/@for nos arquivos *.page.html).
const ionic = require('@ionic/prettier-config');

module.exports = {
  ...ionic,
  overrides: [...ionic.overrides, { files: '*.html', options: { parser: 'angular' } }],
};
