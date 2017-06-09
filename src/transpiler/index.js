var _ = require('underscore')._;
var HtmlParser = require('htmlparser2').Parser;
var HtmlMinify = require('html-minifier').minify;

var Utils = require('./shared/utils');
var Opcodes = require('./shared/opcodes');
var Constants = require('./shared/constants');
var DatasetCollector = require('./dataset-collector');
var AttributesCollector = require('./attributes-collector');

var DEFAULT_OPTIONS   = {
    minifyInput                : true,                  // Minify input removing whitespaces and carriage returns
    skipBlockAttributeMarker   : 'data-partial-id',     // The attribute marker for elements that need to generate a Opcodes.SKIP instruction
    emptySkipBlocks            : true,                  // Whether instructions within skip blocks should not be generated
    safeMergeSelfClosing       : true,                  // Whether it is safe to merge open / close on ALL tags
    extractDatasets            : [ ],                   // FUTURE FEATURE - DON'T USE
    datasetsControlBlockSuffix : 'datasets'             // FUTURE FEATURE - DON'T USE
};


var TemplateTranspiler = function(html, options) {
    this.html = html;
    this.options = _.defaults(options || {}, DEFAULT_OPTIONS);
    this.onreset();
}

_.extend(TemplateTranspiler.prototype, {
    // Brackets matches are {2, 4} to take into account raw helper blocks (the regexps are fixed in patchMoustache)
    // Set to true to reuse the same placeholder to moustaches that are identical. Not needed for all practical cases but it's here for experimentation.
    // *** MUST BE FALSE otherwise <div {{#if value}}attr1="..."{{/if}} {{#if value}}attr2="..."{{/if}}>...</div>
    // *** will not compute the attributes correctly. A warning is generated in patchMoustaches to notify this
    RECYCLE_MOUSTACHE_PLACEHOLDERS  : false,
    // htmlparser2 options
    PARSER_OPTIONS    : { decodeEntities: true, lowerCaseTags: true, recognizeSelfClosing: true, recognizeCDATA : true },
    // Emitters registry (see registerBackend(type, emitter))
    EMITTERS          : { },

    onreset : function() {
        this.moustacheMap = {};
    },
    getParser : function() {
        return HtmlParser;
    },
    makePlaceholder : function(moustache) {
        var placeholder, mKey = Utils.uniqueId() + Constants.moustachePlaceholderSuffix; // Add a termination to prevent moustache-1 from matching moustache-10 etc.
        if(!!moustache.match(/\{{4}\s*[^\/]/)) {
            throw new Error('Raw helpers are not supported (found: ' + moustache + ' )')
        } else if(!!moustache.match(Constants.BLOCK_MOUSTACHE_START_RE)) {
            placeholder = Constants.moustachePlaceholderBlockStartPrefix;
        } else if(!!moustache.match(Constants.BLOCK_MOUSTACHE_ELSE_RE)) {
            placeholder = Constants.moustachePlaceholderBlockElsePrefix;
        } else if(!!moustache.match(Constants.BLOCK_MOUSTACHE_END_RE)) {
            placeholder = Constants.moustachePlaceholderBlockEndPrefix;
        } else if(!!moustache.match(Constants.BLOCK_MOUSTACHE_RE)) {
            placeholder = Constants.moustachePlaceholderBlockPrefix;
        } else {
            placeholder = Constants.moustachePlaceholderPrefix;
        }
        // The replace moustache key, taking care of padding either sides otherwise the HTML parser may fail its tokenization
        return ' ' + placeholder + mKey + ' ';
    },
    normalizeMoustache : function(moustache) {
        // Remove all unneeded spaces
        moustache = Utils.trim(moustache, true);
        // Aim to compact the format: {{#   xxx}} => {{#xxx}}
        moustache = moustache.replace(/(#|\/|>|~)\s*/g, '$1').replace(/\{\s*/g, '{').replace(/\s*(?=\})/g, '');
        return moustache;
    },
    extractDatasets   : function(moustache) {
        var dataprefixes = this.options.extractDatasets, datasets = { };
        if(dataprefixes && _.isArray(dataprefixes) && dataprefixes.length) {
            _.each(dataprefixes, function(dataprefix) {
                var datasetRe = new RegExp( dataprefix + '\\.?([.\\w]*)', 'g');
                var matches   = moustache.match(datasetRe);
                if(matches && matches.length) {
                    var slot      = [];
                    _.each(matches, function(match) {
                        match = match.replace(dataprefix, '').replace(/^\./, '');
                        match = match === '' ? '*' : match;
                        slot.push(match);
                    });
                    // Simple compaction
                    if(slot.indexOf('*') !== -1) {
                        slot = ['*'];
                    }
                    // Set in datasets
                    datasets[dataprefix] = slot;
                }
            });
        }
        return datasets;
    },
    patchMoustaches : function(html) {
        var patchedHtml = html;
        var moustaches = html.match(Constants.ANY_MOUSTACHE_RE);
        if(moustaches && moustaches.length) {
            if(this.RECYCLE_MOUSTACHE_PLACEHOLDERS) {
                console.warn('*** RECYCLE_MOUSTACHE_PLACEHOLDERS is enabled. This may produce wrong dynamic attributes in some cases!')
            }
            _.each(moustaches, function(moustache) {
                var placeholder = this.makePlaceholder(moustache);
                // Build the replace expression
                var replaceExpression = this.RECYCLE_MOUSTACHE_PLACEHOLDERS ? new RegExp(Utils.escapeRegExp(moustache), 'gm') : moustache;
                var normalizedMoustache = this.normalizeMoustache(moustache);
                patchedHtml = patchedHtml.replace(replaceExpression, placeholder);
                this.moustacheMap[placeholder] = {
                    regexp  : new RegExp('\\s?' + placeholder.trim() + '\\s?', 'gi'),
                    key     : placeholder,
                    value   : normalizedMoustache,
                    isBlock : (placeholder.indexOf(Constants.moustachePlaceholderBlockPrefix) !== -1),
                    datasets: this.extractDatasets(moustache)
                };
            }, this);
        }
        return patchedHtml;
    },
    // Tokenize attribute on moustace boundaries. Double quote all non-moustace content
    tokenizeAttribute : function(attr) {
        var tokens = attr.split(Constants.ANY_MOUSTACHE_PLACEHOLDER_RE), buffer = '';
        _.each(tokens, function(token) {
            if(token.match(Constants.ANY_MOUSTACHE_PLACEHOLDER_RE)) {
                buffer += token;
            } else {
                buffer += Utils.quotedString(token);
            }
        }, this);
        attr = buffer;
        return attr;
    },
    // Unpatch attributes
    unpatchAttributes : function(desc, attrs) {
        // TODO OPTIMIZATION: escape attributes only if they are within Opcodes.TEXT instructions?
        attrs = attrs || desc.attrs;
        _.each(attrs, function(attr, index) {
            if(_.isArray(attr)) {
                // Apply unpatching in-situ
                this.unpatchAttributes(desc, attr);
            } else {
                // attr can be null or empty
                if(attr != undefined) {
                    var isBlock = false;
                    var tokenize = (desc.opcode !== Opcodes.CONTROL);
                    if(tokenize) attr = this.tokenizeAttribute(attr);
                    _.each(this.moustacheMap, function(moustacheValue, moustacheKey) {
                        var moustacheKeyRe = moustacheValue.regexp;
                        if(attr.match(moustacheKeyRe)) {
                            attr = attr.replace(moustacheKeyRe, moustacheValue.value);
                            isBlock = isBlock || moustacheValue.isBlock; // Track presence of blocks
                            desc.datasets = Utils.mergeDatasets(desc.datasets, moustacheValue.datasets, false);
                        }
                    });
                    // Wrap tokenizable attributes that happen to contain a control block
                    // in between another dummy control block. This way the HB compiler is forced
                    // to generate a "program" frame rather than apply `invokeAmbiguous`,
                    // which generates inline variables in some cases and that is not compatible
                    // with function-based code generation (because we can't have variables defined inline).
                    // ***** FIXES <div style="color:{{#block}}red{{/block}};"">
                    if(isBlock && tokenize) {
                        attr = '""' + Utils.formatControlOpen('if', 1) + attr + Utils.formatControlClose('if') + '""';
                    }
                }
                attrs.splice(index, 1, attr);
            }
        }, this);
    },
    unpatchMoustaches : function(descriptors) {
        var haveDataSets = false;
        _.each(descriptors, function(desc) {
            this.unpatchAttributes(desc);
            haveDataSets = haveDataSets || !_.isEmpty(desc.datasets);
        }, this);
        descriptors.haveDataSets = haveDataSets;
        return descriptors;
    },
    // Process datasets
    processDataSets : function(descriptors) {
        // Short-cut descriptors with no data sets
        if(!descriptors.haveDataSets) {
            return descriptors;
        }

        // Process descriptors to produce patches
        var patches = DatasetCollector.process(descriptors);
        var patchedDescriptors = [];
        var datasetsControlBlockName = '_' + this.options.backend + '_' + this.options.datasetsControlBlockSuffix + '_';

        // Produce a copy of descriptors interleaving the datasets control blocks
        _.each(descriptors, function(desc, index) {
            var patch = patches[index];
            if(patch && patch.datasetOpen) {
                patchedDescriptors.push({ opcode : Opcodes.CONTROL, attrs : [ Utils.formatControlOpen(datasetsControlBlockName, Utils.quotedString(Utils.uniqueId('ds')) + Utils.formatDatasets(patch.datasets) + ' level=' + patch.level) ]});
            }
            patchedDescriptors.push(desc);
            if(patch && patch.datasetClose) {
                patchedDescriptors.push({ opcode : Opcodes.CONTROL, attrs : [ Utils.formatControlClose(datasetsControlBlockName) ]});
            }
        });

        return patchedDescriptors;
    },
    // Merge skip levels
    mergeSkipLevels : function(descriptors) {
        if(this.options.emptySkipBlocks) {
            var skipModeOn = false;
            var i = 0;
            while(i < descriptors.length - 1) {
                var desc = descriptors[i];
                if(desc.opcode === Opcodes.SKIP) {
                    skipModeOn = true;
                } else if(desc.skipLevel === 0) {
                    skipModeOn = 0;
                } else if(skipModeOn) {
                    descriptors.splice(i, 1);
                    continue;
                } else {
                    throw new Error('Inconsistent skip level state');
                }
                i++;
            }
        }
        return descriptors;
    },
    // Merge self closing tags where possible
    mergeSelfClosing : function(descriptors) {
        var i = 0;
        while(i < descriptors.length - 1) {
            var desc = descriptors[i];
            if(desc.opcode === Opcodes.ELEMENT_OPEN && (this.options.safeMergeSelfClosing || Utils.isSelfClosingTag(desc.attrs[0]))) {
                var next = descriptors[i+1];
                if(next && next.opcode === Opcodes.ELEMENT_CLOSE) {
                    desc.opcode = Opcodes.ELEMENT_VOID;
                    descriptors.splice(i+1, 1);
                }
            }
            i++;
        }
        return descriptors;
    },
    // Merge contiguous text nodes
    mergeText : function(descriptors) {
        var i = 0;
        while(i < descriptors.length - 1) {
            var desc = descriptors[i];
            if(desc.opcode === Opcodes.TEXT) {
                // Peek next descriptor
                var nextDesc = descriptors[i+1]
                if(nextDesc && nextDesc.opcode === Opcodes.TEXT) {
                    nextDesc.attrs[0] = desc.attrs[0] + nextDesc.attrs[0];
                    descriptors.splice(i, 1);
                    continue;
                }
            }
            i++;
        }
        return descriptors;
    },
    mergeDescriptors : function(descriptors) {
        this.mergeSkipLevels(descriptors);
        this.mergeText(descriptors);
        return descriptors;
    },
    prepareHtml : function() {
        if(this.html) {
            // Trim spaces (before comments so they can be used as trimmers :)
            var html = this.html.replace(Constants.TRIM_LEFT_RE, '$1~').replace(Constants.TRIM_RIGHT_RE, '~$1');
            // Remove comments
            html = html.replace(Constants.COMMENT_BLOCK_MOUSTACHE_RE, '').replace(Constants.COMMENT_MOUSTACHE_RE, '');
            // More trimming before and after leading/trailing tags (for noel views)
            html = html.replace(/^\s*</gm,'<').replace(/>\s*$/gm,'>');
            if(this.options.minifyInput) {
                // Apply HtmlMinify to remove spaces and line breaks (so they don't end up as useless text nodes).
                // Note that mustaches inside <pre> tags may have their spacing messed up because of this, but it's for a good cause :)
                html = HtmlMinify(html, {
                    collapseWhitespace : true,
                    conservativeCollapse : true,
                    preserveLineBreaks   : false,
                    ignoreCustomFragments : [ /\{\{[\s\S]*?\}\}/ ]
                });
            }
            // Patch moustaches. This also normalizes them
            html = this.patchMoustaches(html);
            // Normalize moustaches enclosed used in tags, so they can be used as <{{ tag }}> ... <{{ /tag }}>
            html = html.replace(new RegExp('(<\\/?)\\s*(' + Constants.moustachePlaceholderPrefix + '.*?' + Constants.moustachePlaceholderSuffix + ')\\s*(>)', 'gm'), '$1$2$3');
            // Remove double spaces between a block and a mustache _block_   _value_ => _block_ _value_
            // **** this works but it removes spaces too eagerly
            // html = html.replace(/(moustache\-block.*?\-x)\s*(?=moustache\-.*?\-x)/gi, '$1 ');
            // Remove all spaces between blocks _block_  _block_ => _block__block_
            // **** this works but it compresses attribute names, which results in wrong bcounts
            // html = html.replace(/(moustache\-block.*?\-x)\s*(?=moustache-block\-.*?\-x)/gi, '$1');
            // Remove all spaces between a closing tag and a _block_ => </div> _block_ => </div>_block_
            html = html.replace(/(<\/.*?>)\s*(?=moustache-block\-.*?\-x)/gi, '$1');
            return html;
        }
    },
    parse : function(parseOptions, callback) {
        // parseOptions.backend MAY contain the hint of the target emitter if invoked by .generate()
        // this is currently unused but it could be useful in the future to optimize the parsing for a given target.
        parseOptions = _.defaults(parseOptions || {}, this.options);

        var Parser      = this.getParser(),
            html        = this.prepareHtml() || '',
            descriptors = [],
            state       = { skipLevel : 0, nestLevel : 0 }, // Stateful variables during the whole parsing process
            backendHint = parseOptions.backend, // UNUSED backend hint
            container   = this; // Reference to `this` for closures

        // Throw if the Parser is not available
        if(!Parser) return callback && callback('Failed to instantiate htmlparser2. Check your dependencies (`npm install htmlparser2` on nodejs).');

        // Warn if input is not available. Nothing bad will really happen.
        if(!html) console.warn('No input to parse.');

        // Push descriptor from parser callbacks
        var pushDescriptor = function(opcode, attrs, state) {
            var desc = _.extend({ opcode : opcode, attrs : attrs }, state || {}, { datasets : {} });
            descriptors.push(desc);
        }

        // Parse complete. Invoked when parsing completes,
        var parseComplete = function(descriptors) {
            descriptors = container.mergeDescriptors(descriptors);
            descriptors = container.unpatchMoustaches(descriptors);
            descriptors = container.processDataSets(descriptors);
            // Process self closing tags AFTER processing the data sets!
            descriptors = container.mergeSelfClosing(descriptors);
            return descriptors;
        }

        var attributesCollector = new AttributesCollector(parseOptions);

        var parser = new Parser({
            onattribute : function(key, value) {
                //console.log('KEY:', key, 'VALUE:', value)
                // TODO: onattribute is called with ALL the attributes (including duplicates!)
                // that are found BEFORE onopentag is called. It is not called (as expected)
                // if there are no attributes to report.
                attributesCollector.pushPair(key, value);
            },
            onopentag: function (name /*, attrs */) {

                // Initialize args array
                var parsedAttributes  = attributesCollector,
                    argsArray         = [name, parsedAttributes.getKey(), null],
                    staticList        = parsedAttributes.getStaticAttrsList(),
                    dynamicList       = parsedAttributes.getDynamicAttrsList();

                // Reset attributes parser
                attributesCollector = new AttributesCollector(parseOptions);

                // Increase nestLevel
                ++state.nestLevel;

                // Debug dump
                // parsedAttributes.dump();
                if(parsedAttributes.getBcount() > 0) {
                    parsedAttributes.dump();
                    throw new Error('Block count in attributes is not zero');
                }

                // Process statics
                if(staticList.length) {
                    var staticsArray = [];
                    _.each(staticList, function(entry) {
                        staticsArray.push(entry[0], entry[1]);
                    });
                    argsArray[2] = staticsArray;
                }

                // Process dynamic
                if(dynamicList.length) {
                    if(dynamicList.hasBlocks()) {
                        pushDescriptor(Opcodes.ELEMENT_OPEN_START, argsArray, { skipLevel : state.skipLevel });
                        _.each(dynamicList, function(entry) {
                            var qualifier = entry[2];
                            if(qualifier === AttributesCollector.BLOCK_QUALIFIER) {
                                pushDescriptor(Opcodes.CONTROL, [ entry[0] ], { skipLevel : state.skipLevel });
                            } else if(qualifier === AttributesCollector.ATTRIBUTE_QUALIFIER) {
                                pushDescriptor(Opcodes.ATTRIBUTES, [ entry[0], entry[1] ], { skipLevel : state.skipLevel });
                            } else {
                                throw new Error('Unsupported qualifier ' + qualifier);
                            }
                        });
                        pushDescriptor(Opcodes.ELEMENT_OPEN_END, [ name ], { skipLevel : state.skipLevel });
                    } else {
                        var dynamicArray = [];
                        _.each(dynamicList, function(entry) {
                            dynamicArray.push(entry[0], entry[1]);
                        });
                        argsArray = argsArray.concat(dynamicArray);
                    }
                }

                // Generate Opcodes.ELEMENT_OPEN if there are no dynamic blocks
                if(!dynamicList.hasBlocks()) {
                    pushDescriptor(Opcodes.ELEMENT_OPEN, argsArray, { skipLevel : state.skipLevel });
                }

                // Set skipLevel to 1 if this element is a partial holder not inside a skip block
                if(parsedAttributes.hasSkipBlock() && !state.skipLevel) {
                    state.skipLevel = 1;
                    pushDescriptor(Opcodes.SKIP, [], { skipLevel : state.skipLevel });
                }
                // If the skip level is set (= this element is inside a skip block), increase the level
                else if(state.skipLevel) {
                    // Increment skip level
                    ++state.skipLevel;
                }
                // non-zero skip levels are preserved by 'ontext', decreased by one unit by 'onclosetag', and increased by one unit by further 'onopentag'

            },
            ontext: function(text) {
                var segments = text.split(Constants.BLOCK_MOUSTACHE_PLACEHOLDER_RE);
                _.each(segments, function(segment) {
                    // Need to allow empty text segments otherwise "<span>A</span> <span>B</span>" becomes "AB"
                    if(segment /* && segment.trim() */) {
                        var match  = !!segment.match(Constants.BLOCK_MOUSTACHE_PLACEHOLDER_RE);
                        var opcode = match ? Opcodes.CONTROL : Opcodes.TEXT;
                        pushDescriptor(opcode, [ segment ], { skipLevel : state.skipLevel });
                    }
                });
            },
            onclosetag: function(name) {
                // Decrease nestLevel
                if(--state.nestLevel < 0 ) {
                    throw new Error('Inconsistent nestLevel. Some tags were not correctly closed.');
                }
                if(state.skipLevel) --state.skipLevel;
                pushDescriptor(Opcodes.ELEMENT_CLOSE, [ name ], { skipLevel : state.skipLevel });
                // TODO manage situation where there are more closing tags that opening ones
                // (i.e. if multiple open are defined within separate control blocks)
            },
            onerror : function(error) {
                callback && callback(error);
                callback = null; // Prevent further callback invocations
                parser.reset();
            },
            onreset : function() {
                container.onreset();
            },
            onend : function() {
                var error;
                if(state.nestLevel !== 0) {
                    throw new Error('Inconsistent nestLevel at the end of parsing. Some tags were not correctly closed.');
                }
                try {
                    descriptors = parseComplete(descriptors);
                } catch(e) {
                    error = e;
                }
                callback && callback(error, descriptors);
                callback = null; // Prevent further callback invocations
                parser.reset();
            }
        }, this.PARSER_OPTIONS);

        // RUN PARSER
        parser.parseChunk(html);
        parser.done();
    },
    generate : function(options, callback) {
        var EMITTER = this.EMITTERS[options.backend];
        if(!EMITTER) {
            var error = new Error('Emitter "' + options.backend + '" does not exist');
            callback && callback(error);
            throw error;
        }
        this.parse({ backend : options.backend }, function(error, descriptors) {
            var program;
            if(descriptors && !error) {
                try {
                    program = (new EMITTER(options)).emit(descriptors);
                } catch(e) {
                    error = e;
                }
            }
            if(error) console.error(error);
            callback && callback(error, program);
        });
    }
});

TemplateTranspiler.registerBackend = function(type, emitter) {
    TemplateTranspiler.prototype.EMITTERS[type] = emitter;
}
TemplateTranspiler.supportsBackend = function(type) {
    return typeof TemplateTranspiler.prototype.EMITTERS[type]  === 'function';
}

// AUTO-REGISTER BACKEND EMITTERS
var fs = require('fs');
var path = require('path');
var emittersPath = path.resolve(__dirname, 'backends');
var items = fs.readdirSync(emittersPath);
for (var i=0; i<items.length; i++) {
    var fileName = items[i];
    var filePath = path.resolve(emittersPath, fileName);
    var backend  = fileName.split('.').shift()
    var emitter  = require(filePath);
    TemplateTranspiler.registerBackend(backend, emitter);
}

module.exports = TemplateTranspiler;
