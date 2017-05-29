var _    = require('underscore')._,
    fs   = require('fs'),
    path = require('path'),
    Handlebars = require('../../src/handlebars');

var DEFAULT_HANDLEBARS_OPTIONS = {};

var DEFAULT_TRANSPILER_OPTIONS   = {
    debug : false,
    minifyInput            : true,   // OPTIONAL (true): minify input removing whitespaces and carriage returns
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

var DEFAULT_BUILD_OPTIONS = {
    rootPath          : process.cwd(),               // Absolute path or the root folder from where src and dest are resolved
    srcDir            : 'templates',                 // Folder where template sources live, relative to rootPath. This is not recursive.
    destDir           : 'scripts',                   // Name of the output file script, generated in the destDir folder
    inputFileNames    : undefined,                   // Array of files to precompile. Leave undefined to precompile all templates in srcPath
    outputFileName    : 'templates.js',              // Name of the output file script
    partialPrefix     : '_',                         // String prefix to identify template partials (for auto-registration). Set to undefined to disable partials auto-registration.
    handlebarsOptions : DEFAULT_HANDLEBARS_OPTIONS,  // Handlebars options. Provide your own if DEFAULT_HANDLEBARS_OPTIONS (empty by default) is not what you want.
    transpilerOptions : DEFAULT_TRANSPILER_OPTIONS,  // Transpiler options. Provide your own if DEFAULT_TRANSPILER_OPTIONS is not what you want.
}

// Get all (valid) template paths in srcDir (or specified in inputFileNames)
var getTemplatePaths = function(options, callback) {
    var inputFileNames = options.inputFileNames;
    var templatesPath  = path.resolve(options.rootPath, options.srcDir);
    var templatesPaths = [];
    if(inputFileNames) {
        templatesPaths = inputFileNames.map(function(fileName) {
            return path.resolve(templatesPath, fileName);
        });
        callback(null, templatesPaths);
    } else {
        fs.readdir(templatesPath, function(err, entries) {
            if(err) callback(err);
            else {
                // Done callback invoked after all templates have been compiled
                var done = _.after(entries.length, function() {
                    callback(null, templatesPaths);
                });
                // Loop through all template file names
                entries.forEach(function(entry) {
                    var filePath = path.resolve(templatesPath, entry);
                    fs.stat(filePath, function(err, stats) {
                        if(err) callback(err);
                        else {
                            if(stats.isFile()) templatesPaths.push(filePath);
                            done();
                        }
                    });
                });
            }
        });
    }
}

// Precompile all templates in rootPath/srcDir. callback is invoked with an object containing
var precompileTemplates = function(options, callback) {
    var templatesPath  = path.resolve(options.rootPath, options.srcDir);
    getTemplatePaths(options, function(err, templatesPaths) {
        if(err) callback(err);
        else if(templatesPaths.length === 0) {
            callback(null, [], []);
        }
        else {
            var templates = {}, partials = [];
            var precompileOptions = _.chain(options.handlebarsOptions).clone().extend({ transpilerOptions : options.transpilerOptions }).value();
            // Done callback invoked after all templates have been compiled
            var done = _.after(templatesPaths.length, function() {
                callback(null, templates, partials);
            });
            templatesPaths.forEach(function(templatePath) {
                fs.readFile(templatePath, function(err, fileData) {
                    if(err) callback(err);
                    else {
                        try {
                            console.log('> precompiling', templatePath);
                            var precompiledData = Handlebars.precompile(fileData.toString(), precompileOptions);
                            var templateName = templatePath.match(/([^/]*)\./)[1];
                            templates[templateName] = precompiledData;
                            if(templateName.indexOf('_') === 0) {
                                partials.push(templateName);
                            }
                            done();
                        } catch(e) {
                            callback(e);
                        }
                    }
                });
            });
        }
    });
}

// We use Handlebars to generate the body of the script file containing all precompiled templates and statics
// For convenience this also adds the `Handlebars.template` override as in src/handlebars/instrumented-runtime.js
// Templates are looked up as `Handlebars.templates[templateName]`. See precompile.hbs.
var compileScriptTemplate = function(templates, partials, options, callback) {
    fs.readFile(path.resolve(__dirname, 'precompile.hbs'), function(err, outputTemplate) {
        if(err) callback(err);
        else {
            var transpilerOptions = options.transpilerOptions;
            var outputFn          = Handlebars.compile(outputTemplate.toString());
            var outputString      = outputFn({
                templates   : templates,
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
            callback(null, outputString);
        }
    });
}

var writeScriptFile = function(outputString, options, callback) {
    var destDirPath    = path.resolve(options.rootPath, options.destDir);
    var writeTemplateScript = function(err) {
        if(err) console.error(err);
        else {
            var outputFilePath = path.resolve(destDirPath, options.outputFileName);
            console.log('> writing precompiled templates script', outputFilePath);
            fs.writeFile(outputFilePath, outputString, callback);
        }
    }
    fs.stat(destDirPath, function(err, stat) {
        if(stat) {
            writeTemplateScript();
        } else {
            fs.mkdir(destDirPath, writeTemplateScript);
        }
    });
}

var precompile = function(options) {
    options = _.defaults(options || {}, DEFAULT_BUILD_OPTIONS);
    console.log('> rootPath is', options.rootPath);
    precompileTemplates(options, function(err, templates, partials) {
        if(err) console.error(err);
        else {
            compileScriptTemplate(templates, partials, options, function(err, outputString) {
                if(err) console.error(err);
                else {
                    writeScriptFile(outputString, options, function(err) {
                        if(err) console.error(err);
                        else {
                            console.log('> DONE.')
                        }
                    })
                }
            });
        }
    });
}

module.exports = precompile;
