
var Handlebars = require('../../src/handlebars');
var fs = require('fs');
var path = require('path');

var precompiledTemplates = {};
var partials  = [];
var templatesStatics    = {};
var transpilerOptions   = {
    backend : 'idom',                // REQUIRED: Suppoorted backends: idom, html (to use default Handlebars)
    functionMap : {                  // OPTIONAL: What function names should be generated for the various opcodes for this backend (see shared/opcodes.js).
        'elementOpen'      : '_o',
        'elementVoid'      : '_v',
        'elementClose'     : '_c',
        'text'             : '_t',
        'elementOpenStart' : '_os',
        'elementOpenEnd'   : '_oe',
        'attr'             : '_at',
        'skip'             : '_s'
    },
    hoistedStatics           : {},                // OPTIONAL (undefined). An object that will hold hoisted static string references (falsy value to disable)
    generateKeysForStaticEl  : false,             // OPTIONAL (false). Whether keys should be auto-generated for elements with only static properties (not recommended)
    generateKeysForAllEl     : true,              // OPTIONAL (true). Whether keys should be auto-generated for ALL elements (recommended, takes precedence over generateKeysForStaticEl)
    skipBlockAttributeMarker : 'data-partial-id', // OPTIONAL (data-partial-id). The attribute marker for elements that need to generate a 'skip' instruction (falsy to disable)
    emptySkipBlocks          : true,              // OPTIONAL (true). Whether instructions within skip blocks should be ignored / not be generated
    safeMergeSelfClosing     : true,              // OPTIONAL (true). Whether it is safe to merge open / close on ALL tags (true because this is safe with idom backends)
};
var handlebarsOptions = {
    transpilerOptions : transpilerOptions
};

var templatesPath  = path.resolve(__dirname, 'templates');
var templates = fs.readdirSync(templatesPath);
for (var i=0; i < templates.length; i++) {
    var fileName = templates[i];
    var filePath = path.resolve(templatesPath, fileName);
    var fileData = fs.readFileSync(filePath);
    var precompiledData = Handlebars.precompile(fileData.toString(), handlebarsOptions);
    var templateName = fileName.replace(/(.*?)\.html/, '$1');
    precompiledTemplates[templateName] = precompiledData;
    if(templateName.indexOf('_') === 0) {
        partials.push(templateName);
    }
}

// We use Handlebars to generate the body of the script file containing all precompiled templates and statics
// For convenience this also adds the `Handlebars.template` override as in src/handlebars/instrumented-runtime.js
// Templates are looked up as `Handlebars.templates[templateName]`
var outputTemplate = fs.readFileSync(path.resolve(__dirname, 'build.hbs'));

// Build
var outputFn     = Handlebars.compile(outputTemplate.toString());
var outputString = outputFn({
    templates   : precompiledTemplates,
    partials    : partials,
    backend     : transpilerOptions.backend,
    statics     : transpilerOptions.hoistedStatics,
    functionMap : transpilerOptions.functionMap
}, {
    helpers : {
        stringify   : function(o) { return typeof o === 'string' ? '"' + o + '"' : JSON.stringify(o); },
        mapOpcode   : function(opcode, backend, options) {
            if(backend === 'idom') {
                return 'IncrementalDOM.' + opcode;
            } else {
                return opcode;
            }
        }
    }
});

// We use Handlebars to generate the body of the script file containing all precompiled templates and statics
// For convenience this also adds the `Handlebars.template` override as in src/handlebars/instrumented-runtime.js
// Templates are looked up as `Handlebars.templates[templateName]`
var genPath    = path.resolve(__dirname, 'gen');
var writeTemplateScript = function(err) {
    if(err) {
        console.error(err);
    } else {
        var outputPath = path.resolve(genPath, 'precompiled.js');
        fs.writeFile(outputPath, outputString, function(err) {
            if(err) { return console.log(err); }
            console.log('> template script generated in:', outputPath);
        });
    }
}
fs.stat(genPath, function(err, stat) {
    if(stat) {
        writeTemplateScript();
    } else {
        fs.mkdir(genPath, writeTemplateScript);
    }
});