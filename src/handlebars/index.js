var Handlebars = require('handlebars');
Handlebars  = require('./instrumented-compiler')(Handlebars);
module.exports = Handlebars;