var _ = require('underscore')._;
var Constants = require('./shared/constants');

var BLOCK_QUALIFIER = 'block';
var ATTRIBUTE_QUALIFIER = 'attribute';

var AttributesCollector = function(parseOptions) {
    this.key                      = null;
    this.bcount                   = 0;
    this.hasBlocks                = false;
    this.staticAttrs              = [];
    this.dynAttrs                 = [];
    this.hasSkipBlockAttribute    = false;
    this.skipBlockAttributeMarker = parseOptions.skipBlockAttributeMarker;
};
AttributesCollector.prototype.pushPair  = function(key, value) {
    var hasMoustache = key.indexOf(Constants.moustachePlaceholderPrefix) !== -1 || value.indexOf(Constants.moustachePlaceholderPrefix) !== -1;
    var isStatic     = (!hasMoustache && this.bcount === 0);
    var qualifier    = ATTRIBUTE_QUALIFIER;
    // skip block attribute can be static or dynamic
    if(key === this.skipBlockAttributeMarker) {
        this.hasSkipBlockAttribute = true;
        if(this.bcount > 0) {
            throw new Error('Unsupperted skip block ' + key + (value ? '=' + value : '' ) + ' inside a control block');
        }
    }
    // Keys can be dynamic but not within blocks
    if(key === 'key') {
        this.key = value;
        if(this.bcount > 0) {
            throw new Error('Unsupperted key=' + value + ' inside a control block');
        }
    }
    if(isStatic) {
        this.staticAttrs.push(key, value, qualifier, false, this.bcount);
    } else {
        var isBlock = false;
        if(hasMoustache && key.indexOf(Constants.moustachePlaceholderBlockPrefix) !== -1) {
            isBlock = true;
            this.hasBlocks = true;
            // TODO => sanity check value=""
            if(key.indexOf(Constants.moustachePlaceholderBlockStartPrefix) !== -1) {
                ++this.bcount;
            } else if(key.indexOf(Constants.moustachePlaceholderBlockEndPrefix) !== -1) {
                --this.bcount;
            }
        }
        this.hasBlocks = this.hasBlocks || isBlock;
        var qualifier = isBlock ? BLOCK_QUALIFIER : qualifier;
        this.dynAttrs.push(key, value, qualifier, hasMoustache, this.bcount);
    }
};
AttributesCollector.prototype.getBcount = function() {
    return this.bcount;
};
AttributesCollector.prototype.getKey = function() {
    return this.key;
};
AttributesCollector.prototype.hasSkipBlock = function() {
    return this.hasSkipBlockAttribute;
};
AttributesCollector.prototype.getStaticAttrsList = function() {
    return _.chain(this.staticAttrs)
            .groupBy(function(element, index){
                return Math.floor(index/5);
            })
            .toArray()
            .value();
};
AttributesCollector.prototype.getDynamicAttrsList = function() {
    var list = _.chain(this.dynAttrs)
                .groupBy(function(element, index){
                    return Math.floor(index/5);
                })
                .toArray()
                .value();
    var hasBlocks = this.hasBlocks;
    list.hasBlocks = function() { return hasBlocks; };
    return list;
};
AttributesCollector.prototype.dump = function() {
    console.log('staticAttrs:', JSON.stringify(this.getStaticAttrsList(), undefined, 2));
    console.log('dynAttrs:', JSON.stringify(this.getDynamicAttrsList(), undefined, 2));
    console.log('hasBlocks:', JSON.stringify(this.getDynamicAttrsList().hasBlocks(), undefined, 2));
    console.log('key:', this.getKey());
    console.log('hasSkipBlock:', this.hasSkipBlock());
    console.log('bcount:', this.getBcount());
};
AttributesCollector.BLOCK_QUALIFIER = BLOCK_QUALIFIER;
AttributesCollector.ATTRIBUTE_QUALIFIER = ATTRIBUTE_QUALIFIER;

module.exports = AttributesCollector;