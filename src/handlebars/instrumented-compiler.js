var TemplateTranspiler = require('../transpiler');
var Runtime = require('./instrumented-runtime');
var DEFAULT_BACKEND = Runtime.DEFAULT_BACKEND;

module.exports = function(Handlebars) {

    if(!Handlebars || typeof Handlebars.compile !== 'function') {
        throw new Error('Invalid Handlebars')
    }

    // Instrument Runtime part of Handlebars
    Handlebars = Runtime(Handlebars);

    // Original compiler
    var JavaScriptCompilerDefault = Handlebars.JavaScriptCompiler;

    // Constructor & prototype
    var JavaScriptCompilerInstrumented  = function JavaScriptCompilerInstrumented() {};
    JavaScriptCompilerInstrumented.prototype = new JavaScriptCompilerDefault();
    JavaScriptCompilerInstrumented.prototype.constructor = JavaScriptCompilerInstrumented;

    // Multiple compilers are instantiated during the precompilation process via this.compiler().
    JavaScriptCompilerInstrumented.prototype.compiler    = JavaScriptCompilerInstrumented;

    // OVERRIDE: compile
    JavaScriptCompilerInstrumented.prototype.compile = function compile_instrumented_idom(environment, options, context, asObject) {
        options = options || {};
        if(options.backend == null) options.backend = DEFAULT_BACKEND;
        return JavaScriptCompilerDefault.prototype.compile.call(this, environment, options, context, asObject);
    };
    // OVERRIDE: pushSource
    JavaScriptCompilerInstrumented.prototype.pushSource = function pushSource_instrumented_idom(source) {
        if(this.options.backend != null && this.options.backend !== DEFAULT_BACKEND) {
            if (this.pendingContent) {
                // Push source without quoting
                this.source.push(this.appendToBuffer(this.pendingContent, this.pendingLocation));
                this.pendingContent = undefined;
            }
            if (source) {
                this.source.push(source);
            }
        } else {
            JavaScriptCompilerDefault.prototype.pushSource.call(this, source);
        }
    };
    // OVERRIDE: compilerInfo
    JavaScriptCompilerInstrumented.prototype.compilerInfo = function compilerInfo() {
        var revision = Handlebars.COMPILER_REVISION,
            versions = Handlebars.REVISION_CHANGES[revision];
        // Push backend type as 3rd argument of the compiler info.
        // This is accessibile as Handlebars.compile(spec).compiler[2]
        // or in a precompiled template BEFORE the spec is passed to Handlebars.template
        return [revision, versions].concat(this.options.backend || DEFAULT_BACKEND);
        // ***** TODO: ensure this.options.backend is ALWAYS SET
    };
    Handlebars.JavaScriptCompiler = JavaScriptCompilerInstrumented;

    // ==== COMPILE & PRECOMPILE

    var compile    = Handlebars.compile,
        precompile = Handlebars.precompile;

    Handlebars.compile = function compile_instrumented (input, options) {
        options = options || {};

        var transpilerOptions = options.transpilerOptions || {},
            backend = transpilerOptions.backend,
            output;

        if(TemplateTranspiler.supportsBackend(backend)) {
            var transpiler = new TemplateTranspiler(input, transpilerOptions);
            transpiler.generate(transpilerOptions, function(error, program) {
                if(transpilerOptions.debug) {
                    console.log('\n ------8<------\n', program.prettyPrint(), '\n ------>8------\n');
                }
                options.backend = backend;
                output = compile(program.toString(), options);
            });
        } else {
            output = compile(input, options);
        }
        return output;
    }

    Handlebars.precompile = function precompile_instrumented (input, options) {
        options = options || {};

        var transpilerOptions = options.transpilerOptions || {},
            backend = transpilerOptions.backend,
            output;

        if(TemplateTranspiler.supportsBackend(backend)) {
            var transpiler = new TemplateTranspiler(input, transpilerOptions);
            transpiler.generate(transpilerOptions, function(error, program) {
                if(transpilerOptions.debug) {
                    console.log('\n ------8<------\n', program.prettyPrint(), '\n ------>8------\n');
                }
                options.backend = backend;
                output = precompile(program.prettyPrint(), options);
            });
        } else {
            output = precompile(input, options);
        }
        return output;
    }

    return Handlebars;
};