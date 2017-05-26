var _ = require('underscore')._;

var Utils = module.exports = {
    // Self closing tags
    SELF_CLOSING_TAGS   : ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
    // Check if a tag is (potentially) self closing (the descriptor may not be if it has attributes within control blocks)
    isSelfClosingTag : function(tag) {
        return Utils.SELF_CLOSING_TAGS.indexOf(tag) !== -1;
    },
    stringify : function(input) {
        return (_.isObject(input) ? JSON.stringify(input) : input) + '';
    },
    quotedString : function(str) {
      return '"' + (str + '')
      .replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
      .replace(/\u2029/g, '\\u2029') + '"';
    },
    unquotedString : function(str) {
        return str && str.replace(/^"|"$/g, '');
    },
    trim : function(str, all) {
        return str && (all ? str.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'') : str).trim();
    },
    escapeRegExp : function(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    },
    hashCode_DJB2 : function(str) {
        var hash = 0, i, chr, len;
        str = Utils.stringify(str);
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    hashCode_FNV_1a : function (str, asString, seed) {
        var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
        str = Utils.stringify(str);
        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if( asString ){
            // Convert to 8 digit hex string
            return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
    },
    hashCode : function(str) {
        // Use hashCode_FNV_1a as default
        return Utils.hashCode_FNV_1a(str);
    },
    // uninque ID generator
    uniqueId : function(prefix) {
        return _.uniqueId(prefix);
    },
    // merge two datasets
    mergeDatasets : function(dest, toMerge, compact) {
        _.each(toMerge, function(dataset, key) {
            if(dest[key]) {
                dest[key] = dest[key].concat(dataset);
            } else {
                dest[key] = dataset;
            }
        });
        if(compact) Utils.compactDatasets(dest);
        return dest;
    },
    // compact a dataset
    compactDatasets : function(datasets) {
        _.each(datasets, function(dataset, key) {
            if(dataset.indexOf('*') !== -1) {
                dataset = ['*'];
            } else {
                // Sort in ascending order
                var sorted = _.sortBy(dataset, function(item) { return item.length });
                // Filter out segments that have a matching parent
                dataset = _.reduce(sorted, function(memo, item, index) {
                    var hasParentPath = false;
                    if(index > 0) {
                        for(var i=index-1; i >= 0; i--) {
                            if((item + '.').indexOf(sorted[i] + '.') === 0) {
                                hasParentPath = true;
                                break;
                            }
                        }
                    }
                    if(!hasParentPath) {
                        memo.push(item);
                    }
                    return memo;
                }, []);
            }
            datasets[key] = dataset;
        });
    },
    // Purge from a child dataset all entries that exist in the parent
    purgeChildDatasets : function(parentDatasets, childDatasets) {
        _.each(parentDatasets, function(parentDataset, key) {
            var childDataset = childDatasets[key];
            if(childDataset && childDataset.length) {
                var purgedDataset = [];
                _.each(childDataset, function(item, index) {
                    var hasParentPath = false;
                    for(var i = 0; i < parentDataset.length; i++) {
                        if(parentDataset[i] === '*' || (item + '.').indexOf(parentDataset[i] + '.') === 0) {
                            hasParentPath = true;
                            break;
                        }
                    }
                    if(!hasParentPath) {
                        purgedDataset.push(item);
                    }
                });
                if(purgedDataset.length) {
                    childDatasets[key] = purgedDataset;
                } else {
                    delete childDatasets[key];
                }
            }
        });
    },
    formatDatasets : function(datasets) {
        var buffer = '';
        _.each(datasets, function(dataset, key) {
            buffer += ' ' + key.replace(/^@/, '') + '="' + dataset.join(' ') + '"';
        });
        return buffer;
    },
    formatControlOpen : function(name, body) {
        body = body ? ' ' + ('' + body).trim() : '';
        return '{{#' + name + body + '}}';
    },
    formatControlClose : function(name) {
        return '{{/' + name + '}}';
    },
}