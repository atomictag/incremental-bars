//var IncrementalDOM = require('incremental-dom');

// Get full instrumented version of Handlebars
var Handlebars = require('./handlebars');
var HTML_STRING_INPUT = '<div>hello: {{ world}} [{{ @backend }}] {{ type }}</world>';

console.log('\n======== PRE-COMPILE HTML')
var template   = Handlebars.precompile(HTML_STRING_INPUT);
var templateFn = Handlebars.template(eval('template =' + template));
var html       = templateFn({ world : 'world', type : 'precompiled' });
console.log('\n', html);

console.log('\n======== PRE-COMPILE IDOM')

var template   = Handlebars.precompile(HTML_STRING_INPUT, { transpilerOptions : { backend : 'idom', debug : true }});
console.log('\n', template);

console.log('\n======== COMPILE HTML')

templateFn   = Handlebars.compile(HTML_STRING_INPUT);
var html     = templateFn({ world : 'world', type : 'compiled' });
console.log('\n', html);

//var templateFn = Handlebars.template(eval('template =' + template));
//var html       = templateFn({ world : 'world', type : 'precompiled' });

module.exports = Handlebars;