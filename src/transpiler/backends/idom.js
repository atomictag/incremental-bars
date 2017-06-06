var _     = require('underscore')._;

var Utils = require('../shared/utils');
var Opcodes = require('../shared/opcodes');

// Mapping opcodes -> emitted functions. Overridable with options.functionMap
var DEFAULT_FUNCTION_MAP = {};
DEFAULT_FUNCTION_MAP[Opcodes.ELEMENT_OPEN]       =  'IncrementalDOM.elementOpen',
DEFAULT_FUNCTION_MAP[Opcodes.ELEMENT_OPEN_START] =  'IncrementalDOM.elementOpenStart',
DEFAULT_FUNCTION_MAP[Opcodes.ELEMENT_OPEN_END]   =  'IncrementalDOM.elementOpenEnd',
DEFAULT_FUNCTION_MAP[Opcodes.ELEMENT_VOID]       =  'IncrementalDOM.elementVoid',
DEFAULT_FUNCTION_MAP[Opcodes.ELEMENT_CLOSE]      =  'IncrementalDOM.elementClose',
DEFAULT_FUNCTION_MAP[Opcodes.TEXT]               =  'IncrementalDOM.text',
DEFAULT_FUNCTION_MAP[Opcodes.ATTRIBUTES]         =  'IncrementalDOM.attr',
DEFAULT_FUNCTION_MAP[Opcodes.SKIP]               =  'IncrementalDOM.skip';

// Mapping opcodes -> emitter methods
var METHOD_MAP = {};
METHOD_MAP[Opcodes.ELEMENT_OPEN]       =  'elementOpen',
METHOD_MAP[Opcodes.ELEMENT_OPEN_START] =  'elementOpenStart',
METHOD_MAP[Opcodes.ELEMENT_OPEN_END]   =  'elementOpenEnd',
METHOD_MAP[Opcodes.ELEMENT_VOID]       =  'elementVoid',
METHOD_MAP[Opcodes.ELEMENT_CLOSE]      =  'elementClose',
METHOD_MAP[Opcodes.TEXT]               =  'text',
METHOD_MAP[Opcodes.ATTRIBUTES]         =  'attr',
METHOD_MAP[Opcodes.SKIP]               =  'skip',
METHOD_MAP[Opcodes.CONTROL]            =  'control';

var IDomEmitter = module.exports = function(options) {
    this.options = _.defaults(options || {}, {
        hoistedStatics           : false, // An object that will hold hoisted static string references
        generateKeysForStaticEl  : false, // Whether keys should be auto-generated for elements with only static properties
        generateKeysForAllEl     : true,  // Whether keys should be auto-generated for ALL elements
        staticsName              : '__$', // Name of the hoistedStatics object variable
    });
};
_.extend(IDomEmitter.prototype, {
    functionMap  : DEFAULT_FUNCTION_MAP,
    formatAttrs  : function(attrs, compact, trim) {
        if(compact) attrs = _.compact(attrs);
        return _.map(attrs, function(attr) {
            if(attr == undefined) {
                return 'null';
            } else if(_.isArray(attr)) {
                return '[' + this.formatAttrs(attr) + ']';
            } else {
                if(trim) attr = attr.trim();
                return attr;
            }
        }, this).join(', ');
    },
    opcodeToFn : function(opcode) {
        return (this.options.functionMap && this.options.functionMap[opcode]) || this.functionMap[opcode];
    },
    generate : function(desc, compact, trim) {
        return this.opcodeToFn(desc.opcode) + '(' + this.formatAttrs(desc.attrs, compact, trim) + ')';
    },
    // === BACKEND OPCODES
    elementOpen : function(desc) {
        return this.generate(desc, false, true);
    },
    elementVoid : function(desc) {
        return this.generate(desc, false, true);
    },
    elementOpenStart : function(desc) {
        return this.generate(desc, false, true);
    },
    attr : function(desc) {
        return this.generate(desc, false, true);
    },
    elementOpenEnd : function(desc) {
        return this.generate(desc, true, true);
    },
    elementClose : function(desc) {
        return this.generate(desc, true, true);
    },
    skip : function(desc) {
        return this.generate(desc, true, true);
    },
    text : function(desc) {
        return this.generate(desc, true, false);
    },
    // === CONTROL OPCODE
    control : function(desc) {
        return desc.attrs[0].trim();
    },
    // === HOISTING
    hoistStatics : function(descriptors) {
        var statics = this.options.hoistedStatics;;
        if(statics) {
            var __name = this.options.staticsName;
            var __singleSpaceVar = '_S';
            if(!_.isObject(statics)) {
                throw new Error('`hoistedStatics` must be an object!');
            }
            if(!statics['__name']) {
                statics['__name']          = __name;
                statics[__singleSpaceVar]  = ' ';
            }
            _.each(descriptors, function(desc) {
                // TODO: good idea? bad idea?
                if([ Opcodes.TEXT ].indexOf(desc.opcode) !== -1) {
                    if(desc.attrs[0] === '" "') {
                        desc.attrs[0] = __name + '.' + __singleSpaceVar;
                    }
                } else if([ Opcodes.ELEMENT_OPEN, Opcodes.ELEMENT_OPEN_START, Opcodes.ELEMENT_VOID ].indexOf(desc.opcode) !== -1) {
                    var attrs = desc.attrs, data = desc.attrs[2], key;
                    if(data) {
                        // Unquote statics
                        data = _.map(data, function(prop) { return Utils.trim(Utils.unquotedString(prop), true); });

                        // Lookup duplicates
                        key = _.findKey(statics, function(props) {
                            return _.isEqual(props, data);
                        });

                        // If no key entry found, create one and set data as value
                        if(!key) {
                            key = '_' + Utils.hashCode(data);
                            statics[key] = data;
                        }

                        // Replace the statics array with the variable lookup
                        desc.attrs[2] = __name + '.' + key;
                    }
                }
            });
        }
        return statics || {};
    },
    processStatics : function(descriptors) {
        var autoGenerateKeysForAllElements = !!this.options.generateKeysForAllEl;
        var autoGenerateKeysForStaticsOnly = !autoGenerateKeysForAllElements && !!this.options.generateKeysForStaticEl;
        _.each(descriptors, function(desc) {
            if([ Opcodes.ELEMENT_OPEN, Opcodes.ELEMENT_OPEN_START, Opcodes.ELEMENT_VOID ].indexOf(desc.opcode) !== -1) {
                var attrs = desc.attrs, data = attrs[2], key;
                if(data) {
                    // Format and sort properties. These are effectively pairs and values can be in any order, so the sorting is not mega trivial
                    data = _.chain(data)
                    // Unquote and trim all extra spaces. There might be some remote data-* case where spaces matter, but we don't care about those
                    .map(function(prop) { return Utils.trim(Utils.unquotedString(prop), true); })
                    // Group in key-value pairs
                    .groupBy(function(element, index){ return Math.floor(index/2); }).toArray()
                    // Reorganize segments in the value based on their hash value
                    .map(function(pairs) {
                        // There are some attributes that should not be trivially re-arranged, like style & co.
                        // Actually this optimisation is probably worth doing only for 'class' attributes anyways..
                        if(pairs[0] === 'class') {
                            return [ pairs[0], _.chain(pairs[1].split(' ')).sortBy(function(seg) { return Utils.hashCode(seg); }).value().join(' ')];
                        } else {
                            return [ pairs[0], pairs[1]]
                        }
                    })
                    // Sorting of pairs based on their hash value
                    .sortBy(function(pairs) { return Utils.hashCode(pairs); })
                    // Flatten
                    .flatten().value();

                    // NOTE: at this point the properties are still unquoted.

                    // Should keys be auto-generated where possible?
                    if(autoGenerateKeysForStaticsOnly) {
                        // > http://google.github.io/incremental-dom/#rendering-dom/statics-array
                        // `If the statics array is provided, you must also provide a key.
                        // This ensures that an Element with the same tag but different
                        // statics array is never re-used by Incremental DOM.`
                        if(!attrs[1] && _.compact(desc.attrs.slice(3)).length === 0) {
                            attrs[1] = Utils.quotedString(Utils.hashCode(data) + Utils.uniqueId('-'));
                        }
                    }

                    // Apply new data
                    attrs[2] = _.map(data, function(item) { return Utils.quotedString(item); });
                }

                // Should keys be auto-generated for all elements?
                if(autoGenerateKeysForAllElements) {
                    if(!attrs[1]) {
                        attrs[1] = Utils.quotedString(Utils.uniqueId('idom-'));
                    }
                }
                // > If this element is within a skip block (= view partial) it MUST have a key set
                // otherwise duplications will occur. This will never happen if emptySkipBlocks=true
                else if(!attrs[1] && desc.skipLevel > 0) {
                    attrs[1] = Utils.quotedString(Utils.uniqueId('idom-'));
                }
            }
        });
        return descriptors;
    },
    hasDecorators : function(descriptors) {
        return !! _.chain(descriptors).where({ opcode : Opcodes.CONTROL}).find(function(desc) {
            var attr = desc.attrs[0];
            return attr.match(/\{\{\s*#?\*/);
        }).value();
    },
    // <control> ( <istr> + <istr> + <istr> )</control>
    emit : function(descriptors) {
        var GROUP_SEPARATOR    = ' & '; // ' , ' is also possible but it pushes too much stuff on the stack
        var GROUP_CLOSING      = ')'; // ', "")';
        var emitted = '',
            prevIsControl = false,
            open = false,
            concatenateFirstGroup = false,
            statics;
        //
        descriptors = this.processStatics(descriptors);
        statics     = this.hoistStatics(descriptors);
        /*
            In some cases with decorators it is necessary to join our output with a generated string.
            Specifically a case like this:
                <div>AAA</div>
                {{* myDecorator 1 }}
                <div>BBB</div>
            fails unless concatenateFirstGroup=true
                {{* myDecorator 1 }}
                <div>AAA</div>
                <div>BBB</div>
            works no problem, though
        */
        concatenateFirstGroup = concatenateFirstGroup || this.hasDecorators(descriptors);
        //
        _.each(descriptors, function(desc, i) {
            var method    = METHOD_MAP[desc.opcode],
                line      = desc.emitted = this[method](desc),
                opcode    = desc.opcode,
                isControl = opcode === Opcodes.CONTROL,
                join      = (i > 0) && !prevIsControl && !isControl;

            // Control instruction. If a block is open, close it
            if(isControl && open) {
                emitted += GROUP_CLOSING
                open = false;
            }
            // Non-control instruction. If a block is closed, open it
            else if(!isControl && !open) {
                // The leading + fixes an issue with decorators
                emitted += (concatenateFirstGroup ? ' + ' : '') + '(';
                open = true;
            }

            // Non-first line or dom instruction not following a control instruction
            if(join) {
                emitted += GROUP_SEPARATOR + line;
            }
            // Control instruction
            else if(isControl) {
                emitted += line;
            }
            // First line or dom instruction following a control instruction
            else {
                emitted += line;
            }

            // Save the information that the last visited descriptor was a control instruction
            prevIsControl = isControl;
        }, this);
        // Close last block if still open.
        if(open) emitted += GROUP_CLOSING;
        return {
            statics  : statics,
            toString : function() {
                return '' +  emitted + '';
            },
            prettyPrint : function() {
                return (emitted).split(GROUP_SEPARATOR).join(' \n ' + GROUP_SEPARATOR)
                                .split('}{').join('}\n{')
                                .split('}(').join('}(\n    ')
                                .split('){').join(')\n{')
                                .split('}} +').join('}}\n  +')
                                ;
            }
        };
    }
});