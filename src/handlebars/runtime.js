var Handlebars = require('handlebars');
Handlebars  = require('./instrumented-runtime')(Handlebars);
module.exports = Handlebars;